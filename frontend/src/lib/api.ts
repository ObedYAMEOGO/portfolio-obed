// src/lib/api.ts

import axios from "axios";

/* =========================================================
   BASE CONFIG
========================================================= */

const API_BASE_URL =
  process.env
    .NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is missing.",
  );
}

/* =========================================================
   AXIOS INSTANCE 
========================================================= */

const api = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type":
      "application/json",
  },
});

/* =========================================================
   ADMIN AUTH HEADER
========================================================= */

api.interceptors.request.use(
  (config) => {
    const adminKey =
      process.env
        .NEXT_PUBLIC_ADMIN_SECRET;

    if (
      adminKey &&
      config.url?.includes(
        "/admin",
      )
    ) {
      config.headers[
        "x-admin-key"
      ] = adminKey;
    }

    return config;
  },

  (error) => {
    return Promise.reject(
      error,
    );
  },
);

/* =========================================================
   RESPONSE ERROR HANDLER
========================================================= */

api.interceptors.response.use(
  (response) =>
    response,

  (error) => {
    const message =
      error?.response?.data
        ?.detail ||
      error?.message ||
      "Request failed.";

    return Promise.reject(
      new Error(message),
    );
  },
);

/* =========================================================
   GENERIC REQUEST
========================================================= */

async function request<T>(
  url: string,
  options?: {
    method?: string;
    body?: unknown;
  },
): Promise<T> {
  const response =
    await api.request<T>({
      url,
      method:
        options?.method ||
        "GET",
      data: options?.body,
    });

  return response.data;
}

/* =========================================================
   BLOG API
========================================================= */

export const blogApi = {
  getAll: () =>
    request("/posts"),

  getBySlug: (
    slug: string,
  ) =>
    request(`/posts/${slug}`),

  create: (
    data: unknown,
  ) =>
    request(
      "/admin/posts",
      {
        method: "POST",
        body: data,
      },
    ),

  update: (
    id: number,
    data: unknown,
  ) =>
    request(
      `/admin/posts/${id}`,
      {
        method: "PUT",
        body: data,
      },
    ),

  delete: (
    id: number,
  ) =>
    request(
      `/admin/posts/${id}`,
      {
        method: "DELETE",
      },
    ),
};

/* =========================================================
   PROJECT API
========================================================= */

export const projectApi = {
  getAll: () =>
    request("/projects"),

  getById: (
    id: number,
  ) =>
    request(
      `/admin/projects/${id}`,
    ),

  create: (
    data: unknown,
  ) =>
    request(
      "/admin/projects",
      {
        method: "POST",
        body: data,
      },
    ),

  update: (
    id: number,
    data: unknown,
  ) =>
    request(
      `/admin/projects/${id}`,
      {
        method: "PUT",
        body: data,
      },
    ),

  delete: (
    id: number,
  ) =>
    request(
      `/admin/projects/${id}`,
      {
        method: "DELETE",
      },
    ),
};

/* =========================================================
   MATERIAL API
========================================================= */

export const materialApi = {
  getAll: () =>
    request("/materials"),

  getById: (
    id: number,
  ) =>
    request(
      `/admin/materials/${id}`,
    ),

  create: (
    data: unknown,
  ) =>
    request(
      "/admin/materials",
      {
        method: "POST",
        body: data,
      },
    ),

  update: (
    id: number,
    data: unknown,
  ) =>
    request(
      `/admin/materials/${id}`,
      {
        method: "PUT",
        body: data,
      },
    ),

  delete: (
    id: number,
  ) =>
    request(
      `/admin/materials/${id}`,
      {
        method: "DELETE",
      },
    ),
};

/* =========================================================
   LEADS API
========================================================= */

export const leadsApi = {
  getAll: () =>
    request("/admin/leads"),
};

/* =========================================================
   SUBSCRIBERS API
========================================================= */

export const subscribersApi =
  {
    getAll: () =>
      request(
        "/admin/subscribers",
      ),
  };

export default api;