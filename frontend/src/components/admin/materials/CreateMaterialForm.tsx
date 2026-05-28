"use client";

import {
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import { MaterialCreate, VideoContext } from "@/types";
import { materialsApi } from "@/lib/api/materials";
import { toast } from "sonner";

import {
  Plus,
  X,
  Loader2,
  FileText,
  Video,
  UploadCloud,
  ImageIcon,
  Youtube,
  FileVideo,
  CheckCircle2,
} from "lucide-react";

interface CreateMaterialFormProps {
  onRefresh?: () => void;
}

type FormState = MaterialCreate & {
  videoSourceType: "YOUTUBE" | "UPLOAD";
};

const INITIAL_STATE: FormState = {
  title: "",
  slug: "",
  description: "",
  material_type: "DOCUMENT",
  video_context: "NONE",
  category: "General AI",
  resource_url: "",
  thumbnail_url: "",
  is_published: true,
  videoSourceType: "YOUTUBE",
};

export default function CreateMaterialForm({ onRefresh }: CreateMaterialFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);

  const isVideo = formData.material_type === "VIDEO";

  /* =========================================================
     YOUTUBE THUMBNAIL AUTO-DETECTOR
  ========================================================= */
  useEffect(() => {
    if (!isVideo || formData.videoSourceType !== "YOUTUBE" || !formData.resource_url) return;

    const url = formData.resource_url;
    let thumbnail = "";
    let detectedContext: VideoContext = "SINGLE";

    if (url.includes("list=")) {
      const playlistId = url.split("list=")[1]?.split("&")[0];
      if (playlistId) {
        detectedContext = "PLAYLIST";
        thumbnail = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop";
      }
    } else if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      if (videoId) {
        thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        detectedContext = "SINGLE";
      }
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) {
        thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        detectedContext = "SINGLE";
      }
    }

    if (thumbnail) {
      setFormData((prev) => ({ ...prev, thumbnail_url: thumbnail, video_context: detectedContext }));
    }
  }, [formData.resource_url, isVideo, formData.videoSourceType]);

  /* =========================================================
     SLUG GENERATOR
  ========================================================= */
  const generateSlug = (value: string) =>
    value.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({ ...prev, title, slug: generateSlug(title) }));
  };

  /* =========================================================
     CLOUDINARY UPLOAD
  ========================================================= */
  const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!cloudinaryCloudName || !uploadPreset) throw new Error("Cloudinary config missing.");
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/auto/upload`,
      { method: "POST", body: data }
    );
    if (!response.ok) throw new Error("Upload failed.");
    const json = (await response.json()) as { secure_url: string };
    return json.secure_url;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingFile(true);
      const url = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, resource_url: url }));
      toast.success("File uploaded successfully.");
    } catch (error) {
      console.error(error);
      toast.error("File upload failed.");
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingThumb(true);
      const url = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, thumbnail_url: url }));
      toast.success("Thumbnail uploaded successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Thumbnail upload failed.");
    } finally {
      setIsUploadingThumb(false);
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.resource_url) {
      toast.error("Title and resource URL are required.");
      return;
    }
    startTransition(async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { videoSourceType, ...apiPayload } = formData;
        const payload: MaterialCreate = {
          ...apiPayload,
          video_context: isVideo ? formData.video_context : "NONE",
        };
        await materialsApi.create(payload);
        toast.success("Material created successfully.");
        setFormData(INITIAL_STATE);
        setIsOpen(false);
        onRefresh?.();
      } catch (error) {
        console.error(error);
        toast.error("Failed to create material.");
      }
    });
  };

  const previewLabel = useMemo(() => {
    if (formData.material_type === "VIDEO") {
      return formData.video_context === "PLAYLIST" ? "Playlist" : "Video";
    }
    return "Document";
  }, [formData.material_type, formData.video_context]);

  /* =========================================================
     FIELD HELPERS
  ========================================================= */
  const inputClass = "h-11 w-full rounded-lg border border-neutral-200 bg-white px-4 text-[14px] text-neutral-900 outline-none transition-colors focus:border-neutral-400 placeholder:text-neutral-300";
  const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400";

  return (
    <>
      {/* TRIGGER */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-full bg-neutral-900 px-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-neutral-700"
      >
        <Plus className="h-3.5 w-3.5" />
        New Material
      </button>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-8 shadow-2xl">

            {/* CLOSE */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <X className="h-4 w-4" />
            </button>

            {/* HEADER */}
            <div className="mb-8 space-y-1">
              <span className={labelClass}>New Material</span>
              <h2 className="text-xl font-semibold tracking-[-0.01em] text-neutral-900">
                Create {previewLabel}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* TYPE TOGGLE */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      material_type: "DOCUMENT",
                      video_context: "NONE",
                      resource_url: "",
                      thumbnail_url: "",
                    }))
                  }
                  className={`flex h-12 items-center justify-center gap-2 rounded-xl border text-[12px] font-semibold transition-all ${
                    !isVideo
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Document
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      material_type: "VIDEO",
                      video_context: "SINGLE",
                      resource_url: "",
                      thumbnail_url: "",
                    }))
                  }
                  className={`flex h-12 items-center justify-center gap-2 rounded-xl border text-[12px] font-semibold transition-all ${
                    isVideo
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400"
                  }`}
                >
                  <Video className="h-4 w-4" />
                  Video
                </button>
              </div>

              {/* VIDEO OPTIONS */}
              {isVideo && (
                <div className="animate-in fade-in space-y-4 rounded-xl border border-neutral-200 bg-neutral-50 p-5 duration-200">

                  <p className={labelClass}>Video source</p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, videoSourceType: "YOUTUBE", resource_url: "", thumbnail_url: "" }))}
                      className={`flex h-10 items-center justify-center gap-2 rounded-lg border text-[11px] font-semibold transition-all ${
                        formData.videoSourceType === "YOUTUBE"
                          ? "border-red-200 bg-red-50 text-red-600"
                          : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300"
                      }`}
                    >
                      <Youtube className="h-3.5 w-3.5" />
                      YouTube
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, videoSourceType: "UPLOAD", resource_url: "", thumbnail_url: "", video_context: "SINGLE" }))}
                      className={`flex h-10 items-center justify-center gap-2 rounded-lg border text-[11px] font-semibold transition-all ${
                        formData.videoSourceType === "UPLOAD"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300"
                      }`}
                    >
                      <FileVideo className="h-3.5 w-3.5" />
                      Upload MP4
                    </button>
                  </div>

                  {formData.videoSourceType === "YOUTUBE" && (
                    <div className="space-y-2 border-t border-neutral-200 pt-4">
                      <p className={labelClass}>Context</p>
                      <div className="flex gap-6">
                        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-neutral-700">
                          <input
                            type="radio"
                            name="video_context"
                            checked={formData.video_context === "SINGLE"}
                            onChange={() => setFormData((prev) => ({ ...prev, video_context: "SINGLE" }))}
                            className="accent-neutral-900"
                          />
                          Single video
                        </label>
                        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-neutral-700">
                          <input
                            type="radio"
                            name="video_context"
                            checked={formData.video_context === "PLAYLIST"}
                            onChange={() => setFormData((prev) => ({ ...prev, video_context: "PLAYLIST" }))}
                            className="accent-neutral-900"
                          />
                          Playlist
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TITLE + CATEGORY */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className={labelClass}>Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Introduction to RAG"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="General AI"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* SLUG */}
              <div className="space-y-2">
                <label className={labelClass}>Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  className={inputClass}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <label className={labelClass}>Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="A short description of the material…"
                  className="w-full rounded-lg border border-neutral-200 bg-white p-4 text-[14px] text-neutral-900 outline-none transition-colors focus:border-neutral-400 placeholder:text-neutral-300 resize-none"
                />
              </div>

              {/* RESOURCE URL */}
              {(!isVideo || formData.videoSourceType === "YOUTUBE") && (
                <div className="animate-in fade-in space-y-2 duration-200">
                  <label className={labelClass}>
                    {isVideo ? "YouTube URL" : "Resource URL"}
                  </label>
                  <input
                    type="url"
                    required={formData.videoSourceType === "YOUTUBE" || !isVideo}
                    placeholder={isVideo ? "https://youtube.com/watch?v=…" : "https://example.com/file.pdf"}
                    value={formData.resource_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, resource_url: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              )}

              {/* FILE UPLOAD */}
              {(!isVideo || formData.videoSourceType === "UPLOAD") && (
                <div className="animate-in fade-in space-y-2 duration-200">
                  <label className={labelClass}>
                    {isVideo ? "Upload video (.mp4 / .mov)" : "Upload file (.pdf / .zip)"}
                  </label>
                  <label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 transition-colors hover:border-neutral-400">
                    {isUploadingFile ? (
                      <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
                    ) : (
                      <UploadCloud className="h-5 w-5 text-neutral-400" />
                    )}
                    <span className="text-[11px] font-medium text-neutral-400">
                      {formData.resource_url ? "Replace file" : "Click to upload"}
                    </span>
                    <input
                      type="file"
                      accept={isVideo ? "video/*" : "*/*"}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}

              {/* THUMBNAIL UPLOAD */}
              {(!isVideo || formData.videoSourceType === "UPLOAD") && (
                <div className="animate-in fade-in space-y-2 duration-200">
                  <label className={labelClass}>Thumbnail image</label>
                  <label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 transition-colors hover:border-neutral-400">
                    {isUploadingThumb ? (
                      <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-neutral-400" />
                    )}
                    <span className="text-[11px] font-medium text-neutral-400">
                      {formData.thumbnail_url ? "Replace image" : "Click to upload"}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                  </label>
                </div>
              )}

              {/* URL PREVIEW */}
              <div className="space-y-2.5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Asset preview
                  </span>
                </div>

                <div className="space-y-1.5 break-all text-[12px]">
                  <div className="flex gap-2">
                    <span className="shrink-0 text-neutral-400">Resource:</span>
                    {formData.resource_url ? (
                      <a href={formData.resource_url} target="_blank" rel="noreferrer" className="text-neutral-700 underline underline-offset-2 hover:text-neutral-900">
                        {formData.resource_url}
                      </a>
                    ) : (
                      <span className="italic text-neutral-300">Not set</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <span className="shrink-0 text-neutral-400">Thumbnail:</span>
                    {formData.thumbnail_url ? (
                      <a href={formData.thumbnail_url} target="_blank" rel="noreferrer" className="text-neutral-700 underline underline-offset-2 hover:text-neutral-900">
                        {formData.thumbnail_url}
                      </a>
                    ) : (
                      <span className="italic text-neutral-300">Not set</span>
                    )}
                  </div>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isPending || isUploadingFile || isUploadingThumb}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  `Create ${previewLabel}`
                )}
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  );
}