// src/lib/api/settings.ts

import api from "./index";

/* =========================================================
   TYPES
========================================================= */

export interface UpdateResumePayload {
  resume_url: string;
}

/* =========================================================
   SETTINGS API
========================================================= */

export const settingsApi = {
  async getSettings() {
    const response =
      await api.get(
        "/admin/settings",
      );

    return response.data;
  },

  async updateResume(
    data: UpdateResumePayload,
  ) {
    const response =
      await api.put(
        "/admin/settings/resume",
        data,
      );

    return response.data;
  },
};