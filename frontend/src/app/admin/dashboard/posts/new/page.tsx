"use client";

import {
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import Image from "next/image";

import Link from "next/link";

import ReactMarkdown from "react-markdown";

import {
  ArrowLeft,
  Edit3,
  Eye,
  ImageIcon,
  Loader2,
  Save,
  Upload,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { postsApi } from "@/lib/api/posts";

import type { PostCreate } from "@/types/post";

export default function NewPostPage() {
  const router =
    useRouter();

  const [isPreview, setIsPreview] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  const [formData, setFormData] =
    useState<PostCreate>({
      title: "",
      slug: "",
      summary: "",
      content: "",
      feature_image_url: "",
      category: "Research",
      is_published: false,
    });

  const generatedSlug =
    useMemo(() => {
      return formData.title
        .toLowerCase()
        .trim()
        .replace(
          /[^a-z0-9]+/g,
          "-",
        )
        .replace(
          /(^-|-$)/g,
          "",
        );
    }, [formData.title]);

  const handleImageUpload =
    async (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      try {
        setUploadingImage(true);

        const data =
          new FormData();

        data.append(
          "file",
          file,
        );

        data.append(
          "upload_preset",
          process.env
            .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
            "",
        );

        const cloudName =
          process.env
            .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

        if (!cloudName) {
          throw new Error(
            "Missing Cloudinary cloud name",
          );
        }

        const response =
          await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: "POST",
              body: data,
            },
          );

        const json =
          await response.json();

        if (!response.ok) {
          throw new Error(
            json.error
              ?.message ||
              "Upload failed",
          );
        }

        setFormData(
          (prev) => ({
            ...prev,
            feature_image_url:
              json.secure_url,
          }),
        );

        toast.success(
          "Image uploaded successfully.",
        );
      } catch (
        error: unknown
      ) {
        console.error(error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Upload failed",
        );
      } finally {
        setUploadingImage(false);
      }
    };

  const handleSubmit =
    async (
      e?: React.FormEvent,
    ) => {
      e?.preventDefault();

      if (
        !formData.title ||
        !formData.content
      ) {
        toast.error(
          "Title and content are required.",
        );

        return;
      }

      setLoading(true);

      try {
        await postsApi.create({
          ...formData,
          slug:
            generatedSlug,
        });

        toast.success(
          formData.is_published
            ? "Post published."
            : "Draft saved.",
        );

        router.push(
          "/admin/dashboard",
        );

        router.refresh();
      } catch (
        error: unknown
      ) {
        console.error(error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to create post.",
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#050505] mt-16">
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* HEADER */}
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
              onClick={() =>
                setIsPreview(
                  !isPreview,
                )
              }
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
              onClick={
                handleSubmit
              }
              disabled={loading}
              className="h-11 rounded-none bg-[#050505] px-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white hover:bg-neutral-800"
            >
              {loading ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="mr-2 h-3.5 w-3.5" />
              )}

              {formData.is_published
                ? "Publish Post"
                : "Save Draft"}
            </Button>

          </div>

        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-10 border border-neutral-200 bg-white p-8 md:p-10"
        >

          {/* TITLE */}
          <div className="space-y-3">

            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">

              Title

            </label>

            <input
              type="text"
              value={
                formData.title
              }
              onChange={(
                e,
              ) =>
                setFormData({
                  ...formData,
                  title:
                    e.target
                      .value,
                })
              }
              className="w-full border-b border-neutral-300 bg-transparent pb-3 text-2xl font-semibold outline-none focus:border-black"
            />

          </div>

          {/* SUMMARY */}
          <div className="space-y-3">

            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">

              Summary

            </label>

            <textarea
              value={
                formData.summary
              }
              onChange={(
                e,
              ) =>
                setFormData({
                  ...formData,
                  summary:
                    e.target
                      .value,
                })
              }
              className="min-h-[100px] w-full border border-neutral-300 bg-[#fafafa] p-4 outline-none focus:border-black"
            />

          </div>

          {/* IMAGE */}
          <div className="space-y-5">

            {formData.feature_image_url ? (
              <div className="relative h-80 w-full overflow-hidden border border-neutral-300">

                <Image
                  src={
                    formData.feature_image_url
                  }
                  alt="Preview"
                  fill
                  className="object-cover"
                />

              </div>
            ) : (
              <div className="flex h-60 items-center justify-center border border-dashed border-neutral-300 bg-[#fafafa]">

                <ImageIcon className="h-10 w-10 text-neutral-300" />

              </div>
            )}

            <label className="inline-flex cursor-pointer items-center">

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImageUpload
                }
                className="hidden"
              />

              <div className="flex h-11 items-center justify-center border border-neutral-300 bg-white px-5 font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-neutral-100">

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

          </div>

          {/* CONTENT */}
          <div className="space-y-3">

            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">

              Content

            </label>

            {isPreview ? (
              <div className="prose prose-neutral min-h-[500px] max-w-none border border-neutral-300 bg-white p-8">

                <ReactMarkdown>
                  {
                    formData.content
                  }
                </ReactMarkdown>

              </div>
            ) : (
              <textarea
                value={
                  formData.content
                }
                onChange={(
                  e,
                ) =>
                  setFormData({
                    ...formData,
                    content:
                      e.target
                        .value,
                  })
                }
                className="min-h-[500px] w-full border border-neutral-300 bg-[#fafafa] p-6 outline-none focus:border-black"
              />
            )}

          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between border-t border-neutral-200 pt-8">

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={
                  formData.is_published
                }
                onChange={(
                  e,
                ) =>
                  setFormData({
                    ...formData,
                    is_published:
                      e.target
                        .checked,
                  })
                }
              />

              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">

                Publish Immediately

              </span>

            </label>

            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">

              Markdown supported

            </span>

          </div>

        </form>

      </div>
    </div>
  );
}