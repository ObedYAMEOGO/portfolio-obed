// src/lib/api/leads.ts

import api from "./index";

import {
  Lead,
} from "@/types";

/* =========================================================
   LEADS API
========================================================= */

export const leadsApi = {
  async getAll(): Promise<
    Lead[]
  > {
    try {
      const response =
        await api.get(
          "/admin/leads",
        );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch leads:",
        error,
      );

      throw error;
    }
  },

  async delete(
    id: number,
  ): Promise<void> {
    try {
      await api.delete(
        `/admin/leads/${id}`,
      );
    } catch (error) {
      console.error(
        "Failed to delete lead:",
        error,
      );

      throw error;
    }
  },
};