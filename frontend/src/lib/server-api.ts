// src/lib/server-api.ts

import "server-only";

import { PaginatedPosts, Project, ProjectCreate } from "@/types";

/* =========================================================
   ENV
========================================================= */

const API_URL = process.env.INTERNAL_API_URL;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

if (!API_URL) {
  throw new Error("INTERNAL_API_URL is missing.");
}

if (!ADMIN_SECRET) {
  throw new Error("ADMIN_SECRET is missing.");
}

const SAFE_API_URL = API_URL;
const SAFE_ADMIN_SECRET = ADMIN_SECRET;

/* =========================================================
   BASE FETCH
========================================================= */

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit & { revalidate?: number },
): Promise<T> {
  const { revalidate, ...fetchOptions } = options ?? {};

  const cacheOption: RequestInit =
    revalidate !== undefined
      ? { next: { revalidate } }
      : { cache: "no-store" };

  try {
    const response = await fetch(`${SAFE_API_URL}${endpoint}`, {
      ...fetchOptions,
      ...cacheOption,
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": SAFE_ADMIN_SECRET,
        ...fetchOptions?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("SERVER_API_ERROR:", {
        endpoint,
        status: response.status,
        error: errorText,
      });

      throw new Error(`API Error ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("SERVER_FETCH_FAILURE:", {
      endpoint,
      message: error instanceof Error ? error.message : "Unknown error",
    });

    throw error;
  }
}

/* =========================================================
   REST HELPERS
========================================================= */

function get<T>(endpoint: string, revalidate?: number) {
  return apiFetch<T>(endpoint, revalidate !== undefined ? { revalidate } : undefined);
}

function post<T>(endpoint: string, body: unknown) {
  return apiFetch<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function put<T>(endpoint: string, body: unknown) {
  return apiFetch<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

function del(endpoint: string) {
  return apiFetch<void>(endpoint, { method: "DELETE" });
}

/* =========================================================
   TYPES
========================================================= */

export interface DashboardStats {
  total_projects: number;
  active_subscribers: number;
  total_leads: number;
  total_articles: number;
  total_materials: number;
  system_status: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  feature_image_url?: string;
  category?: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Subscriber {
  id: number;
  email: string;
  is_active: boolean;
  created_at?: string;
}

export interface Lead {
  id: number;
  full_name: string;
  email: string;
  message: string;
  created_at?: string;
}

export interface Material {
  id: number;
  title: string;
  slug: string;
  description: string;
  material_type: string;
  video_context: string;
  category: string;
  resource_url: string;
  thumbnail_url?: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

/* =========================================================
   PUBLIC PROJECTS — cached, rebuilt every hour
========================================================= */

export async function getProjects() {
  return get<Project[]>("/projects", 3600);
}

/* =========================================================
   ADMIN PROJECTS — always fresh
========================================================= */

export async function getAdminProjects() {
  return get<Project[]>("/admin/projects");
}

export async function getAdminProjectById(id: number) {
  return get<Project>(`/admin/projects/${id}`);
}

export async function createProject(data: ProjectCreate) {
  return post<Project>("/admin/projects", data);
}

export async function updateProject(id: number, data: ProjectCreate) {
  return put<Project>(`/admin/projects/${id}`, data);
}

export async function deleteProject(id: number) {
  return del(`/admin/projects/${id}`);
}

/* =========================================================
   DASHBOARD — always fresh
========================================================= */

export async function getDashboardStats() {
  return get<DashboardStats>("/admin/stats");
}

/* =========================================================
   POSTS — always fresh
========================================================= */

export async function getAdminPosts(page: number = 1, limit: number = 10) {
  return get<PaginatedPosts>(`/admin/posts?page=${page}&limit=${limit}`);
}

/* =========================================================
   SUBSCRIBERS — always fresh
========================================================= */

export async function getSubscribers() {
  return get<Subscriber[]>("/admin/subscribers");
}

/* =========================================================
   LEADS — always fresh
========================================================= */

export async function getLeads() {
  return get<Lead[]>("/admin/leads");
}

/* =========================================================
   MATERIALS — always fresh
========================================================= */

export async function getMaterials() {
  return get<Material[]>("/admin/materials");
}

export async function createMaterial(data: Material) {
  return post("/admin/materials", data);
}