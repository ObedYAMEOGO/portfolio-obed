"use client";

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";

import type { BlogPost, BlogCategory } from "@/types/blog";
import { groupPostsByBucket, paginateArchive, ARCHIVE_PAGE_SIZE } from "@/lib/blog-utils";
import FeaturedHero from "@/components/blog/FeaturedHero";
import PostCard from "@/components/blog/PostCard";
import ArchiveRow from "@/components/blog/ArchiveRow";
import BlogSidebar from "@/components/blog/BlogSideBar";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES: BlogCategory[] = [
  "Engineering",
  "Next.js",
  "Design",
  "Career",
  "Database",
  "DevOps",
  "CSS",
  "React",
  "Auth",
];

interface BlogFeedProps {
  posts: BlogPost[];
}

export default function BlogFeed({ posts }: BlogFeedProps) {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | null>(null);
  const [archivePage, setArchivePage] = useState(1);

  // ── Filter posts by active category ─────────────────────────────────────
  const filteredPosts = useMemo(
    () =>
      activeCategory
        ? posts.filter((p) => p.category === activeCategory)
        : posts,
    [posts, activeCategory],
  );

  const { featured, thisWeek, thisMonth, archive } =
    groupPostsByBucket(filteredPosts);

  const visibleArchive = paginateArchive(archive, archivePage);
  const hasMore = visibleArchive.length < archive.length;

  // ── Sidebar data ─────────────────────────────────────────────────────────
  // Trending = top 3 posts by position (replace with view-count sort in production)
  const trendingPosts = posts.slice(0, 3);
  const archiveYears = [
    { year: 2024, count: 31 },
    { year: 2023, count: 24 },
    { year: 2022, count: 18 },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

      {/* ══════════════════════════════════════════
          MOBILE — sticky category pill strip
          (hidden on md+ screens)
      ══════════════════════════════════════════ */}
      <div
        className="
          -mx-4
          mb-6
          flex
          gap-2
          overflow-x-auto
          px-4
          pb-1
          scrollbar-none
          md:hidden
          [&::-webkit-scrollbar]:hidden
        "
      >
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all duration-150",
            activeCategory === null
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-neutral-200 bg-white text-neutral-500",
          )}
        >
          All
        </button>

        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all duration-150",
              activeCategory === cat
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-white text-neutral-500",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          MAIN GRID — feed (left) + sidebar (right, desktop only)
      ══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_260px] lg:grid-cols-[1fr_280px]">

        {/* ── LEFT: Feed ───────────────────────────────────────────── */}
        <main className="min-w-0 space-y-10">

          {/* ── Featured hero ── */}
          {featured && (
            <section>
              <SectionLabel label="Featured today" />
              <FeaturedHero post={featured} />
            </section>
          )}

          {/* ── This week ── */}
          {thisWeek.length > 0 && (
            <section>
              <SectionLabel label="This week" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {thisWeek.map((post) => (
                  <PostCard key={post.slug} post={post} size="md" />
                ))}
              </div>
            </section>
          )}

          {/* ── Earlier this month ── */}
          {thisMonth.length > 0 && (
            <section>
              <SectionLabel label="Earlier this month" />
              {/* Desktop: 3-col grid | Mobile: single col list */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {thisMonth.map((post) => (
                  <PostCard key={post.slug} post={post} size="sm" />
                ))}
              </div>
            </section>
          )}

          {/* ── Archive ── */}
          {archive.length > 0 && (
            <section>
              <SectionLabel label="Archive" />
              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-neutral-200
                  bg-white
                "
              >
                {visibleArchive.map((post) => (
                  <ArchiveRow key={post.slug} post={post} />
                ))}
              </div>

              {/* ── Load more ── */}
              {hasMore && (
                <button
                  onClick={() => setArchivePage((p) => p + 1)}
                  className="
                    mt-4
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    border
                    border-neutral-200
                    bg-white
                    py-3
                    text-[13px]
                    font-medium
                    text-neutral-500
                    transition-all
                    duration-200
                    hover:border-neutral-300
                    hover:bg-neutral-50
                    hover:text-neutral-700
                    active:scale-[0.99]
                  "
                >
                  <ChevronDown className="h-4 w-4" />
                  Load {Math.min(ARCHIVE_PAGE_SIZE, archive.length - visibleArchive.length)} more posts
                </button>
              )}
            </section>
          )}

          {/* Empty state */}
          {!featured && thisWeek.length === 0 && thisMonth.length === 0 && archive.length === 0 && (
            <div className="py-20 text-center text-neutral-400">
              <p className="text-sm">No posts in this category yet.</p>
            </div>
          )}
        </main>

        {/* ── RIGHT: Sidebar (desktop only) ────────────────────────── */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <BlogSidebar
              trendingPosts={trendingPosts}
              categories={activeCategory ? [activeCategory] : []}
              archiveYears={archiveYears}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Small helper ──────────────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
        {label}
      </span>
      <div className="h-px flex-1 bg-neutral-200" />
    </div>
  );
}