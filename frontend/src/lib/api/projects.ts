import api from "./index";

import {
  Project,
  ProjectCreate,
} from "@/types";

/* =========================================================
   PROJECTS API
========================================================= */

export const projectsApi = {
  /* ======================================================
     GET ALL PROJECTS
  ====================================================== */

  async getAll(): Promise<
    Project[]
  > {
    try {
      const response =
        await api.get(
          "/admin/projects",
        );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch projects:",
        error,
      );

      throw error;
    }
  },

  /* ======================================================
     GET PROJECT BY ID
  ====================================================== */

  async getById(
    id: number,
  ): Promise<Project> {
    try {
      const response =
        await api.get(
          `/admin/projects/${id}`,
        );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch project:",
        error,
      );

      throw error;
    }
  },

  /* ======================================================
     CREATE PROJECT
  ====================================================== */

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

  /* ======================================================
     UPDATE PROJECT
  ====================================================== */

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

  /* ======================================================
     DELETE PROJECT
  ====================================================== */

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