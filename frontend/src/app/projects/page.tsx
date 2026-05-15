"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Project } from "@/types";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f5] selection:bg-neutral-200">

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* HEADER SECTION */}
        <header className="mb-20 space-y-4 border-b border-neutral-200 pb-12">
          <h2 className="text-[10px] font-mono text-neutral-400 uppercase tracking-[0.4em]">
            02 // Project_Database
          </h2>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-[#050505] font-serif">
            Understanding and Engineering AI Systems
          </h1>
          <p className="text-neutral-600 mt-4 max-w-2xl font-serif text-lg leading-relaxed">
            Focus on Building Production-Grade ML & Intelligent Systems.
          </p>
        </header>

        {loading ? (
          /* SKELETONS - Harmonisés avec le design des cartes */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="flex flex-col border border-neutral-200 bg-white animate-pulse"
              >
                <div className="p-10 space-y-6 grow">
                  <div className="h-8 bg-neutral-100 w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-neutral-100 w-full" />
                    <div className="h-4 bg-neutral-100 w-5/6" />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <div className="h-8 bg-neutral-100 w-16" />
                    <div className="h-8 bg-neutral-100 w-16" />
                  </div>
                </div>
                <div className="flex border-t border-neutral-200 h-14 bg-neutral-50" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {projects.length === 0 ? (
              <div className="text-center py-32 border border-dashed border-neutral-300">
                <p className="text-neutral-400 font-mono text-xs uppercase tracking-widest">
                  NO_PROJECTS_FOUND_IN_SYSTEM
                </p>
              </div>
            ) : (
              /* GRID - 2 colonnes pour un rendu optimal */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}