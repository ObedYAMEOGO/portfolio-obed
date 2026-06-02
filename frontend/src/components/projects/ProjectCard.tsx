// components/ProjectCard.tsx

"use client";

import { Project } from "@/types";
import { ArrowUpRight, Github } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const description = project.description ?? "";
  const techStack = project.tech_stack ?? [];
  const isLong = description.length > 120;
  const preview = isLong && !expanded ? description.slice(0, 120) + "…" : description;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1, rootMargin: "50px" }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
    >
      {/* TOP-RIGHT GEOMETRIC PATTERN */}
      <div className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 opacity-[0.07] transition-opacity duration-300 group-hover:opacity-[0.12] dark:opacity-[0.06] dark:group-hover:opacity-[0.1]">
        <svg viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="56" y="0"  width="28" height="28" fill="#050505" />
          <rect x="84" y="0"  width="28" height="28" fill="#050505" />
          <rect x="84" y="28" width="28" height="28" fill="#050505" />
          <rect x="56" y="56" width="28" height="28" fill="#050505" />
          <rect x="84" y="56" width="28" height="28" fill="#050505" />
          <rect x="84" y="84" width="28" height="28" fill="#050505" />
        </svg>
      </div>

      {/* Hover background wash */}
      <div className="absolute inset-0 bg-neutral-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-neutral-800/40" />

      <div className="relative p-5">

        {/* Eyebrow */}
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 transition-colors duration-200 group-hover:text-neutral-500 dark:text-neutral-500 dark:group-hover:text-neutral-400">
          Project
        </p>

        {/* Title */}
        <h3 className="mb-2 text-[17px] font-semibold leading-snug text-neutral-900 dark:text-white">
          {project.title}
        </h3>

        {/* Description */}
        {description.length > 0 && (
          <p className="mb-4 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            {preview}
            {isLong && (
              <button
                onClick={() => setExpanded(v => !v)}
                className="ml-1 font-medium text-neutral-900 underline-offset-2 hover:underline dark:text-neutral-200"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </p>
        )}

        {/* Tech stack */}
        {techStack.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-1.5">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-medium text-neutral-600 transition-all duration-200 hover:scale-105 hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="mb-4 h-px bg-neutral-100 transition-colors duration-300 group-hover:bg-neutral-200 dark:bg-neutral-800 dark:group-hover:bg-neutral-700" />

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-[12px] font-medium text-white transition-all duration-200 hover:gap-2.5 hover:bg-neutral-700 active:scale-95 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              View live
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}

          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-[12px] font-medium text-neutral-600 transition-all duration-200 hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 active:scale-95 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            >
              <Github className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" />
              Code
            </a>
          )}
        </div>

      </div>
    </article>
  );
}