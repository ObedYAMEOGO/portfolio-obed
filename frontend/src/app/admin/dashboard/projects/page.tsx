// src/app/admin/dashboard/projects/page.tsx

import ProjectsTable from "@/components/admin/projects/ProjectsTable";

import { Button } from "@/components/ui/button";

import Link from "next/link";

import {
  ArrowLeft,
  Plus,
} from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-24 text-[#050505]">

      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* HEADER */}
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
              Projects
            </h1>

          </div>

          <Button
            asChild
            className="rounded-none bg-black px-6 font-mono text-[10px] uppercase tracking-[0.18em]"
          >
            <Link href="/admin/dashboard/projects/new">

              <Plus className="mr-2 h-4 w-4" />

              New Project

            </Link>
          </Button>

        </div>

        <ProjectsTable />

      </div>

    </div>
  );
}