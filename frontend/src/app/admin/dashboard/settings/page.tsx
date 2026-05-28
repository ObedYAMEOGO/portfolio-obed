import Link from "next/link";

import {
  ArrowLeft,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import CvUploadForm from "@/components/admin/settings/CvUploadForm";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#050505]">
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-6 border-b border-neutral-300 pb-8 md:flex-row md:items-center md:justify-between">

          <div className="space-y-3">

            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">

              <Settings className="h-3.5 w-3.5" />

              System Settings

            </div>

            <h1 className="font-mono text-4xl font-bold uppercase tracking-tight">

              Resume_Manager

            </h1>

            <p className="max-w-2xl text-sm text-neutral-500">
              Upload and manage your downloadable CV.
            </p>

          </div>

          {/* BACK BUTTON */}
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-none border-neutral-300 bg-white px-6 font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-neutral-100"
          >
            <Link href="/admin/dashboard">

              <ArrowLeft className="mr-2 h-4 w-4" />

              Back To Dashboard

            </Link>
          </Button>

        </div>

        {/* FORM */}
        <CvUploadForm />

      </div>
    </div>
  );
}