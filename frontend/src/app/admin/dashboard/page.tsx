"use client";

import { useEffect, useState } from "react";
import {
  Database,
  LogOut,
  Users,
  Activity,
  Mail,
  FileText,
  Plus,
} from "lucide-react";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import api, { blogApi } from "@/lib/api";
import { Project, Subscriber, Lead } from "@/types";

import { Button } from "@/components/ui/button";
import CreateProjectForm from "@/components/admin/CreateProjectForm";
import SubscriberTable from "@/components/admin/SubscriberTable";
import LeadsTable from "@/components/admin/LeadsTable";
import BlogTable from "@/components/admin/BlogTable";

import { toast } from "sonner";
import Link from "next/link";

interface DashboardStats {
  projects: number;
  subscribers: number;
  leads: number;
  posts: number;
  status: string;
}

export default function AdminDashboard() {
  const router = useRouter();

  const { isLoaded, isSignedIn, user } = useUser();

  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    subscribers: 0,
    leads: 0,
    posts: 0,
    status: "Active",
  });

  const ADMIN_EMAIL = "obedyameogo4@gmail.com";

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push("/");
      } else {
        const userEmail = user?.primaryEmailAddress?.emailAddress;

        if (userEmail !== ADMIN_EMAIL) {
          toast.error("Access Denied: Admin Privileges Required");
          router.push("/");
        } else {
          fetchDashboardStats();
        }
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  const fetchDashboardStats = async () => {
    try {
      const [projectRes, subRes, leadsRes, postsRes] = await Promise.all([
        api.get<Project[]>("/projects"),
        api.get<Subscriber[]>("/subscribers"),
        api.get<Lead[]>("/leads"),
        blogApi.adminGetAll(),
      ]);

      setStats({
        projects: projectRes.data.length,
        subscribers: subRes.data.length,
        leads: leadsRes.data.length,
        posts: postsRes.data.length,
        status: "Active",
      });
    } catch (error) {
      console.error("Sync_Error:", error);

      setStats((prev) => ({
        ...prev,
        status: "Degraded",
      }));

      toast.error("System Sync Failed: Check Backend Connection");
    }
  };

  if (
    !isLoaded ||
    !isSignedIn ||
    user?.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL
  ) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-[#050505] mt-16">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* HEADER */}
        <div className="mb-16 flex flex-col items-start justify-between gap-8 border-b border-neutral-300 pb-10 md:flex-row md:items-end">
          <div className="space-y-2">
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              <Activity className="h-3 w-3" />
              Root Access Verified
            </div>

            <h1 className="font-mono text-4xl font-bold uppercase tracking-tighter">
              Command_Center
            </h1>

            <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-400">
              Operator: {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* BLOG BUTTON */}
            <Button
              asChild
              className="
                h-11
                rounded-none
                border
                border-[#050505]
                bg-[#050505]
                px-6
                font-mono
                text-[10px]
                uppercase
                tracking-[0.18em]
                text-[#f5f5f5]
                transition-all
                duration-300
                hover:border-neutral-800
                hover:bg-neutral-800
                active:scale-[0.98]
              "
            >
              <Link href="/admin/dashboard/blog/new">
                <Plus className="mr-2 h-4 w-4" />
                Initialize_New_Post
              </Link>
            </Button>

            {/* CREATE PROJECT */}
            <CreateProjectForm onRefresh={fetchDashboardStats} />

            {/* SIGN OUT */}
            <SignOutButton>
              <Button
                variant="outline"
                className="
                  h-11
                  rounded-none
                  border-neutral-300
                  bg-transparent
                  px-6
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-widest
                  transition-all
                  hover:border-red-200
                  hover:bg-red-50
                  hover:text-red-600
                "
              >
                <LogOut className="mr-2 h-4 w-4" />
                Terminate_Session
              </Button>
            </SignOutButton>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="mb-20 grid grid-cols-1 gap-0 border border-neutral-300 bg-neutral-300 shadow-sm md:grid-cols-2 lg:grid-cols-4">
          <DashboardStatCard
            title="Total_Projects"
            value={stats.projects.toString()}
            icon={<Database className="h-4 w-4" />}
          />

          <DashboardStatCard
            title="Research_Logs"
            value={stats.posts.toString()}
            icon={<FileText className="h-4 w-4" />}
          />

          <DashboardStatCard
            title="Identity_Nodes"
            value={stats.subscribers.toString()}
            icon={<Users className="h-4 w-4" />}
          />

          <DashboardStatCard
            title="Inbound_Leads"
            value={stats.leads.toString()}
            icon={<Mail className="h-4 w-4" />}
          />
        </div>

        {/* TABLES */}
        <div className="grid grid-cols-1 gap-20">
          {/* BLOG */}
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <h2 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-[#050505]">
                Research_Repository
              </h2>

              <div className="h-px grow bg-neutral-300" />
            </div>

            <div className="overflow-hidden rounded-none border border-neutral-300 bg-white shadow-sm">
              <BlogTable />
            </div>
          </div>

          {/* LEADS */}
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <h2 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-[#050505]">
                Inbound_Communications
              </h2>

              <div className="h-px grow bg-neutral-300" />
            </div>

            <div className="overflow-hidden rounded-none border border-neutral-300 bg-white shadow-sm">
              <LeadsTable />
            </div>
          </div>

          {/* SUBSCRIBERS */}
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <h2 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-[#050505]">
                Subscriber_Registry
              </h2>

              <div className="h-px grow bg-neutral-300" />
            </div>

            <div className="overflow-hidden rounded-none border border-neutral-300 bg-white shadow-sm">
              <SubscriberTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardStatCard({
  title,
  value,
  icon,
  statusColor = "text-[#050505]",
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  statusColor?: string;
}) {
  return (
    <div className="group flex flex-col gap-6 bg-[#f5f5f5] p-8 transition-colors hover:bg-white">
      <div className="flex items-center justify-between text-neutral-400">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] transition-colors group-hover:text-neutral-900">
          {title}
        </span>

        <div className="border border-neutral-200 p-2 transition-colors group-hover:border-neutral-900">
          {icon}
        </div>
      </div>

      <div
        className={`font-mono text-4xl font-bold tracking-tighter ${statusColor}`}
      >
        {value}
      </div>
    </div>
  );
}