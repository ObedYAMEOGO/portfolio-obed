// src/lib/api/projects.ts

import api from "./index";

import {
  Project,
  ProjectCreate,
} from "@/types";

/* =========================================================
   PROJECTS API
========================================================= */

export const projectsApi = {
  async getAll(): Promise<
    Project[]
  > {
    const response =
      await api.get(
        "/admin/projects",
      );

    return response.data;
  },

  async getById(
    id: number,
  ): Promise<Project> {
    const response =
      await api.get(
        `/admin/projects/${id}`,
      );

    return response.data;
  },

  async create(
    data: ProjectCreate,
  ): Promise<Project> {
    const response =
      await api.post(
        "/admin/projects",
        data,
      );

    return response.data;
  },

  async update(
    id: number,
    data: ProjectCreate,
  ): Promise<Project> {
    const response =
      await api.put(
        `/admin/projects/${id}`,
        data,
      );

    return response.data;
  },

  async delete(
    id: number,
  ): Promise<void> {
    await api.delete(
      `/admin/projects/${id}`,
    );
  },
};