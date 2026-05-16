import axios from "axios";
import { Post, PostCreate, Project, Subscriber, Lead } from "@/types";

const getBaseURL = () => {
  // Browser → localhost
  if (typeof window !== "undefined") {
    return "http://localhost:8000/api/v1";
  }

  // Docker server-side
  return "http://backend:8000/api/v1";
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

/**
 * PROJECT & SYSTEM API
 */
export const systemApi = {
  getProjects: () => api.get<Project[]>("/projects"),

  getSubscribers: () =>
    api.get<Subscriber[]>("/subscribers"),

  getLeads: () =>
    api.get<Lead[]>("/leads"),
};

/**
 * BLOG SYSTEM API
 */
export const blogApi = {
  // PUBLIC
  getAllPublished: () =>
    api.get<Post[]>("/posts"),

  getBySlug: (slug: string) =>
    api.get<Post>(`/posts/${slug}`),

  // ADMIN
  adminGetAll: () =>
    api.get<Post[]>("/admin/posts"),

  create: (data: PostCreate) =>
    api.post<Post>("/admin/posts", data),

  getById: (id: number) =>
    api.get<Post>(`/admin/posts/${id}`),

  update: (id: number, data: PostCreate) =>
    api.put<Post>(`/admin/posts/${id}`, data),

  delete: (id: number) =>
    api.delete(`/admin/posts/${id}`),
  subscribe: (email: string) => api.post("/subscribe", { email }),
  unsubscribe: (email: string) => api.post(`/unsubscribe?email=${encodeURIComponent(email)}`),
};

