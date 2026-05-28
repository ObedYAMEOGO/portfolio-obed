/* GORDON: Server-side API client.
   Uses INTERNAL_API_URL for Docker communication.
   ONLY used in server components / server actions.
*/

import axios from "axios";

const API_BASE_URL =
  process.env.INTERNAL_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    "INTERNAL_API_URL is missing",
  );
}

/* =========================================================
   SERVER AXIOS INSTANCE
========================================================= */

const serverApi = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type":
      "application/json",
  },
});

/* =========================================================
   ADMIN HEADER INJECTION
========================================================= */

serverApi.interceptors.request.use(
  (config) => {
    const adminKey =
      process.env.ADMIN_SECRET;

    /* Ensure headers object exists */
    config.headers =
      config.headers || {};

    /* Inject admin key for admin routes */
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

  (error) =>
    Promise.reject(error),
);

/* =========================================================
   RESPONSE ERROR HANDLING
========================================================= */

serverApi.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {
      console.error(
        "SERVER_API_ERROR:",
        {
          status:
            error.response.status,

          url:
            error.config?.url,

          data:
            error.response.data,
        },
      );
    } else if (
      error.request
    ) {
      console.error(
        "SERVER_API_NETWORK_ERROR:",
        error.message,
      );
    } else {
      console.error(
        "SERVER_API_UNKNOWN_ERROR:",
        error.message,
      );
    }

    return Promise.reject(
      error,
    );
  },
);

export default serverApi;