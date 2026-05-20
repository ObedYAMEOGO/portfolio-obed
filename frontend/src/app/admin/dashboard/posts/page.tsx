import Link from "next/link";

import {
  Plus,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import PostsTable from "@/components/admin/posts/PostsTable";

export const dynamic =
  "force-dynamic";

export default function AdminPostsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-24 text-[#050505]">
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* BACK BUTTON */}
        <div className="mb-6">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:text-[#050505]"
          >
            <ArrowLeft className="h-4 w-4" />

            Back_To_Dashboard
          </Link>
        </div>

        {/* HEADER */}
        <div className="mb-12 flex flex-col gap-6 border-b border-neutral-200 pb-8 md:flex-row md:items-end md:justify-between">

          <div className="space-y-2">

            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">

              Content Management

            </p>

            <h1 className="font-mono text-4xl font-bold uppercase tracking-tight">

              Posts_Registry

            </h1>

            <p className="text-sm text-neutral-500">

              Manage all articles, drafts, and publications.

            </p>

          </div>

          <Button
            asChild
            className="h-11 rounded-none border border-black bg-black px-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white hover:bg-neutral-800"
          >
            <Link href="/admin/dashboard/posts/new">

              <Plus className="mr-2 h-4 w-4" />

              Create Post

            </Link>
          </Button>

        </div>

        {/* TABLE */}
        <PostsTable />

      </div>
    </div>
  );
}