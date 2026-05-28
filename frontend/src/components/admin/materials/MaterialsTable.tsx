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
  Pencil,
} from "lucide-react";

import { toast } from "sonner";

interface Material {
  id: number;
  title: string;
  slug?: string;
  description?: string;

  material_type:
    | "DOCUMENT"
    | "VIDEO";

  video_context:
    | "SINGLE"
    | "PLAYLIST"
    | "NONE";

  category: string;

  resource_url: string;

  thumbnail_url?:
    | string
    | null;

  is_published?: boolean;

  created_at?: string;
}

interface MaterialsTableProps {
  onRefresh?: () => void;
}

export default function MaterialsTable({
  onRefresh,
}: MaterialsTableProps) {
  const [
    materials,
    setMaterials,
  ] = useState<Material[]>(
    [],
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    deletingId,
    setDeletingId,
  ] = useState<
    number | null
  >(null);

  /* =========================================================
     FETCH MATERIALS
  ========================================================= */

  useEffect(() => {
    const fetchMaterials =
      async () => {
        try {
          setLoading(true);

          const data =
            await materialsApi.getAll();

          const sorted = (
            data ?? []
          ).sort((a, b) => {
            const dateA =
              a.created_at
                ? new Date(
                    a.created_at,
                  ).getTime()
                : 0;

            const dateB =
              b.created_at
                ? new Date(
                    b.created_at,
                  ).getTime()
                : 0;

            return (
              dateB - dateA
            );
          });

          setMaterials(
            sorted,
          );
        } catch (error) {
          console.error(
            "Failed to fetch materials:",
            error,
          );

          toast.error(
            "Failed to load materials.",
          );
        } finally {
          setLoading(
            false,
          );
        }
      };

    fetchMaterials();
  }, []);

  /* =========================================================
     DELETE MATERIAL
  ========================================================= */

  const handleDelete =
    async (
      id: number,
    ) => {
      const confirmed =
        window.confirm(
          "Delete this material permanently?",
        );

      if (!confirmed)
        return;

      try {
        setDeletingId(id);

        await materialsApi.delete(
          id,
        );

        setMaterials(
          (prev) =>
            prev.filter(
              (
                material,
              ) =>
                material.id !==
                id,
            ),
        );

        toast.success(
          "Material deleted.",
        );

        onRefresh?.();
      } catch (error) {
        console.error(
          error,
        );

        toast.error(
          "Failed to delete material.",
        );
      } finally {
        setDeletingId(
          null,
        );
      }
    };

  /* =========================================================
     HELPERS
  ========================================================= */

  const renderIcon = (
    material: Material,
  ) => {
    if (
      material.material_type ===
      "DOCUMENT"
    ) {
      return (
        <FileText className="h-4 w-4 text-neutral-500" />
      );
    }

    if (
      material.video_context ===
      "PLAYLIST"
    ) {
      return (
        <FolderOpen className="h-4 w-4 text-amber-500" />
      );
    }

    return (
      <Video className="h-4 w-4 text-blue-500" />
    );
  };

  const renderContext = (
    material: Material,
  ) => {
    if (
      material.material_type ===
      "DOCUMENT"
    ) {
      return "Document";
    }

    return material.video_context ===
      "PLAYLIST"
      ? "Playlist"
      : "Single video";
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-10">
        <div className="flex items-center justify-center gap-3 text-[12px] text-neutral-400">
          <Loader2 className="h-4 w-4 animate-spin" />

          Loading materials…
        </div>
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
            Learning Assets
          </p>

          <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-neutral-900">
            Materials
          </h2>
        </div>

        <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-semibold text-neutral-500">
          {
            materials.length
          }{" "}
          total
        </span>
      </div>

      {/* EMPTY */}

      {materials.length ===
      0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16">
          <p className="text-sm text-neutral-400">
            No materials
            yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                {[
                  "Type",
                  "Title",
                  "Category",
                  "Context",
                  "Created",
                  "",
                ].map(
                  (
                    header,
                  ) => (
                    <th
                      key={
                        header
                      }
                      className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 last:text-right"
                    >
                      {
                        header
                      }
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {materials.map(
                (
                  material,
                ) => (
                  <tr
                    key={
                      material.id
                    }
                    className="transition-colors hover:bg-neutral-50"
                  >
                    {/* TYPE */}

                    <td className="px-6 py-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50">
                        {renderIcon(
                          material,
                        )}
                      </div>
                    </td>

                    {/* TITLE */}

                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="max-w-xs truncate text-[14px] font-medium text-neutral-900">
                          {
                            material.title
                          }
                        </p>

                        <p className="text-[11px] text-neutral-400">
                          #
                          {
                            material.id
                          }
                        </p>
                      </div>
                    </td>

                    {/* CATEGORY */}

                    <td className="px-6 py-4">
                      <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-medium text-neutral-600">
                        {
                          material.category
                        }
                      </span>
                    </td>

                    {/* CONTEXT */}

                    <td className="px-6 py-4">
                      <span className="text-[12px] text-neutral-500">
                        {renderContext(
                          material,
                        )}
                      </span>
                    </td>

                    {/* DATE */}

                    <td className="px-6 py-4">
                      <span className="text-[12px] text-neutral-400">
                        {material.created_at
                          ? new Date(
                              material.created_at,
                            ).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month:
                                  "short",
                                day: "2-digit",
                              },
                            )
                          : "—"}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={
                            material.resource_url
                          }
                          target="_blank"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition-colors hover:border-neutral-400 hover:text-neutral-900"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>

                        <Link
                          href={`/admin/dashboard/materials/${material.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition-colors hover:border-neutral-400 hover:text-neutral-900"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              material.id,
                            )
                          }
                          disabled={
                            deletingId ===
                            material.id
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 text-red-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId ===
                          material.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}