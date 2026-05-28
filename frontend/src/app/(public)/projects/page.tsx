// app/projects/page.tsx

/* eslint-disable react/jsx-no-comment-textnodes */

import Link from "next/link";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Project } from "@/types";

import ProjectCard from "@/components/ProjectCard";

export const revalidate = 3600;

/* =========================================================
   CONFIG
========================================================= */

const API_URL =
  process.env.INTERNAL_API_URL ||
  "http://backend:8000/api/v1";

const PROJECTS_PER_PAGE = 6;

/* =========================================================
   FETCH
========================================================= */

async function getProjects(): Promise<Project[]> {
  const res = await fetch(
    `${API_URL}/projects`,
    {
      next: {
        revalidate: 3600,
      },
    },
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch projects",
    );
  }

  return res.json();
}

/* =========================================================
   PAGE
========================================================= */

interface ProjectsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params =
    await searchParams;

  const currentPage =
    Number(params.page) || 1;

  let projects: Project[] = [];

  try {
    projects = await getProjects();
  } catch (err) {
    console.error(err);
  }

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalProjects =
    projects.length;

  const totalPages =
    Math.ceil(
      totalProjects /
        PROJECTS_PER_PAGE,
    ) || 1;

  const safePage = Math.min(
    Math.max(currentPage, 1),
    totalPages,
  );

  const startIndex =
    (safePage - 1) *
    PROJECTS_PER_PAGE;

  const paginatedProjects =
    projects.slice(
      startIndex,
      startIndex +
        PROJECTS_PER_PAGE,
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f5f5f5] via-[#e8e8e8] to-[#dcdcdc]">
      
      {/* Subtle Background Texture - very light */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        <div className="absolute top-0 -left-1/4 w-1/2 h-96 bg-linear-to-r from-gray-200/40 to-gray-300/40 blur-3xl rounded-full" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-96 bg-linear-to-l from-gray-200/40 to-gray-300/40 blur-3xl rounded-full" />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-32 pt-36">

        {/* =========================================================
            HEADER - Updated with elegant grey tones
        ========================================================= */}

        <header className="mb-24">

          <div className="space-y-6 text-center md:text-left">

            <span
              className="
                inline-block
                font-mono
                text-[10px]
                uppercase
                tracking-[0.35em]
                text-gray-600
                bg-gray-200/60
                px-3
                py-1
                rounded-full
                backdrop-blur-sm
              "
            >
              Selected Work
            </span>

            <h1
              className="
                text-4xl
                font-bold
                tracking-[-0.02em]
                bg-linear-to-r
                from-gray-900
                via-gray-800
                to-gray-700
                bg-clip-text
                text-transparent
                md:text-6xl
              "
            >
              AI Systems &<br />
              Infrastructure
            </h1>

            <p
              className="
                max-w-2xl
                text-[17px]
                leading-relaxed
                text-gray-600
                mx-auto
                md:mx-0
              "
            >
              Production-grade machine
              learning systems,
              intelligent infrastructure,
              applied AI tooling,
              and engineering research.
            </p>

          </div>

        </header>

        {/* =========================================================
            EMPTY STATE - Light theme
        ========================================================= */}

        {paginatedProjects.length ===
        0 ? (

          <div className="py-32 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200/60 backdrop-blur-sm mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No projects yet</p>
            <p className="text-xs text-gray-400 mt-1">Check back soon for new work</p>
          </div>

        ) : (

          <>
            {/* =========================================================
                GRID
            ========================================================= */}

            <div
              className="
                grid
                grid-cols-1
                gap-x-8
                gap-y-12
                md:grid-cols-2
                lg:gap-x-10
                lg:gap-y-16
              "
            >

              {paginatedProjects.map(
                (project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ),
              )}

            </div>

            {/* =========================================================
                PAGINATION - Light theme styling
            ========================================================= */}

            {totalPages > 1 && (

              <nav
                className="
                  mt-24
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                {/* PREVIOUS */}
                <Link
                  href={
                    safePage > 1
                      ? `/projects?page=${
                          safePage -
                          1
                        }`
                      : "#"
                  }
                  aria-disabled={
                    safePage === 1
                  }
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                    safePage === 1
                      ? "pointer-events-none text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>

                {/* PAGE NUMBERS */}
                <div className="flex items-center gap-1">
                  {Array.from({
                    length: totalPages,
                  }).map(
                    (_, index) => {
                      const page =
                        index + 1;

                      const active =
                        safePage ===
                        page;

                      return (
                        <Link
                          key={page}
                          href={`/projects?page=${page}`}
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
                            active
                              ? "bg-linear-to-r from-gray-700 to-gray-900 text-white shadow-md"
                              : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                          }`}
                        >
                          {page}
                        </Link>
                      );
                    },
                  )}
                </div>

                {/* NEXT */}
                <Link
                  href={
                    safePage <
                    totalPages
                      ? `/projects?page=${
                          safePage +
                          1
                        }`
                      : "#"
                  }
                  aria-disabled={
                    safePage ===
                    totalPages
                  }
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                    safePage ===
                    totalPages
                      ? "pointer-events-none text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
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