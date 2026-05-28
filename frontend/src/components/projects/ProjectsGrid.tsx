"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { Project } from "@/types";

interface ProjectsGridProps {
  projects: Project[];
}

const MOBILE_LIMIT = 3;

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [expanded, setExpanded] = useState(false);

  // On mobile: show 3 by default, all when expanded.
  // On md+: always show all (handled via CSS visibility trick below).
  const hiddenCount = projects.length - MOBILE_LIMIT;

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={
              // Hide cards beyond the limit on mobile only when not expanded
              index >= MOBILE_LIMIT && !expanded
                ? "hidden md:block"
                : "block"
            }
          >
            <ProjectCard project={project} index={index} />
          </div>
        ))}
      </div>

      {/* Show more / Show less — only visible on mobile when there are hidden cards */}
      {hiddenCount > 0 && (
        <div className="mt-8 flex justify-center md:hidden">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-600 shadow-sm transition-all duration-200 hover:border-neutral-400 hover:text-neutral-900 active:scale-95"
          >
            {expanded ? (
              <>
                Show less
                <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Show {hiddenCount} more
                <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}