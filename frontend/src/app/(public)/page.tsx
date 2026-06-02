/* app/page.tsx
   GORDON: Updated to use server-only settings API for SSR */

import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

import {
  ArrowRight,
  GraduationCap,
  Download,
} from "lucide-react";

import ProjectCard from "@/components/projects/ProjectCard";
import CapabilityMatrix from "@/components/sections/SkillMatrix";
import ManifestoSection from "@/components/sections/ManifestoSection";

import { Project } from "@/types";
import { getProjects } from "@/lib/server-api";
/* GORDON: Import server-only settings API instead of client API */
import { getSettingsServer } from "@/lib/api/settings-server";

export const revalidate = 3600;

/* =========================================================
   PROJECTS
========================================================= */

async function ProjectsSection() {
  let projects: Project[] = [];

  try {
    const data = await getProjects();
    projects = data.slice(0, 4);
  } catch (error) {
    console.error("PROJECT_FETCH_ERROR:", error);
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {projects.length > 0 ? (
        projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))
      ) : (
        <div className="col-span-2 py-20 text-center">
          <p className="text-sm text-neutral-400">No projects available</p>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="space-y-4">
          <div className="aspect-16/10 w-full animate-pulse rounded-xl bg-neutral-100" />
          <div className="h-4 w-2/3 animate-pulse rounded-full bg-neutral-100" />
          <div className="h-3 w-full animate-pulse rounded-full bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function HomePage() {
  let resumeUrl = "";

  /* GORDON: Use server-side settings API which connects via Docker network.
     Race against a 3s timeout so a slow Railway response never blocks the page. */
  const settings = await Promise.race([
    getSettingsServer(),
    new Promise<null>((res) => setTimeout(() => res(null), 3000)),
  ]);
  resumeUrl = settings?.resume_url || "";

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5] text-[#050505] selection:bg-neutral-200">
      <main className="relative flex flex-col items-center overflow-hidden px-4 pb-14 pt-16 sm:px-6 md:pt-20">

        {/* GRID BACKGROUND */}
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-size-[40px_40px]" />

        {/* =========================================================
            HERO
        ========================================================= */}

        <section className="flex min-h-[58vh] w-full max-w-7xl items-center">
          <div className="grid w-full grid-cols-1 items-center gap-14 lg:grid-cols-[60%_40%]">

            {/* LEFT */}
            <div className="flex flex-col items-center space-y-6 text-center lg:items-start lg:text-left">

              {/* Eyebrow — rounded pill */}
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-neutral-200
                  bg-white
                  px-5
                  py-2
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-neutral-500
                  shadow-sm
                "
              >
                A Machine Learning Engineer
              </div>

              {/* Title */}
              <h1
                className="
                  max-w-3xl
                  text-[2rem]
                  font-semibold
                  leading-[1.05]
                  tracking-[-0.02em]
                  text-neutral-900
                  sm:text-[2.5rem]
                  md:text-[3rem]
                "
              >
                Focused on building production grade ML &amp; intelligent systems.
              </h1>

              {/* Sub-label */}
              <span className="block text-sm font-medium uppercase tracking-[0.3em] text-neutral-400">
                Research · Engineering · Deployment
              </span>

              {/* CTAs */}
              <div className="flex flex-col items-center gap-3 pt-1 sm:flex-row lg:items-start">

                {/* PROJECTS */}
                <Link
                  href="/projects"
                  prefetch
                  className="
                    inline-flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-neutral-900
                    px-8
                    text-[12px]
                    font-semibold
                    uppercase
                    tracking-widest
                    text-white
                    transition-colors
                    duration-200
                    hover:bg-neutral-700
                    sm:w-auto
                  "
                >
                  View My Projects
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                {/* CV */}
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="
                      inline-flex
                      h-11
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-full
                      border
                      border-neutral-300
                      bg-white
                      px-8
                      text-[12px]
                      font-semibold
                      uppercase
                      tracking-widest
                      text-neutral-700
                      transition-colors
                      duration-200
                      hover:border-neutral-400
                      hover:bg-neutral-50
                      sm:w-auto
                    "
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download My CV
                  </a>
                )}

              </div>
            </div>

            {/* RIGHT — IMAGE (layout & sizes unchanged) */}
            <div className="relative flex justify-center">
              <div className="relative flex aspect-square w-70 items-center justify-center sm:w-[320px] md:w-[107.5] lg:h-125 lg:w-125">

                {/* GLOW */}
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-neutral-200/90 via-white to-neutral-300/80 blur-3xl" />

                {/* PROFILE */}
                <div className="relative z-10 h-full w-full overflow-hidden rounded-none">
                  <Image
                    src="/profile-obed.png"
                    alt="Obed Yameogo"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="pointer-events-none select-none object-cover"
                  />

                  {/* MOBILE TAG */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/95 px-4 py-4 backdrop-blur-md md:hidden">
                    <div className="text-center">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-neutral-900">
                        Obed Yameogo
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-neutral-600">
                        Machine Learning Engineer, PhD Scholar.
                      </p>
                    </div>
                  </div>
                </div>

                {/* FLOATING CARD */}
                <div
                  className="
                    absolute
                    -left-6
                    top-3
                    z-20
                    hidden
                    max-w-55
                    flex-col
                    gap-2
                    rounded-xl
                    border
                    border-white/40
                    bg-white/80
                    p-5
                    backdrop-blur-md
                    md:flex
                    lg:-left-20
                  "
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Profile
                  </p>

                  <h3 className="text-xl font-semibold leading-snug tracking-tight text-neutral-900">
                    Obed Yameogo
                  </h3>

                  <div className="mb-2 flex flex-col gap-2 border-t border-neutral-200 pt-3">
                    <p className="flex items-center gap-2 text-[11px] font-medium text-neutral-600">
                      <GraduationCap className="h-4 w-4 text-neutral-400" />
                     Machine Learning Engineer
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* MANIFESTO */}
        <ManifestoSection />

        {/* CAPABILITIES */}
        <section className="w-full max-w-7xl">
          <CapabilityMatrix />
        </section>

        {/* QUOTE TICKER */}
        <section className="relative w-full overflow-hidden border-y border-neutral-200 bg-white/60 py-4 backdrop-blur-sm">

          <div className="flex whitespace-nowrap animate-[ticker_22s_linear_infinite]">

            <div className="mx-10 flex items-center gap-4 text-neutral-700">
              <span className="text-sm tracking-[0.25em] text-neutral-400">
                — CAL NEWPORT
              </span>

              <p className="text-sm font-medium sm:text-base">
                &quot;Clarity about what matters provides clarity about what does not.&quot;
              </p>
            </div>

            {/* duplicate for seamless infinite loop */}
            <div className="mx-10 flex items-center gap-4 text-neutral-700">
              <span className="text-sm tracking-[0.25em] text-neutral-400">
                — CAL NEWPORT
              </span>

              <p className="text-sm font-medium sm:text-base">
                &quot;Clarity about what matters provides clarity about what does not.&quot;
              </p>
            </div>

            <div className="mx-10 flex items-center gap-4 text-neutral-700">
              <span className="text-sm tracking-[0.25em] text-neutral-400">
                — CAL NEWPORT
              </span>

              <p className="text-sm font-medium sm:text-base">
                &quot;Clarity about what matters provides clarity about what does not.&quot;
              </p>
            </div>

          </div>

        </section>

        {/* PROJECTS */}
        <section className="mt-16 w-full max-w-7xl space-y-10">

          <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 md:flex-row md:items-end">

            <div className="space-y-2">
              <span className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Selected Works
              </span>

              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-neutral-900">
                Projects
              </h2>
            </div>

            <Link
              href="/projects"
              prefetch
              className="
                group
                inline-flex
                items-center
                gap-2
                text-[12px]
                font-semibold
                uppercase
                tracking-widest
                text-neutral-500
                transition-colors
                duration-150
                hover:text-neutral-900
              "
            >
              All Projects
              <ArrowRight className="h-3.5 w-3.5 text-[15px] text-neutral-500 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

          </div>

          <Suspense fallback={<ProjectsSkeleton />}>
            <ProjectsSection />
          </Suspense>

        </section>

      </main>
    </div>
  );
}