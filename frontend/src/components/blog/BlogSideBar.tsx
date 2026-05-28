import Link from "next/link";
import { TrendingUp, Tag, Archive } from "lucide-react";

import type { BlogPost, BlogCategory } from "@/types/blog";
import { cn } from "@/lib/utils";

interface BlogSidebarProps {
  trendingPosts: BlogPost[];
  categories: BlogCategory[];
  archiveYears: { year: number; count: number }[];
}

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

export default function BlogSidebar({
  trendingPosts,
  categories,
  archiveYears,
}: BlogSidebarProps) {
  return (
    <aside className="flex flex-col gap-5">

      {/* ── Trending this month ── */}
      <div
        className="
          rounded-2xl
          border
          border-neutral-200
          bg-white
          p-5
        "
      >
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-neutral-400" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Trending this month
          </span>
        </div>

        <ol className="flex flex-col gap-3">
          {trendingPosts.slice(0, 3).map((post, index) => (
            <li key={post.slug} className="flex items-start gap-3">
              <span className="mt-0.5 text-xl font-bold leading-none text-neutral-200 tabular-nums">
                {index + 1}
              </span>
              <Link
                href={`/blog/${post.slug}`}
                className="text-[13px] font-medium leading-snug text-neutral-700 transition-colors duration-150 hover:text-neutral-900"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {/* ── Browse by topic ── */}
      <div
        className="
          rounded-2xl
          border
          border-neutral-200
          bg-white
          p-5
        "
      >
        <div className="mb-4 flex items-center gap-2">
          <Tag className="h-4 w-4 text-neutral-400" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Browse by topic
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/blog?category=${cat}`}
              className={cn(
                "rounded-full border border-neutral-200 px-3 py-1 text-[11px] font-medium text-neutral-600 transition-all duration-150 hover:border-neutral-400 hover:text-neutral-900",
                categories.includes(cat) && "border-neutral-900 bg-neutral-900 text-white hover:border-neutral-900 hover:text-white",
              )}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Archive by year ── */}
      <div
        className="
          rounded-2xl
          border
          border-neutral-200
          bg-white
          p-5
        "
      >
        <div className="mb-4 flex items-center gap-2">
          <Archive className="h-4 w-4 text-neutral-400" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Archive
          </span>
        </div>

        <ul className="flex flex-col gap-2">
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
                  py-1.5
                  text-sm
                  transition-colors
                  duration-150
                  hover:bg-neutral-50
                "
              >
                <span className="font-medium text-neutral-700">{year}</span>
                <span className="text-[12px] text-neutral-400">{count} posts</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}