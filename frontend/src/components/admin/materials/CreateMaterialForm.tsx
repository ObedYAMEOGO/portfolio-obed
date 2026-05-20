"use client";

import {
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import {
  MaterialCreate,
  VideoContext,
} from "@/types";

import { materialsApi } from "@/lib/api/materials";

import { Button } from "@/components/ui/button";

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
  CheckCircle2
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

export default function CreateMaterialForm({
  onRefresh,
}: CreateMaterialFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);

  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);

  const isVideo = formData.material_type === "VIDEO";

  /* =========================================================
     AUTOMATED YOUTUBE DETECTOR & THUMBNAIL PARSER
  ========================================================= */
  useEffect(() => {
    if (!isVideo || formData.videoSourceType !== "YOUTUBE" || !formData.resource_url) {
      return;
    }

    const url = formData.resource_url;
    let thumbnail = "";
    let detectedContext: VideoContext = "SINGLE";

    // 1. Check for standard YouTube Playlists
    if (url.includes("list=")) {
      const playlistId = url.split("list=")[1]?.split("&")[0];
      if (playlistId) {
        detectedContext = "PLAYLIST";
        // YouTube doesn't expose a clean default playlist cover URL pattern, fallback to standard icon image node
        thumbnail = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop";
      }
    } else {
      // 2. Parse Single Video Links (watch?v= or youtu.be/)
      if (url.includes("youtube.com/watch?v=")) {
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
    }

    if (thumbnail) {
      setFormData((prev) => ({
        ...prev,
        thumbnail_url: thumbnail,
        video_context: detectedContext,
      }));
    }
  }, [formData.resource_url, isVideo, formData.videoSourceType]);

  /* =========================================================
     SLUG GENERATOR
  ========================================================= */
  const generateSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  /* =========================================================
     CLOUDINARY PIPELINE EXECUTOR
  ========================================================= */
  const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!cloudinaryCloudName || !uploadPreset) {
      throw new Error("Cloudinary environment variables missing configuration parameters.");
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/auto/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed inside cloud node system.");
    }

    const json = (await response.json()) as { secure_url: string };
    return json.secure_url;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingFile(true);
      const url = await uploadToCloudinary(file);

      setFormData((prev) => ({
        ...prev,
        resource_url: url,
      }));

      toast.success("Resource file committed successfully to Cloudinary matrix.");
    } catch (error) {
      console.error(error);
      toast.error("Resource binary file upload failed.");
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

      setFormData((prev) => ({
        ...prev,
        thumbnail_url: url,
      }));

      toast.success("Thumbnail cover image successfully attached to asset block.");
    } catch (error) {
      console.error(error);
      toast.error("Thumbnail upload failed.");
    } finally {
      setIsUploadingThumb(false);
    }
  };

  /* =========================================================
     SUBMIT CONTAINER STRATAGEM
  ========================================================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.resource_url) {
      toast.error("Form transmission denied: Title and resource target pointers must be defined.");
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

        toast.success("Educational material node deployed successfully.");
        setFormData(INITIAL_STATE);
        setIsOpen(false);
        onRefresh?.();
      } catch (error) {
        console.error(error);
        toast.error("Failed to compile and post core payload node.");
      }
    });
  };

  const previewLabel = useMemo(() => {
    if (formData.material_type === "VIDEO") {
      return formData.video_context === "PLAYLIST" ? "Playlist" : "Video";
    }
    return "Document";
  }, [formData.material_type, formData.video_context]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="h-11 rounded-none border border-black bg-black px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white hover:bg-neutral-800"
      >
        <Plus className="mr-2 h-4 w-4" /> Add_Material
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-neutral-300 bg-[#f5f5f5] p-8 shadow-xl">
            {/* CLOSE ACTION BUTTON */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-6 top-6 text-neutral-400 transition-colors hover:text-black"
            >
              <X className="h-5 w-5" />
            </button>

            {/* HEADER INTERFACE LABEL */}
            <div className="mb-8 space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-400">
                Material Hub Registry Terminal
              </span>
              <h2 className="font-mono text-xl font-bold uppercase tracking-tight">
                Create_Material_Node
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* COMPONENT STREAM INTERFACE PICKER TYPE */}
              <div className="grid grid-cols-2 gap-4">
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
                  className={`flex h-14 flex-col items-center justify-center gap-1 border p-2 font-mono text-[10px] uppercase tracking-wide transition-colors ${
                    !isVideo
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 bg-white text-neutral-500"
                  }`}
                >
                  <FileText className="h-4 w-4" /> Document_Payload
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
                  className={`flex h-14 flex-col items-center justify-center gap-1 border p-2 font-mono text-[10px] uppercase tracking-wide transition-colors ${
                    isVideo
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 bg-white text-neutral-500"
                  }`}
                >
                  <Video className="h-4 w-4" /> Video_Pipeline
                </button>
              </div>

              {/* DYNAMIC FIELD CONFIGURATORS WHEN VIDEO MODE ACTIVE */}
              {isVideo && (
                <div className="border border-neutral-300 bg-white p-4 space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 block font-bold">
                      Video_Source_Routing //
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, videoSourceType: "YOUTUBE", resource_url: "", thumbnail_url: "" }))}
                        className={`h-9 border text-[10px] font-mono uppercase flex items-center justify-center gap-2 ${formData.videoSourceType === "YOUTUBE" ? "bg-red-50 text-red-600 border-red-500 font-bold" : "bg-neutral-50 border-neutral-200"}`}
                      >
                        <Youtube className="h-4 w-4" /> Stream From YouTube
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, videoSourceType: "UPLOAD", resource_url: "", thumbnail_url: "", video_context: "SINGLE" }))}
                        className={`h-9 border text-[10px] font-mono uppercase flex items-center justify-center gap-2 ${formData.videoSourceType === "UPLOAD" ? "bg-red-50 text-red-600 border-red-500 font-bold" : "bg-neutral-50 border-neutral-200"}`}
                      >
                        <FileVideo className="h-4 w-4" /> Upload Local MP4
                      </button>
                    </div>
                  </div>

                  {formData.videoSourceType === "YOUTUBE" && (
                    <div className="flex flex-col gap-2 pt-2 border-t border-neutral-100">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 block font-bold">
                        YouTube_Context_Configuration //
                      </span>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 font-mono text-[11px] text-neutral-700 cursor-pointer">
                          <input
                            type="radio"
                            name="video_context"
                            checked={formData.video_context === "SINGLE"}
                            onChange={() => setFormData((prev) => ({ ...prev, video_context: "SINGLE" }))}
                            className="accent-black"
                          />
                          Unique Single Video
                        </label>
                        <label className="flex items-center gap-2 font-mono text-[11px] text-neutral-700 cursor-pointer">
                          <input
                            type="radio"
                            name="video_context"
                            checked={formData.video_context === "PLAYLIST"}
                            onChange={() => setFormData((prev) => ({ ...prev, video_context: "PLAYLIST" }))}
                            className="accent-black"
                          />
                          Channel Playlist Tree
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CORE INPUT METRICS FIELDS */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Material Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="h-11 w-full border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Resource Category Namespace</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="h-11 w-full border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">System URI Slug Pointer</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  className="h-11 w-full border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-black"
                />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Description Summary</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-neutral-300 bg-white p-4 text-sm outline-none focus:border-black"
                />
              </div>

              {/* INPUT MATRIX: CONDITIONAL RESOURCE LINKS & UPLOADER DRAWER CORES */}
              {(!isVideo || formData.videoSourceType === "YOUTUBE") ? (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 block">
                    {isVideo ? "YouTube Resource Link / Query Path URI" : "Resource Access Address URL"}
                  </label>
                  <input
                    type="url"
                    required={formData.videoSourceType === "YOUTUBE" || !isVideo}
                    placeholder={isVideo ? "https://www.youtube.com/watch?v=..." : "https://example.com/asset.pdf"}
                    value={formData.resource_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, resource_url: e.target.value }))}
                    className="h-11 w-full border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-black font-mono text-xs"
                  />
                </div>
              ) : null}

              {/* FILE COMMITTAL LAYOUT CONTROLLERS */}
              {(!isVideo || formData.videoSourceType === "UPLOAD") && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                    {isVideo ? "Video Binary Upload (.mp4/.mov)" : "Static Document Stream Payload Upload (.pdf/.zip)"}
                  </label>
                  <label className="flex h-28 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-neutral-300 bg-white transition-colors hover:border-black">
                    {isUploadingFile ? (
                      <Loader2 className="h-5 w-5 animate-spin text-neutral-900" />
                    ) : (
                      <UploadCloud className="h-5 w-5 text-neutral-400" />
                    )}
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-500">
                      {formData.resource_url ? "Swap Uploaded File Node" : "Select Device Binary File"}
                    </span>
                    <input type="file" accept={isVideo ? "video/*" : "*/*"} className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              )}

              {/* COVER ART IMAGE THUMBNAIL INGESTION SYSTEM BLOCK */}
              {(!isVideo || formData.videoSourceType === "UPLOAD") && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Cover Art Image Thumbnail</label>
                  <label className="flex h-28 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-neutral-300 bg-white transition-colors hover:border-black">
                    {isUploadingThumb ? (
                      <Loader2 className="h-5 w-5 animate-spin text-neutral-900" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-neutral-400" />
                    )}
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-500">
                      Upload Custom Static Cover Art
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                  </label>
                </div>
              )}

              {/* CLOUDINARY FILE TELEMETRY VERIFICATION PREVIEW CANVAS NODES */}
              <div className="border border-neutral-200 bg-neutral-100/60 p-4 font-mono text-[11px] space-y-2.5">
                <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-neutral-400" /> Cloudinary_Deployment_Telemetry_Logs
                </span>
                <div className="space-y-1.5 break-all">
                  <div>
                    <span className="text-neutral-500">RESOURCE_URL:</span>{" "}
                    {formData.resource_url ? (
                      <a href={formData.resource_url} target="_blank" rel="noreferrer" className="text-red-600 underline hover:text-red-800">
                        {formData.resource_url}
                      </a>
                    ) : (
                      <span className="text-neutral-400 italic">NULL (Awaiting asset pipeline attachment...)</span>
                    )}
                  </div>
                  <div>
                    <span className="text-neutral-500">THUMBNAIL_URL:</span>{" "}
                    {formData.thumbnail_url ? (
                      <a href={formData.thumbnail_url} target="_blank" rel="noreferrer" className="text-red-600 underline hover:text-red-800">
                        {formData.thumbnail_url}
                      </a>
                    ) : (
                      <span className="text-neutral-400 italic">NULL (Awaiting source metadata extraction loop...)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* TRANSACTION SUBMISSION ACTION ENGINES */}
              <Button
                type="submit"
                disabled={isPending || isUploadingFile || isUploadingThumb}
                className="h-11 w-full rounded-none border border-black bg-black font-mono text-[10px] uppercase tracking-[0.2em] text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  `Create_${previewLabel}`
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}