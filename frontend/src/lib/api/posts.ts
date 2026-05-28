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
  async getAll(): Promise<
    Post[]
  > {
    try {
      const response =
        await api.get(
          "/admin/posts",
        );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch posts:",
        error,
      );

      throw error;
    }
  },

  async getById(
    id: number,
  ): Promise<Post> {
    try {
      const response =
        await api.get(
          `/admin/posts/${id}`,
        );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch post:",
        error,
      );

      throw error;
    }
  },

  async create(
    data: PostCreate,
  ): Promise<Post> {
    try {
      const response =
        await api.post(
          "/admin/posts",
          data,
        );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to create post:",
        error,
      );

      throw error;
    }
  },

  async update(
    id: number,
    data: PostCreate,
  ): Promise<Post> {
    try {
      const response =
        await api.put(
          `/admin/posts/${id}`,
          data,
        );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to update post:",
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
        `/admin/posts/${id}`,
      );
    } catch (error) {
      console.error(
        "Failed to delete post:",
        error,
      );

      throw error;
    }
  },
};