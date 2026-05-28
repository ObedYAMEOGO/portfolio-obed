// app/blog/page.tsx
// Server component — data is fetched here, then passed to the client BlogFeed.
// Replace MOCK_POSTS with your real CMS/MDX fetch below.

import type { Metadata } from "next";

import { MOCK_POSTS } from "@/lib/blog-utils";
import BlogFeed from "@/components/blog/BlogFeed";

// ── ISR: rebuild the page at most once per hour ──────────────────────────────
// Remove or adjust this when using a real CMS with webhooks.
export const revalidate = 3600;

// ── SEO ──────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Blog — Obed Yameogo",
  description:
    "Thoughts on engineering, design, and building products that matter.",
  openGraph: {
    title: "Blog — Obed Yameogo",
    description:
      "Thoughts on engineering, design, and building products that matter.",
  },
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPage() {
  // ── 1. Fetch posts ──────────────────────────────────────────────────────
  // When you're ready to use a real data source, replace the line below
  // with your CMS client.  Examples:
  //
  //   Sanity:        const posts = await client.fetch(groq`*[_type=="post"]`)
  //   Contentlayer:  import { allPosts } from "contentlayer/generated"
  //   MDX folder:    const posts = await getMdxPosts()   // your helper
  //
  const posts = MOCK_POSTS;

  // ── 2. Sort by date descending (newest first) ───────────────────────────
  const sorted = [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  // ── 3. Render ───────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-neutral-50">

      {/* ── Page header ── */}
      <div
        className="
          border-b
          border-neutral-200
          bg-white
          px-4
          py-12
          sm:px-6
          lg:px-8
        "
      >
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Writing
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Blog
          </h1>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-neutral-500">
            Thoughts on engineering, design, and building products that matter.
          </p>
        </div>
      </div>

      {/* ── Feed ── */}
      <BlogFeed posts={sorted} />
    </main>
  );
}