// src/app/admin/dashboard/materials/[id]/edit/page.tsx

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import EditMaterialForm from "@/components/admin/materials/EditMaterialForm";
import { serverMaterialsApi } from "@/lib/server/materials";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMaterialPage({ params }: PageProps) {
  const { id } = await params;

  const material = await serverMaterialsApi.getById(Number(id));

  return (
    <main className="min-h-screen bg-[#f5f5f5] p-8">
      <div className="mx-auto max-w-5xl">

        {/* BACK BUTTON */}
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
            Materials Registry
          </p>
          <h1 className="mt-2 font-mono text-3xl font-bold uppercase tracking-tight text-[#050505]">
            Edit_Material
          </h1>
        </div>

        {/* FORM */}
        <EditMaterialForm material={material} />
      </div>
    </main>
  );
}