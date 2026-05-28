"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";

import type { BlogPost } from "@/types/blog";
import { cn } from "@/lib/utils";

interface ArchiveRowProps {
  post: BlogPost;
}

const CATEGORY_PILL: Record<string, string> = {
  Engineering: "text-emerald-700 bg-emerald-50",
  "Next.js":   "text-sky-700 bg-sky-50",
  Design:      "text-violet-700 bg-violet-50",
  Career:      "text-amber-700 bg-amber-50",
  Database:    "text-blue-700 bg-blue-50",
  DevOps:      "text-orange-700 bg-orange-50",
  CSS:         "text-pink-700 bg-pink-50",
  React:       "text-cyan-700 bg-cyan-50",
  Auth:        "text-indigo-700 bg-indigo-50",
};

export default function ArchiveRow({ post }: ArchiveRowProps) {
  const pillClass =
    CATEGORY_PILL[post.category] ?? "text-neutral-700 bg-neutral-100";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="
        group
        flex
        items-center
        gap-3
        border-b
        border-neutral-100
        px-4
        py-3.5
        transition-colors
        duration-150
        last:border-b-0
        hover:bg-neutral-50
        sm:gap-4
      "
    >
      {/* Category pill */}
      <span
        className={cn(
          "hidden shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider sm:block",
          pillClass,
        )}
      >
        {post.category}
      </span>

      {/* Title */}
      <span className="flex-1 text-[13px] font-medium leading-snug text-neutral-700 group-hover:text-neutral-900">
        {post.title}
      </span>

      {/* Date */}
      <span className="shrink-0 text-[11px] text-neutral-400">
        {format(new Date(post.publishedAt), "MMM d")}
      </span>

      {/* Read time */}
      <span className="hidden shrink-0 text-[11px] text-neutral-400 sm:block">
        {post.readingTime} min
      </span>

      {/* Arrow — appears on hover */}
      <ArrowRight
        className="
          h-3.5
          w-3.5
          shrink-0
          text-neutral-300
          opacity-0
          transition-all
          duration-150
          group-hover:translate-x-0.5
          group-hover:text-neutral-500
          group-hover:opacity-100
        "
      />
    </Link>
  );
}