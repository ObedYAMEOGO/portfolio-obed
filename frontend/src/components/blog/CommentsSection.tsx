"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser, useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import {
  MessageCircle,
  Trash2,
  CornerDownRight,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

// =========================================================
// TYPES
// =========================================================

interface Comment {
  id: number;
  post_slug: string;
  content: string;
  user_id: number;
  user_name: string;
  user_avatar: string | null;
  parent_id: number | null;
  is_deleted: boolean;
  created_at: string;
  replies: Comment[];
}

// =========================================================
// API HELPERS
// =========================================================

const API = process.env.NEXT_PUBLIC_API_URL ;


if (!API) {
  throw new Error("NEXT_PUBLIC_API_URL is missing");
}
async function fetchComments(slug: string): Promise<Comment[]> {
  const res = await fetch(`${API}/comments?slug=${slug}`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

async function postComment(
  token: string,
  body: { post_slug: string; content: string; parent_id?: number }
): Promise<Comment> {
  const res = await fetch(`${API}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to post comment");
  return res.json();
}

async function deleteComment(token: string, id: number): Promise<void> {
  const res = await fetch(`${API}/comments/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete comment");
}

// =========================================================
// AVATAR
// =========================================================

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const colors = [
    "bg-neutral-900",
    "bg-stone-700",
    "bg-zinc-700",
    "bg-slate-700",
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        colors[colorIndex],
        size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-[12px]"
      )}
      title={name}
    >
      {initials}
    </div>
  );
}

// =========================================================
// COMMENT INPUT
// =========================================================

function CommentInput({
  slug,
  parentId,
  onSuccess,
  onCancel,
  placeholder = "Write a comment…",
  autoFocus = false,
}: {
  slug: string;
  parentId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return postComment(token, {
        post_slug: slug,
        content: content.trim(),
        parent_id: parentId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", slug] });
      setContent("");
      onSuccess?.();
    },
  });

  const handleSubmit = () => {
    if (!content.trim() || mutation.isPending) return;
    mutation.mutate();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-3">
      <Avatar
        name={user?.fullName || user?.primaryEmailAddress?.emailAddress || "U"}
      />
      <div className="flex-1">
        <textarea
          ref={textareaRef}
          autoFocus={autoFocus}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={2}
          className="
            w-full resize-none rounded-xl border border-neutral-200
            bg-neutral-50 px-4 py-3 text-[13px] leading-relaxed
            text-neutral-800 placeholder:text-neutral-400
            focus:border-neutral-400 focus:bg-white focus:outline-none
            transition-colors duration-200
          "
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[11px] text-neutral-400">⌘ + Enter to submit</p>
          <div className="flex gap-2">
            {onCancel && (
              <button
                onClick={onCancel}
                className="rounded-full px-4 py-1.5 text-[12px] font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || mutation.isPending}
              className="
                inline-flex items-center gap-1.5 rounded-full bg-neutral-900
                px-4 py-1.5 text-[12px] font-semibold text-white
                transition-all duration-200 hover:bg-neutral-700
                disabled:cursor-not-allowed disabled:opacity-40 active:scale-95
              "
            >
              <Send className="h-3 w-3" />
              {mutation.isPending ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
        {mutation.isError && (
          <p className="mt-1 text-[12px] text-red-500">
            Something went wrong. Try again.
          </p>
        )}
      </div>
    </div>
  );
}

// =========================================================
// REPLIES THREAD
// =========================================================

const INITIAL_REPLIES_SHOWN = 1;

function RepliesThread({
  replies,
  slug,
  currentUserName,
}: {
  replies: Comment[];
  slug: string;
  currentUserName: string | null;
}) {
  const [showAll, setShowAll] = useState(false);

  // Filter out deleted replies entirely
  const visible_replies = replies.filter((r) => !r.is_deleted);

  if (visible_replies.length === 0) return null;

  // Sort chronologically
  const sorted = [...visible_replies].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const visible = showAll ? sorted : sorted.slice(-INITIAL_REPLIES_SHOWN);
  const hiddenCount = sorted.length - INITIAL_REPLIES_SHOWN;

  return (
    <div className="mt-3 ml-3 border-l-2 border-neutral-100 pl-4">
      {!showAll && hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="
            mb-3 inline-flex items-center gap-1.5 text-[11px]
            font-semibold text-neutral-400 hover:text-neutral-700
            transition-colors duration-200
          "
        >
          <ChevronDown className="h-3 w-3" />
          View {hiddenCount} previous {hiddenCount === 1 ? "reply" : "replies"}
        </button>
      )}

      <div className="space-y-4">
        {visible.map((reply) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            slug={slug}
            currentUserName={currentUserName}
            depth={1}
          />
        ))}
      </div>

      {showAll && hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(false)}
          className="
            mt-3 inline-flex items-center gap-1.5 text-[11px]
            font-semibold text-neutral-400 hover:text-neutral-700
            transition-colors duration-200
          "
        >
          <ChevronUp className="h-3 w-3" />
          Collapse replies
        </button>
      )}
    </div>
  );
}

// =========================================================
// SINGLE COMMENT
// =========================================================

function CommentItem({
  comment,
  slug,
  currentUserName,
  depth = 0,
}: {
  comment: Comment;
  slug: string;
  currentUserName: string | null;
  depth?: number;
}) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [replying, setReplying] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return deleteComment(token, comment.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", slug] });
    },
  });

  const isOwn =
    currentUserName !== null && currentUserName === comment.user_name;

  return (
    <div className="flex gap-3">
      <Avatar name={comment.user_name} size={depth > 0 ? "sm" : "md"} />

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] font-semibold text-black">
            {comment.user_name}
          </span>
          <span
            className="text-[11px] text-neutral-400"
            title={new Date(comment.created_at).toLocaleString()}
          >
            {formatDistanceToNow(new Date(comment.created_at), {
              addSuffix: true,
            })}
          </span>

          {isOwn && (
            <button
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="
                ml-auto rounded p-1 text-neutral-300
                hover:bg-red-50 hover:text-red-400
                transition-all duration-200
              "
              title="Delete comment"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Content */}
        <p className="mt-1 text-[13px] leading-relaxed text-neutral-700">
          {comment.content}
        </p>

        {/* Reply button — only on top-level */}
        {currentUserName !== null && depth === 0 && (
          <button
            onClick={() => setReplying((v) => !v)}
            className="
              mt-2 inline-flex items-center gap-1.5 text-[11px]
              font-medium text-neutral-400 hover:text-neutral-700
              transition-colors duration-200
            "
          >
            <CornerDownRight className="h-3 w-3" />
            {replying ? "Cancel" : "Reply"}
          </button>
        )}

        {/* Inline reply input */}
        {replying && (
          <div className="mt-3">
            <CommentInput
              slug={slug}
              parentId={comment.id}
              placeholder={`Reply to ${comment.user_name}…`}
              autoFocus
              onSuccess={() => setReplying(false)}
              onCancel={() => setReplying(false)}
            />
          </div>
        )}

        {/* Threaded replies */}
        {depth === 0 && comment.replies && comment.replies.length > 0 && (
          <RepliesThread
            replies={comment.replies}
            slug={slug}
            currentUserName={currentUserName}
          />
        )}
      </div>
    </div>
  );
}

// =========================================================
// MAIN COMMENTS SECTION
// =========================================================

export default function CommentsSection({ slug }: { slug: string }) {
  const { isSignedIn, isLoaded, user } = useUser();

  const { data: rawComments = [], isLoading } = useQuery({
    queryKey: ["comments", slug],
    queryFn: () => fetchComments(slug),
    staleTime: 30 * 1000,
  });

  // Filter deleted top-level comments entirely
  const comments = rawComments.filter((c) => !c.is_deleted);

  const totalCount = comments.reduce(
    (acc, c) =>
      acc + 1 + (c.replies?.filter((r) => !r.is_deleted).length || 0),
    0
  );

  const currentUserName = isSignedIn
    ? user?.fullName || user?.primaryEmailAddress?.emailAddress || null
    : null;

  return (
    <div className="mt-16 border-t border-neutral-200 pt-10">

      {/* HEADER */}
      <div className="mb-8 flex items-center gap-3">
        <MessageCircle className="h-4 w-4 text-neutral-400" />
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
          {totalCount > 0
            ? `${totalCount} Comment${totalCount !== 1 ? "s" : ""}`
            : "Discussion"}
        </h2>
      </div>

      {/* INPUT */}
      {isLoaded && isSignedIn && (
        <div className="mb-10">
          <CommentInput slug={slug} />
        </div>
      )}

      {/* SIGN IN PROMPT */}
      {isLoaded && !isSignedIn && (
        <div className="mb-10 rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-5 text-center">
          <p className="text-[13px] text-neutral-500">
            Login in to join the discussion.
          </p>
        </div>
      )}

      {/* SKELETON */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-neutral-100" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 w-32 animate-pulse rounded-full bg-neutral-100" />
                <div className="h-3 w-full animate-pulse rounded-full bg-neutral-100" />
                <div className="h-3 w-3/4 animate-pulse rounded-full bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-[13px] text-neutral-400">
            No comments yet. Be the first to share your thoughts.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              slug={slug}
              currentUserName={currentUserName}
            />
          ))}
        </div>
      )}
    </div>
  );
}