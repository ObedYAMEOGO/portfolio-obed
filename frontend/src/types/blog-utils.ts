import {
  differenceInCalendarDays,
  format,
  isToday,
  isYesterday,
} from "date-fns";

import type { Post } from "@/types";

/* =========================================================
   READING TIME
========================================================= */

export function calculateReadingTime(content: string): number {
  if (!content) return 1;

  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/* =========================================================
   SUMMARY
========================================================= */

export function getPostSummary(post: Post): string {
  return post.summary ?? "No summary available.";
}

/* =========================================================
   CANONICAL DATE
   Always prefer published_at; fall back to created_at.
========================================================= */

export function postDate(post: Post): string {
  return post.published_at || post.created_at;
}

/* =========================================================
   FORMAT DATE — STABLE (SSR-safe)
   Returns "MMM d, yyyy" (e.g. "Jan 5, 2025").
   Never calls new Date() for comparison so it produces the
   same string on the server and the client — no hydration mismatch.
   Use this as the initial/fallback value anywhere you render a date.
========================================================= */

export function formatPostDate(date?: string | null): string {
  if (!date) return "—";

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return "—";

  return format(parsed, "MMM d, yyyy");
}

/* =========================================================
   FORMAT RELATIVE DATE — CLIENT-ONLY
   Returns human-readable labels: "Today", "Yesterday",
   "3 days ago", "1 week ago", "2 weeks ago", or falls back
   to the stable absolute format for older posts.

   ⚠️  Never call this during SSR — it depends on new Date()
   which differs between server and client and will cause a
   hydration mismatch. Use the <RelativeDate> component instead,
   which safely defers this call to a useEffect.
========================================================= */

export function formatRelativeDate(date?: string | null): string {
  if (!date) return "—";

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return "—";

  const diff = differenceInCalendarDays(new Date(), parsed);

  if (isToday(parsed))     return "Today";
  if (isYesterday(parsed)) return "Yesterday";
  if (diff <= 6)           return `${diff} days ago`;
  if (diff <= 13)          return "1 week ago";
  if (diff <= 20)          return "2 weeks ago";

  return format(parsed, "MMM d, yyyy");
}

/* =========================================================
   TIME BUCKETS
   `now` must be passed in — never call new Date() internally.

   Uses UTC-normalised arithmetic instead of date-fns
   differenceInCalendarDays, which resolves dates in the LOCAL
   timezone. Node (Docker) runs UTC; the browser runs the user's
   local tz (e.g. IST = UTC+5:30). A post at 2026-05-23T20:00Z
   is "May 23" in UTC but "May 24" in IST — a 1-day shift that
   flips the bucket. By truncating both sides to UTC midnight
   before diffing we get the same integer on every machine.
========================================================= */

export type TimeBucket = "today" | "this-week" | "this-month" | "archive";

export function getTimeBucket(dateString: string, now: Date): TimeBucket {
  // Truncate both timestamps to UTC midnight so the diff is
  // timezone-independent — identical on server (Node/UTC) and
  // browser (any local tz).
  const nowUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );

  const post = new Date(dateString);
  const postUTC = Date.UTC(
    post.getUTCFullYear(),
    post.getUTCMonth(),
    post.getUTCDate(),
  );

  const diff = Math.round((nowUTC - postUTC) / 86_400_000);

  if (diff === 0) return "today";
  if (diff <= 7)  return "this-week";
  if (diff <= 30) return "this-month";
  return "archive";
}

/* =========================================================
   BUCKET GROUPING
   `now` must be passed in from the server component as a stable
   snapshot so bucketing is identical on server and client.
========================================================= */

export function groupPostsByBucket(posts: Post[], now: Date) {
  const hero = posts.find((p) => p.featured) ?? posts[0] ?? null;
  const rest = hero ? posts.filter((p) => p.id !== hero.id) : posts;

  return {
    hero,
    thisWeek: rest
      .filter((p) => getTimeBucket(postDate(p), now) === "this-week")
      .slice(0, 2),
    thisMonth: rest
      .filter((p) => getTimeBucket(postDate(p), now) === "this-month")
      .slice(0, 3),
    archive: rest.filter(
      (p) => getTimeBucket(postDate(p), now) === "archive",
    ),
  };
}

/* =========================================================
   PAGINATION
========================================================= */

export const ARCHIVE_PAGE_SIZE = 8;

export function paginateArchive(posts: Post[], page: number): Post[] {
  return posts.slice(0, page * ARCHIVE_PAGE_SIZE);
}

/* =========================================================
   DERIVED HELPERS
   getArchiveYears is safe — it only calls new Date() on post
   dates (stable strings), never on the current time.
========================================================= */

export function extractCategories(posts: Post[]): string[] {
  return Array.from(new Set(posts.map((p) => p.category))).sort();
}

export function getArchiveYears(
  posts: Post[],
): { year: number; count: number }[] {
  const map = new Map<number, number>();

  for (const p of posts) {
    const year = new Date(postDate(p)).getFullYear();
    map.set(year, (map.get(year) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year - a.year);
}