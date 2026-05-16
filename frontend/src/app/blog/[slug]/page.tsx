"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

import { blogApi } from "@/lib/api";
import { Post } from "@/types";
import { ArrowLeft, Clock, Terminal, Share2 } from "lucide-react";

export default function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await blogApi.getBySlug(slug);

        setPost(res.data);

        if (res.data?.content) {
          const lines = res.data.content.split("\n");

          const extracted = lines
            .filter(
              (line) =>
                line.startsWith("## ") ||
                line.startsWith("### ")
            )
            .map((line) => {
              const level = line.startsWith("### ")
                ? 3
                : 2;

              const text = line
                .replace(/^###?\s+/, "")
                .trim();

              const id = text
                .toLowerCase()
                .replace(/[^\w]+/g, "-");

              return {
                id,
                text,
                level,
              };
            });

          setHeadings(extracted);
        }
      } catch (err) {
        console.error("Fetch_Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] font-mono text-xs uppercase tracking-widest text-neutral-400">
        <Terminal className="mr-2 h-4 w-4 animate-spin" />
        Initializing_Data_Stream...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f5f5]">
        <h1 className="font-mono text-sm uppercase tracking-widest text-red-500">
          404_Node_Not_Found
        </h1>

        <Link
          href="/blog"
          className="mt-4 text-xs uppercase tracking-tighter underline"
        >
          Return_to_Index
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#050505]">
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-32">

        {/* BACK BUTTON */}
        <Link
          href="/blog"
          className="mb-12 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:text-black"
        >
          <ArrowLeft className="h-3 w-3" />
          Back_to_Index
        </Link>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">

          {/* ARTICLE */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

            {/* HEADER */}
            <header className="mb-12 space-y-6">

              <div className="flex flex-wrap items-center gap-6">

                <span className="border border-neutral-300 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
                  {post.category}
                </span>

                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                  <Clock className="h-3 w-3" />

                  {new Date(post.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }
                  )}
                </div>
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                {post.title}
              </h1>

              <p className="border-l-2 border-neutral-300 pl-6 text-lg italic leading-relaxed text-neutral-500">
                {post.summary}
              </p>
            </header>

            {/* FEATURE IMAGE */}
            {post.feature_image_url && (
              <div className="relative mb-16 aspect-[21/9] w-full overflow-hidden border border-neutral-200">
                <Image
                  src={post.feature_image_url}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* MARKDOWN CONTENT */}
            <div className="prose prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-pre:rounded-none prose-pre:bg-[#0d0d0d] prose-code:text-neutral-800">
              <ReactMarkdown
                components={{
                  h2: ({ node, ...props }) => {
                    const id =
                      props.children
                        ?.toString()
                        .toLowerCase()
                        .replace(/[^\w]+/g, "-") || "";

                    return (
                      <h2 id={id} {...props} />
                    );
                  },

                  h3: ({ node, ...props }) => {
                    const id =
                      props.children
                        ?.toString()
                        .toLowerCase()
                        .replace(/[^\w]+/g, "-") || "";

                    return (
                      <h3 id={id} {...props} />
                    );
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* FOOTER */}
            <div className="mt-20 flex flex-wrap items-center justify-between border-t border-neutral-200 pt-10">

              <div className="flex items-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400 transition-colors hover:text-black"
                >
                  <Share2 className="h-3 w-3" />
                  Archive_Report
                </button>
              </div>

              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-300">
                End_of_File // Obed_Yameogo_Research
              </span>
            </div>
          </motion.article>

          {/* SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">

              {/* FULL WHITE SIDEBAR */}
              <div className="flex min-h-[80vh] flex-col border border-neutral-200 bg-white shadow-sm">

                {/* TABLE OF CONTENTS */}
                <div className="flex-1 p-6">

                  {headings.length > 0 ? (
                    <>
                      <p className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
                        Document_Index
                      </p>

                      <ul className="space-y-4">
                        {headings.map((heading) => (
                          <li
                            key={heading.id}
                            style={{
                              paddingLeft:
                                heading.level === 3
                                  ? "14px"
                                  : "0px",
                            }}
                          >
                            <a
                              href={`#${heading.id}`}
                              className="block font-mono text-sm font-semibold uppercase tracking-wide text-black transition-colors duration-200 hover:text-neutral-600"
                            >
                              {heading.level === 3
                                ? "↳ "
                                : ""}
                              {heading.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-300">
                        No_Index_Available
                      </p>
                    </div>
                  )}

                </div>

                {/* ADS SECTION */}
                <div className="mt-auto border-t border-neutral-200 p-5">

                  <p className="mb-3 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-400">
                    Sponsored
                  </p>

                  {/* GOOGLE ADS PLACEHOLDER */}
                  <div className="flex h-[280px] items-center justify-center border border-dashed border-neutral-300 bg-neutral-50">

                    <div className="text-center">

                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                        Google_Ads_Space
                      </p>

                      <p className="mt-2 text-xs text-neutral-300">
                        300 × 250 Ad Placement
                      </p>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}