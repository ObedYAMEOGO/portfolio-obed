// src/app/admin/dashboard/materials/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditMaterialForm from "@/components/admin/materials/EditMaterialForm";
import { materialsApi } from "@/lib/api/materials";
import { Material } from "@/types";

export default function EditMaterialPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        setLoading(true);
        const data = await materialsApi.getById(id);
        setMaterial(data);
      } catch (err: unknown) {
        console.error('Failed to fetch material:', err);
        
        if (err && typeof err === 'object' && 'message' in err) {
          setError((err as { message: string }).message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load material');
        }
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(id)) {
      fetchMaterial();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f5f5] p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
              Materials Registry
            </p>
            <h1 className="mt-2 font-mono text-3xl font-bold uppercase tracking-tight text-[#050505]">
              Edit_Material
            </h1>
          </div>
          <div className="flex justify-center py-12">
            <div className="text-neutral-500">Loading material...</div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !material) {
    return (
      <main className="min-h-screen bg-[#f5f5f5] p-8">
        <div className="mx-auto max-w-5xl">
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

          <div className="mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
              Materials Registry
            </p>
            <h1 className="mt-2 font-mono text-3xl font-bold uppercase tracking-tight text-[#050505]">
              Edit_Material
            </h1>
          </div>

          <div className="rounded border border-red-200 bg-red-50 p-6">
            <h2 className="font-mono text-sm font-bold uppercase text-red-800">
              Error Loading Material
            </h2>
            <p className="mt-2 text-sm text-red-700">
              {error || 'Material not found'}
            </p>
            <Link
              href="/admin/dashboard/materials"
              className="mt-4 inline-block text-sm text-red-600 underline"
            >
              Return to Materials List
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Success state
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