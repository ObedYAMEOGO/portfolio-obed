"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Save,
  Loader2,
} from "lucide-react";

import Link from "next/link";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { postsApi } from "@/lib/api/posts";

import type {
  Post,
  PostCreate,
} from "@/types/post";

interface EditPostFormProps {
  post: Post;
}

export default function EditPostForm({
  post,
}: EditPostFormProps) {
  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState<PostCreate>({
      title: post.title,
      slug: post.slug,
      summary:
        post.summary || "",
      content:
        post.content,
      feature_image_url:
        post.feature_image_url ||
        "",
      category:
        post.category,
      is_published:
        post.is_published,
    });

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit =
    async (
      e: React.FormEvent,
    ) => {
      e.preventDefault();

      try {
        setLoading(true);

        await postsApi.update(
          post.id,
          formData,
        );

        toast.success(
          "Post updated successfully.",
        );

        router.replace(
          "/admin/dashboard/posts",
        );
      } catch (
        error: unknown
      ) {
        console.error(error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Update failed.",
        );
      } finally {
        setLoading(false);
      }
    };

  /* =========================================================
     COMPONENT
  ========================================================= */

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div className="space-y-2">

          <Link
            href="/admin/dashboard/posts"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:text-black"
          >

            <ArrowLeft className="h-3.5 w-3.5" />

            Back_To_Posts

          </Link>

          <h1 className="font-mono text-3xl font-bold uppercase tracking-tight text-[#050505]">

            Edit_Post

          </h1>

        </div>

      </div>

      {/* FORM */}

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-8 border border-neutral-200 bg-white p-8"
      >

        {/* TITLE */}

        <div className="space-y-2">

          <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">

            Title

          </label>

          <input
            type="text"
            value={
              formData.title
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                title:
                  e.target
                    .value,
              })
            }
            className="w-full border border-neutral-300 px-4 py-4 outline-none transition-colors focus:border-black"
          />

        </div>

        {/* SUMMARY */}

        <div className="space-y-2">

          <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">

            Summary

          </label>

          <textarea
            value={
              formData.summary
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                summary:
                  e.target
                    .value,
              })
            }
            className="min-h-[120px] w-full border border-neutral-300 px-4 py-4 outline-none transition-colors focus:border-black"
          />

        </div>

        {/* CONTENT */}

        <div className="space-y-2">

          <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">

            Content

          </label>

          <textarea
            value={
              formData.content
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                content:
                  e.target
                    .value,
              })
            }
            className="min-h-[500px] w-full border border-neutral-300 px-4 py-4 outline-none transition-colors focus:border-black"
          />

        </div>

        {/* FOOTER */}

        <div className="flex items-center justify-between border-t border-neutral-200 pt-6">

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={
                formData.is_published
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_published:
                    e.target
                      .checked,
                })
              }
            />

            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">

              Published

            </span>

          </label>

          <Button
            type="submit"
            disabled={loading}
            className="h-11 rounded-none bg-black px-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white hover:bg-neutral-800"
          >

            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Post
              </>
            )}

          </Button>

        </div>

      </form>

    </div>
  );
}