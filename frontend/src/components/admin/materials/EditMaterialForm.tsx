"use client";

import { useEffect, useState, useTransition } from "react";
import { Material, MaterialCreate } from "@/types";
import { materialsApi } from "@/lib/api/materials";
import { toast } from "sonner";
import { Loader2, Pencil, X } from "lucide-react";

interface Props {
  material: Material;
  onRefresh?: () => void;
}

export default function EditMaterialForm({ material, onRefresh }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<MaterialCreate>({
    title:         material.title ?? "",
    slug:          material.slug ?? "",
    description:   material.description ?? "",
    material_type: material.material_type,
    video_context: material.video_context,
    category:      material.category ?? "",
    resource_url:  material.resource_url ?? "",
    thumbnail_url: material.thumbnail_url ?? "",
    is_published:  true,
  });

  useEffect(() => {
    setFormData({
      title:         material.title ?? "",
      slug:          material.slug ?? "",
      description:   material.description ?? "",
      material_type: material.material_type,
      video_context: material.video_context,
      category:      material.category ?? "",
      resource_url:  material.resource_url ?? "",
      thumbnail_url: material.thumbnail_url ?? "",
      is_published:  true,
    });
  }, [material]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await materialsApi.update(material.id, formData);
        toast.success("Material updated.");
        setIsOpen(false);
        onRefresh?.();
      } catch (error) {
        console.error(error);
        toast.error("Failed to update material.");
      }
    });
  };

  const inputClass =
    "h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 text-[14px] text-neutral-900 outline-none transition-colors focus:border-neutral-400 focus:bg-white placeholder:text-neutral-300";

  const labelClass =
    "block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400";

  return (
    <>
      {/* TRIGGER */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-neutral-200 px-4 text-[11px] font-semibold text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900"
      >
        <Pencil className="h-3 w-3" />
        Edit
      </button>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-8 shadow-2xl">

            {/* CLOSE */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <X className="h-4 w-4" />
            </button>

            {/* HEADER */}
            <div className="mb-7 space-y-1">
              <span className={labelClass}>Material</span>
              <h2 className="text-xl font-semibold tracking-[-0.01em] text-neutral-900">
                Edit Material
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* TITLE */}
              <div className="space-y-2">
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Material title"
                  className={inputClass}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <label className={labelClass}>Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Short description…"
                  className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-[14px] text-neutral-900 outline-none transition-colors focus:border-neutral-400 focus:bg-white placeholder:text-neutral-300"
                />
              </div>

              {/* CATEGORY + RESOURCE URL */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className={labelClass}>Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="General AI"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Resource URL</label>
                  <input
                    type="text"
                    value={formData.resource_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, resource_url: e.target.value }))}
                    placeholder="https://…"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  );
}