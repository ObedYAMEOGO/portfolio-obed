"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { materialsApi } from "@/lib/api/materials";

import {
  Trash2,
  ExternalLink,
  FileText,
  Video,
  FolderOpen,
  Loader2,
  Database,
  Pencil,
} from "lucide-react";

import { toast } from "sonner";

interface Material {
  id: number;
  title: string;
  slug?: string;
  description?: string;

  material_type: "DOCUMENT" | "VIDEO";

  video_context: "SINGLE" | "PLAYLIST" | "NONE";

  category: string;

  resource_url: string;

  thumbnail_url?: string | null;

  is_published?: boolean;

  created_at?: string;
}

interface MaterialsTableProps {
  onRefresh?: () => void;
}

export default function MaterialsTable({ onRefresh }: MaterialsTableProps) {
  const [materials, setMaterials] = useState<Material[]>([]);

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  /* =========================================================
     FETCH MATERIALS
  ========================================================= */

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const data = await materialsApi.getAll();

        const sortedMaterials = (data ?? []).sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;

          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

          return dateB - dateA;
        });

        setMaterials(sortedMaterials);
      } catch (error) {
        console.error("Failed to fetch materials:", error);

        toast.error("Failed to load materials registry.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Delete this material permanently?");

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await materialsApi.delete(id);

      setMaterials((prev) => prev.filter((material) => material.id !== id));

      toast.success("Material deleted successfully.");

      onRefresh?.();
    } catch (error) {
      console.error("Delete material error:", error);

      toast.error("Failed to delete material.");
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================================
     ICONS
  ========================================================= */

  const renderMaterialIcon = (material: Material) => {
    if (material.material_type === "DOCUMENT") {
      return <FileText className="h-4 w-4 text-neutral-600" />;
    }

    if (material.video_context === "PLAYLIST") {
      return <FolderOpen className="h-4 w-4 text-amber-600" />;
    }

    return <Video className="h-4 w-4 text-blue-600" />;
  };

  /* =========================================================
     CONTEXT LABEL
  ========================================================= */

  const renderContext = (material: Material) => {
    if (material.material_type === "DOCUMENT") {
      return "DOCUMENT";
    }

    return material.video_context === "PLAYLIST"
      ? "VIDEO_PLAYLIST"
      : "VIDEO_SINGLE";
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="mt-14 border border-neutral-200 bg-white p-10">
        <div className="flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Syncing_Materials_Registry
        </div>
      </div>
    );
  }

  /* =========================================================
     COMPONENT
  ========================================================= */

  return (
    <section className="mt-14 border border-neutral-200 bg-white">
      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
            Learning Assets Registry
          </p>

          <h2 className="mt-1 flex items-center gap-3 font-mono text-xl font-bold uppercase tracking-tight text-[#050505]">
            <Database className="h-5 w-5" />
            Indexed_Materials
          </h2>
        </div>

        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
          {materials.length} Assets
        </div>
      </div>

      {/* EMPTY STATE */}

      {materials.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-400">
            No_Materials_Found
          </p>

          <p className="text-sm text-neutral-500">
            Uploaded learning assets will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="w-20 px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  Type
                </th>

                <th className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  Title
                </th>

                <th className="w-52 px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  Category
                </th>

                <th className="w-52 px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  Context
                </th>

                <th className="w-52 px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  Created
                </th>

                <th className="w-40 px-6 py-4 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100 bg-white">
              {materials.map((material) => (
                <tr
                  key={material.id}
                  className="transition-colors hover:bg-neutral-50"
                >
                  {/* TYPE */}

                  <td className="px-6 py-5">
                    <div className="flex h-9 w-9 items-center justify-center border border-neutral-200 bg-neutral-100">
                      {renderMaterialIcon(material)}
                    </div>
                  </td>

                  {/* TITLE */}

                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="max-w-md truncate text-sm font-medium text-[#050505]">
                        {material.title}
                      </p>

                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-400">
                        Asset_ID_
                        {material.id}
                      </p>
                    </div>
                  </td>

                  {/* CATEGORY */}

                  <td className="px-6 py-5">
                    <span className="inline-flex border border-neutral-300 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-600">
                      {material.category}
                    </span>
                  </td>

                  {/* CONTEXT */}

                  <td className="px-6 py-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-400">
                      {renderContext(material)}
                    </span>
                  </td>

                  {/* DATE */}

                  <td className="px-6 py-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-400">
                      {material.created_at
                        ? new Date(material.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            },
                          )
                        : "N/A"}
                    </span>
                  </td>

                  {/* ACTIONS */}

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      {/* OPEN */}

                      <Link
                        href={material.resource_url}
                        target="_blank"
                        className="inline-flex h-9 w-9 items-center justify-center border border-neutral-300 bg-white text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-[#050505]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>

                      {/* EDIT */}

                      {/* EDIT */}

                      <Link
                        href={`/admin/dashboard/materials/${material.id}/edit`}
                        className="inline-flex h-9 w-9 items-center justify-center border border-neutral-300 bg-white text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-black"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() => handleDelete(material.id)}
                        disabled={deletingId === material.id}
                        className="inline-flex h-9 w-9 items-center justify-center border border-red-200 bg-white text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === material.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
