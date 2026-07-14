// src/app/admin/dashboard/page.tsx

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

import {
  Database,
  Users,
  Mail,
  FileText,
  Activity,
  Radio,
  Plus,
  LogOut,
  BookOpen,
  Settings,
} from "lucide-react";

import { SignOutButton } from "@clerk/nextjs";

import ProjectsTable from "@/components/admin/projects/ProjectsTable";
import PostsTable from "@/components/admin/posts/PostsTable";
import MaterialsTable from "@/components/admin/materials/MaterialsTable";
import LeadsTable from "@/components/admin/leads/LeadsTable";
import SubscribersTable from "@/components/admin/subscribers/SubscribersTable";
import UsersTable from "@/components/admin/users/UsersTable";

import { getDashboardStats } from "@/lib/server-api";
import type { DashboardStats } from "@/types";
import CommentsTable from "@/components/admin/comments/CommentsTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  // Read from env — set ADMIN_EMAIL in Vercel environment variables.
  // No NEXT_PUBLIC_ prefix needed: this is a server component, so the
  // value never reaches the client bundle.
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!email || !adminEmail || email !== adminEmail) redirect("/");

  let stats: DashboardStats = {
    total_projects: 0,
    active_subscribers: 0,
    total_leads: 0,
    total_articles: 0,
    total_materials: 0,
    system_status: "DEGRADED",
  };

  try {
    stats = await getDashboardStats();
  } catch (error) {
    console.error("Dashboard stats fetch failed:", error);
  }

  const { q } = await searchParams;
  const isOperational = stats.system_status === "Operational";

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 text-neutral-900">
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* =========================================================
            HEADER
        ========================================================= */}

        <div className="mb-12 flex flex-col gap-6 border-b border-neutral-200 pb-10 lg:flex-row lg:items-end lg:justify-between">

          {/* LEFT */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
              <Activity className="h-3 w-3 animate-pulse" />
              Admin Dashboard
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.02em] text-neutral-900 md:text-4xl">
              Command Center
            </h1>

            <div className="flex items-center gap-2 text-[12px] text-neutral-500">
              <Radio
                className={`h-3 w-3 ${
                  isOperational
                    ? "animate-pulse text-green-500"
                    : "text-red-400"
                }`}
              />
              <span>
                System status:{" "}
                <span
                  className={`font-semibold ${
                    isOperational ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {stats.system_status}
                </span>
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/dashboard/posts/new"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-neutral-900 px-5 text-[11px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
            >
              <Plus className="h-3.5 w-3.5" />
              New Post
            </Link>

            <Link
              href="/admin/dashboard/projects/new"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-neutral-900 px-5 text-[11px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
            >
              <Plus className="h-3.5 w-3.5" />
              New Project
            </Link>

            <Link
              href="/admin/dashboard/materials/new"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-neutral-900 px-5 text-[11px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
            >
              <Plus className="h-3.5 w-3.5" />
              New Material
            </Link>

            <Link
              href="/admin/dashboard/settings"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 text-[11px] font-semibold uppercase tracking-widest text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Link>

            <SignOutButton>
              <button className="inline-flex h-9 items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 text-[11px] font-semibold uppercase tracking-widest text-neutral-600 transition-colors hover:border-red-200 hover:text-red-600">
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </SignOutButton>
          </div>

        </div>

        {/* =========================================================
            STATS
        ========================================================= */}

        <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
          <StatCard title="Projects"    value={stats.total_projects}     icon={<Database className="h-4 w-4" />} />
          <StatCard title="Posts"       value={stats.total_articles}     icon={<FileText className="h-4 w-4" />} />
          <StatCard title="Subscribers" value={stats.active_subscribers} icon={<Users className="h-4 w-4" />} />
          <StatCard title="Leads"       value={stats.total_leads}        icon={<Mail className="h-4 w-4" />} />
          <StatCard title="Materials"   value={stats.total_materials}    icon={<BookOpen className="h-4 w-4" />} />
        </div>

        {/* =========================================================
            TABLES
        ========================================================= */}

        <div className="space-y-12">
          <PostsTable />
          <ProjectsTable />
          <MaterialsTable />
          <CommentsTable />
          <LeadsTable />
          <UsersTable searchQuery={q ?? ""} />
          <SubscribersTable />
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        rounded-xl
        border
        border-neutral-200
        bg-white
        p-5
        transition-all
        duration-200
        hover:border-neutral-400
        hover:shadow-sm
      "
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
          {title}
        </span>
        <span className="text-neutral-400">{icon}</span>
      </div>

      <p className="text-3xl font-semibold tracking-tight text-neutral-900">
        {value}
      </p>
    </div>
  );
}