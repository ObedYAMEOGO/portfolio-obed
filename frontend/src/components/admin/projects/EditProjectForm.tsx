/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useTransition, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { projectsApi } from "@/lib/api/projects";
import type { Project } from "@/types";

interface Props {
  project: Project;
}

interface FormData {
  title:        string;
  description:  string;
  content:      string;
  image_url:    string;
  github_url:   string;
  live_url:     string;
  tech_stack:   string;
  is_published: boolean;
}

function toFormData(project: Project): FormData {
  return {
    title:        project.title || "",
    description:  project.description || "",
    content:      project.content || "",
    image_url:    project.image_url || "",
    github_url:   project.github_url || "",
    live_url:     project.live_url || "",
    tech_stack:   Array.isArray(project.tech_stack) ? project.tech_stack.join(", ") : "",
    is_published: project.is_published ?? true,
  };
}

export default function EditProjectForm({ project }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => toFormData(project));

  useEffect(() => { setFormData(toFormData(project)); }, [project]);

  /* =========================================================
     HELPERS
  ========================================================= */

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  /* =========================================================
     CLOUDINARY UPLOAD
  ========================================================= */

  async function uploadImage(file: File): Promise<string> {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );
    if (!response.ok) throw new Error("Upload failed");
    const result = await response.json();
    return result.secure_url as string;
  }

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image_url: imageUrl }));
      toast.success("Image uploaded successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  }

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await projectsApi.update(project.id, {
          title:        formData.title,
          slug:         formData.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          description:  formData.description,
          content:      formData.content,
          image_url:    formData.image_url || undefined,
          github_url:   formData.github_url || undefined,
          live_url:     formData.live_url || undefined,
          tech_stack:   formData.tech_stack.split(",").map((t) => t.trim()).filter(Boolean),
          is_published: formData.is_published,
        });
        toast.success("Project updated successfully.");
        router.push("/admin/dashboard/projects");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to update project.");
      }
    });
  };

  const inputClass =
    "w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-[14px] text-neutral-900 outline-none transition-colors focus:border-neutral-400 focus:bg-white placeholder:text-neutral-300";

  const labelClass =
    "block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-8">

      {/* HEADER */}
      <div className="mb-8 space-y-1">
        <span className={labelClass}>Project</span>
        <h2 className="text-xl font-semibold tracking-[-0.01em] text-neutral-900">
          Edit Project
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* TITLE */}
        <div className="space-y-2">
          <label className={labelClass}>Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Project title"
            className={inputClass}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Short project description…"
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* CONTENT */}
        <div className="space-y-2">
          <label className={labelClass}>Content</label>
          <textarea
            name="content"
            rows={10}
            value={formData.content}
            onChange={handleChange}
            placeholder="Write in Markdown…"
            className={`${inputClass} resize-y font-mono text-[13px]`}
          />
        </div>

        {/* GITHUB + LIVE URL */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className={labelClass}>GitHub URL</label>
            <input
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              placeholder="https://github.com/…"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Live URL</label>
            <input
              name="live_url"
              value={formData.live_url}
              onChange={handleChange}
              placeholder="https://…"
              className={inputClass}
            />
          </div>
        </div>

        {/* IMAGE URL */}
        <div className="space-y-2">
          <label className={labelClass}>Image URL</label>
          <input
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://…"
            className={inputClass}
          />
        </div>

        {/* FILE UPLOAD */}
        <div className="space-y-3">
          <label className={labelClass}>Upload Image</label>

          <label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 transition-colors hover:border-neutral-400">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
            ) : (
              <Upload className="h-5 w-5 text-neutral-400" />
            )}
            <span className="text-[11px] font-medium text-neutral-400">
              {formData.image_url ? "Replace image" : "Click to upload"}
            </span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          {formData.image_url && (
            <div className="relative overflow-hidden rounded-xl border border-neutral-200">
              <img
                src={formData.image_url}
                alt="Preview"
                className="h-52 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, image_url: "" }))}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-red-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* TECH STACK */}
        <div className="space-y-2">
          <label className={labelClass}>Tech Stack</label>
          <input
            name="tech_stack"
            value={formData.tech_stack}
            onChange={handleChange}
            placeholder="Next.js, FastAPI, PostgreSQL"
            className={inputClass}
          />
          <p className="text-[11px] text-neutral-400">Separate with commas</p>
        </div>

        {/* PUBLISHED + SUBMIT */}
        <div className="flex items-center justify-between border-t border-neutral-200 pt-6">

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="is_published"
              checked={formData.is_published}
              onChange={handleChange}
              className="h-4 w-4 accent-neutral-900"
            />
            <span className="text-[13px] font-medium text-neutral-600">
              Published
            </span>
          </label>

          <button
            type="submit"
            disabled={isPending || uploading}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-neutral-900 px-6 text-[12px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isPending ? "Saving…" : "Save Changes"}
          </button>

        </div>

      </form>
    </div>
  );
}