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
    const response =
      await api.get(
        "/admin/leads",
      );

    return response.data;
  },

  async delete(
    id: number,
  ): Promise<void> {
    await api.delete(
      `/admin/leads/${id}`,
    );
  },
};