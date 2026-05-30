"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock } from "lucide-react";

import type { Post } from "@/types";
import RelativeDate from "@/components/blog/RelativeDate";

interface FeaturedHeroProps {
  post: Post;
}

export default function FeaturedHero({ post }: FeaturedHeroProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
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
        {/* ── IMAGE ── */}
        <div className="relative min-h-60 overflow-hidden bg-neutral-100">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-linear-to-br from-neutral-900 via-neutral-800 to-neutral-700">
              <div className="h-24 w-24 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm" />
            </div>
          )}

          {/* Featured badge */}
          <span
            className="
              absolute left-4 top-4
              rounded-full border border-emerald-400/30
              bg-emerald-500/20 px-3 py-1
              text-[10px] font-semibold uppercase tracking-widest
              text-white backdrop-blur-sm
            "
          >
            Featured
          </span>
        </div>

        {/* ── CONTENT ── */}
        <div className="flex flex-col justify-between gap-4 p-6 md:p-8">
          <div className="space-y-4">

            {/* ── TOP ROW — category (left) + reading time (right) ── */}
            <div className="flex items-center justify-between gap-3">
              {/* Category badge — warm [#c17650] tint */}
              <span
                className="
                  inline-block rounded-full
                  border border-[#c17650]/30
                  bg-[#c17650]/10
                  px-3 py-1
                  text-[10px] font-semibold uppercase tracking-wider
                  text-[#c17650]
                "
              >
                {post.category}
              </span>

              {/* Reading time — top right */}
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>{post.reading_time} min read</span>
              </div>
            </div>

            {/* Title */}
            <h2
              className="
                text-2xl font-semibold leading-tight tracking-tight
                text-neutral-900 transition-colors duration-200
                group-hover:text-neutral-600
              "
            >
              {post.title}
            </h2>

            {(post.summary || post.content) && (
              <p className="text-sm leading-relaxed text-neutral-500 md:text-[15px]">
                {post.summary || post.content.substring(0, 150) + "..."}
              </p>
            )}
          </div>

          {/* ── AUTHOR + DATE + CTA ── */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white">
              {post.author_initials}
            </div>

            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-neutral-700">
                {post.author_name}
              </span>
              <RelativeDate
                dateString={post.published_at || post.created_at}
                className="text-[11px] text-neutral-400"
              />
            </div>

            <div
              className="
                ml-auto flex items-center gap-1.5
                rounded-full border border-neutral-200 bg-neutral-50
                px-4 py-1.5 text-[12px] font-semibold text-neutral-700
                transition-all duration-200
                group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white
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