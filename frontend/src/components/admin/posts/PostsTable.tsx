"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { postsApi } from "@/lib/api/posts";
import type { Post } from "@/types";

interface PostsTableProps {
  page?: number;
}

export default function PostsTable({ page = 1 }: PostsTableProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await postsApi.getAll(page, pageSize);
      setPosts(data.items);
      setTotalPages(data.total_pages);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await postsApi.delete(id);
      toast.success("Post deleted successfully");
      fetchPosts();
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/admin/dashboard/posts?page=${newPage}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                  No posts yet. Create your first post!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-neutral-900">{post.title}</div>
                      <div className="text-xs text-neutral-400">/blog/{post.slug}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{post.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        post.is_published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="rounded p-1 text-neutral-400 transition-colors hover:text-neutral-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/dashboard/posts/${post.id}/edit`}
                        className="rounded p-1 text-neutral-400 transition-colors hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="rounded p-1 text-neutral-400 transition-colors hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} posts
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}