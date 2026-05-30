"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Eye, 
  Edit3,
  Upload,
  X,
  ImageIcon,
  CheckCircle2 
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { postsApi } from "@/lib/api/posts";

import type { Post, BlogCategory, PostUpdate } from "@/types";

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

function normalizeCategory(cat: string | null | undefined): BlogCategory {
  if (cat && (categories as readonly string[]).includes(cat)) {
    return cat as BlogCategory;
  }
  return "Research";
}

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

interface EditPostFormProps {
  post: Post;
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();
  
  // UI State
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Form State - Initialize with safe fallbacks
  const [formData, setFormData] = useState({
    title: post.title || "",
    slug: post.slug || "",
    summary: post.summary ?? "",
    content: post.content || "",
    category: normalizeCategory(post.category),
    tags: post.tags ?? [],
    cover_image_url: post.cover_image_url ?? "",
    seo_title: post.seo_title ?? "",
    seo_description: post.seo_description ?? "",
    featured: post.featured ?? false,
    is_published: post.is_published ?? false,
  });

  /* =========================================================
     HANDLERS
  ========================================================= */

  const updateField = useCallback(<K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    updateField("title", title);
    if (formData.slug === post.slug) {
      updateField("slug", generateSlug(title));
    }
  }, [updateField, formData.slug, post.slug]);

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

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
      );

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) throw new Error("Missing Cloudinary configuration");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: uploadFormData }
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
    const currentTags = formData.tags || [];
    updateField("tags", currentTags.filter((tag) => tag !== tagToRemove));
  }, [formData.tags, updateField]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }, [addTag]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

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
      const updateData: PostUpdate = {
        title: formData.title,
        slug: formData.slug,
        summary: formData.summary || null,
        content: formData.content,
        category: formData.category,
        tags: formData.tags || [],
        cover_image_url: formData.cover_image_url || null,
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null,
        featured: formData.featured,
        is_published: formData.is_published,
      };

      await postsApi.update(post.id, updateData);
      toast.success("Post updated successfully.");
      router.push("/admin/dashboard/posts");
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setLoading(false);
    }
  }, [formData, post.id, router]);

  // Get the final slug value
  const finalSlug = useMemo(() => {
    return formData.slug || generateSlug(formData.title || "");
  }, [formData.slug, formData.title]);

  const safeTags = useMemo(() => {
    return formData.tags || [];
  }, [formData.tags]);

  const inputClass = "w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-[14px] outline-none focus:border-neutral-400 focus:bg-white";
  const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400";

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="space-y-3">
        <Link
          href="/admin/dashboard/posts"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-neutral-400 hover:text-neutral-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Posts
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-neutral-900">
              Edit Post
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Update your article content and settings
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              variant="outline"
              className="h-10 rounded-lg border-neutral-300 bg-white px-4 font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-neutral-100"
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
              onClick={handleSubmit}
              disabled={loading}
              className="h-10 rounded-lg bg-black px-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white hover:bg-neutral-800"
            >
              {loading ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="mr-2 h-3.5 w-3.5" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-neutral-200 bg-white p-8">
        {/* TITLE */}
        <div>
          <label className={labelClass}>Title *</label>
          <input
            className={inputClass}
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="My Amazing Post..."
          />
        </div>

        {/* SLUG PREVIEW */}
        {finalSlug && (
          <div>
            <label className={labelClass}>Slug Preview</label>
            <div className="flex items-center gap-2 rounded-lg bg-neutral-50 px-4 py-3 border border-neutral-200">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="font-mono text-sm text-neutral-600">
                /blog/{finalSlug}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Auto-generated from title • Not editable
            </p>
          </div>
        )}

        {/* CATEGORY */}
        <div>
          <label className={labelClass}>Category</label>
          <select
            className={inputClass}
            value={formData.category}
            onChange={(e) => updateField("category", e.target.value as BlogCategory)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* TAGS */}
        <div>
          <label className={labelClass}>Tags</label>
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag and press Enter"
                className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-[14px] outline-none focus:border-neutral-400"
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                className="h-11 rounded-lg border-neutral-300 px-5 font-mono text-[10px] uppercase"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
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
        </div>

        {/* COVER IMAGE */}
        <div>
          <label className={labelClass}>Cover Image</label>
          
          {formData.cover_image_url ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 mb-3">
              <Image
                src={formData.cover_image_url}
                alt="Cover preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => updateField("cover_image_url", "")}
                className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 mb-3">
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
              <div className="flex h-11 items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-neutral-100 transition-colors">
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
            <input
              type="text"
              value={formData.cover_image_url}
              onChange={(e) => updateField("cover_image_url", e.target.value)}
              placeholder="Or enter image URL"
              className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-[14px] outline-none focus:border-neutral-400"
            />
          </div>
        </div>

        {/* SUMMARY */}
        <div>
          <label className={labelClass}>Summary</label>
          <textarea
            rows={3}
            className={inputClass}
            value={formData.summary}
            onChange={(e) => updateField("summary", e.target.value)}
            placeholder="A brief summary of your post..."
          />
        </div>

        {/* SEO */}
        <div className="space-y-4 border-t border-neutral-200 pt-6">
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            SEO Settings
          </h3>
          
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">SEO Title</label>
            <input
              className={inputClass}
              value={formData.seo_title}
              onChange={(e) => updateField("seo_title", e.target.value)}
              placeholder="Custom SEO title (optional)"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">SEO Description</label>
            <textarea
              rows={2}
              className={inputClass}
              value={formData.seo_description}
              onChange={(e) => updateField("seo_description", e.target.value)}
              placeholder="Custom SEO description (optional)"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div>
          <label className={labelClass}>Content *</label>
          {isPreview ? (
            <div className="prose prose-neutral max-w-none min-h-100 rounded-lg border border-neutral-200 bg-white p-6 overflow-auto">
              <ReactMarkdown>{formData.content || "*No content to preview*"}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              rows={15}
              className={`${inputClass} font-mono`}
              value={formData.content}
              onChange={(e) => updateField("content", e.target.value)}
              placeholder="Write your post content in **Markdown**..."
            />
          )}
        </div>

        {/* FLAGS */}
        <div className="flex gap-6 border-t border-neutral-200 pt-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm text-neutral-600">Feature this post</span>
          </label>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => updateField("is_published", e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm text-neutral-600">
              {post.is_published ? "Published" : "Publish immediately"}
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4"
            />
            <span className="text-sm text-neutral-600">Notify subscribers</span>
          </label>
        </div>
      </form>
    </div>
  );
}