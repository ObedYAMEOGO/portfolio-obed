import Link from "next/link";
import { TrendingUp, Cpu, Archive } from "lucide-react";

import type { Post, BlogCategory } from "@/types";
import { cn } from "@/lib/utils";

interface BlogSidebarProps {
  trendingPosts: Post[];
  allCategories: string[];
  activeCategory: BlogCategory | "All";
  onCategoryChange: (cat: BlogCategory | "All") => void;
  archiveYears: { year: number; count: number }[];
}

export default function BlogSidebar({
  trendingPosts,
  allCategories,
  activeCategory,
  onCategoryChange,
  archiveYears,
}: BlogSidebarProps) {
  return (
    <aside className="space-y-5">

      {/* ── Trending ────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-neutral-400" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
            Trending
          </span>
        </div>

        <div className="space-y-5">
          {trendingPosts.slice(0, 5).map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex gap-4"
            >
              <span className="text-2xl font-bold leading-none text-neutral-200">
                0{index + 1}
              </span>
              <div>
                <h3
                  className="
                    text-[13px]
                    font-medium
                    leading-snug
                    text-neutral-700
                    transition-colors
                    duration-150
                    group-hover:text-neutral-900
                  "
                >
                  {post.title}
                </h3>
                <p className="mt-1 text-[11px] text-neutral-400">
                  {post.category}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── AI Topics (interactive filter) ──────────────────────── */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-neutral-400" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
            AI Topics
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* All pill */}
          <button
            onClick={() => onCategoryChange("All")}
            className={cn(
              "rounded-full border px-3 py-1 text-[11px] font-medium transition-all duration-150",
              activeCategory === "All"
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900",
            )}
          >
            All
          </button>

          {allCategories.map((topic) => (
            <button
              key={topic}
              onClick={() => onCategoryChange(topic as BlogCategory)}
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] font-medium transition-all duration-150",
                activeCategory === topic
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900",
              )}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* ── Archive by year ──────────────────────────────────────── */}
      {archiveYears.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-2">
            <Archive className="h-4 w-4 text-neutral-400" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
              Archive
            </span>
          </div>

          <ul className="flex flex-col gap-1">
            {archiveYears.map(({ year, count }) => (
              <li key={year}>
                <Link
                  href={`/blog?year=${year}`}
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    px-2
                    py-2
                    text-sm
                    transition-colors
                    duration-150
                    hover:bg-neutral-50
                  "
                >
                  <span className="font-medium text-neutral-700">{year}</span>
                  <span className="text-[12px] text-neutral-400">
                    {count} {count === 1 ? "post" : "posts"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}