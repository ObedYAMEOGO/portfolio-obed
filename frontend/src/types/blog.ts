export type BlogCategory =
  | "Engineering"
  | "Design"
  | "Career"
  | "Next.js"
  | "Database"
  | "DevOps"
  | "CSS"
  | "React"
  | "Auth";

export type TimeBucket = "today" | "this-week" | "this-month" | "archive";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  author: {
    name: string;
    initials: string;
  };
  publishedAt: string; // ISO date string e.g. "2024-09-15"
  readingTime: number; // minutes
  featured?: boolean;   // editor's pick — only one post should have this true
  coverImage?: string;  // optional, URL or local path
}