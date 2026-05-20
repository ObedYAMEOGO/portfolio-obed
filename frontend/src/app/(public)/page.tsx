// app/page.tsx

import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

import { ArrowRight, GraduationCap } from "lucide-react";

import ProjectCard from "@/components/ProjectCard";
import CapabilityMatrix from "@/components/sections/SkillMatrix";
import ManifestoSection from "@/components/sections/ManifestoSection";

import { Button } from "@/components/ui/button";

import { Project } from "@/types";
import { getProjects } from "@/lib/server-api";

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
        projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))
      ) : (
        <div className="border border-dashed border-neutral-300 bg-white py-20 text-center">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-neutral-400">
            No_Projects_Available
          </p>
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
        <div
          key={item}
          className="h-56 animate-pulse border border-neutral-200 bg-neutral-100"
        />
      ))}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5] text-[#050505] selection:bg-neutral-200">
      <main className="relative flex flex-col items-center overflow-hidden px-4 pb-14 pt-16 sm:px-6 md:pt-20">
        {/* GRID BACKGROUND */}
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-size-[40px_40px]" />

        {/* HERO */}
        <section className="flex min-h-[58vh] w-full max-w-7xl items-center">
          <div className="grid w-full grid-cols-1 items-center gap-14 lg:grid-cols-[60%_40%]">
            {/* LEFT */}
            <div className="flex flex-col items-center space-y-6 text-center lg:items-start lg:text-left">
              <div className="inline-flex items-center gap-2 border border-neutral-300 bg-white px-5 py-2 font-mono text-[10px] uppercase tracking-[0.35em] text-neutral-500 shadow-sm">
                Machine Learning Engineer
              </div>

              <h1 className="max-w-3xl text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.04em] sm:text-[3.5rem] md:text-[5rem]">
                Focused on Building Production-Grade ML & Intelligent Systems.
              </h1>

              <span className="block font-mono text-sm font-bold uppercase tracking-[0.35em] text-neutral-400">
                Research — Engineering — Deployment
              </span>

              <div className="flex flex-col items-center gap-4 pt-1 sm:flex-row lg:items-start">
                <Button
                  asChild
                  size="lg"
                  className="h-11 w-full bg-[#050505] px-8 font-mono text-[10px] uppercase tracking-widest text-[#f5f5f5] hover:bg-neutral-800 sm:w-auto"
                >
                  <Link
                    href="/projects"
                    prefetch={true}
                    className="flex items-center gap-2"
                  >
                    View My Projects
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-11 w-full border-neutral-300 bg-white font-mono text-[10px] uppercase tracking-widest hover:bg-neutral-100 sm:w-auto"
                >
                  <Link href="/admin/dashboard" prefetch={true}>
                    Dashboard
                  </Link>
                </Button>
              </div>
            </div>

            {/* RIGHT */}
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
                      <p className="font-mono text-[12px] font-bold uppercase tracking-[0.25em] text-black">
                        I AM OBED YAMEOGO
                      </p>

                      <p className="mt-1 text-[11px] leading-relaxed text-neutral-700">
                        A PhD Scholar in AI and Machine Learning Engineer.
                      </p>
                    </div>
                  </div>
                </div>

                {/* FLOATING CARD */}
                <div className="absolute -left-6 top-3 z-20 hidden max-w-55 flex-col gap-2 border border-white/40 bg-white/80 p-5 backdrop-blur-md md:flex lg:-left-14">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">
                    Identity_Verified
                  </p>

                  <h3 className="text-2xl font-bold leading-none text-black">
                    Obed Yameogo
                  </h3>

                  <div className="mb-6 flex flex-col gap-2 border-t border-neutral-200 pt-3">
                    <p className="flex items-center gap-2 text-[11px] font-medium text-neutral-700">
                      <GraduationCap className="h-4 w-4 text-neutral-500" />
                      PhD Scholar in AI · MLE
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

        {/* PROJECTS */}
        <section className="mt-16 w-full max-w-7xl space-y-10">
          <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 md:flex-row md:items-end">
            <div className="space-y-3">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-400">
                01 // Selected_Works
              </h2>

              <h3 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Projects
              </h3>
            </div>

            <Button
              asChild
              variant="link"
              className="group p-0 font-mono text-[10px] uppercase tracking-widest text-neutral-900"
            >
              <Link
                href="/projects"
                prefetch={true}
                className="flex items-center gap-2"
              >
                Explore All Projects
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <Suspense fallback={<ProjectsSkeleton />}>
            <ProjectsSection />
          </Suspense>
        </section>
      </main>
    </div>
  );
}