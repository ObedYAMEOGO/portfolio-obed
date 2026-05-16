"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, X, Loader2, FileText, Video, FolderOpen, UploadCloud, ImageIcon } from "lucide-react";

interface CreateMaterialFormProps {
  onRefresh: () => void;
}

export default function CreateMaterialForm({ onRefresh }: CreateMaterialFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);

  // Core Data State Ingestion Matrix
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    material_type: "DOCUMENT", // DOCUMENT or VIDEO
    video_context: "NONE",     // SINGLE, PLAYLIST, or NONE
    category: "General AI",
    resource_url: "",
    thumbnail_url: "",
    is_published: true,
  });

  // Automated YouTube Thumbnail Extraction Hook (Only for Video types)
  useEffect(() => {
    if (formData.material_type !== "VIDEO" || !formData.resource_url) return;

    const url = formData.resource_url;
    let computedThumbnail = "";

    if (url.includes("list=")) {
      const playlistId = url.split("list=")[1]?.split("&")[0];
      if (playlistId) {
        computedThumbnail = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop`;
      }
    } else if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      if (videoId) computedThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) computedThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    if (computedThumbnail) {
      setFormData((prev) => ({ ...prev, thumbnail_url: computedThumbnail }));
    }
  }, [formData.resource_url, formData.material_type]);

  // Generate clean slug strings automatically during typing
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  // Cloudinary Core Upload Function
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your_preset";

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/auto/upload`,
      { method: "POST", body: uploadData }
    );

    if (!res.ok) throw new Error("Cloudinary rejected pipeline handshake");
    const data = await res.json();
    return data.secure_url;
  };

  // Handler for Document Files (.pdf, .md, etc)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingFile(true);
      const secureUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, resource_url: secureUrl }));
      toast.success("Document asset securely cached on Cloudinary.");
    } catch (err) {
      console.error(err);
      toast.error("Document upload failed. Verify configurations.");
    } finally {
      setIsUploadingFile(false);
    }
  };

  // Handler for Optional Document Thumbnail Images
  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingThumb(true);
      const secureUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, thumbnail_url: secureUrl }));
      toast.success("Custom thumbnail image bound to document.");
    } catch (err) {
      console.error(err);
      toast.error("Thumbnail upload failed.");
    } finally {
      setIsUploadingThumb(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.resource_url) {
      toast.error("Missing Parameters: Title and Resource destination are mandatory.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        ...formData,
        video_context: formData.material_type === "DOCUMENT" ? "NONE" : formData.video_context,
      };

      await api.post("/admin/materials", payload);
      toast.success("AI Training Asset Registered Successfully");
      
      setFormData({
        title: "",
        slug: "",
        description: "",
        material_type: "DOCUMENT",
        video_context: "NONE",
        category: "General AI",
        resource_url: "",
        thumbnail_url: "",
        is_published: true,
      });
      setIsOpen(false);
      onRefresh();
    } catch (err) {
      console.error("Material_Ingestion_Error:", err);
      toast.error("Pipeline Rejected Data Payload");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        className="h-11 rounded-none border border-[#050505] bg-white px-6 font-mono text-[10px] uppercase tracking-widest text-[#050505] transition-all duration-300 hover:bg-neutral-100 active:scale-[0.98]"
      >
        <Plus className="mr-2 h-4 w-4" /> Add_Learning_Material
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl rounded-none border border-neutral-300 bg-[#f5f5f5] p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-6 top-6 text-neutral-400 hover:text-black transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-8 space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-400">
                Data Injection Node
              </span>
              <h2 className="font-mono text-xl font-bold uppercase tracking-tight">
                Initialize_AI_Material
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
              
              {/* ASSET TYPE SWITCHES */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, material_type: "DOCUMENT", video_context: "NONE", resource_url: "", thumbnail_url: "" }))}
                  className={`flex h-14 flex-col items-center justify-center gap-1 border border-neutral-300 p-2 transition-colors uppercase text-[10px] tracking-wide font-bold ${
                    formData.material_type === "DOCUMENT" ? "bg-black text-white border-black" : "bg-white text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Notes / Documents
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, material_type: "VIDEO", video_context: "SINGLE", resource_url: "", thumbnail_url: "" }))}
                  className={`flex h-14 flex-col items-center justify-center gap-1 border border-neutral-300 p-2 transition-colors uppercase text-[10px] tracking-wide font-bold ${
                    formData.material_type === "VIDEO" ? "bg-black text-white border-black" : "bg-white text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  <Video className="h-4 w-4" />
                  Media / Videos
                </button>
              </div>

              {/* DYNAMIC VIDEO CONTEXT ARRAYS */}
              {formData.material_type === "VIDEO" && (
                <div className="border border-neutral-300 bg-white p-4 space-y-3 animate-fadeIn">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Video Deployment Context:</p>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-bold tracking-tight">
                      <input
                        type="radio"
                        name="video_context"
                        value="SINGLE"
                        checked={formData.video_context === "SINGLE"}
                        onChange={() => setFormData((prev) => ({ ...prev, video_context: "SINGLE" }))}
                        className="accent-black"
                      />
                      Single Lecture
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-bold tracking-tight">
                      <input
                        type="radio"
                        name="video_context"
                        value="PLAYLIST"
                        checked={formData.video_context === "PLAYLIST"}
                        onChange={() => setFormData((prev) => ({ ...prev, video_context: "PLAYLIST" }))}
                        className="accent-black"
                      />
                      <FolderOpen className="h-3 w-3 inline text-neutral-500" /> Full Course Playlist
                    </label>
                  </div>
                </div>
              )}

              {/* FIELDS SUMMARY GRID */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="uppercase tracking-wide text-neutral-400 font-bold">Asset_Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full border border-neutral-300 bg-white p-3 font-sans text-sm outline-none focus:border-black"
                    placeholder="e.g., Transformers Architecture Guide"
                  />
                </div>
                <div className="space-y-2">
                  <label className="uppercase tracking-wide text-neutral-400 font-bold">Category_Node</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-neutral-300 bg-white p-3 font-sans text-sm outline-none focus:border-black"
                    placeholder="e.g., Deep Learning, NLP"
                  />
                </div>
              </div>

              {/* INPUT FIELDS / PICKERS MECHANICS BASE ON ASSET FORMAT */}
              {formData.material_type === "DOCUMENT" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* DOCUMENT FILE SLOT */}
                  <div className="space-y-2">
                    <label className="uppercase tracking-wide text-neutral-400 font-bold">Source Document (.pdf, .md, .docx)</label>
                    <div className="relative flex h-24 w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-neutral-300 bg-white hover:border-black transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.md,.docx,.txt"
                        onChange={handleFileChange}
                        disabled={isUploadingFile}
                        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      {isUploadingFile ? (
                        <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                      ) : (
                        <>
                          <UploadCloud className="h-5 w-5 text-neutral-400 mb-1" />
                          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Select File</span>
                        </>
                      )}
                    </div>
                    {formData.resource_url && (
                      <p className="font-mono text-[9px] text-green-600 truncate bg-green-50 border border-green-200 p-1.5">
                        Uploaded File path loaded.
                      </p>
                    )}
                  </div>

                  {/* THUMBNAIL IMAGE SLOT FOR DOCUMENTS */}
                  <div className="space-y-2">
                    <label className="uppercase tracking-wide text-neutral-400 font-bold">Document Cover Thumbnail (Optional)</label>
                    <div className="relative flex h-24 w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-neutral-300 bg-white hover:border-black transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        disabled={isUploadingThumb}
                        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      {isUploadingThumb ? (
                        <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                      ) : (
                        <>
                          <ImageIcon className="h-5 w-5 text-neutral-400 mb-1" />
                          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Select Cover Image</span>
                        </>
                      )}
                    </div>
                    {formData.thumbnail_url && (
                      <p className="font-mono text-[9px] text-green-600 truncate bg-green-50 border border-green-200 p-1.5">
                        Cover Image parsed.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="uppercase tracking-wide text-neutral-400 font-bold">YouTube Stream / Playlist URL</label>
                  <input
                    type="url"
                    required={formData.material_type === "VIDEO"}
                    value={formData.resource_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, resource_url: e.target.value }))}
                    className="w-full border border-neutral-300 bg-white p-3 font-sans text-sm outline-none focus:border-black"
                    placeholder={formData.video_context === "PLAYLIST" ? "https://youtube.com/playlist?list=..." : "https://youtube.com/watch?v=..."}
                  />
                </div>
              )}

              {/* GLOBAL METADATA PREVIEW REFERENCE CONTAINER */}
              {formData.thumbnail_url && (
                <div className="border border-neutral-300 p-2 bg-white space-y-1">
                  <p className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Bound Cover Reference:</p>
                  <p className="font-mono text-[10px] text-neutral-600 truncate">{formData.thumbnail_url}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="uppercase tracking-wide text-neutral-400 font-bold">Description Summary</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-neutral-300 bg-white p-3 font-sans text-sm outline-none focus:border-black"
                  placeholder="Provide technical synopsis of the source files..."
                />
              </div>

              {/* ACTION TRIGGER BUTTON */}
              <div className="flex justify-end border-t border-neutral-300 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || isUploadingFile || isUploadingThumb}
                  className="h-11 rounded-none border border-black bg-black px-8 uppercase tracking-widest text-white hover:bg-neutral-800 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transmitting...
                    </>
                  ) : (
                    "Confirm_Asset_Injection"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}