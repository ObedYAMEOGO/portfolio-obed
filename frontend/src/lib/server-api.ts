import "server-only";

import { Project } from "@/types";

const API_URL =
  process.env.INTERNAL_API_URL ||
  "http://backend:8000/api/v1";

const ADMIN_SECRET =
  process.env.NEXT_PUBLIC_ADMIN_SECRET || "";

if (!API_URL) {
  throw new Error(
    "INTERNAL_API_URL is missing.",
  );
}

if (!ADMIN_SECRET) {
  throw new Error(
    "NEXT_PUBLIC_ADMIN_SECRET is missing.",
  );
}

/* =========================================================
   GENERIC FETCHER
========================================================= */

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        ...(options?.headers || {}),
      },

      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `API Error ${response.status}`,
    );
  }

  return (await response.json()) as T;
}

/* =========================================================
   ADMIN HEADERS
========================================================= */

function adminHeaders() {
  return {
    "x-admin-key":
      ADMIN_SECRET,
  };
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
   PUBLIC API
========================================================= */

export async function getProjects(): Promise<
  Project[]
> {
  return apiFetch<Project[]>(
    "/projects",
  );
}

/* =========================================================
   ADMIN API
========================================================= */

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiFetch<DashboardStats>(
    "/admin/stats",
    {
      headers: {
        ...adminHeaders(),
      },
    },
  );
}

export async function getAdminPosts(): Promise<
  Post[]
> {
  return apiFetch<Post[]>(
    "/admin/posts",
    {
      headers: {
        ...adminHeaders(),
      },
    },
  );
}

export async function getSubscribers(): Promise<
  Subscriber[]
> {
  return apiFetch<Subscriber[]>(
    "/admin/subscribers",
    {
      headers: {
        ...adminHeaders(),
      },
    },
  );
}

export async function getLeads(): Promise<
  Lead[]
> {
  return apiFetch<Lead[]>(
    "/admin/leads",
    {
      headers: {
        ...adminHeaders(),
      },
    },
  );
}

export async function createProject(
  data: unknown,
) {
  return apiFetch(
    "/admin/projects",
    {
      method: "POST",

      headers: {
        ...adminHeaders(),
      },

      body: JSON.stringify(data),
    },
  );
}

export async function createMaterial(
  data: unknown,
) {
  return apiFetch(
    "/admin/materials",
    {
      method: "POST",

      headers: {
        ...adminHeaders(),
      },

      body: JSON.stringify(data),
    },
  );
}

