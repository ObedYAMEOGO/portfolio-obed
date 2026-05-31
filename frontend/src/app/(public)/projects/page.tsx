// app/projects/page.tsx  ← server component, fully static

import { Project } from "@/types";
import ProjectsClient from "@/components/projects/ProjectsClient";

export const revalidate = 3600;

const API_URL = process.env.INTERNAL_API_URL;

if (!API_URL) {
  throw new Error("INTERNAL_API_URL is missing");
}

async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_URL}/projects`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* HEADER */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Selected Work
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Projects
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-neutral-500">
            Production-grade machine learning systems, intelligent
            infrastructure, applied AI tooling, and engineering research.
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <ProjectsClient projects={projects} />

    </div>
  );
}