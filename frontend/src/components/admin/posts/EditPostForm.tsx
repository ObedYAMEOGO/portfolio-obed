"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { postsApi } from "@/lib/api/posts";
import type { Post, PostCreate } from "@/types/post";

interface EditPostFormProps {
  post: Post;
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<PostCreate>({
    title:             post.title,
    slug:              post.slug,
    summary:           post.summary || "",
    content:           post.content,
    feature_image_url: post.feature_image_url || "",
    category:          post.category,
    is_published:      post.is_published,
  });

  const set = (field: Partial<PostCreate>) =>
    setFormData((prev) => ({ ...prev, ...field }));

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await postsApi.update(post.id, formData);
      toast.success("Post updated successfully.");
      router.replace("/admin/dashboard/posts");
    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-[14px] text-neutral-900 outline-none transition-colors focus:border-neutral-400 focus:bg-white placeholder:text-neutral-300";

  const labelClass =
    "block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="space-y-3">
        <Link
          href="/admin/dashboard/posts"
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Posts
        </Link>

        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-neutral-900">
          Edit Post
        </h1>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-neutral-200 bg-white p-8"
      >

        {/* TITLE */}
        <div className="space-y-2">
          <label className={labelClass}>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="Post title"
            className={inputClass}
          />
        </div>

        {/* SUMMARY */}
        <div className="space-y-2">
          <label className={labelClass}>Summary</label>
          <textarea
            value={formData.summary}
            onChange={(e) => set({ summary: e.target.value })}
            placeholder="A short summary shown in the blog listing…"
            className={`${inputClass} min-h-[120px] resize-none py-3`}
          />
        </div>

        {/* CONTENT */}
        <div className="space-y-2">
          <label className={labelClass}>Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => set({ content: e.target.value })}
            placeholder="Write in Markdown…"
            className={`${inputClass} min-h-[480px] resize-y py-3 font-mono text-[13px]`}
          />
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-neutral-200 pt-6">

          {/* PUBLISHED TOGGLE */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => set({ is_published: e.target.checked })}
              className="h-4 w-4 accent-neutral-900"
            />
            <span className="text-[13px] font-medium text-neutral-600">
              Published
            </span>
          </label>

          {/* SAVE */}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-neutral-900 px-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {loading ? "Saving…" : "Save Changes"}
          </button>

        </div>
      </form>

    </div>
  );
}