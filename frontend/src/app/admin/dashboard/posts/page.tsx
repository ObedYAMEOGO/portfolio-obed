// src/app/admin/dashboard/posts/page.tsx

import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PostsTable from "@/components/admin/posts/PostsTable";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page ?? "1");

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-24 text-[#050505]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 flex items-center justify-between border-b border-neutral-300 pb-8">
          <div className="space-y-3">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-black"
            >
              <ArrowLeft className="h-3 w-3" />
              Dashboard
            </Link>
            <h1 className="font-mono text-4xl font-bold uppercase tracking-tight">
              Posts
            </h1>
          </div>
          <Button
            asChild
            className="rounded-none bg-black px-6 font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-black/90"
          >
            <Link href="/admin/dashboard/posts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>

        <PostsTable page={currentPage} />
      </div>
    </div>
  );
}