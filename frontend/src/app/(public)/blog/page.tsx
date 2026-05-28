/* eslint-disable react/jsx-no-comment-textnodes */

import Link from "next/link";
import Image from "next/image";

import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Post } from "@/types";

import { calculateReadingTime } from "@/lib/utils";

export const revalidate = 3600;

/* =========================================================
   CONFIG
========================================================= */

const API_URL =
  process.env.INTERNAL_API_URL ||
  "http://backend:8000/api/v1";

const POSTS_PER_PAGE = 6;

/* =========================================================
   FETCH POSTS
========================================================= */

async function getPosts(): Promise<Post[]> {
  const res = await fetch(
    `${API_URL}/posts`,
    {
      next: {
        revalidate: 3600,
      },
    },
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch posts",
    );
  }

  return res.json();
}

/* =========================================================
   PAGE
========================================================= */

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
  }>;
}) {
  const params =
    await searchParams;

  const currentPage = Number(
    params?.page || "1",
  );

  let posts: Post[] = [];

  try {
    posts = await getPosts();

    console.log(
      "POSTS:",
      posts,
    );
  } catch (err) {
    console.error(
      "Failed to fetch posts:",
      err,
    );
  }

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages =
    Math.ceil(
      posts.length /
        POSTS_PER_PAGE,
    ) || 1;

  const safePage = Math.min(
    Math.max(currentPage, 1),
    totalPages,
  );

  const startIndex =
    (safePage - 1) *
    POSTS_PER_PAGE;

  const paginatedPosts =
    posts.slice(
      startIndex,
      startIndex +
        POSTS_PER_PAGE,
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f5f5f5] via-[#e8e8e8] to-[#dcdcdc]">
      
      {/* Subtle Background Texture - very light */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        <div className="absolute top-0 -left-1/4 w-1/2 h-96 bg-linear-to-r from-gray-200/40 to-gray-300/40 blur-3xl rounded-full" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-96 bg-linear-to-l from-gray-200/40 to-gray-300/40 blur-3xl rounded-full" />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-32 pt-36">

        {/* =========================================================
            HEADER - Updated with elegant grey tones
        ========================================================= */}

        <header className="mb-24">

          <div className="space-y-6 text-center md:text-left">

            <span className="inline-block font-mono text-[10px] uppercase tracking-[0.35em] text-gray-600 bg-gray-200/60 px-3 py-1 rounded-full backdrop-blur-sm">
              Writing
            </span>

            <h1 className="text-4xl font-bold tracking-[-0.02em] bg-linear-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent md:text-6xl">
              Blog
            </h1>

            <p className="max-w-2xl text-[17px] leading-relaxed text-gray-600 mx-auto md:mx-0">
              Thoughts on machine learning systems,
              production AI,
              distributed infrastructure,
              and technical architecture.
            </p>

          </div>

        </header>

        {/* =========================================================
            POSTS GRID - Card design with light theme
        ========================================================= */}

        {paginatedPosts.length >
        0 ? (
          <>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:gap-x-10 lg:gap-y-16">

              {paginatedPosts.map(
                (
                  post,
                  index,
                ) => {
                  const readingTime =
                    calculateReadingTime(
                      post.content ||
                        "",
                    );

                  return (
                    <article
                      key={post.id}
                      className="group relative flex flex-col transform transition-all duration-500 hover:-translate-y-1"
                      style={{
                        animationDelay: `${index * 80}ms`,
                      }}
                    >

                      <Link
                        href={`/blog/${post.slug}`}
                        prefetch
                        className="flex flex-col"
                      >

                        {/* =========================================================
                            IMAGE CONTAINER WITH OVERLAY CONTENT (Light theme overlay)
                        ========================================================= */}

                        <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-linear-to-br from-gray-100 to-gray-200 shadow-md transition-shadow duration-500 group-hover:shadow-xl">

                          <Image
                            src={
                              post.feature_image_url ||
                              "/blog-placeholder.jpg"
                            }
                            alt={
                              post.title
                            }
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="
                              object-cover
                              transition-all
                              duration-700
                              ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                              group-hover:scale-[1.08]
                            "
                          />

                          {/* Light, subtle overlay for text readability */}
                          <div className="
                            absolute 
                            inset-0 
                            bg-linear-to-t 
                            from-gray-900/70 
                            via-gray-900/40 
                            to-gray-900/20
                            transition-all
                            duration-500
                            group-hover:from-gray-900/60
                            group-hover:via-gray-900/30
                            group-hover:to-gray-900/10
                          " />

                          {/* =========================================================
                              CONTENT OVERLAYED ON IMAGE
                          ========================================================= */}

                          <div className="
                            absolute
                            inset-0
                            flex
                            flex-col
                            justify-between
                            p-5
                            md:p-6
                            lg:p-7
                          ">
                            
                            {/* TOP ROW: Category + Reading Time */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {post.category && (
                                  <span className="
                                    text-[9px]
                                    md:text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-white
                                    bg-black/40
                                    backdrop-blur-md
                                    px-2.5
                                    py-1
                                    rounded-full
                                    border
                                    border-white/20
                                    transition-all
                                    duration-300
                                    group-hover:bg-black/60
                                    group-hover:border-white/30
                                    group-hover:scale-105
                                  ">
                                    {post.category}
                                  </span>
                                )}
                              </div>

                              <span className="
                                text-[9px]
                                md:text-[10px]
                                font-medium
                                text-white/80
                                bg-black/40
                                backdrop-blur-md
                                px-2.5
                                py-1
                                rounded-full
                                border
                                border-white/20
                              ">
                                {readingTime}
                              </span>
                            </div>

                            {/* BOTTOM CONTENT: Title, Summary, Date */}
                            <div className="
                              space-y-2
                              transform
                              translate-y-2
                              transition-all
                              duration-500
                              ease-out
                              group-hover:translate-y-0
                            ">
                              
                              {/* TITLE with animated underline - light theme colors */}
                              <div className="relative inline-block">
                                <h2
                                  className="
                                    text-[16px]
                                    sm:text-[18px]
                                    md:text-[20px]
                                    lg:text-[22px]
                                    font-bold
                                    leading-tight
                                    tracking-[-0.02em]
                                    text-white
                                    drop-shadow-lg
                                    transition-all
                                    duration-300
                                    line-clamp-2
                                  "
                                >
                                  {post.title}
                                </h2>
                                <div className="
                                  absolute
                                  -bottom-1
                                  left-0
                                  w-0
                                  h-0.5
                                  bg-linear-to-r
                                  from-gray-600
                                  to-gray-800
                                  transition-all
                                  duration-500
                                  group-hover:w-full
                                " />
                              </div>

                              {/* SUMMARY */}
                              {post.summary && (
                                <p className="
                                  text-[11px]
                                  sm:text-[12px]
                                  md:text-[13px]
                                  leading-relaxed
                                  text-white/90
                                  drop-shadow-md
                                  line-clamp-2
                                ">
                                  {post.summary}
                                </p>
                              )}

                              {/* DATE */}
                              <div className="flex items-center gap-2 pt-1">
                                <time className="
                                  text-[9px]
                                  md:text-[10px]
                                  font-medium
                                  text-white/70
                                ">
                                  {post.created_at
                                    ? new Date(
                                        post.created_at,
                                      ).toLocaleDateString(
                                        "en-US",
                                        {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        },
                                      )
                                    : "—"}
                                </time>
                              </div>
                            </div>
                          </div>

                          {/* Read button - appears on hover */}
                          <div className="
                            absolute
                            bottom-3
                            right-3
                            flex
                            items-center
                            gap-1.5
                            rounded-full
                            bg-white
                            px-3
                            py-1.5
                            text-[10px]
                            font-semibold
                            tracking-wide
                            uppercase
                            text-black
                            opacity-0
                            shadow-lg
                            transition-all
                            duration-300
                            translate-y-1
                            group-hover:opacity-100
                            group-hover:translate-y-0
                            hover:scale-105
                            hover:gap-2
                            z-10
                          ">
                            Read
                            <ArrowUpRight className="h-3 w-3" />
                          </div>

                          {/* Animated border ring on hover */}
                          <div
                            className="
                              absolute
                              inset-0
                              rounded-xl
                              ring-2
                              ring-gray-400/0
                              transition-all
                              duration-500
                              group-hover:ring-gray-500/30
                              pointer-events-none
                            "
                          />

                          {/* Shine effect on hover */}
                          <div className="
                            absolute
                            inset-0
                            opacity-0
                            group-hover:opacity-100
                            transition-opacity
                            duration-700
                            pointer-events-none
                            overflow-hidden
                            rounded-xl
                          ">
                            <div className="
                              absolute
                              -inset-full
                              top-0
                              h-full
                              w-1/2
                              z-5
                              block
                              transform
                              -skew-x-12
                              bg-linear-to-r
                              from-transparent
                              via-white/15
                              to-transparent
                              group-hover:animate-shine
                            " />
                          </div>

                        </div>

                      </Link>

                      {/* Removed the separate content section - everything is now on the image */}
                      
                    </article>
                  );
                },
              )}

            </div>

            {/* =========================================================
                PAGINATION - Light theme styling
            ========================================================= */}

            {totalPages > 1 && (
              <nav className="mt-24 flex items-center justify-center gap-2">

                {/* PREVIOUS */}
                <Link
                  href={
                    safePage > 1
                      ? `/blog?page=${safePage - 1}`
                      : "#"
                  }
                  aria-disabled={
                    safePage === 1
                  }
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                    safePage === 1
                      ? "pointer-events-none text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>

                {/* PAGE NUMBERS */}
                <div className="flex items-center gap-1">
                  {Array.from({
                    length:
                      totalPages,
                  }).map(
                    (
                      _,
                      index,
                    ) => {
                      const page =
                        index + 1;

                      const active =
                        safePage ===
                        page;

                      return (
                        <Link
                          key={page}
                          href={`/blog?page=${page}`}
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
                            active
                              ? "bg-linear-to-r from-gray-700 to-gray-900 text-white shadow-md"
                              : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                          }`}
                        >
                          {page}
                        </Link>
                      );
                    },
                  )}
                </div>

                {/* NEXT */}
                <Link
                  href={
                    safePage <
                    totalPages
                      ? `/blog?page=${safePage + 1}`
                      : "#"
                  }
                  aria-disabled={
                    safePage ===
                    totalPages
                  }
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                    safePage ===
                    totalPages
                      ? "pointer-events-none text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>

              </nav>
            )}
          </>
        ) : (
          <div className="py-32 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200/60 backdrop-blur-sm mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No posts yet</p>
            <p className="text-xs text-gray-400 mt-1">Check back soon for new content</p>
          </div>
        )}

      </main>

    </div>
  );
}