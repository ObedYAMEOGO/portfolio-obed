/* GORDON: Server-only settings API.
   Uses INTERNAL_API_URL + server secrets.
   ONLY imported inside server components.
*/

import "server-only";

import serverApi from "./server";

/* =========================================================
   TYPES
========================================================= */

export interface AdminSettings {
  id?: number;

  resume_url:
    | string
    | null;

  updated_at?: string;
}

/* =========================================================
   GET SETTINGS (SERVER)
========================================================= */

export async function getSettingsServer():
  Promise<AdminSettings> {
  try {
    const response =
      await serverApi.get<AdminSettings>(
        "/admin/settings",
      );

    return response.data;
  } catch (error) {
    /* Prevent app crash */
    console.error(
      "SETTINGS_SERVER_ERROR:",
      error instanceof Error
        ? error.message
        : "Unknown error",
    );

    /* Safe fallback */
    return {
      resume_url: null,
    };
  }
}