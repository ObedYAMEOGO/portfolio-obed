/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";
import api from "@/lib/api";

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CreateProjectForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [techInput, setTechInput] = useState("");

  const [formData, setFormData] = useState({
    title:        "",
    slug:         "",
    description:  "",
    content:      "",
    tech_stack:   [] as string[],
    github_url:   "",
    live_url:     "",
    image_url:    "",
    is_published: false,
  });

  /* =========================================================
     HELPERS
  ========================================================= */

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  }

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: toSlug(title),
    }));
  }

  /* =========================================================
     CLOUDINARY UPLOAD
  ========================================================= */

  async function uploadImage(file: File) {
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
    } catch (err) {
      console.error(err);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  /* =========================================================
     TECH STACK
  ========================================================= */

  function addTech() {
    const trimmed = techInput.trim();
    if (!trimmed || formData.tech_stack.includes(trimmed)) {
      setTechInput("");
      return;
    }
    setFormData((prev) => ({ ...prev, tech_stack: [...prev.tech_stack, trimmed] }));
    setTechInput("");
  }

  function removeTech(tech: string) {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((t) => t !== tech),
    }));
  }

  /* =========================================================
     SUBMIT
  ========================================================= */

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/admin/projects", formData);
      router.push("/admin/dashboard/projects");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to create project.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-[14px] text-neutral-900 outline-none transition-colors focus:border-neutral-400 focus:bg-white placeholder:text-neutral-300";

  const labelClass =
    "block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* TITLE + SLUG */}
      <div className="grid gap-5 md:grid-cols-2">

        <div className="space-y-2">
          <label className={labelClass}>Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="My Project"
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Slug</label>
          <input
            type="text"
            name="slug"
            required
            value={formData.slug}
            onChange={handleChange}
            placeholder="my-project"
            className={inputClass}
          />
          {formData.slug && (
            <p className="font-mono text-[10px] tracking-[0.12em] text-neutral-400">
              /projects/<span className="text-neutral-600">{formData.slug}</span>
            </p>
          )}
        </div>

      </div>

      {/* DESCRIPTION */}
      <div className="space-y-2">
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          rows={3}
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
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className={labelClass}>GitHub URL</label>
          <input
            type="text"
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
            type="text"
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
          type="text"
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
      <div className="space-y-3">
        <label className={labelClass}>Tech Stack</label>

        <div className="flex gap-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
            placeholder="e.g. React"
            className={`${inputClass} flex-1`}
          />
          <button
            type="button"
            onClick={addTech}
            className="rounded-full bg-neutral-900 px-5 text-[12px] font-semibold text-white transition-colors hover:bg-neutral-700"
          >
            Add
          </button>
        </div>

        {formData.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tech_stack.map((tech) => (
              <span
                key={tech}
                className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[11px] font-medium text-neutral-600"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  className="text-neutral-400 transition-colors hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
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
            Publish immediately
          </span>
        </label>

        <button
          type="submit"
          disabled={loading || uploading}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-neutral-900 px-6 text-[12px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {loading ? "Creating…" : "Create Project"}
        </button>

      </div>

    </form>
  );
}