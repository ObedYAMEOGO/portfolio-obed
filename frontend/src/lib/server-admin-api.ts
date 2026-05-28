// src/lib/server-admin-api.ts

import "server-only";

import axios from "axios";

import type {
  DashboardStats,
  Lead,
  Material,
  Post,
  Project,
  Subscriber,
} from "@/types";

/* =========================================================
   ENV
========================================================= */

const API_BASE_URL =
  process.env.INTERNAL_API_URL;

const ADMIN_SECRET =
  process.env.ADMIN_SECRET;

if (!API_BASE_URL) {
  throw new Error(
    "INTERNAL_API_URL is missing.",
  );
}

if (!ADMIN_SECRET) {
  throw new Error(
    "ADMIN_SECRET is missing.",
  );
}

/* =========================================================
   AXIOS INSTANCE
========================================================= */

export const adminApi =
  axios.create({
    baseURL: API_BASE_URL,

    headers: {
      "Content-Type":
        "application/json",

      "x-admin-secret":
        ADMIN_SECRET,
    },

    timeout: 30000,
  });

/* =========================================================
   ERROR HANDLING
========================================================= */

adminApi.interceptors.response.use(
  (response) =>
    response,

  (error) => {
    if (error.response) {
      console.error(
        "SERVER_ADMIN_API_ERROR:",
        {
          status:
            error.response.status,

          url: error.config
            ?.url,

          data:
            error.response.data,
        },
      );
    } else if (
      error.request
    ) {
      console.error(
        "SERVER_ADMIN_API_NETWORK_ERROR:",
        error.message,
      );
    } else {
      console.error(
        "SERVER_ADMIN_API_UNKNOWN_ERROR:",
        error.message,
      );
    }

    return Promise.reject(
      error,
    );
  },
);

/* =========================================================
   DASHBOARD STATS
========================================================= */

export async function getDashboardStats(): Promise<DashboardStats> {
  const response =
    await adminApi.get<DashboardStats>(
      "/admin/stats",
    );

  return response.data;
}

/* =========================================================
   POSTS
========================================================= */

export async function getPosts(): Promise<
  Post[]
> {
  const response =
    await adminApi.get<
      Post[]
    >("/admin/posts");

  return response.data;
}

export async function getPost(
  id: number,
): Promise<Post> {
  const response =
    await adminApi.get<Post>(
      `/admin/posts/${id}`,
    );

  return response.data;
}

/* =========================================================
   PROJECTS
========================================================= */

export async function getProjects(): Promise<
  Project[]
> {
  const response =
    await adminApi.get<
      Project[]
    >("/admin/projects");

  return response.data;
}

export async function getProject(
  id: number,
): Promise<Project> {
  const response =
    await adminApi.get<Project>(
      `/admin/projects/${id}`,
    );

  return response.data;
}

/* =========================================================
   MATERIALS
========================================================= */

export async function getMaterials(): Promise<
  Material[]
> {
  const response =
    await adminApi.get<
      Material[]
    >("/admin/materials");

  return response.data;
}

export async function getMaterial(
  id: number,
): Promise<Material> {
  const response =
    await adminApi.get<Material>(
      `/admin/materials/${id}`,
    );

  return response.data;
}

/* =========================================================
   LEADS
========================================================= */

export async function getLeads(): Promise<
  Lead[]
> {
  const response =
    await adminApi.get<
      Lead[]
    >("/admin/leads");

  return response.data;
}

/* =========================================================
   SUBSCRIBERS
========================================================= */

export async function getSubscribers(): Promise<
  Subscriber[]
> {
  const response =
    await adminApi.get<
      Subscriber[]
    >(
      "/admin/subscribers",
    );

  return response.data;
}