"use client";

import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";

import type { BlogPost } from "@/types/blog";
import { formatPostDate } from "@/lib/blog-utils";
import { cn } from "@/lib/utils";

interface FeaturedHeroProps {
  post: BlogPost;
}

// Category accent colours — extend as you add categories
const CATEGORY_COLORS: Record<string, string> = {
  Engineering: "text-emerald-600 bg-emerald-50 border-emerald-200",
  "Next.js":   "text-sky-600 bg-sky-50 border-sky-200",
  Design:      "text-violet-600 bg-violet-50 border-violet-200",
  Career:      "text-amber-600 bg-amberald-50 border-amber-200",
  Database:    "text-blue-600 bg-blue-50 border-blue-200",
  DevOps:      "text-orange-600 bg-orange-50 border-orange-200",
  CSS:         "text-pink-600 bg-pink-50 border-pink-200",
  React:       "text-cyan-600 bg-cyan-50 border-cyan-200",
  Auth:        "text-indigo-600 bg-indigo-50 border-indigo-200",
};

export default function FeaturedHero({ post }: FeaturedHeroProps) {
  const accentClass =
    CATEGORY_COLORS[post.category] ?? "text-neutral-600 bg-neutral-100 border-neutral-200";

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      {/* ── Desktop: side-by-side | Mobile: stacked ── */}
      <article
        className="
          grid
          grid-cols-1
          overflow-hidden
          rounded-2xl
          border
          border-neutral-200
          bg-white
          shadow-sm
          transition-shadow
          duration-300
          group-hover:shadow-md
          md:grid-cols-[1fr_1.1fr]
        "
      >
        {/* ── Decorative image panel ── */}
        <div
          className="
            relative
            flex
            min-h-[180px]
            items-center
            justify-center
            overflow-hidden
            bg-gradient-to-br
            from-neutral-900
            via-neutral-800
            to-neutral-700
            md:min-h-[280px]
          "
        >
          {/* Editor's pick badge */}
          <span
            className="
              absolute
              left-4
              top-4
              rounded-full
              border
              border-emerald-400/30
              bg-emerald-500/20
              px-3
              py-1
              text-[10px]
              font-semibold
              uppercase
              tracking-widest
              text-emerald-300
              backdrop-blur-sm
            "
          >
            Editor&apos;s pick
          </span>

          {/* Abstract decorative shape */}
          <div
            className="
              h-24
              w-24
              rounded-2xl
              border
              border-white/10
              bg-white/5
              backdrop-blur-sm
              transition-transform
              duration-500
              group-hover:scale-110
              group-hover:rotate-3
            "
          />
        </div>

        {/* ── Text content ── */}
        <div className="flex flex-col justify-between gap-4 p-6 md:p-8">
          <div className="space-y-3">
            {/* Category badge */}
            <span
              className={cn(
                "inline-block rounded-full border px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                accentClass,
              )}
            >
              {post.category}
            </span>

            {/* Title */}
            <h2
              className="
                text-xl
                font-semibold
                leading-snug
                tracking-tight
                text-neutral-900
                transition-colors
                duration-200
                group-hover:text-neutral-600
                md:text-2xl
              "
            >
              {post.title}
            </h2>

            {/* Excerpt — hidden on very small screens */}
            <p className="hidden text-sm leading-relaxed text-neutral-500 sm:block md:text-[15px]">
              {post.excerpt}
            </p>
          </div>

          {/* ── Meta row ── */}
          <div className="flex items-center gap-3">
            {/* Author avatar */}
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-neutral-900
                text-[10px]
                font-bold
                text-white
              "
            >
              {post.author.initials}
            </div>

            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-neutral-700">
                {post.author.name}
              </span>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                <span>{formatPostDate(post.publishedAt)}</span>
                <span>·</span>
                <Clock className="h-3 w-3" />
                <span>{post.readingTime} min read</span>
              </div>
            </div>

            {/* Read CTA — right-aligned */}
            <div
              className="
                ml-auto
                flex
                items-center
                gap-1.5
                rounded-full
                border
                border-neutral-200
                bg-neutral-50
                px-4
                py-1.5
                text-[12px]
                font-semibold
                text-neutral-700
                transition-all
                duration-200
                group-hover:border-neutral-900
                group-hover:bg-neutral-900
                group-hover:text-white
              "
            >
              <BookOpen className="h-3.5 w-3.5" />
              Read
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}