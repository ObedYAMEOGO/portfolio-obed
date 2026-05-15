"use client";

import { motion } from "framer-motion";
import { Project } from "@/types";
import { ExternalLink, Github } from "lucide-react";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
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
        hover:shadow-md
      "
    >
      {/* CONTENT AREA */}
      <div className="flex-grow space-y-6 p-10">
        {/* TITLE */}
        <h3 className="font-serif text-2xl font-bold tracking-tight text-[#050505]">
          {project.title}
        </h3>

        {/* DESCRIPTION */}
        <p className="max-w-2xl font-serif text-[18px] leading-relaxed text-neutral-600">
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
                bg-transparent
                px-3
                py-1.5
                font-mono
                text-[12px]
                text-neutral-500
              "
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* BOTTOM ACTIONS - Full Width Row */}
      <div className="flex w-full border-t border-neutral-300">
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
            className="
              flex flex-1 items-center justify-center gap-3 
              bg-[#050505] py-4
              font-mono text-[11px] uppercase tracking-widest text-white 
              transition-colors hover:bg-neutral-800
            "
          >
            <Github className="h-4 w-4" />
            GitHub Link
          </a>
        )}

        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noreferrer"
            className="
              flex flex-1 items-center justify-center gap-3 
              bg-white py-4
              font-mono text-[11px] uppercase tracking-widest text-[#050505] 
              border-l border-neutral-300
              transition-colors hover:bg-neutral-50
            "
          >
            <ExternalLink className="h-4 w-4" />
            Live Demo
          </a>
        )}
      </div>
    </motion.div>
  );
}