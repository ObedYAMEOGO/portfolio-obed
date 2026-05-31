// src/lib/api/server/materials.ts

import { auth } from "@clerk/nextjs/server";

const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

if (!API_URL) {
  throw new Error("Neither INTERNAL_API_URL nor NEXT_PUBLIC_API_URL is set.");
}

// Strip trailing /api/v1 if already baked into the env var,
// so the path is never doubled: /api/v1/api/v1/admin/...
const BASE_URL = API_URL.replace(/\/api\/v1\/?$/, "");

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

  const url = `${BASE_URL}/api/v1${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Server fetch failed [${res.status}] ${path}: ${body}`);
  }

  return res.json() as Promise<T>;
}

/* =========================================================
   PER-RESOURCE HELPERS
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