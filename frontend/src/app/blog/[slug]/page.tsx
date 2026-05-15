"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

import { blogApi } from "@/lib/api";
import { Post } from "@/types";
import { ArrowLeft, Clock, Terminal, Share2 } from "lucide-react";

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await blogApi.getBySlug(slug);
        setPost(res.data);
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
        <Terminal className="mr-2 h-4 w-4 animate-spin" /> Initializing_Data_Stream...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f5f5]">
        <h1 className="font-mono text-sm uppercase tracking-widest text-red-500">404_Node_Not_Found</h1>
        <Link href="/blog" className="mt-4 text-xs uppercase tracking-tighter underline">Return_to_Index</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#050505]">

      <main className="mx-auto max-w-4xl px-6 pt-32 pb-24">
        {/* BACK BUTTON */}
        <Link 
          href="/blog" 
          className="mb-12 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:text-black"
        >
          <ArrowLeft className="h-3 w-3" /> Back_to_Index
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* POST HEADER */}
          <header className="mb-12 space-y-6">
            <div className="flex flex-wrap items-center gap-6">
              <span className="border border-neutral-300 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
                {post.category}
              </span>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                <Clock className="h-3 w-3" />
                {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}
              </div>
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              {post.title}
            </h1>

            <p className="text-lg italic leading-relaxed text-neutral-500 border-l-2 border-neutral-300 pl-6">
              {post.summary}
            </p>
          </header>

          {/* FEATURE IMAGE */}
          {post.feature_image_url && (
            <div className="relative mb-16 aspect-21/9 w-full overflow-hidden border border-neutral-200">
              <Image 
                src={post.feature_image_url} 
                alt={post.title} 
                fill 
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* ARTICLE CONTENT */}
          <div className="prose prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-pre:rounded-none prose-pre:bg-[#0d0d0d] prose-code:text-neutral-800">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* FOOTER INFO */}
          <div className="mt-20 flex flex-wrap items-center justify-between border-t border-neutral-200 pt-10">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
              >
                <Share2 className="h-3 w-3" /> Archive_Report
              </button>
            </div>
            
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-300">
              End_of_File // Obed_Yameogo_Research
            </span>
          </div>
        </motion.article>
      </main>
    </div>
  );
}