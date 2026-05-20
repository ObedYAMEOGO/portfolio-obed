// src/lib/api/posts.ts

import api from "./index";

import {
  Post,
  PostCreate,
} from "@/types";

/* =========================================================
   POSTS API
========================================================= */

export const postsApi = {
  async getAll(): Promise<Post[]> {
    const response =
      await api.get(
        "/admin/posts",
      );

    return response.data;
  },

  async getById(
    id: number,
  ): Promise<Post> {
    const response =
      await api.get(
        `/admin/posts/${id}`,
      );

    return response.data;
  },

  async create(
    data: PostCreate,
  ): Promise<Post> {
    const response =
      await api.post(
        "/admin/posts",
        data,
      );

    return response.data;
  },

  async update(
    id: number,
    data: PostCreate,
  ): Promise<Post> {
    const response =
      await api.put(
        `/admin/posts/${id}`,
        data,
      );

    return response.data;
  },

  async delete(
    id: number,
  ): Promise<void> {
    await api.delete(
      `/admin/posts/${id}`,
    );
  },
};