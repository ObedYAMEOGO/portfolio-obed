// src/lib/api/posts.ts

import api from "./index";

import type {
  Post,
  PostCreate,
  PostUpdate,
  PaginatedPosts,
} from "@/types";

/* =========================================================
   BACKEND -> FRONTEND TRANSFORMER
========================================================= */

function transformPost(post: Post): Post {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    summary: post.summary ?? "",
    content: post.content,
    category: post.category || "Research", 
    tags: post.tags ?? [],
    cover_image_url: post.cover_image_url ?? null,
    seo_title: post.seo_title ?? null,
    seo_description: post.seo_description ?? null,
    featured: post.featured,
    is_published: post.is_published,
    published_at: post.published_at ?? null,
    reading_time: post.reading_time,
    author_name: post.author_name,
    author_initials: post.author_initials,
    created_at: post.created_at,
    updated_at: post.updated_at ?? null,
  };
}

/* =========================================================
   POSTS API
========================================================= */

export const postsApi = {
  /* =========================
     ADMIN - LIST POSTS
  ========================= */

  async getAll(page = 1, pageSize = 10) {
    const res = await api.get<PaginatedPosts>(
      `/admin/posts?page=${page}&page_size=${pageSize}`
    );

    return {
      items: res.data.items.map(transformPost),
      total: res.data.total,
      page: res.data.page,
      page_size: res.data.page_size,
      total_pages: res.data.total_pages,
      has_next: res.data.has_next,
      has_prev: res.data.has_prev,
    };
  },

  /* =========================
     ADMIN - GET BY ID
  ========================= */

  async getById(id: number) {
    const res = await api.get<Post>(`/admin/posts/${id}`);
    return transformPost(res.data);
  },

  /* =========================
     CREATE POST
  ========================= */

  async create(data: PostCreate) {
    const res = await api.post<Post>(`/admin/posts`, data);
    return transformPost(res.data);
  },

  /* =========================
     UPDATE POST
  ========================= */

  async update(id: number, data: PostUpdate) {
    const res = await api.put<Post>(
      `/admin/posts/${id}`,
      data
    );
    return transformPost(res.data);
  },

  /* =========================
     DELETE POST
  ========================= */

  async delete(id: number) {
    await api.delete(`/admin/posts/${id}`);
  },

  /* =========================
     PUBLIC POSTS
  ========================= */

  async getPublished(page = 1, pageSize = 12) {
    const res = await api.get<PaginatedPosts>(
      `/posts?page=${page}&page_size=${pageSize}`
    );

    return {
      items: res.data.items.map(transformPost),
      total: res.data.total,
      page: res.data.page,
      page_size: res.data.page_size,
      total_pages: res.data.total_pages,
      has_next: res.data.has_next,
      has_prev: res.data.has_prev,
    };
  },

  /* =========================
     GET BY SLUG
  ========================= */

  async getBySlug(slug: string) {
    const res = await api.get<Post>(`/posts/${slug}`);
    return transformPost(res.data);
  },
};