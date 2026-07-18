import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";

import type { Components } from "react-markdown";

import { ArrowLeft, Clock, CalendarDays } from "lucide-react";

import type { Post } from "@/types";

import PrintButton from "@/components/blog/PrintButton";
import ShareButtons from "@/components/blog/ShareButtons";
import CommentsSection from "@/components/blog/CommentsSection";
import PostReactions from "@/components/blog/PostReactions";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

const API_URL = process.env.INTERNAL_API_URL;

if (!API_URL) {
  throw new Error("INTERNAL_API_URL is missing");
}

export const revalidate = false;

/* =========================================================
   STATIC PARAMS
========================================================= */

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/posts`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const posts: Post[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.items)
        ? data.items
        : [];

    return posts.filter((p) => p.is_published).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

/* =========================================================
   FETCH POST
========================================================= */

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_URL}/posts/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}

/* =========================================================
   READING TIME
========================================================= */

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "Date not available";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Date not available";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* =========================================================
   PAGE
========================================================= */

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const readingTime =
    post.reading_time || calculateReadingTime(post.content || "");

  const markdownComponents: Components = {
    h1: ({ children }) => (
      <h1 className="mt-10 mb-4 text-3xl font-bold text-neutral-900">
        {children}
      </h1>
    ),

    h2: ({ children }) => {
      const id =
        children
          ?.toString()
          .toLowerCase()
          .replace(/[^\w]+/g, "-") || "";
      return (
        <h2
          id={id}
          className="mt-10 mb-3 text-2xl font-semibold text-neutral-800"
        >
          {children}
        </h2>
      );
    },

    h3: ({ children }) => (
      <h3 className="mt-8 mb-2 text-xl font-semibold text-neutral-800">
        {children}
      </h3>
    ),

    h4: ({ children }) => (
      <h4 className="mt-6 mb-2 text-lg font-semibold text-neutral-800">
        {children}
      </h4>
    ),

    p: ({ children }) => (
      <p className="mb-5 text-base leading-relaxed text-neutral-700">
        {children}
      </p>
    ),

    a: ({ href, children }) => {
      // Handle missing or invalid href
      if (!href) {
        return <span className="text-neutral-900">{children}</span>;
      }

      // Check link type
      const isInternal = href.startsWith("/") && !href.startsWith("//");
      const isAnchor = href.startsWith("#");
      const isEmail = href.startsWith("mailto:");
      const isPhone = href.startsWith("tel:");

      const linkClass = "text-blue-600 underline hover:text-blue-800 transition-colors cursor-pointer";

      // Email or phone link
      if (isEmail || isPhone) {
        return (
          <a href={href} className={linkClass}>
            {children}
          </a>
        );
      }

      // Anchor link (table of contents, internal sections)
      if (isAnchor) {
        return (
          <a href={href} className={linkClass}>
            {children}
          </a>
        );
      }

      // Internal link using Next.js Link (don't open in new tab)
      if (isInternal) {
        return (
          <Link href={href} className={linkClass}>
            {children}
          </Link>
        );
      }

      // External link (open in new tab)
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {children}
        </a>
      );
    },

    ul: ({ children }) => (
      <ul className="mb-5 list-disc pl-6 text-neutral-700">{children}</ul>
    ),

    ol: ({ children }) => (
      <ol className="mb-5 list-decimal pl-6 text-neutral-700">{children}</ol>
    ),

    li: ({ children }) => (
      <li className="mb-1.5 text-base leading-relaxed">{children}</li>
    ),

    blockquote: ({ children }) => (
      <blockquote className="mb-5 border-l-4 border-neutral-300 pl-5 italic text-neutral-600">
        {children}
      </blockquote>
    ),

    code: ({ children, className }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm font-mono text-neutral-800">
            {children}
          </code>
        );
      }
      return (
        <code className="block overflow-x-auto rounded-lg bg-neutral-900 p-4 text-sm font-mono text-neutral-100">
          {children}
        </code>
      );
    },

    pre: ({ children }) => (
      <pre className="mb-5 overflow-x-auto rounded-lg bg-neutral-900 p-4">
        {children}
      </pre>
    ),

    img: ({ src, alt }) => {
      const imageSrc = typeof src === "string" ? src : "";
      if (!imageSrc) return null;

      return (
        <div className="relative my-6 aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={imageSrc}
            alt={alt || ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1024px"
          />
        </div>
      );
    },

    // Add GFM-specific components if needed
    table: ({ children }) => (
      <div className="mb-5 overflow-x-auto">
        <table className="min-w-full border-collapse border border-neutral-200 text-sm">
          {children}
        </table>
      </div>
    ),

    th: ({ children }) => (
      <th className="border border-neutral-200 bg-neutral-50 px-4 py-2 text-left font-semibold">
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td className="border border-neutral-200 px-4 py-2">
        {children}
      </td>
    ),

    input: ({ type, checked }) => {
      if (type === "checkbox") {
        return (
          <input
            type="checkbox"
            checked={checked}
            disabled
            className="mr-2 h-4 w-4 accent-blue-600"
          />
        );
      }
      return null;
    },

    del: ({ children }) => (
      <del className="text-neutral-500">{children}</del>
    ),
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-4xl px-6 pb-32 pt-28">
        {/* BACK */}
        <div className="mb-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 hover:text-neutral-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Blog
          </Link>
        </div>

        {/* META */}
        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          {post.category && (
            <span className="rounded-full border bg-neutral-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700">
              {post.category}
            </span>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
            <CalendarDays className="h-3.5 w-3.5" />
            <time dateTime={post.published_at || post.created_at || ""}>
              {formatDate(post.published_at || post.created_at)}
            </time>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
            <Clock className="h-3.5 w-3.5" />
            <span>{readingTime} min read</span>
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold leading-tight text-neutral-900 md:text-5xl">
          {post.title}
        </h1>

        {/* SUMMARY */}
        {post.summary && (
          <p className="mt-6 border-l-4 border-neutral-300 pl-5 text-[17px] leading-relaxed text-neutral-600">
            {post.summary}
          </p>
        )}

        {/* COVER IMAGE */}
        {post.cover_image_url && (
          <div className="mt-12 mb-16">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 1024px"
              />
            </div>
          </div>
        )}

        {/* CONTENT */}
        <article className="max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        <PostReactions slug={post.slug} />

        {/* AUTHOR & SHARE */}
        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t pt-10 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 font-bold text-white">
              {post.author_initials || "OY"}
            </div>
            <div>
              <h3 className="font-semibold">
                {post.author_name || "Obed Yameogo"}
              </h3>
              <p className="text-sm text-neutral-500">
                Production ML Engineer
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <PrintButton />
            <ShareButtons />
          </div>
        </div>

        {/* TAGS */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <CommentsSection slug={post.slug} />
      </main>
    </div>
  );
}