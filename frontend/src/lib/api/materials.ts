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
    try {
      const response =
        await api.get(
          "/admin/materials",
        );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch materials:",
        error,
      );

      throw error;
    }
  },

  async getById(
    id: number,
  ): Promise<Material> {
    try {
      const response =
        await api.get(
          `/admin/materials/${id}`,
        );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch material:",
        error,
      );

      throw error;
    }
  },

  async create(
    data: MaterialCreate,
  ): Promise<Material> {
    try {
      const response =
        await api.post(
          "/admin/materials",
          data,
        );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to create material:",
        error,
      );

      throw error;
    }
  },

  async update(
    id: number,
    data: MaterialCreate,
  ): Promise<Material> {
    try {
      const response =
        await api.put(
          `/admin/materials/${id}`,
          data,
        );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to update material:",
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
        `/admin/materials/${id}`,
      );
    } catch (error) {
      console.error(
        "Failed to delete material:",
        error,
      );

      throw error;
    }
  },
};