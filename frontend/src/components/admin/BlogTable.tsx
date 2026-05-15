"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { blogApi } from "@/lib/api";
import { Post } from "@/types";

import { Button } from "@/components/ui/button";

import {
  Pencil,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";

import { toast } from "sonner";

export default function BlogTable() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await blogApi.adminGetAll();
      setPosts(res.data ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      await blogApi.delete(id);

      toast.success("Post deleted.");

      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post.");
    }
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      await blogApi.update(post.id, {
        ...post,
        is_published: !post.is_published,
      });

      toast.success(
        post.is_published
          ? "Post unpublished."
          : "Post published."
      );

      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update post.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
        Loading posts...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-10 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400">
        No blog posts found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            <th className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Image
            </th>

            <th className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Title
            </th>

            <th className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Category
            </th>

            <th className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Status
            </th>

            <th className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Date
            </th>

            <th className="px-6 py-4 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {posts.map((post) => (
            <tr
              key={post.id}
              className="border-b border-neutral-200 transition-colors hover:bg-neutral-50"
            >
              {/* IMAGE */}
              <td className="px-6 py-5">
                {post.feature_image_url ? (
                  <div className="relative h-16 w-24 overflow-hidden border border-neutral-200 bg-neutral-100">
                    <Image
                      src={post.feature_image_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-24 items-center justify-center border border-dashed border-neutral-200 bg-neutral-50 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                    No Image
                  </div>
                )}
              </td>

              {/* TITLE */}
              <td className="px-6 py-5">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#050505]">
                    {post.title}
                  </p>

                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                    /blog/{post.slug}
                  </p>
                </div>
              </td>

              {/* CATEGORY */}
              <td className="px-6 py-5">
                <span className="border border-neutral-300 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
                  {post.category}
                </span>
              </td>

              {/* STATUS */}
              <td className="px-6 py-5">
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                    post.is_published
                      ? "text-green-600"
                      : "text-neutral-400"
                  }`}
                >
                  {post.is_published ? "Published" : "Draft"}
                </span>
              </td>

              {/* DATE */}
              <td className="px-6 py-5 font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-400">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </td>

              {/* ACTIONS */}
              <td className="px-6 py-5">
                <div className="flex items-center justify-end gap-2">
                  {/* VIEW */}
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-none border-neutral-300 bg-white px-3 hover:bg-neutral-100"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>

                  {/* EDIT */}
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-none border-neutral-300 bg-white px-3 hover:bg-neutral-100"
                  >
                    <Link href={`/admin/dashboard/blog/edit/${post.id}`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                  </Button>

                  {/* PUBLISH TOGGLE */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTogglePublish(post)}
                    className="h-9 rounded-none border-neutral-300 bg-white px-3 hover:bg-neutral-100"
                  >
                    {post.is_published ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </Button>

                  {/* DELETE */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    className="h-9 rounded-none border-red-200 bg-white px-3 text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}