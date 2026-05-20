// src/lib/api/index.ts

import axios from "axios";

/* =========================================================
   SERVER VS CLIENT URL
========================================================= */

const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.INTERNAL_API_URL
    : process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    "API URL is missing."
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
   ADMIN HEADER
========================================================= */

api.interceptors.request.use(
  (config) => {
    const adminKey =
      process.env
        .NEXT_PUBLIC_ADMIN_SECRET;

    if (
      adminKey &&
      config.url?.includes(
        "/admin"
      )
    ) {
      config.headers[
        "x-admin-key"
      ] = adminKey;
    }

    return config;
  }
);

/* =========================================================
   EXPORT
========================================================= */

export default api;