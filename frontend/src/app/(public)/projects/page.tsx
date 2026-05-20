import { Project } from "@/types";

import ProjectCard from "@/components/ProjectCard";

export const revalidate = 3600;

const API_URL =
  process.env.INTERNAL_API_URL ||
  "http://backend:8000/api/v1";

async function getProjects(): Promise<Project[]> {
  const res = await fetch(
    `${API_URL}/projects`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch projects"
    );
  }

  return res.json();
}

export default async function ProjectsPage() {

  let projects: Project[] = [];

  try {
    projects = await getProjects();
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] selection:bg-neutral-200">

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">

        {/* HEADER */}
        <header className="mb-20 space-y-4 border-b border-neutral-200 pb-12">

          <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-400">
            02 // Project_Database
          </h2>

          <h1 className="font-serif text-5xl font-bold tracking-tighter text-[#050505] md:text-6xl">
            Understanding and Engineering AI Systems
          </h1>

          <p className="mt-4 max-w-2xl font-serif text-lg leading-relaxed text-neutral-600">
            Focus on Building Production-Grade ML &
            Intelligent Systems.
          </p>

        </header>

        {projects.length === 0 ? (

          <div className="border border-dashed border-neutral-300 py-32 text-center">

            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              NO_PROJECTS_FOUND_IN_SYSTEM
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}

          </div>

        )}

      </main>
    </div>
  );
}