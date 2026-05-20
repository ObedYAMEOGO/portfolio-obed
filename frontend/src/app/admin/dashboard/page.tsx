import {
  auth,
  currentUser,
} from "@clerk/nextjs/server";

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
} from "lucide-react";

import { SignOutButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

import CreateProjectForm from "@/components/admin/projects/CreateProjectForm";

import CreateMaterialForm from "@/components/admin/materials/CreateMaterialForm";

import ProjectsTable from "@/components/admin/projects/ProjectsTable";

import PostsTable from "@/components/admin/posts/PostsTable";

import MaterialsTable from "@/components/admin/materials/MaterialsTable";

import LeadsTable from "@/components/admin/leads/LeadsTable";

import SubscribersTable from "@/components/admin/subscribers/SubscribersTable";

import {
  getDashboardStats,
} from "@/lib/server-admin-api";
import type {
  DashboardStats,
} from "@/types";

export const dynamic =
  "force-dynamic";

const ADMIN_EMAIL =
  "obedyameogo4@gmail.com";

export default async function AdminDashboardPage() {
  const { userId } =
    await auth();

  if (!userId) {
    redirect("/");
  }

  const user =
    await currentUser();

  const email =
    user?.primaryEmailAddress
      ?.emailAddress;

  if (email !== ADMIN_EMAIL) {
    redirect("/");
  }

  let stats: DashboardStats =
    {
      total_projects: 0,
      active_subscribers: 0,
      total_leads: 0,
      total_articles: 0,
      total_materials: 0,
      system_status:
        "DEGRADED",
    };

  try {
    stats =
      await getDashboardStats();
  } catch (error) {
    console.error(
      "Dashboard stats fetch failed:",
      error,
    );
  }

  const isOperational =
    stats.system_status ===
    "Operational";

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-24 text-[#050505]">
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* HEADER */}
        <div className="mb-16 flex flex-col gap-8 border-b border-neutral-300 pb-10 lg:flex-row lg:items-end lg:justify-between">

          {/* LEFT */}
          <div className="space-y-3">

            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">

              <Activity className="h-3 w-3 animate-pulse" />

              Root Access Verified

            </div>

            <h1 className="font-mono text-4xl font-bold uppercase tracking-tighter md:text-5xl">

              Command_Center

            </h1>

            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-neutral-400">

              <Radio
                className={`h-3 w-3 ${
                  isOperational
                    ? "animate-pulse text-green-600"
                    : "text-red-500"
                }`}
              />

              <span>
                Telemetry:

                <span
                  className={
                    isOperational
                      ? "ml-2 font-bold text-green-600"
                      : "ml-2 font-bold text-red-500"
                  }
                >
                  {
                    stats.system_status
                  }
                </span>

              </span>

            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap items-center gap-3">

            <Button
              asChild
              className="h-11 rounded-none border border-black bg-black px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white hover:bg-neutral-800"
            >
              <Link href="/admin/dashboard/posts/new">

                <Plus className="mr-2 h-4 w-4" />

                New Post

              </Link>
            </Button>

            <CreateProjectForm />

            <CreateMaterialForm />

            <SignOutButton>

              <Button
                variant="outline"
                className="h-11 rounded-none border border-neutral-300 bg-white px-6 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-100"
              >

                <LogOut className="mr-2 h-4 w-4" />

                Terminate Session

              </Button>

            </SignOutButton>

          </div>

        </div>

        {/* STATS */}
        <div className="mb-20 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <StatCard
            title="Projects"
            value={
              stats.total_projects
            }
            icon={
              <Database className="h-4 w-4" />
            }
          />

          <StatCard
            title="Posts"
            value={
              stats.total_articles
            }
            icon={
              <FileText className="h-4 w-4" />
            }
          />

          <StatCard
            title="Subscribers"
            value={
              stats.active_subscribers
            }
            icon={
              <Users className="h-4 w-4" />
            }
          />

          <StatCard
            title="Leads"
            value={
              stats.total_leads
            }
            icon={
              <Mail className="h-4 w-4" />
            }
          />

          <StatCard
            title="Materials"
            value={
              stats.total_materials
            }
            icon={
              <BookOpen className="h-4 w-4" />
            }
          />

        </div>

        {/* TABLES */}
        <div className="space-y-16">

          <PostsTable />

          <ProjectsTable />

          <MaterialsTable />

          <LeadsTable />

          <SubscribersTable />

        </div>

      </div>
    </div>
  );
}

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
    <div className="border border-neutral-300 bg-white p-6 transition-all hover:border-black">

      <div className="mb-4 flex items-center justify-between">

        <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">

          {title}

        </span>

        {icon}

      </div>

      <div className="font-mono text-4xl font-bold">

        {value}

      </div>

    </div>
  );
}




// // src/app/admin/dashboard/page.tsx

// import {
//   auth,
//   currentUser,
// } from "@clerk/nextjs/server";

// import { redirect } from "next/navigation";

// import Link from "next/link";

// import {
//   Database,
//   Users,
//   Mail,
//   FileText,
//   Activity,
//   Radio,
//   Plus,
//   LogOut,
//   BookOpen,
// } from "lucide-react";

// import { SignOutButton } from "@clerk/nextjs";

// import { Button } from "@/components/ui/button";

// import CreateProjectForm from "@/components/admin/CreateProjectForm";

// import CreateMaterialForm from "@/components/admin/CreateMaterialForm";

// import SubscriberTable from "@/components/admin/SubscriberTable";

// import LeadsTable from "@/components/admin/LeadsTable";

// import BlogTable from "@/components/admin/BlogTable";

// import MaterialsTable from "@/components/admin/MaterialsTable";

// import {
//   getDashboardStats,
//   DashboardStats,
// } from "@/lib/server-api";

// export const dynamic =
//   "force-dynamic";

// const ADMIN_EMAIL =
//   "obedyameogo4@gmail.com";

// /* =========================================================
//    PAGE
// ========================================================= */

// export default async function AdminDashboardPage() {
//   const { userId } = await auth();

//   if (!userId) {
//     redirect("/");
//   }

//   const user =
//     await currentUser();

//   const email =
//     user?.primaryEmailAddress
//       ?.emailAddress;

//   if (email !== ADMIN_EMAIL) {
//     redirect("/");
//   }

//   let stats: DashboardStats = {
//     total_projects: 0,
//     active_subscribers: 0,
//     total_leads: 0,
//     total_articles: 0,
//     total_materials: 0,
//     system_status: "DEGRADED",
//   };

//   try {
//     stats =
//       await getDashboardStats();
//   } catch (error) {
//     console.error(
//       "Dashboard stats fetch failed:",
//       error,
//     );
//   }

//   const isOperational =
//     stats.system_status ===
//     "Operational";

//   return (
//     <div className="min-h-screen bg-[#f5f5f5] pt-24 text-[#050505]">
//       <div className="mx-auto max-w-7xl px-6 py-12">

//         {/* =========================================================
//             HEADER
//         ========================================================= */}

//         <div className="mb-16 flex flex-col gap-8 border-b border-neutral-300 pb-10 lg:flex-row lg:items-end lg:justify-between">

//           {/* LEFT */}
//           <div className="space-y-3">

//             <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">

//               <Activity className="h-3 w-3 animate-pulse" />

//               Root Access Verified

//             </div>

//             <h1 className="font-mono text-4xl font-bold uppercase tracking-tighter md:text-5xl">

//               Command_Center

//             </h1>

//             <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-neutral-400">

//               <Radio
//                 className={`h-3 w-3 ${
//                   isOperational
//                     ? "animate-pulse text-green-600"
//                     : "text-red-500"
//                 }`}
//               />

//               <span>
//                 Telemetry:{" "}

//                 <span
//                   className={
//                     isOperational
//                       ? "font-bold text-green-600"
//                       : "font-bold text-red-500"
//                   }
//                 >
//                   {stats.system_status}
//                 </span>
//               </span>

//             </div>

//           </div>

//           {/* =========================================================
//               ACTIONS
//           ========================================================= */}

//           <div className="flex flex-wrap items-center gap-3">

//             {/* NEW POST */}
//             <Button
//               asChild
//               className="h-11 rounded-none border border-black bg-black px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white hover:bg-neutral-800"
//             >
//               <Link href="/admin/dashboard/blog/new">

//                 <Plus className="mr-2 h-4 w-4" />

//                 New Post

//               </Link>
//             </Button>

//             {/* NEW PROJECT */}
//             <CreateProjectForm />

//             {/* NEW MATERIAL */}
//             <CreateMaterialForm />

//             {/* LOGOUT */}
//             <SignOutButton>

//               <Button
//                 variant="outline"
//                 className="h-11 rounded-none border border-neutral-300 bg-white px-6 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-100"
//               >

//                 <LogOut className="mr-2 h-4 w-4" />

//                 Terminate Session

//               </Button>

//             </SignOutButton>

//           </div>

//         </div>

//         {/* =========================================================
//             STATS
//         ========================================================= */}

//         <div className="mb-20 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

//           <StatCard
//             title="Projects"
//             value={stats.total_projects}
//             icon={
//               <Database className="h-4 w-4" />
//             }
//           />

//           <StatCard
//             title="Posts"
//             value={stats.total_articles}
//             icon={
//               <FileText className="h-4 w-4" />
//             }
//           />

//           <StatCard
//             title="Subscribers"
//             value={
//               stats.active_subscribers
//             }
//             icon={
//               <Users className="h-4 w-4" />
//             }
//           />

//           <StatCard
//             title="Leads"
//             value={stats.total_leads}
//             icon={
//               <Mail className="h-4 w-4" />
//             }
//           />

//           <StatCard
//             title="Materials"
//             value={
//               stats.total_materials
//             }
//             icon={
//               <BookOpen className="h-4 w-4" />
//             }
//           />

//         </div>

//         {/* =========================================================
//             TABLES
//         ========================================================= */}

//         <div className="space-y-16">

//           <BlogTable />

//           <MaterialsTable />

//           <LeadsTable />

//           <SubscriberTable />

//         </div>

//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    STAT CARD
// ========================================================= */

// function StatCard({
//   title,
//   value,
//   icon,
// }: {
//   title: string;
//   value: number;
//   icon: React.ReactNode;
// }) {
//   return (
//     <div className="border border-neutral-300 bg-white p-6 transition-all hover:border-black">

//       <div className="mb-4 flex items-center justify-between">

//         <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">

//           {title}

//         </span>

//         {icon}

//       </div>

//       <div className="font-mono text-4xl font-bold">

//         {value}

//       </div>

//     </div>
//   );
// }