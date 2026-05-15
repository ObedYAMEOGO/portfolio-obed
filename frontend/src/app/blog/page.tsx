"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { blogApi } from "@/lib/api";
import { Post } from "@/types";
import { ArrowRight, Terminal } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await blogApi.getAllPublished();
        setPosts(res.data ?? []);
      } catch (err) {
        console.error("Fetch_Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#050505]">
      <main className="mx-auto max-w-6xl px-6 pt-32 pb-24">
        {/* HEADER */}
        <header className="mb-20 border-b border-neutral-200 pb-10">
          <div className="space-y-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-400">
              Research & Engineering Notes
            </span>

            <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
              Blog
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg">
              Thoughts on machine learning systems, production AI,
              distributed infrastructure, and technical architecture.
            </p>
          </div>
        </header>

        {/* POSTS */}
        <div className="space-y-12">
          {loading ? (
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-neutral-400">
              <Terminal className="h-3.5 w-3.5 animate-spin" />
              <span>Initializing_Data_Stream...</span>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="group overflow-hidden border border-neutral-200 bg-white transition-all duration-300 hover:border-neutral-800 hover:shadow-lg"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  prefetch={true} // Faster transition to individual article
                  className="grid grid-cols-1 md:grid-cols-[320px_1fr]"
                >
                  {/* IMAGE */}
                  <div className="relative h-60 w-full overflow-hidden bg-neutral-100 md:h-full">
                    <Image
                      src={post.feature_image_url || "/blog-placeholder.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Overlay effect on hover */}
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-col justify-between p-8 md:p-10">
                    <div>
                      {/* META */}
                      <div className="mb-5 flex flex-wrap items-center gap-4">
                        {post.category && (
                          <span className="border border-neutral-300 bg-[#f5f5f5] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-600">
                            {post.category}
                          </span>
                        )}

                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                          {/* Secure date formatting */}
                          {post.created_at ? new Date(post.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                          }) : "STAMP_PENDING"}
                        </span>
                      </div>

                      {/* TITLE */}
                      <h2 className="text-3xl font-semibold leading-tight tracking-tight transition-colors duration-200 group-hover:text-neutral-700 md:text-4xl">
                        {post.title}
                      </h2>

                      {/* SUMMARY */}
                      {post.summary && (
                        <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-neutral-500">
                          {post.summary}
                        </p>
                      )}
                    </div>

                    {/* CTA / READ ARTICLE BUTTON */}
                    <div className="mt-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#050505]">
                      <span className="border-b border-transparent transition-all group-hover:border-black">
                        Read Article
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-2" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))
          ) : (
            <div className="border border-dashed border-neutral-300 bg-white py-24 text-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-400">
                Repository_Empty // No Logs Found
              </span>
            </div>
          )}
        </div>
      </main>

      
    </div>
  );
}