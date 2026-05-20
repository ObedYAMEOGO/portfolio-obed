// src/app/admin/dashboard/leads/page.tsx

import LeadsTable from "@/components/admin/leads/LeadsTable";

import Link from "next/link";

import {
  ArrowLeft,
} from "lucide-react";

export default function LeadsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-24">

      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-12 space-y-3 border-b border-neutral-300 pb-8">

          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400 hover:text-black"
          >
            <ArrowLeft className="h-3 w-3" />
            Dashboard
          </Link>

          <h1 className="font-mono text-4xl font-bold uppercase tracking-tight">
            Leads
          </h1>

        </div>

        <LeadsTable />

      </div>

    </div>
  );
}