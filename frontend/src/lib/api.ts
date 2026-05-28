// src/lib/api.ts

/* =========================================================
   CLIENT API
   Browser-safe axios instance
========================================================= */

import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is missing",
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

  timeout: 30000,
});

/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */

api.interceptors.response.use(
  (response) =>
    response,

  (error) => {
    try {
      console.error(
        "CLIENT_API_ERROR:",
        {
          message:
            error?.message ||
            "Unknown error",

          status:
            error?.response
              ?.status,

          url:
            error?.config
              ?.url,

          method:
            error?.config
              ?.method,

          isNetworkError:
            !error?.response,

          isTimeout:
            error?.code ===
            "ECONNABORTED",
        },
      );
    } catch (
      loggingError
    ) {
      console.error(
        "API_LOGGING_FAILED:",
        loggingError,
      );
    }

    return Promise.reject(
      error,
    );
  },
);

/* =========================================================
   EXPORT
========================================================= */

export default api;