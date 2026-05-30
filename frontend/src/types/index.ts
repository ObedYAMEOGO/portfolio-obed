// frontend/src/types/index.ts

/* =========================================================
   BLOG CATEGORY (FRONTEND ONLY)
========================================================= */

export type BlogCategory =
  | "AI Engineering"
  | "LLMs"
  | "Machine Learning"
  | "MLOps"
  | "RAG"
  | "AI Agents"
  | "Inference"
  | "Infrastructure"
  | "Research";

/* =========================================================
   BACKEND POST RESPONSE (MATCH FASTAPI PostResponse)
========================================================= */

export interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  category: string; // Backend enum serialized to string, never null
  tags: string[];
  cover_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  featured: boolean;
  is_published: boolean;
  published_at: string | null;
  reading_time: number;
  author_name: string;
  author_initials: string;
  created_at: string;
  updated_at: string | null;
}

// ─── Alias ───────────────────────────────────────────────────────────────────
// BlogPost previously existed as a separate camelCase UI model.
// That caused runtime bugs in ArchiveRow / BlogSidebar (post.createdAt,
// post.readingTime, etc. were undefined at runtime because the API returns
// snake_case). All components now use Post directly.
// This alias keeps any remaining `import type { BlogPost }` lines compiling
// while you migrate — remove it once every file imports Post instead.
export type BlogPost = Post;

/* =========================================================
   POST CREATE / UPDATE (MATCH PostCreate / PostUpdate)
========================================================= */

export interface PostCreate {
  title: string;
  slug: string;
  summary?: string | null;
  content: string;
  category: BlogCategory;
  tags?: string[];
  cover_image_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  featured?: boolean;
  is_published?: boolean;
  published_at?: string | null;
}

export interface PostUpdate {
  title?: string;
  slug?: string;
  summary?: string | null;
  content?: string;
  category?: BlogCategory;
  tags?: string[];
  cover_image_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  featured?: boolean;
  is_published?: boolean;
  published_at?: string | null;
}

/* =========================================================
   PAGINATION (MATCH BACKEND EXACTLY)
========================================================= */

export interface PaginatedPosts {
  items: Post[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

/* =========================================================
   PROJECTS
========================================================= */

export interface Project {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  content?: string | null;
  tech_stack: string[];
  github_url?: string | null;
  live_url?: string | null;
  image_url?: string | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectCreate {
  title: string;
  slug: string;
  description?: string;
  content?: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  is_published?: boolean;
}

/* =========================================================
   MATERIALS
========================================================= */

export type MaterialType = "DOCUMENT" | "VIDEO";

export type VideoContext = "NONE" | "SINGLE" | "PLAYLIST";

export interface Material {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  material_type: MaterialType;
  video_context: VideoContext;
  category: string;
  resource_url: string;
  thumbnail_url?: string | null;
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

export interface LeadCreate {
  full_name: string;
  email: string;
  message: string;
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

export interface SubscriberCreate {
  email: string;
}

/* =========================================================
   USERS
========================================================= */

export interface User {
  id: number;
  clerk_id: string;
  email: string;
  full_name?: string | null;
  receive_notifications: boolean;
  created_at?: string;
}

export interface UserSync {
  clerk_id: string;
  email: string;
  full_name?: string | null;
}

export interface UserNotificationUpdate {
  email: string;
}

export interface AdminUserResponse {
  id: number;
  email: string;
  full_name?: string | null;
  receive_notifications: boolean;
  is_newsletter_subscriber: boolean;
  created_at: string;
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