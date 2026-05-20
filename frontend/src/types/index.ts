// src/types/index.ts

/* =========================================================
   POSTS
========================================================= */

export interface Post {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  category: string;
  feature_image_url?: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PostCreate {
  title: string;
  slug: string;
  summary?: string;
  content: string;
  category: string;
  feature_image_url?: string;
  is_published: boolean;
}

/* =========================================================
   PROJECTS
========================================================= */

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectCreate {
  title: string;
  slug: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  is_published: boolean;
}

/* =========================================================
   MATERIALS
========================================================= */

export type MaterialType =
  | "DOCUMENT"
  | "VIDEO";

export type VideoContext =
  | "NONE"
  | "SINGLE"
  | "PLAYLIST";

export interface Material {
  id: number;
  title: string;
  slug: string;
  description?: string;
  material_type: MaterialType;
  video_context: VideoContext;
  category: string;
  resource_url: string;
  thumbnail_url?: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MaterialCreate {
  title: string;
  slug: string;
  description?: string;
  material_type: MaterialType;
  video_context: VideoContext;
  category: string;
  resource_url: string;
  thumbnail_url?: string;
  is_published: boolean;
}

/* =========================================================
   LEADS
========================================================= */

export interface Lead {
  id: number;
  full_name: string;
  email: string;
  message: string;
  created_at?: string;
}

/* =========================================================
   SUBSCRIBERS
========================================================= */

export interface Subscriber {
  id: number;
  email: string;
  is_active: boolean;
  created_at?: string;
}

/* =========================================================
   DASHBOARD STATS
========================================================= */

export interface DashboardStats {
  total_projects: number;
  total_articles: number;
  total_materials: number;
  total_leads: number;
  active_subscribers: number;
  system_status: string;
}