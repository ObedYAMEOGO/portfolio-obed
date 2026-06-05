"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { Trash2, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: number;
  post_slug: string;
  content: string;
  user_name: string;
  parent_id: number | null;
  is_deleted: boolean;
  created_at: string;
  replies: Comment[];
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function CommentsTable() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(true);

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["admin-comments"],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${API}/admin/comments?page_size=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch comments");
      return res.json() as Promise<Comment[]>;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = await getToken();
      const res = await fetch(`${API}/admin/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-comments"] }),
  });

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">

      {/* HEADER */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-5"
      >
        <div className="flex items-center gap-3">
          <MessageCircle className="h-4 w-4 text-neutral-400" />
          <h2 className="text-sm font-semibold text-neutral-900">Comments</h2>
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-500">
            {comments.length}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-neutral-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-neutral-400" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-neutral-100">
          {isLoading ? (
            <div className="px-6 py-8 text-center text-sm text-neutral-400">
              Loading…
            </div>
          ) : comments.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-neutral-400">
              No comments yet.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start justify-between gap-4 px-6 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[12px] font-semibold text-neutral-800">
                        {comment.user_name}
                      </span>
                      {comment.parent_id && (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-500">
                          Reply
                        </span>
                      )}
                      {comment.is_deleted && (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] text-red-400">
                          Deleted
                        </span>
                      )}
                      <span className="text-[11px] text-neutral-400">
                        on{" "}
                        <span className="font-medium text-neutral-600">
                          {comment.post_slug}
                        </span>
                        {" · "}
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[13px] text-neutral-600">
                      {comment.content}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteMutation.mutate(comment.id)}
                    disabled={deleteMutation.isPending}
                    className="shrink-0 text-neutral-300 transition-colors hover:text-red-400"
                    title="Hard delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}