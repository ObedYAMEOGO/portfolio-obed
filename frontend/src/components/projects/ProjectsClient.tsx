// components/projects/ProjectsClient.tsx  ← client component, handles pagination

"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Project } from "@/types";
import ProjectCard from "@/components/projects/ProjectCard";

const PROJECTS_PER_PAGE = 6;

// Projects created within this many days are considered "new"
const NEW_THRESHOLD_DAYS = 14;

function isRecentlyAdded(created_at?: string | null): boolean {
  if (!created_at) return false;
  const age = Date.now() - new Date(created_at).getTime();
  return age < NEW_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;
}

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE) || 1;
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * PROJECTS_PER_PAGE;
  const paginatedProjects = projects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

  const goTo = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (projects.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="py-32 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-neutral-600">No projects yet</p>
          <p className="mt-1 text-xs text-neutral-400">Check back soon for new work</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

      {/* GRID */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:gap-x-10 lg:gap-y-12">
        {paginatedProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            isNew={isRecentlyAdded(project.created_at)}
          />
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <nav className="mt-16 flex items-center justify-center gap-2">

          <button
            onClick={() => goTo(safePage - 1)}
            disabled={safePage === 1}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
              safePage === 1
                ? "cursor-not-allowed text-neutral-300"
                : "text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              const active = safePage === page;
              return (
                <button
                  key={page}
                  onClick={() => goTo(page)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
                    active
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => goTo(safePage + 1)}
            disabled={safePage === totalPages}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
              safePage === totalPages
                ? "cursor-not-allowed text-neutral-300"
                : "text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900"
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>

        </nav>
      )}
    </main>
  );
}