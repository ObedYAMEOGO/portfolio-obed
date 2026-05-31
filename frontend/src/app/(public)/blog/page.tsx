import type { Metadata } from "next";

import BlogFeed from "@/components/blog/BlogFeed";
import type { Post } from "@/types";

export const revalidate = 3600;

const API_URL = process.env.INTERNAL_API_URL;

if (!API_URL) {
  throw new Error("INTERNAL_API_URL is missing");
}
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
export default async function BlogPage() {
  const rawPosts = await getPosts();

  // Only published posts, newest first with stable tiebreaker.
  const posts = rawPosts
    .filter((p) => p.is_published)
    .sort((a, b) => {
      const da = new Date(a.published_at || a.created_at).getTime();
      const db = new Date(b.published_at || b.created_at).getTime();
      if (db !== da) return db - da;
      return b.id - a.id;
    });

  // Stable ISO string passed down so server and client bucket posts identically.
  const now = new Date().toISOString();

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* ── Page header ── */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Writing
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Blog
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-neutral-500">
            Thoughts on AI engineering, ML systems, inference, LLMs, and modern
            AI infrastructure.
          </p>
        </div>
      </div>

      {/* ── Feed (handles filtering, empty state, year grouping internally) ── */}
      <BlogFeed posts={posts} now={now} />
    </div>
  );
}