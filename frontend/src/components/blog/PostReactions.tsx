"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser, useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

// =========================================================
// TYPES
// =========================================================

type ReactionType = "LIKE" | "HEART" | "FIRE" | "INSIGHTFUL";

interface ReactionCount {
  reaction: ReactionType;
  count: number;
  reacted: boolean;
}

interface PostReactionsResponse {
  post_slug: string;
  reactions: ReactionCount[];
}

// =========================================================
// CONFIG
// =========================================================

const REACTIONS: {
  type: ReactionType;
  emoji: string;
  label: string;
}[] = [
  { type: "LIKE",       emoji: "👍", label: "Like"       },
  { type: "HEART",      emoji: "❤️", label: "Love"       },
  { type: "FIRE",       emoji: "🔥", label: "Fire"       },
  { type: "INSIGHTFUL", emoji: "💡", label: "Insightful" },
];

// =========================================================
// API HELPERS
// =========================================================

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function fetchReactions(
  slug: string,
  token?: string
): Promise<PostReactionsResponse> {
  const res = await fetch(`${API}/reactions?slug=${slug}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch reactions");
  return res.json();
}

async function toggleReaction(
  token: string,
  post_slug: string,
  reaction: ReactionType
): Promise<{ reacted: boolean }> {
  const res = await fetch(`${API}/reactions/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ post_slug, reaction }),
  });
  if (!res.ok) throw new Error("Failed to toggle reaction");
  return res.json();
}

// =========================================================
// COMPONENT
// =========================================================

export default function PostReactions({ slug }: { slug: string }) {
  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["reactions", slug],
    queryFn: async () => {
      const token = isSignedIn ? (await getToken()) ?? undefined : undefined;
      return fetchReactions(slug, token);
    },
    staleTime: 60 * 1000,
    enabled: isLoaded,
  });

  const mutation = useMutation({
    mutationFn: async (reaction: ReactionType) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return toggleReaction(token, slug, reaction);
    },
    onMutate: async (reaction) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["reactions", slug] });
      const prev = queryClient.getQueryData<PostReactionsResponse>(["reactions", slug]);

      queryClient.setQueryData<PostReactionsResponse>(["reactions", slug], (old) => {
        if (!old) return old;
        return {
          ...old,
          reactions: old.reactions.map((r) =>
            r.reaction === reaction
              ? {
                  ...r,
                  reacted: !r.reacted,
                  count: r.reacted ? r.count - 1 : r.count + 1,
                }
              : r
          ),
        };
      });

      return { prev };
    },
    onError: (_err, _reaction, context) => {
      // Rollback on error
      if (context?.prev) {
        queryClient.setQueryData(["reactions", slug], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reactions", slug] });
    },
  });

  const totalReactions =
    data?.reactions.reduce((acc, r) => acc + r.count, 0) ?? 0;

  return (
    <div className="mt-10 flex flex-col items-center gap-4">

      {/* LABEL */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
        {totalReactions > 0
          ? `${totalReactions} reaction${totalReactions !== 1 ? "s" : ""}`
          : "React to this post"}
      </p>

      {/* REACTION BUTTONS */}
      <div className="flex items-center gap-2">
        {isLoading ? (
          // Skeleton
          <>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-12 w-20 animate-pulse rounded-full bg-neutral-100"
              />
            ))}
          </>
        ) : (
          REACTIONS.map(({ type, emoji, label }) => {
            const r = data?.reactions.find((x) => x.reaction === type);
            const reacted = r?.reacted ?? false;
            const count = r?.count ?? 0;

            return (
              <button
                key={type}
                onClick={() => {
                  if (!isSignedIn) return;
                  mutation.mutate(type);
                }}
                disabled={!isSignedIn || mutation.isPending}
                title={
                  isSignedIn
                    ? reacted
                      ? `Remove ${label}`
                      : label
                    : "Sign in to react"
                }
                className={cn(
                  "group relative flex items-center gap-1.5 rounded-full border px-4 py-2.5",
                  "text-[13px] font-medium transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  reacted
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50",
                  !isSignedIn && "cursor-default opacity-70"
                )}
              >
                {/* Emoji bounce on hover */}
                <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
                  {emoji}
                </span>
                {count > 0 && (
                  <span
                    className={cn(
                      "text-[12px] font-semibold tabular-nums",
                      reacted ? "text-white" : "text-neutral-700"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* SIGN IN NUDGE */}
      {isLoaded && !isSignedIn && (
        <p className="text-[11px] text-neutral-400">
          Sign in to react to this post
        </p>
      )}
    </div>
  );
}