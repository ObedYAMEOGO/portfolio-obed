import { Project } from "@/types";

import {
  ExternalLink,
  Github,
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <article
      className="
        group
        relative
        flex
        flex-col
        border
        border-neutral-300
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-md
      "
    >
      {/* CONTENT */}
      <div className="grow space-y-6 p-10">
        {/* TITLE */}
        <h3 className="text-2xl font-bold tracking-tight text-[#050505]">
          {project.title}
        </h3>

        {/* DESCRIPTION */}
        <p className="max-w-2xl text-[17px] leading-relaxed text-neutral-600">
          {project.description}
        </p>

        {/* TECH STACK */}
        <div className="flex flex-wrap gap-2 pt-2">
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className="
                border
                border-neutral-200
                px-3
                py-1.5
                font-mono
                text-[11px]
                uppercase
                tracking-wide
                text-neutral-500
              "
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      {(project.github_url ||
        project.live_url) && (
        <div className="flex w-full border-t border-neutral-300">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-3
                bg-[#050505]
                py-4
                font-mono
                text-[10px]
                uppercase
                tracking-[0.18em]
                text-white
                transition-colors
                hover:bg-neutral-800
              "
            >
              <Github className="h-4 w-4" />

              GitHub
            </a>
          )}

          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-3
                border-l
                border-neutral-300
                bg-white
                py-4
                font-mono
                text-[10px]
                uppercase
                tracking-[0.18em]
                text-[#050505]
                transition-colors
                hover:bg-neutral-50
              "
            >
              <ExternalLink className="h-4 w-4" />

              Live Demo
            </a>
          )}
        </div>
      )}
    </article>
  );
}