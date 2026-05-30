"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Post } from "@/types";
import { postDate } from "@/types/blog-utils";
import { cn } from "@/lib/utils";
import RelativeDate from "@/components/blog/RelativeDate";

interface ArchiveRowProps {
  post: Post;
}

const CATEGORY_PILL: Record<string, string> = {
  "AI Engineering":   "text-emerald-700 bg-emerald-50",
  LLMs:               "text-sky-700 bg-sky-50",
  "Machine Learning": "text-violet-700 bg-violet-50",
  MLOps:              "text-orange-700 bg-orange-50",
  RAG:                "text-cyan-700 bg-cyan-50",
  "AI Agents":        "text-indigo-700 bg-indigo-50",
  Inference:          "text-pink-700 bg-pink-50",
  Infrastructure:     "text-amber-700 bg-amber-50",
  Research:           "text-blue-700 bg-blue-50",
};

export default function ArchiveRow({ post }: ArchiveRowProps) {
  const pillClass =
    CATEGORY_PILL[post.category] ?? "text-neutral-700 bg-neutral-100";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="
        group flex items-center gap-3 border-b border-neutral-100
        px-4 py-4 transition-colors duration-150
        last:border-b-0 hover:bg-neutral-50 sm:gap-4
      "
    >
      <span
        className={cn(
          "hidden shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider sm:block",
          pillClass,
        )}
      >
        {post.category}
      </span>

      <span className="flex-1 text-[13px] font-medium leading-snug text-neutral-700 group-hover:text-neutral-900">
        {post.title}
      </span>

      {/* ✅ RelativeDate replaces the raw formatPostDate span */}
      <RelativeDate
        dateString={postDate(post)}
        className="shrink-0 text-[11px] text-neutral-400"
      />

      <span className="hidden shrink-0 text-[11px] text-neutral-400 sm:block">
        {post.reading_time} min
      </span>

      <ArrowRight
        className="
          h-3.5 w-3.5 shrink-0 text-neutral-300 opacity-0
          transition-all duration-150
          group-hover:translate-x-0.5 group-hover:text-neutral-500 group-hover:opacity-100
        "
      />
    </Link>
  );
}