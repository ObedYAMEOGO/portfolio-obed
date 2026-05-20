// src/lib/server-admin-api.ts

import "server-only";

import axios from "axios";

/* =========================================================
   ENV
========================================================= */

const API_BASE_URL =
  process.env.INTERNAL_API_URL;

const ADMIN_KEY =
  process.env.NEXT_PUBLIC_ADMIN_SECRET;

if (!API_BASE_URL) {
  throw new Error(
    "INTERNAL_API_URL is missing.",
  );
}

if (!ADMIN_KEY) {
  throw new Error(
    "NEXT_PUBLIC_ADMIN_SECRET is missing.",
  );
}
/* =========================================================
   AXIOS INSTANCE
========================================================= */

export const adminApi =
  axios.create({
    baseURL:
      API_BASE_URL,
    headers: {
      "Content-Type":
        "application/json",
      "x-admin-key":
        ADMIN_KEY,
    },
  });

/* =========================================================
   DASHBOARD STATS
========================================================= */

export async function getDashboardStats() {
  const response =
    await adminApi.get(
      "/admin/stats",
    );

  return response.data;
}

/* =========================================================
   POSTS
========================================================= */

export async function getPosts() {
  const response =
    await adminApi.get(
      "/admin/posts",
    );

  return response.data;
}

export async function getPost(
  id: number,
) {
  const response =
    await adminApi.get(
      `/admin/posts/${id}`,
    );

  return response.data;
}

/* =========================================================
   PROJECTS
========================================================= */

export async function getProjects() {
  const response =
    await adminApi.get(
      "/admin/projects",
    );

  return response.data;
}

export async function getProject(
  id: number,
) {
  const response =
    await adminApi.get(
      `/admin/projects/${id}`,
    );

  return response.data;
}

/* =========================================================
   MATERIALS
========================================================= */

export async function getMaterials() {
  const response =
    await adminApi.get(
      "/admin/materials",
    );

  return response.data;
}

export async function getMaterial(
  id: number,
) {
  const response =
    await adminApi.get(
      `/admin/materials/${id}`,
    );

  return response.data;
}

/* =========================================================
   LEADS
========================================================= */

export async function getLeads() {
  const response =
    await adminApi.get(
      "/admin/leads",
    );

  return response.data;
}

/* =========================================================
   SUBSCRIBERS
========================================================= */

export async function getSubscribers() {
  const response =
    await adminApi.get(
      "/admin/subscribers",
    );

  return response.data;
}