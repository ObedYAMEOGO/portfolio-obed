// src/lib/api/settings-server.ts

import "server-only";

import { apiFetch } from "@/lib/server-api";

/* =========================================================
   TYPES
========================================================= */

export interface AdminSettings {
  id?: number;
  resume_url: string | null;
  updated_at?: string;
}

/* =========================================================
   GET SETTINGS (SERVER)
========================================================= */

export async function getSettingsServer(): Promise<AdminSettings> {
  try {
    // Revalidate every 60 seconds so CV updates appear quickly after admin upload
    return await apiFetch<AdminSettings>("/admin/settings", { revalidate: 60 });
  } catch (error) {
    console.error(
      "SETTINGS_SERVER_ERROR:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return { resume_url: null };
  }
}
