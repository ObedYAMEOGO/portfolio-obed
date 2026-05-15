"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { blogApi } from "@/lib/api";
import { PostCreate } from "@/types";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  Save,
  Eye,
  Edit3,
  ArrowLeft,
  Loader2,
  Upload,
  ImageIcon,
} from "lucide-react";

import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function NewPostPage() {
  const router = useRouter();

  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<PostCreate>({
    title: "",
    slug: "",
    summary: "",
    content: "",
    feature_image_url: "",
    category: "Research",
    is_published: false,
  });

  // AUTO GENERATE SLUG
  useEffect(() => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setFormData((prev) => ({
      ...prev,
      slug,
    }));
  }, [formData.title]);

  /**
   * CLOUDINARY IMAGE UPLOAD
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploadingImage(true);

      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
      );

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      if (!cloudName) {
        throw new Error("Missing Cloudinary cloud name");
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      setFormData((prev) => ({
        ...prev,
        feature_image_url: data.secure_url,
      }));

      toast.success("Image uploaded successfully.");
    } catch (err: unknown) {
      console.error("UPLOAD_ERROR:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload image.";
      toast.error(errorMessage);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // VALIDATION: Required fields for any post
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required.");
      return;
    }

    // VALIDATION: Required summary for broadcast/newsletter
    if (formData.is_published && !formData.summary) {
      toast.error("A summary is required to broadcast this post to subscribers.");
      return;
    }

    setLoading(true);

    try {
      await blogApi.create(formData);

      toast.success(
        formData.is_published
          ? "Post published and broadcasted successfully."
          : "Draft saved successfully."
      );

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#050505] mt-16">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* TOP BAR */}
        <div className="mb-12 flex flex-col gap-6 border-b border-neutral-200 pb-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:text-[#050505]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>

            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              New Post
            </h1>

            <p className="text-sm text-neutral-500">
              Write and publish a new article.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              variant="outline"
              className="h-11 rounded-none border-neutral-300 bg-white px-5 font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-neutral-100"
            >
              {isPreview ? (
                <>
                  <Edit3 className="mr-2 h-3.5 w-3.5" />
                  Editor
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
        <form
          onSubmit={handleSubmit}
          className="space-y-10 border border-neutral-200 bg-white p-8 md:p-10"
        >
          {/* TITLE + SLUG */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                Title
              </label>

              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                placeholder="Building Production-Ready ML Systems"
                className="w-full border-b border-neutral-300 bg-transparent pb-3 text-2xl font-semibold outline-none transition-colors focus:border-[#050505]"
              />
            </div>

            <div className="space-y-3">
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                Slug
              </label>

              <div className="border-b border-neutral-300 pb-3 font-mono text-sm text-neutral-500">
                /blog/{formData.slug || "your-post-slug"}
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="space-y-3">
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
              Summary
            </label>

            <textarea
              value={formData.summary || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  summary: e.target.value,
                })
              }
              placeholder="Short introduction to the article (Required for broadcast)..."
              className="min-h-25 w-full border border-neutral-300 bg-[#fafafa] p-4 text-[15px] leading-relaxed outline-none transition-colors focus:border-[#050505]"
            />
          </div>

          {/* FEATURE IMAGE */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                Featured Image
              </label>

              <p className="text-sm text-neutral-500">
                Upload a cover image for this article.
              </p>
            </div>

            {/* IMAGE PREVIEW */}
            {formData.feature_image_url ? (
              <div className="relative h-80 w-full overflow-hidden border border-neutral-300 bg-neutral-100">
                <Image
                  src={formData.feature_image_url}
                  alt="Feature preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-60 w-full flex-col items-center justify-center gap-4 border border-dashed border-neutral-300 bg-[#fafafa]">
                <ImageIcon className="h-10 w-10 text-neutral-300" />
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                  No image uploaded
                </p>
              </div>
            )}

            {/* UPLOAD BUTTON */}
            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex cursor-pointer items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="flex h-11 items-center justify-center border border-neutral-300 bg-white px-5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:bg-neutral-100">
                  {uploadingImage ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-3.5 w-3.5" />
                      Upload Image
                    </>
                  )}
                </div>
              </label>

              {formData.feature_image_url && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      feature_image_url: "",
                    })
                  }
                  className="h-11 rounded-none border-neutral-300 bg-white px-5 font-mono text-[10px] uppercase tracking-[0.18em]"
                >
                  Remove
                </Button>
              )}
            </div>

            {/* URL FIELD */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                Or Paste Image URL
              </label>

              <input
                type="text"
                value={formData.feature_image_url || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    feature_image_url: e.target.value,
                  })
                }
                placeholder="https://res.cloudinary.com/..."
                className="w-full border border-neutral-300 bg-[#fafafa] px-4 py-4 text-[15px] outline-none transition-colors focus:border-[#050505]"
              />
            </div>
          </div>

          {/* CONTENT */}
          <div className="space-y-3">
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
              Content
            </label>

            {isPreview ? (
              <div className="prose prose-neutral min-h-125 max-w-none border border-neutral-300 bg-white p-8">
                <ReactMarkdown>{formData.content}</ReactMarkdown>
              </div>
            ) : (
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: e.target.value,
                  })
                }
                placeholder="# Start writing..."
                className="min-h-125 w-full border border-neutral-300 bg-[#fafafa] p-6 text-[15px] leading-relaxed outline-none transition-colors focus:border-[#050505]"
              />
            )}
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex flex-col gap-8 border-t border-neutral-200 pt-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-8">
              {/* PUBLISH */}
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_published: e.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-black"
                />

                <div className="space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                    Publish Immediately
                  </p>

                  <p className="text-xs text-neutral-400">
                    Make this article publicly visible and notify subscribers.
                  </p>
                </div>
              </label>

              {/* CATEGORY */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                  Category
                </label>

                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                  className="border-b border-neutral-300 bg-transparent pb-1 font-mono text-[11px] uppercase tracking-[0.18em] outline-none transition-colors focus:border-[#050505]"
                >
                  <option value="Research">Research</option>
                  <option value="Engineering">Engineering</option>
                  <option value="MLOps">MLOps</option>
                  <option value="AI Systems">AI Systems</option>
                </select>
              </div>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
              Markdown supported
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}