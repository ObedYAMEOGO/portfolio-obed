import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

import type { Post } from "@/types";
import { cn } from "@/lib/utils";
import RelativeDate from "@/components/blog/RelativeDate";

interface PostCardProps {
  post: Post;
  compact?: boolean;
}

const CATEGORY_DOT: Record<string, string> = {
  "AI Engineering":   "bg-emerald-500",
  LLMs:               "bg-sky-500",
  "Machine Learning": "bg-violet-500",
  MLOps:              "bg-orange-500",
  RAG:                "bg-cyan-500",
  "AI Agents":        "bg-indigo-500",
  Inference:          "bg-pink-500",
  Infrastructure:     "bg-amber-500",
  Research:           "bg-blue-500",
};

export default function PostCard({ post, compact = false }: PostCardProps) {
  const dot = CATEGORY_DOT[post.category] ?? "bg-neutral-400";
  const displayDate = post.published_at || post.created_at;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-200 hover:border-neutral-300 hover:shadow-sm">

      {!compact && post.cover_image_url && (
        <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
          <div className="relative aspect-video w-full">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            />
          </div>
        </Link>
      )}

      {!compact && !post.cover_image_url && (
        <div className="h-36 w-full bg-neutral-100 transition-colors duration-200 group-hover:bg-neutral-200" />
      )}

      <div className={cn("flex flex-1 flex-col", compact ? "gap-2 p-4" : "gap-3 p-5")}>

        <div className="flex items-center gap-2">
          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dot)} />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
            {post.category}
          </span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h2
            className={cn(
              "font-semibold leading-snug tracking-tight text-neutral-900 transition-colors duration-150 group-hover:text-neutral-600",
              compact ? "line-clamp-2 text-[14px]" : "line-clamp-2 text-[17px]",
            )}
          >
            {post.title}
          </h2>
        </Link>

        {!compact && (
          <p className="line-clamp-2 text-[13px] leading-relaxed text-neutral-500">
            {post.summary || post.content.substring(0, 120) + "…"}
          </p>
        )}

        {/* RelativeDate replaces the raw formatPostDate span */}
        <div className="mt-auto flex items-center gap-3 text-[11px] text-neutral-400">
          <RelativeDate dateString={displayDate} />
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{post.reading_time} min read</span>
          </div>
        </div>
      </div>
    </article>
  );
}