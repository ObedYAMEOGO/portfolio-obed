// src/lib/api/materials.ts

import api from "./index";
import { AxiosError } from "axios";

import {
  Material,
  MaterialCreate,
} from "@/types";

/* =========================================================
   TYPE GUARDS
========================================================= */

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

/* =========================================================
   MATERIALS API
========================================================= */

export const materialsApi = {
  // PUBLIC - for courses page (no auth required)
  async getPublicCourses(): Promise<Material[]> {
    try {
      const response = await api.get("/materials");
      return response.data;
    } catch (error: unknown) {
      console.error("Failed to fetch public courses:", error);
      return [];
    }
  },

  // ADMIN - requires authentication
  async getAll(): Promise<Material[]> {
    try {
      const response = await api.get("/admin/materials");
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error("Failed to fetch materials:", {
          status: error.response?.status,
          message: error.message,
        });
      } else {
        console.error("Failed to fetch materials:", error);
      }
      throw error;
    }
  },

  async getById(id: number): Promise<Material> {
    try {
      const response = await api.get(`/admin/materials/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error(`Failed to fetch material ${id}:`, {
          status: error.response?.status,
          message: error.message,
        });
      } else {
        console.error(`Failed to fetch material ${id}:`, error);
      }
      throw error;
    }
  },

  async create(data: MaterialCreate): Promise<Material> {
    try {
      const response = await api.post("/admin/materials", data);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error("Failed to create material:", {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
      } else {
        console.error("Failed to create material:", error);
      }
      throw error;
    }
  },

  async update(id: number, data: MaterialCreate): Promise<Material> {
    try {
      const response = await api.put(`/admin/materials/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error(`Failed to update material ${id}:`, {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
      } else {
        console.error(`Failed to update material ${id}:`, error);
      }
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/admin/materials/${id}`);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error(`Failed to delete material ${id}:`, {
          status: error.response?.status,
          message: error.message,
        });
      } else {
        console.error(`Failed to delete material ${id}:`, error);
      }
      throw error;
    }
  },
};