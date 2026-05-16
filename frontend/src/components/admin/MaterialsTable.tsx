"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Trash2, ExternalLink, FileText, Video, FolderOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Material {
  id: number;
  title: string;
  material_type: "DOCUMENT" | "VIDEO";
  video_context: "SINGLE" | "PLAYLIST" | "NONE";
  category: string;
  resource_url: string;
  created_at: string;
}

interface MaterialsTableProps {
  onRefresh?: () => void;
}

export default function MaterialsTable({ onRefresh }: MaterialsTableProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchMaterials = async () => {
    try {
      const res = await api.get<Material[]>("/materials");
      setMaterials(res.data ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load materials directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = confirm(
      "CONFIRMATION REQUIRED: Permanently eliminate this material from the system?"
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      // Calls your FastAPI endpoint: @router.delete("/admin/materials/{material_id}")
      await api.delete(`/admin/materials/${id}`);
      
      toast.success("Material asset expunged.");
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Execution failed: Backend pipeline rejected command.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Syncing_Materials_Registry...
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="p-10 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400">
        No educational materials indexed in directory.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            <th className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Type
            </th>
            <th className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Asset_Title
            </th>
            <th className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Category
            </th>
            <th className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Context Structure
            </th>
            <th className="px-6 py-4 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              System_Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-neutral-200 bg-white font-mono text-xs text-[#050505]">
          {materials.map((material) => (
            <tr key={material.id} className="transition-colors hover:bg-neutral-50">
              {/* TYPE ICON INDICATOR */}
              <td className="px-6 py-4">
                {material.material_type === "DOCUMENT" ? (
                  <FileText className="h-4 w-4 text-neutral-600" />
                ) : material.video_context === "PLAYLIST" ? (
                  <FolderOpen className="h-4 w-4 text-amber-600" />
                ) : (
                  <Video className="h-4 w-4 text-blue-600" />
                )}
              </td>

              {/* TITLE */}
              <td className="px-6 py-4 font-sans text-sm font-semibold tracking-tight text-neutral-900 max-w-xs truncate">
                {material.title}
              </td>

              {/* CATEGORY */}
              <td className="px-6 py-4 uppercase tracking-tighter text-neutral-500">
                {material.category}
              </td>

              {/* CONFIG CONTEXT */}
              <td className="px-6 py-4 text-neutral-400 text-[11px]">
                {material.material_type === "DOCUMENT" ? "STATIC_DOCUMENT" : `VIDEO_${material.video_context}`}
              </td>

              {/* ACTIONS */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* LIVE EXTERNAL TEST LINK */}
                  <a
                    href={material.resource_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center border border-neutral-300 bg-white text-neutral-500 transition-colors hover:bg-neutral-100"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  {/* DESTRUCTION RUNNER BUTTON */}
                  <button
                    onClick={() => handleDelete(material.id)}
                    disabled={deletingId === material.id}
                    className="inline-flex h-9 w-9 items-center justify-center border border-red-200 bg-white text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
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
  );
}