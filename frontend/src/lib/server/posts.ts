import "server-only";

import {
  adminApi,
} from "@/lib/server-admin-api";

import type {
  Post,
} from "@/types/post";

export async function getAdminPost(
  id: number,
): Promise<Post | null> {
  try {
    const response =
      await adminApi.get(
        `/admin/posts/${id}`,
      );

    return response.data;
  } catch (error) {
    console.error(error);

    return null;
  }
}