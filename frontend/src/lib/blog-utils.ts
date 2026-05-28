import { differenceInCalendarDays, format, isToday, isYesterday } from "date-fns";
import type { BlogPost, TimeBucket } from "@/types/blog";

// ─── Time bucket helper ──────────────────────────────────────────────────────
// Assigns every post into one of four temporal display zones.
export function getTimeBucket(dateString: string): TimeBucket {
  const date = new Date(dateString);
  const diff = differenceInCalendarDays(new Date(), date);

  if (diff === 0) return "today";
  if (diff <= 7) return "this-week";
  if (diff <= 30) return "this-month";
  return "archive";
}

// ─── Human-readable date label ───────────────────────────────────────────────
export function formatPostDate(dateString: string): string {
  const date = new Date(dateString);
  const diff = differenceInCalendarDays(new Date(), date);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (diff <= 6) return `${diff} days ago`;
  if (diff <= 13) return "1 week ago";
  if (diff <= 20) return "2 weeks ago";
  return format(date, "MMM d");
}

// ─── Mock data ───────────────────────────────────────────────────────────────
// Replace this with your CMS fetch (Sanity, Contentlayer, MDX, etc.)
// The shape must match BlogPost interface from @/types/blog.

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

export const MOCK_POSTS: BlogPost[] = [
  {
    slug: "rebuild-api-10x-load",
    title: "How we rebuilt our API to handle 10× the load without a single downtime",
    excerpt:
      "A deep-dive into the architecture decisions that changed everything — and the mistakes we almost shipped.",
    category: "Engineering",
    author: { name: "Obed Yameogo", initials: "OY" },
    publishedAt: daysAgo(0),
    readingTime: 8,
    featured: true,
  },
  {
    slug: "server-components-clicking",
    title: "Server components are finally clicking for me — here's what helped",
    excerpt: "Three mental models that unlocked React Server Components for me after months of confusion.",
    category: "Next.js",
    author: { name: "Obed Yameogo", initials: "OY" },
    publishedAt: daysAgo(2),
    readingTime: 5,
  },
  {
    slug: "postgres-vs-typesense",
    title: "Postgres full-text search vs. Typesense: a real-world comparison",
    excerpt: "I ran both solutions under identical load. Here are the numbers and the tradeoffs.",
    category: "Database",
    author: { name: "Obed Yameogo", initials: "OY" },
    publishedAt: daysAgo(4),
    readingTime: 6,
  },
  {
    slug: "text-only-design",
    title: "Why I switched from Figma to a text-only design process",
    excerpt: "Fewer tools, faster decisions, better outcomes. Here's why it works.",
    category: "Design",
    author: { name: "Obed Yameogo", initials: "OY" },
    publishedAt: daysAgo(10),
    readingTime: 4,
  },
  {
    slug: "cold-email-strategy",
    title: "The cold email that landed me three client calls in one week",
    excerpt: "One template, one tweak, three calls. The exact message I used.",
    category: "Career",
    author: { name: "Obed Yameogo", initials: "OY" },
    publishedAt: daysAgo(12),
    readingTime: 3,
  },
  {
    slug: "debugging-race-condition",
    title: "Debugging a race condition I didn't know I had",
    excerpt: "A production bug that only surfaced at scale and how I tracked it down.",
    category: "Engineering",
    author: { name: "Obed Yameogo", initials: "OY" },
    publishedAt: daysAgo(15),
    readingTime: 7,
  },
  {
    slug: "railway-zero-downtime",
    title: "Zero-downtime deploys with Railway + GitHub Actions",
    excerpt: "My full CI/CD pipeline from commit to live in under 3 minutes.",
    category: "DevOps",
    author: { name: "Obed Yameogo", initials: "OY" },
    publishedAt: daysAgo(32),
    readingTime: 5,
  },
  {
    slug: "clerk-vs-nextauth",
    title: "Clerk vs NextAuth in 2024 — which one should you use?",
    excerpt: "A practical comparison based on building three real projects with each.",
    category: "Auth",
    author: { name: "Obed Yameogo", initials: "OY" },
    publishedAt: daysAgo(39),
    readingTime: 6,
  },
  {
    slug: "container-queries",
    title: "Container queries changed how I think about responsive design",
    excerpt: "Why I'm refactoring all my old breakpoint logic to use @container instead.",
    category: "CSS",
    author: { name: "Obed Yameogo", initials: "OY" },
    publishedAt: daysAgo(46),
    readingTime: 4,
  },
  {
    slug: "use-optimistic-hook",
    title: "useOptimistic: the hook that makes your UI feel instant",
    excerpt: "A practical walkthrough of React 19's useOptimistic with real mutation patterns.",
    category: "React",
    author: { name: "Obed Yameogo", initials: "OY" },
    publishedAt: daysAgo(53),
    readingTime: 3,
  },
];

// ─── Bucket grouping ─────────────────────────────────────────────────────────
export function groupPostsByBucket(posts: BlogPost[]) {
  const featured = posts.find((p) => p.featured) ?? null;

  const nonFeatured = posts.filter((p) => !p.featured);

  return {
    featured,
    thisWeek: nonFeatured
      .filter((p) => getTimeBucket(p.publishedAt) === "this-week")
      .slice(0, 2),
    thisMonth: nonFeatured
      .filter((p) => getTimeBucket(p.publishedAt) === "this-month")
      .slice(0, 3),
    archive: nonFeatured.filter(
      (p) => getTimeBucket(p.publishedAt) === "archive"
    ),
  };
}

// ─── Pagination helper ───────────────────────────────────────────────────────
export const ARCHIVE_PAGE_SIZE = 8;

export function paginateArchive(posts: BlogPost[], page: number): BlogPost[] {
  return posts.slice(0, page * ARCHIVE_PAGE_SIZE);
}