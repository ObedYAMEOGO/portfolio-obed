"use client";

import {
  useEffect,
  useState,
  useTransition,
} from "react";

import {
  Material,
  MaterialCreate,
} from "@/types";

import { materialsApi } from "@/lib/api/materials";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import {
  Loader2,
  Pencil,
  X,
} from "lucide-react";

interface Props {
  material: Material;
  onRefresh?: () => void;
}

export default function EditMaterialForm({
  material,
  onRefresh,
}: Props) {
  const [isOpen, setIsOpen] =
    useState(false);

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const [formData, setFormData] =
    useState<MaterialCreate>({
      title: material.title,
      slug: material.slug,
      description:
        material.description,
      material_type:
        material.material_type,
      video_context:
        material.video_context,
      category:
        material.category,
      resource_url:
        material.resource_url,
      thumbnail_url:
        material.thumbnail_url ||
        "",
      is_published: true,
    });

  useEffect(() => {
    setFormData({
      title: material.title,
      slug: material.slug,
      description:
        material.description,
      material_type:
        material.material_type,
      video_context:
        material.video_context,
      category:
        material.category,
      resource_url:
        material.resource_url,
      thumbnail_url:
        material.thumbnail_url ||
        "",
      is_published: true,
    });
  }, [material]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    startTransition(
      async () => {
        try {
          await materialsApi.update(
            material.id,
            formData
          );

          toast.success(
            "Material updated."
          );

          setIsOpen(false);

          onRefresh?.();
        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to update material."
          );
        }
      }
    );
  };

  return (
    <>
      <Button
        type="button"
        onClick={() =>
          setIsOpen(true)
        }
        variant="outline"
        className="h-9 rounded-none"
      >
        <Pencil className="mr-2 h-4 w-4" />
        Edit
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-2xl border border-neutral-300 bg-white p-8">
            <button
              type="button"
              onClick={() =>
                setIsOpen(false)
              }
              className="absolute right-4 top-4"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-6 font-mono text-xl uppercase">
              Edit_Material
            </h2>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-4"
            >
              <input
                type="text"
                value={
                  formData.title
                }
                onChange={(e) =>
                  setFormData(
                    (
                      prev
                    ) => ({
                      ...prev,
                      title:
                        e.target
                          .value,
                    })
                  )
                }
                placeholder="Title"
                className="h-11 w-full border px-4"
              />

              <textarea
                rows={4}
                value={
                  formData.description
                }
                onChange={(e) =>
                  setFormData(
                    (
                      prev
                    ) => ({
                      ...prev,
                      description:
                        e.target
                          .value,
                    })
                  )
                }
                placeholder="Description"
                className="w-full border p-4"
              />

              <input
                type="text"
                value={
                  formData.category
                }
                onChange={(e) =>
                  setFormData(
                    (
                      prev
                    ) => ({
                      ...prev,
                      category:
                        e.target
                          .value,
                    })
                  )
                }
                placeholder="Category"
                className="h-11 w-full border px-4"
              />

              <input
                type="text"
                value={
                  formData.resource_url
                }
                onChange={(e) =>
                  setFormData(
                    (
                      prev
                    ) => ({
                      ...prev,
                      resource_url:
                        e.target
                          .value,
                    })
                  )
                }
                placeholder="Resource URL"
                className="h-11 w-full border px-4"
              />

              <Button
                type="submit"
                disabled={
                  isPending
                }
                className="w-full rounded-none"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Update Material"
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}