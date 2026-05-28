"use client";

import Link from "next/link";
import { Clock } from "lucide-react";

import type { BlogPost } from "@/types/blog";
import { formatPostDate } from "@/lib/blog-utils";
import { cn } from "@/lib/utils";

export type PostCardSize = "md" | "sm"; // md = this-week, sm = this-month

interface PostCardProps {
  post: BlogPost;
  size?: PostCardSize;
}

const CATEGORY_DOT: Record<string, string> = {
  Engineering: "bg-emerald-500",
  "Next.js":   "bg-sky-500",
  Design:      "bg-violet-500",
  Career:      "bg-amber-500",
  Database:    "bg-blue-500",
  DevOps:      "bg-orange-500",
  CSS:         "bg-pink-500",
  React:       "bg-cyan-500",
  Auth:        "bg-indigo-500",
};

export default function PostCard({ post, size = "md" }: PostCardProps) {
  const dot = CATEGORY_DOT[post.category] ?? "bg-neutral-400";

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article
        className={cn(
          `
            flex
            h-full
            flex-col
            gap-3
            rounded-2xl
            border
            border-neutral-200
            bg-white
            p-5
            transition-all
            duration-200
            group-hover:border-neutral-300
            group-hover:shadow-sm
          `,
          size === "sm" && "gap-2 p-4",
        )}
      >
        {/* ── Decorative thumbnail ── */}
        {size === "md" && (
          <div
            className="
              h-28
              w-full
              overflow-hidden
              rounded-xl
              bg-neutral-100
              transition-all
              duration-300
              group-hover:bg-neutral-200
            "
          />
        )}

        {/* ── Category + title ── */}
        <div className="flex items-center gap-2">
          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dot)} />
          <span
            className={cn(
              "font-semibold uppercase tracking-wider text-neutral-500",
              size === "md" ? "text-[10px]" : "text-[10px]",
            )}
          >
            {post.category}
          </span>
        </div>

        <h3
          className={cn(
            "font-semibold leading-snug tracking-tight text-neutral-900 transition-colors duration-200 group-hover:text-neutral-600",
            size === "md" ? "text-[15px]" : "text-[13px]",
          )}
        >
          {post.title}
        </h3>

        {size === "md" && (
          <p className="line-clamp-2 text-[13px] leading-relaxed text-neutral-500">
            {post.excerpt}
          </p>
        )}

        {/* ── Meta ── */}
        <div className="mt-auto flex items-center gap-1.5 text-[11px] text-neutral-400">
          <span>{formatPostDate(post.publishedAt)}</span>
          <span>·</span>
          <Clock className="h-3 w-3" />
          <span>{post.readingTime} min</span>
        </div>
      </article>
    </Link>
  );
}