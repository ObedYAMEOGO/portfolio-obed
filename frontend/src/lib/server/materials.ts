// src/lib/api/server/materials.ts

import { auth } from "@clerk/nextjs/server";

const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

if (!API_URL) {
  throw new Error("Neither INTERNAL_API_URL nor NEXT_PUBLIC_API_URL is set.");
}

/* =========================================================
   CORE HELPER
========================================================= */

async function serverFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new Error(
      `No Clerk session token available for server fetch: ${path}`,
    );
  }

  const url = `${API_URL}/api/v1${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: "no-store", // admin data must never be stale
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Server fetch failed [${res.status}] ${path}: ${body}`);
  }

  return res.json() as Promise<T>;
}

/* =========================================================
   PER-RESOURCE HELPERS
   Mirror the shape of the browser API clients so pages can
   swap imports without changing call sites.
========================================================= */

import type { Material, Post, Project } from "@/types";

export const serverMaterialsApi = {
  getById: (id: number) =>
    serverFetch<Material>(`/admin/materials/${id}`),

  getAll: () =>
    serverFetch<Material[]>("/admin/materials"),
};

export const serverPostsApi = {
  getById: (id: number) =>
    serverFetch<Post>(`/admin/posts/${id}`),

  getAll: () =>
    serverFetch<Post[]>("/admin/posts"),
};

export const serverProjectsApi = {
  getById: (id: number) =>
    serverFetch<Project>(`/admin/projects/${id}`),

  getAll: () =>
    serverFetch<Project[]>("/admin/projects"),
};