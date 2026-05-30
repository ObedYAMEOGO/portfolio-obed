"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import {
  ArrowLeft,
  Edit3,
  Eye,
  Loader2,
  Save,
  Upload,
  X,
  ImageIcon,
  CheckCircle2,
} from "lucide-react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { postsApi } from "@/lib/api/posts";

import type { BlogCategory, PostCreate } from "@/types";

/* =========================================================
   CONSTANTS
========================================================= */

const categories: BlogCategory[] = [
  "AI Engineering",
  "LLMs",
  "Machine Learning",
  "MLOps",
  "RAG",
  "AI Agents",
  "Inference",
  "Infrastructure",
  "Research",
];

/* =========================================================
   UTILITY FUNCTIONS
========================================================= */

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* =========================================================
   COMPONENT
========================================================= */

export default function NewPostPage() {
  const router = useRouter();

  // UI State
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Form State - Matches backend schema exactly
  const [formData, setFormData] = useState<PostCreate>({
    title: "",
    slug: "",
    summary: null,
    content: "",
    category: "Research",
    tags: [], // Initialize as empty array
    cover_image_url: null,
    seo_title: null,
    seo_description: null,
    featured: false,
    is_published: false,
    published_at: null,
  });

  /* =========================================================
     HANDLERS
  ========================================================= */

  const updateField = useCallback(<K extends keyof PostCreate>(
    field: K,
    value: PostCreate[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    updateField("title", title);
    updateField("slug", generateSlug(title));
  }, [updateField]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB.");
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
      );

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) throw new Error("Missing Cloudinary configuration");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error?.message || "Upload failed");
      }

      updateField("cover_image_url", json.secure_url);
      toast.success("Image uploaded successfully.");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  }, [updateField]);

  const addTag = useCallback(() => {
    const tag = tagInput.trim();
    if (!tag) return;

    // Ensure tags array exists before using includes
    const currentTags = formData.tags || [];
    
    if (currentTags.includes(tag)) {
      toast.error("Tag already exists.");
      return;
    }

    if (tag.length > 50) {
      toast.error("Tag must be less than 50 characters.");
      return;
    }

    updateField("tags", [...currentTags, tag]);
    setTagInput("");
  }, [tagInput, formData.tags, updateField]);

  const removeTag = useCallback((tagToRemove: string) => {
    // Ensure tags array exists before filtering
    const currentTags = formData.tags || [];
    updateField("tags", currentTags.filter((tag) => tag !== tagToRemove));
  }, [formData.tags, updateField]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }, [addTag]);

  const submitPost = useCallback(async () => {
    if (!formData.title?.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!formData.content?.trim()) {
      toast.error("Content is required.");
      return;
    }

    if (formData.title.length > 200) {
      toast.error("Title must be less than 200 characters.");
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        tags: formData.tags || [], // Ensure tags is always an array
        published_at: formData.is_published ? new Date().toISOString() : null,
      };

      await postsApi.create(submitData);

      toast.success(
        formData.is_published ? "Post published successfully!" : "Draft saved successfully."
      );

      router.push("/admin/dashboard/posts");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to create post.");
    } finally {
      setLoading(false);
    }
  }, [formData, router]);

  // Get the final slug value
  const finalSlug = useMemo(() => {
    return formData.slug || generateSlug(formData.title || "");
  }, [formData.slug, formData.title]);

  // Get safe tags array for rendering
  const safeTags = useMemo(() => {
    return formData.tags || [];
  }, [formData.tags]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#050505] mt-16">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* HEADER */}
        <div className="mb-12 flex flex-col gap-6 border-b border-neutral-200 pb-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Link
              href="/admin/dashboard/posts"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:text-[#050505]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Posts
            </Link>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Create New Post
            </h1>
            <p className="text-sm text-neutral-500">
              Write and publish a new article using Markdown.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              variant="outline"
              className="h-11 rounded-none border-neutral-300 bg-white px-5 font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-neutral-100"
            >
              {isPreview ? (
                <>
                  <Edit3 className="mr-2 h-3.5 w-3.5" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-3.5 w-3.5" />
                  Preview
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={submitPost}
              disabled={loading}
              className="h-11 rounded-none bg-[#050505] px-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white hover:bg-neutral-800"
            >
              {loading ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="mr-2 h-3.5 w-3.5" />
              )}
              {formData.is_published ? "Publish Post" : "Save Draft"}
            </Button>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={(e) => { e.preventDefault(); submitPost(); }} className="space-y-8 border border-neutral-200 bg-white p-8 md:p-10">
          
          {/* Title */}
          <div className="space-y-2">
            <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="My Amazing Post..."
              className="w-full border-b border-neutral-300 bg-transparent pb-3 text-2xl font-semibold outline-none focus:border-black transition-colors"
              autoFocus
            />
          </div>

          {/* Slug - VISIBLE BUT NOT EDITABLE (visual cue only) */}
          {finalSlug && (
            <div className="space-y-2">
              <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Slug Preview
              </label>
              <div className="flex items-center gap-2 rounded-md bg-neutral-50 px-3 py-2 border border-neutral-200">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="font-mono text-sm text-neutral-600">
                  /blog/{finalSlug}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Auto-generated from title • Not editable
              </p>
            </div>
          )}

          {/* Category */}
          <div className="space-y-2">
            <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => updateField("category", e.target.value as BlogCategory)}
              className="h-12 w-full border border-neutral-300 bg-white px-4 outline-none focus:border-black"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Summary
            </label>
            <textarea
              value={formData.summary ?? ""}
              onChange={(e) => updateField("summary", e.target.value)}
              placeholder="A brief summary of your post..."
              rows={3}
              className="w-full border border-neutral-300 bg-[#fafafa] p-4 outline-none focus:border-black resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Tags
            </label>
            <div className="flex gap-3">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag and press Enter"
                className="h-11 flex-1 border border-neutral-300 bg-[#fafafa] px-4 outline-none focus:border-black"
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                className="h-11 rounded-none border-neutral-300 px-5 font-mono text-[10px] uppercase"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {safeTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-3">
            <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Cover Image
            </label>
            
            {formData.cover_image_url ? (
              <div className="relative aspect-video w-full overflow-hidden border border-neutral-300 bg-neutral-100">
                <Image
                  src={formData.cover_image_url}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => updateField("cover_image_url", null)}
                  className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex h-60 items-center justify-center border border-dashed border-neutral-300 bg-[#fafafa]">
                <ImageIcon className="h-10 w-10 text-neutral-300" />
              </div>
            )}

            <div className="flex items-center gap-4">
              <label className="inline-flex cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
                <div className="flex h-11 items-center justify-center border border-neutral-300 bg-white px-5 font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-neutral-100 transition-colors">
                  {uploadingImage ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-3.5 w-3.5" />
                      {formData.cover_image_url ? "Change Image" : "Upload Image"}
                    </>
                  )}
                </div>
              </label>
              {uploadingImage && <p className="text-sm text-neutral-500">Uploading to Cloudinary...</p>}
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-4 border-t border-neutral-200 pt-6">
            <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              SEO Settings
            </h3>
            
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-600">SEO Title</label>
              <input
                value={formData.seo_title ?? ""}
                onChange={(e) => updateField("seo_title", e.target.value)}
                placeholder="Custom SEO title (optional)"
                className="w-full border border-neutral-300 bg-[#fafafa] px-4 py-2 outline-none focus:border-black"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-600">SEO Description</label>
              <textarea
                value={formData.seo_description ?? ""}
                onChange={(e) => updateField("seo_description", e.target.value)}
                placeholder="Custom SEO description (optional)"
                rows={2}
                className="w-full border border-neutral-300 bg-[#fafafa] px-4 py-2 outline-none focus:border-black resize-none"
              />
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="featured" className="text-sm text-neutral-600">
              Feature this post (appears in featured section)
            </label>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Content <span className="text-red-500">*</span>
            </label>
            
            {isPreview ? (
              <div className="prose prose-neutral max-w-none min-h-125 border border-neutral-300 bg-white p-8 overflow-auto">
                <ReactMarkdown>{formData.content || "*No content to preview*"}</ReactMarkdown>
              </div>
            ) : (
              <textarea
                value={formData.content}
                onChange={(e) => updateField("content", e.target.value)}
                placeholder="Write your post content in **Markdown**..."
                className="min-h-125 w-full border border-neutral-300 bg-[#fafafa] p-6 font-mono text-sm outline-none focus:border-black resize-y"
              />
            )}
          </div>

          {/* Publish Options */}
          <div className="flex items-center justify-between border-t border-neutral-200 pt-6">
            <div className="flex items-center gap-6">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => updateField("is_published", e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                  Publish Immediately
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                  Notify Subscribers
                </span>
              </label>
            </div>

            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
              Markdown Supported
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}