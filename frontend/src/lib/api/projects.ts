// src/lib/api/projects.ts

"use client";

import api from "./index";

import {
  Project,
  ProjectCreate,
} from "@/types";

/* =========================================================
   CLIENT PROJECT API
========================================================= */

export const projectsApi = {
  async create(
    data: ProjectCreate,
  ): Promise<Project> {
    try {
      const response =
        await api.post(
          "/admin/projects",
          data,
        );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to create project:",
        error,
      );

      throw error;
    }
  },

  async update(
    id: number,
    data: ProjectCreate,
  ): Promise<Project> {
    try {
      const response =
        await api.put(
          `/admin/projects/${id}`,
          data,
        );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to update project:",
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
        `/admin/projects/${id}`,
      );
    } catch (error) {
      console.error(
        "Failed to delete project:",
        error,
      );

      throw error;
    }
  },
};