// src/app/admin/dashboard/materials/new/page.tsx

import CreateMaterialForm from "@/components/admin/materials/CreateMaterialForm";

import Link from "next/link";

import {
  ArrowLeft,
} from "lucide-react";

export default function NewMaterialPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-24">

      <div className="mx-auto max-w-4xl px-6 py-12">

        <div className="mb-10 space-y-4">

          <Link
            href="/admin/dashboard/materials"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400 hover:text-black"
          >
            <ArrowLeft className="h-3 w-3" />
            Back
          </Link>

          <h1 className="font-mono text-4xl font-bold uppercase tracking-tight">
            New_Material
          </h1>

        </div>

        <CreateMaterialForm />

      </div>

    </div>
  );
}