import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

import { ArrowLeft, Clock } from "lucide-react";

import { Post } from "@/types";

import PrintButton from "@/components/blog/PrintButton";

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

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_URL}/posts/${slug}`, {
      next: {
        revalidate: 3600,
      },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}

function extractHeadings(content: string) {
  const lines = content.split("\n");

  return lines
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
}

export default async function PostPage({
  params,
}: PostPageProps) {
  const { slug } = await params;

  const post = await getPost(slug);

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

  const headings = extractHeadings(post.content || "");

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

        {/* GRID */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">

          {/* ARTICLE */}
          <article>

            {/* HEADER */}
            <header className="mb-12 space-y-6">

              <div className="flex flex-wrap items-center gap-6">

                {post.category && (
                  <span className="border border-neutral-300 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
                    {post.category}
                  </span>
                )}

                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                  <Clock className="h-3 w-3" />

                  {post.created_at
                    ? new Date(post.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        }
                      )
                    : "STAMP_PENDING"}
                </div>

              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                {post.title}
              </h1>

              {post.summary && (
                <p className="border-l-2 border-neutral-300 pl-6 text-lg italic leading-relaxed text-neutral-500">
                  {post.summary}
                </p>
              )}

            </header>

            {/* FEATURE IMAGE */}
            {post.feature_image_url && (
              <div className="relative mb-16 aspect-21/9 w-full overflow-hidden border border-neutral-200">
                <Image
                  src={post.feature_image_url}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            {/* CONTENT */}
            <div className="prose prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-pre:rounded-none prose-pre:bg-[#0d0d0d] prose-code:text-neutral-800">

              <ReactMarkdown
                components={{
                  h2: ({ children }) => {
                    const id =
                      children
                        ?.toString()
                        .toLowerCase()
                        .replace(/[^\w]+/g, "-") || "";

                    return <h2 id={id}>{children}</h2>;
                  },

                  h3: ({ children }) => {
                    const id =
                      children
                        ?.toString()
                        .toLowerCase()
                        .replace(/[^\w]+/g, "-") || "";

                    return <h3 id={id}>{children}</h3>;
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>

            </div>

            {/* FOOTER */}
            <div className="mt-20 flex flex-wrap items-center justify-between border-t border-neutral-200 pt-10">

              <PrintButton />

              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-300">
                End_of_File // Obed_Yameogo_Research
              </span>

            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">

              <div className="flex min-h-[80vh] flex-col border border-neutral-200 bg-white shadow-sm">

                {/* TOC */}
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
                              {heading.level === 3 ? "↳ " : ""}
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

                  <div className="flex h-70 items-center justify-center border border-dashed border-neutral-300 bg-neutral-50">

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