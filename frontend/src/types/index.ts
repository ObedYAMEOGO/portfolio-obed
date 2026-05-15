// frontend/types/index.ts

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  is_published: boolean;
  created_at: string;
}

export interface Subscriber {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface Lead {
  id: number;
  full_name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface Post {
  image_url: string;
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  feature_image_url?: string;
  category: string;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

export interface PostCreate {
  title: string;
  slug: string;
  summary?: string;
  content: string;
  feature_image_url?: string;
  category: string;
  is_published: boolean;
}