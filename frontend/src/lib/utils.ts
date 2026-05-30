// src/lib/utils/index.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { BlogCategory } from "@/types";

/* =========================================================
   UI UTILITY
========================================================= */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* =========================================================
   CONTENT UTILITY
========================================================= */

export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content?.trim().split(/\s+/).length ?? 0;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));

  return `${minutes} min read`;
}

/* =========================================================
   CATEGORY SYSTEM (SAFE NORMALIZER)
========================================================= */

const BLOG_CATEGORIES = [
  "AI Engineering",
  "LLMs",
  "Machine Learning",
  "MLOps",
  "RAG",
  "AI Agents",
  "Inference",
  "Infrastructure",
  "Research",
] as const satisfies readonly BlogCategory[];

export function normalizeCategory(
  cat: string | null | undefined
): BlogCategory {
  if (
    cat &&
    (BLOG_CATEGORIES as readonly string[]).includes(cat)
  ) {
    return cat as BlogCategory;
  }

  return "Research";
}

