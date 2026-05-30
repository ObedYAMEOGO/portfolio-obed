import type { Metadata } from "next";

import BlogFeed from "@/components/blog/BlogFeed";
import type { Post } from "@/types";

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

const API_URL =
  process.env.INTERNAL_API_URL || "http://backend:8000/api/v1";

/* ── SEO ────────────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Blog — Obed Yameogo",
  description:
    "Thoughts on AI engineering, ML systems, inference, LLMs, and modern AI infrastructure.",
  openGraph: {
    title: "Blog — Obed Yameogo",
    description:
      "Thoughts on AI engineering, ML systems, inference, LLMs, and modern AI infrastructure.",
  },
};

/* ── Data fetching ──────────────────────────────────────────────────────────── */
async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${API_URL}/posts`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  } catch (err) {
    console.error("Error fetching posts:", err);
    return [];
  }
}

/* ── Page ───────────────────────────────────────────────────────────────────── */
interface BlogPageProps {
  searchParams: Promise<{ year?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { year } = await searchParams;
  const yearFilter = year ? parseInt(year, 10) : null;

  const rawPosts = await getPosts();

  // Capture now on the server as a stable ISO string.
  // Passing it as a prop ensures server and client bucket posts identically,
  // preventing hydration mismatches from new Date() drift between renders.
  const now = new Date().toISOString();

  const posts = rawPosts
    .filter((p) => {
      if (!p.is_published) return false;
      // Apply year filter server-side so server and client see the same array.
      if (yearFilter) {
        const date = new Date(p.published_at || p.created_at);
        return date.getUTCFullYear() === yearFilter;
      }
      return true;
    })
    .sort((a, b) => {
      const da = new Date(a.published_at || a.created_at).getTime();
      const db = new Date(b.published_at || b.created_at).getTime();
      // Primary: newest first.
      // Secondary: higher id first — stable tiebreaker for posts with
      // identical timestamps, ensuring server and client produce the
      // same order regardless of JS engine sort stability.
      if (db !== da) return db - da;
      return b.id - a.id;
    });

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* ── Page header ── */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Writing
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {yearFilter ? `Posts from ${yearFilter}` : "Blog"}
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-neutral-500">
            Thoughts on AI engineering, ML systems, inference, LLMs, and modern
            AI infrastructure.
          </p>
        </div>
      </div>

      {/* ── Feed (handles empty state internally) ── */}
      <BlogFeed posts={posts} now={now} />
    </div>
  );
}