// src/lib/server/posts.ts

import "server-only";

import {
  adminApi,
} from "@/lib/server-admin-api";

import type {
  Post,
} from "@/types";

/* =========================================================
   GET ADMIN POST
========================================================= */

export async function getAdminPost(
  id: number,
): Promise<Post | null> {
  try {
    const response =
      await adminApi.get<Post>(
        `/admin/posts/${id}`,
      );

    return response.data;
  } catch (error) {
    console.error(
      "GET_ADMIN_POST_ERROR:",
      {
        id,

        message:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
    );

    return null;
  }
}