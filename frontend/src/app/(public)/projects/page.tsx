// app/projects/page.tsx

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Project } from "@/types";
import ProjectCard from "@/components/projects/ProjectCard";

export const revalidate = 3600;

/* =========================================================
   CONFIG
========================================================= */

const API_URL =
  process.env.INTERNAL_API_URL || "http://backend:8000/api/v1";

const PROJECTS_PER_PAGE = 6;

/* =========================================================
   FETCH
========================================================= */

async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_URL}/projects`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("Failed to fetch projects");

  return res.json();
}

/* =========================================================
   PAGE
========================================================= */

interface ProjectsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  let projects: Project[] = [];

  try {
    projects = await getProjects();
  } catch (err) {
    console.error(err);
  }

  /* ── Pagination ── */
  const totalProjects = projects.length;
  const totalPages = Math.ceil(totalProjects / PROJECTS_PER_PAGE) || 1;
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * PROJECTS_PER_PAGE;
  const paginatedProjects = projects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* =========================================================
          HEADER — matches blog/page.tsx exactly
      ========================================================= */}

      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Selected Work
          </p>
          <h1 className="text-3xl sm:text-4x font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Projects
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-neutral-500">
            Production-grade machine learning systems, intelligent
            infrastructure, applied AI tooling, and engineering research.
          </p>
        </div>
      </div>

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

        {/* ── Empty state ── */}
        {paginatedProjects.length === 0 ? (
          <div className="py-32 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
              <svg
                className="h-8 w-8 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-neutral-600">No projects yet</p>
            <p className="mt-1 text-xs text-neutral-400">Check back soon for new work</p>
          </div>
        ) : (
          <>
            {/* ── Grid ── */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:gap-x-10 lg:gap-y-12">
              {paginatedProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <nav className="mt-16 flex items-center justify-center gap-2">

                <Link
                  href={safePage > 1 ? `/projects?page=${safePage - 1}` : "#"}
                  aria-disabled={safePage === 1}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                    safePage === 1
                      ? "pointer-events-none cursor-not-allowed text-neutral-300"
                      : "text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    const active = safePage === page;
                    return (
                      <Link
                        key={page}
                        href={`/projects?page=${page}`}
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
                          active
                            ? "bg-neutral-900 text-white"
                            : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                        }`}
                      >
                        {page}
                      </Link>
                    );
                  })}
                </div>

                <Link
                  href={safePage < totalPages ? `/projects?page=${safePage + 1}` : "#"}
                  aria-disabled={safePage === totalPages}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                    safePage === totalPages
                      ? "pointer-events-none cursor-not-allowed text-neutral-300"
                      : "text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900"
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>

              </nav>
            )}
          </>
        )}
      </main>
    </div>
  );
}