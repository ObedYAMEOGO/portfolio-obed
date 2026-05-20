import Link from "next/link";

import {
  ArrowLeft,
} from "lucide-react";

import EditProjectForm from "@/components/admin/projects/EditProjectForm";

import {
  projectsApi,
} from "@/lib/api/projects";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProjectPage({
  params,
}: PageProps) {
  const { id } =
    await params;

  const project =
    await projectsApi.getById(
      Number(id)
    );

  return (
    <main className="min-h-screen bg-[#f5f5f5] p-8">
      <div className="mx-auto max-w-5xl">
        {/* BACK */}

        <Link
          href="/admin/dashboard"
          className="
            mb-8
            inline-flex
            items-center
            gap-2
            border
            border-neutral-300
            bg-white
            px-4
            py-2
            font-mono
            text-[10px]
            uppercase
            tracking-[0.2em]
            text-neutral-600
            transition-colors
            hover:border-black
            hover:text-black
          "
        >
          <ArrowLeft className="h-3.5 w-3.5" />

          Back_To_Dashboard
        </Link>

        {/* HEADER */}

        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
            Projects Registry
          </p>

          <h1 className="mt-2 font-mono text-3xl font-bold uppercase tracking-tight text-[#050505]">
            Edit_Project
          </h1>
        </div>

        <EditProjectForm
          project={project}
        />
      </div>
    </main>
  );
}