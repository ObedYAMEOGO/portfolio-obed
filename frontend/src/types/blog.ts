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

/**
 * Backend → Frontend normalized BlogPost contract
 * MUST match FastAPI PostResponse mapping
 */
export interface BlogPost {
  id: number;

  title: string;
  slug: string;

  excerpt: string | null;
  content: string;

  category: BlogCategory | string;

  tags: string[];

  coverImageUrl: string | null;

  isPublished: boolean;
  featured: boolean;

  createdAt: string;
  updatedAt: string | null;
  publishedAt: string | null;

  readingTime: number;

  authorName: string;
  authorInitials: string;
}