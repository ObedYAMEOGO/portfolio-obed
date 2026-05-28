import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import type { Components } from "react-markdown";

import {
  ArrowLeft,
  Clock,
  CalendarDays,
} from "lucide-react";

import { Post } from "@/types";

import PrintButton from "@/components/blog/PrintButton";
import ShareButtons from "@/components/blog/ShareButtons";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://backend:8000/api/v1";

export const revalidate = 3600;

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
   CALCULATE READING TIME
========================================================= */

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/* =========================================================
   PAGE
========================================================= */

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content || "");

  const markdownComponents: Components = {
    h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mt-12 mb-6">{children}</h1>,
    h2: ({ children }) => {
      const id = children?.toString().toLowerCase().replace(/[^\w]+/g, "-") || "";
      return <h2 id={id} className="text-3xl font-semibold text-neutral-800 mt-12 mb-4 pb-2 border-b border-neutral-200">{children}</h2>;
    },
    h3: ({ children }) => {
      const id = children?.toString().toLowerCase().replace(/[^\w]+/g, "-") || "";
      return <h3 id={id} className="text-2xl font-semibold text-neutral-800 mt-8 mb-3">{children}</h3>;
    },
    h4: ({ children }) => <h4 className="text-xl font-semibold text-neutral-800 mt-6 mb-3">{children}</h4>,
    p: ({ children }) => <p className="text-[16px] leading-[1.8] text-neutral-700 mb-6">{children}</p>,

    pre: ({ children }) => (
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-[#0a0a0a] shadow-lg my-8">
        <div className="flex items-center gap-2 border-b border-neutral-800 bg-[#161616] px-5 py-3">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="ml-3 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-400">
            Code
          </span>
        </div>
        <pre className="m-0 overflow-x-auto p-6 text-[14px] leading-[1.8] text-neutral-100">
          {children}
        </pre>
      </div>
    ),

    code: ({ node, className, children, ...props }) => {
      const isInline = !className || (!className.includes('language-') && String(children).length < 100);

      if (isInline) {
        return (
          <code
            className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-[14px] text-rose-600"
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <code
          className={`font-mono text-[14px] text-neutral-100 ${className || ""}`}
          {...props}
        >
          {children}
        </code>
      );
    },

    img: ({ src, alt }) => {
      const imageSrc = src ? String(src) : "";
      return (
        <div className="relative my-10 -mx-8 md:-mx-16">
          <Image
            src={imageSrc}
            alt={alt || ""}
            width={1200}
            height={600}
            className="w-full h-auto shadow-md"
            unoptimized={!imageSrc.startsWith('/') && !imageSrc.startsWith('http')}
          />
          {alt && (
            <p className="text-center text-sm text-neutral-500 mt-3 italic px-8 md:px-16">
              {alt}
            </p>
          )}
        </div>
      );
    },

    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neutral-600 hover:text-neutral-900 underline decoration-neutral-300 hover:decoration-neutral-600 transition-colors"
      >
        {children}
      </a>
    ),

    ul: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-neutral-700">{children}</ol>,
    li: ({ children }) => <li className="text-[16px] leading-[1.8]">{children}</li>,

    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-neutral-300 pl-6 my-8 py-2 bg-neutral-50 rounded-r-xl italic text-neutral-600">
        {children}
      </blockquote>
    ),

    hr: () => <hr className="my-12 border-neutral-200" />,

    table: ({ children }) => (
      <div className="overflow-x-auto my-8">
        <table className="min-w-full border-collapse border border-neutral-200 rounded-lg">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => <th className="border border-neutral-200 bg-neutral-50 px-4 py-3 text-left font-semibold text-neutral-800">{children}</th>,
    td: ({ children }) => <td className="border border-neutral-200 px-4 py-3 text-neutral-700">{children}</td>,
  };

  return (
    <div className="min-h-screen bg-white">

      <main className="mx-auto max-w-4xl px-6 pb-32 pt-28">

        {/* =========================================================
            BACK BUTTON
        ========================================================= */}

        <div className="mb-12">
          <Link
            href="/blog"
            className="
              inline-flex
              items-center
              gap-2
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-neutral-400
              transition-all
              duration-300
              hover:text-neutral-600
              hover:gap-3
              group
            "
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Blog
          </Link>
        </div>

        {/* =========================================================
            HERO SECTION
        ========================================================= */}

        <section className="mb-12">
          {/* META ROW */}
          <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            {post.category && (
              <span
                className="
                  rounded-full
                  bg-neutral-100
                  px-3
                  py-1
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-neutral-700
                  border
                  border-neutral-200
                "
              >
                {post.category}
              </span>
            )}

            <span className="text-neutral-300">·</span>

            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <CalendarDays className="h-3.5 w-3.5" />
              <time>
                {post.created_at
                  ? new Date(post.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </time>
            </div>

            <span className="text-neutral-300">·</span>

            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <Clock className="h-3.5 w-3.5" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* TITLE */}
          <h1
            className="
              text-4xl
              font-bold
              leading-[1.2]
              tracking-[-0.02em]
              text-neutral-900
              md:text-5xl
              lg:text-6xl
            "
          >
            {post.title}
          </h1>

          {/* SUMMARY */}
          {post.summary && (
            <p
              className="
                mt-6
                border-l-4
                border-neutral-300
                pl-5
                text-[17px]
                leading-relaxed
                text-neutral-600
              "
            >
              {post.summary}
            </p>
          )}
        </section>

        {/* =========================================================
            FEATURE IMAGE
        ========================================================= */}

        {post.feature_image_url && (
          <div className="mb-16 -mx-6">
            <div className="relative w-full">
              <div className="relative aspect-video">
                <Image
                  src={post.feature_image_url}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            ARTICLE CONTENT
        ========================================================= */}

         <article className="prose prose-lg max-w-none">
          <ReactMarkdown components={markdownComponents}>
            {post.content}
          </ReactMarkdown>
        </article>
        {/* =========================================================
            FOOTER - Author & Actions
        ========================================================= */}

        <div className="mt-20 space-y-8">

          {/* Divider */}
          <div className="border-t border-neutral-200" />

          {/* Author Section */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Written by
              </p>

              <div className="flex items-center gap-4">
                {/* Profile Image */}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
                  <Image
                    src="/profile-obed.png"
                    alt="Obed Yameogo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    Obed Yameogo
                  </h3>
                  <p className="text-sm text-neutral-500">
                    PhD Scholar in AI · ML Engineer
                  </p>
                </div>
              </div>

              <p className="max-w-2xl text-[14px] leading-relaxed text-neutral-600">
                Building scalable intelligent systems, machine learning infrastructure,
                and production AI architectures. Passionate about bridging research and engineering.
              </p>
            </div>

            <div className="flex gap-3">
              <PrintButton />
            </div>
          </div>

          {/* Social Share Section */}
          <div className="border-t border-neutral-200 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Share this article
              </p>

              <ShareButtons />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}