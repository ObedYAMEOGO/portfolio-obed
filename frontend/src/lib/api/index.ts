import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is missing");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =======================================================
   HELPERS
======================================================= */

/**
 * Waits for window.Clerk to be loaded and have an active
 * session before resolving. Times out after 5 s to avoid
 * hanging requests on unauthenticated pages.
 */
function waitForClerkSession(timeoutMs = 5000): Promise<string | null> {
  return new Promise((resolve) => {
    const deadline = Date.now() + timeoutMs;

    const attempt = async () => {
      if (typeof window === "undefined") {
        resolve(null);
        return;
      }

      const clerk = window.Clerk;

      if (clerk?.session) {
        // Session is ready — grab the token
        try {
          const token = await clerk.session.getToken();
          resolve(token ?? null);
        } catch {
          resolve(null);
        }
        return;
      }

      if (Date.now() >= deadline) {
        // Timed out — no session found
        resolve(null);
        return;
      }

      // Clerk not ready yet — retry in 100 ms
      setTimeout(attempt, 100);
    };

    attempt();
  });
}

/* =======================================================
   REQUEST INTERCEPTOR
======================================================= */

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await waitForClerkSession();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("No Clerk session token available for", config.url);
      }
    } catch (error) {
      console.error("TOKEN_INJECTION_ERROR:", error);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* =======================================================
   RESPONSE INTERCEPTOR
======================================================= */

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url;
    const data = error?.response?.data;

    console.error(`API error ${status} on ${url}:`, data);

    return Promise.reject(error);
  },
);

export default api;