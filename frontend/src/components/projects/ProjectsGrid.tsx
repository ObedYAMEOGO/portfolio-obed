// components/ProjectsGrid.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { Project } from "@/types";

interface ProjectsGridProps {
  projects: Project[];
}

const MOBILE_LIMIT = 3;

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [expanded, setExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const hiddenCount = projects.length - MOBILE_LIMIT;

  // Fade in grid on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={gridRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1)"
      }}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={
              index >= MOBILE_LIMIT && !expanded
                ? "hidden md:block"
                : "block"
            }
            style={{
              animation: isVisible ? "slideIn 0.5s ease-out forwards" : "none",
              animationDelay: `${index * 100}ms`,
              opacity: 0,
              transform: "translateY(20px)"
            }}
          >
            <ProjectCard project={project} index={index} />
          </div>
        ))}
      </div>

      {hiddenCount > 0 && (
        <div className="mt-8 flex justify-center md:hidden">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-all duration-300 hover:bg-neutral-50 hover:scale-105 active:scale-95 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {expanded ? (
              <>
                Show less
                <ChevronUp className="h-4 w-4 transition-transform duration-300" />
              </>
            ) : (
              <>
                Show {hiddenCount} more {hiddenCount === 1 ? "project" : "projects"}
                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </>
            )}
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}