"use client";

import {
  useState,
  type FormEvent,
} from "react";

import {
  Loader2,
  Upload,
  FileText,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";

import { Input } from "@/components/ui/input";

import { settingsApi } from "@/lib/api/settings";

/* =========================================================
   COMPONENT
========================================================= */

export default function CvUploadForm() {
  const [loading, setLoading] =
    useState(false);

  const [file, setFile] =
    useState<File | null>(null);

  /* =========================================================
     FILE CHANGE
  ========================================================= */

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) return;

    if (
      selectedFile.type !==
      "application/pdf"
    ) {
      toast.error(
        "Only PDF files are allowed.",
      );

      return;
    }

    setFile(selectedFile);
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleUpload = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const form =
      e.currentTarget;

    if (!file) {
      toast.error(
        "Please select a CV file.",
      );

      return;
    }

    try {
      setLoading(true);

      const cloudName =
        process.env
          .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      const uploadPreset =
        process.env
          .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (
        !cloudName ||
        !uploadPreset
      ) {
        throw new Error(
          "Cloudinary environment variables are missing.",
        );
      }

      /* =====================================================
         CLOUDINARY UPLOAD
      ===================================================== */

      const formData =
        new FormData();

      formData.append(
        "file",
        file,
      );

      formData.append(
        "upload_preset",
        uploadPreset,
      );

      /*
       IMPORTANT:
       Use IMAGE upload endpoint for PDFs
       Cloudinary handles PDFs better there.
      */

      const uploadResponse =
        await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

      const uploadData =
        await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadData?.error
            ?.message ||
            "Cloudinary upload failed.",
        );
      }

      /* =====================================================
         FORCE DOWNLOAD URL
      ===================================================== */

      const downloadUrl =
        uploadData.secure_url.replace(
          "/upload/",
          "/upload/fl_attachment/",
        );

      /* =====================================================
         SAVE URL IN DATABASE
      ===================================================== */

      await settingsApi.updateResume(
        {
          resume_url:
            downloadUrl,
        },
      );

      toast.success(
        "CV uploaded successfully.",
      );

      setFile(null);

      form.reset();

    } catch (error) {
      console.error(
        "CV_UPLOAD_ERROR:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Upload failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <Card className="border-neutral-200 bg-white">
      <CardContent className="p-8">
        <div className="mb-8 space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
            Resume Management
          </p>

          <h2 className="font-mono text-2xl font-bold uppercase tracking-tight">
            Upload_CV
          </h2>

          <p className="text-sm text-neutral-500">
            Upload your latest CV as a PDF.
          </p>
        </div>

        <form
          onSubmit={handleUpload}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="cv">
              CV File (PDF)
            </Label>

            <Input
              id="cv"
              type="file"
              accept=".pdf"
              onChange={
                handleFileChange
              }
              disabled={loading}
              className="cursor-pointer"
            />
          </div>

          {file && (
            <div className="flex items-center gap-3 border border-neutral-200 bg-neutral-50 p-4">
              <FileText className="h-5 w-5 text-neutral-500" />

              <div className="flex-1 overflow-hidden">
                <p className="truncate font-mono text-xs">
                  {file.name}
                </p>

                <p className="text-xs text-neutral-500">
                  {(
                    file.size /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  MB
                </p>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={
              loading || !file
            }
            className="h-11 rounded-none border border-black bg-black px-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white hover:bg-neutral-800"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload CV
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}