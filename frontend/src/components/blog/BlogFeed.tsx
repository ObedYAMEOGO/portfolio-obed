"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import type { Post, BlogCategory } from "@/types";
import {
  groupPostsByBucket,
  paginateArchive,
  extractCategories,
  getArchiveYears,
  ARCHIVE_PAGE_SIZE,
} from "@/types/blog-utils";
import { cn } from "@/lib/utils";

import FeaturedHero from "./FeaturedHero";
import PostCard from "./PostCard";
import ArchiveRow from "./ArchiveRow";
import BlogSidebar from "./BlogSideBar";

interface BlogFeedProps {
  posts: Post[];
  // ISO string captured on the server — passed down so that bucket
  // calculations are identical on server and client (no hydration mismatch).
  now: string;
}

export default function BlogFeed({ posts, now }: BlogFeedProps) {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "All">("All");
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [archivePage, setArchivePage] = useState(1);

  // Parse once; stable reference across renders since `now` never changes.
  const nowDate = useMemo(() => new Date(now), [now]);

  // Reset pagination whenever the filter changes
  const handleCategory = (cat: BlogCategory | "All") => {
    setActiveCategory(cat);
    setArchivePage(1);
  };

  const handleYear = (year: number | null) => {
    setActiveYear(year);
    setArchivePage(1);
  };

  // ── Derived data ────────────────────────────────────────────────────────────
  const allCategories = useMemo(() => extractCategories(posts), [posts]);
  const archiveYears  = useMemo(() => getArchiveYears(posts), [posts]);
  const trendingPosts = useMemo(() => posts.slice(0, 5), [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;

      const matchesYear = !activeYear || (() => {
        const date = new Date(p.published_at || p.created_at);
        return date.getUTCFullYear() === activeYear;
      })();

      return matchesCategory && matchesYear;
    });
  }, [posts, activeCategory, activeYear]);

  // nowDate is passed in so bucketing matches the server render exactly.
  const { hero, thisWeek, thisMonth, archive } = useMemo(
    () => groupPostsByBucket(filteredPosts, nowDate),
    [filteredPosts, nowDate],
  );

  const visibleArchive = paginateArchive(archive, archivePage);
  const hasMore = visibleArchive.length < archive.length;
  const remaining = archive.length - visibleArchive.length;

  const isEmpty =
    !hero && thisWeek.length === 0 && thisMonth.length === 0 && archive.length === 0;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

      {/* ══════════════════════════════════════════════════
          MOBILE — horizontal scrollable category pills
          Hidden on md+ (sidebar handles filtering there)
      ══════════════════════════════════════════════════ */}
      <div
        className="
          -mx-4
          mb-8
          flex
          gap-2
          overflow-x-auto
          px-4
          pb-1
          [&::-webkit-scrollbar]:hidden
          md:hidden
        "
      >
        <CategoryPill
          label="All"
          active={activeCategory === "All"}
          onClick={() => handleCategory("All")}
        />
        {allCategories.map((cat) => (
          <CategoryPill
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onClick={() => handleCategory(cat as BlogCategory)}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          MAIN LAYOUT — feed (left) + sidebar (right)
      ══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_272px]">

        {/* ── FEED ──────────────────────────────────────────────── */}
        <main className="min-w-0 space-y-12">

          {/* Empty state */}
          {isEmpty && (
            <div className="py-24 text-center">
              <p className="text-sm text-neutral-400">
                {activeYear
                  ? `No posts from ${activeYear}.`
                  : "No posts in this category yet."}
              </p>
            </div>
          )}

          {/* ── 1. Featured hero ── */}
          {hero && (
            <section>
              <SectionLabel label="Featured" />
              <FeaturedHero post={hero} />
            </section>
          )}

          {/* ── 2. This week — 2-col grid ── */}
          {thisWeek.length > 0 && (
            <section>
              <SectionLabel label="This week" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {thisWeek.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* ── 3. Earlier this month — 3-col grid ── */}
          {thisMonth.length > 0 && (
            <section>
              <SectionLabel label="Earlier this month" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {thisMonth.map((post) => (
                  <PostCard key={post.id} post={post} compact />
                ))}
              </div>
            </section>
          )}

          {/* ── 4. Archive — compact list ── */}
          {archive.length > 0 && (
            <section>
              <SectionLabel label="Archive" />

              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                {visibleArchive.map((post) => (
                  <ArchiveRow key={post.id} post={post} />
                ))}
              </div>

              {hasMore && (
                <button
                  onClick={() => setArchivePage((p) => p + 1)}
                  className="
                    mt-3
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
                    hover:text-neutral-800
                    active:scale-[0.99]
                  "
                >
                  <ChevronDown className="h-4 w-4" />
                  Load {Math.min(ARCHIVE_PAGE_SIZE, remaining)} more posts
                </button>
              )}
            </section>
          )}
        </main>

        {/* ── SIDEBAR (desktop only) ────────────────────────────── */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <BlogSidebar
              trendingPosts={trendingPosts}
              allCategories={allCategories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategory}
              archiveYears={archiveYears}
              activeYear={activeYear}
              onYearChange={handleYear}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Small reusable helpers ────────────────────────────────────────────────── */

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
        {label}
      </span>
      <div className="h-px flex-1 bg-neutral-200" />
    </div>
  );
}

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all duration-150",
        active
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400 hover:text-neutral-800",
      )}
    >
      {label}
    </button>
  );
}