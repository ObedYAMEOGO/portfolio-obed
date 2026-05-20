// src/lib/api/materials.ts

import api from "./index";

import {
  Material,
  MaterialCreate,
} from "@/types";

/* =========================================================
   MATERIALS API
========================================================= */

export const materialsApi = {
  async getAll(): Promise<
    Material[]
  > {
    const response =
      await api.get(
        "/admin/materials",
      );

    return response.data;
  },

  async getById(
    id: number,
  ): Promise<Material> {
    const response =
      await api.get(
        `/admin/materials/${id}`,
      );

    return response.data;
  },

  async create(
    data: MaterialCreate,
  ): Promise<Material> {
    const response =
      await api.post(
        "/admin/materials",
        data,
      );

    return response.data;
  },

  async update(
    id: number,
    data: MaterialCreate,
  ): Promise<Material> {
    const response =
      await api.put(
        `/admin/materials/${id}`,
        data,
      );

    return response.data;
  },

  async delete(
    id: number,
  ): Promise<void> {
    await api.delete(
      `/admin/materials/${id}`,
    );
  },
};