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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const description = project.description || "";
  const hasDescription = description.length > 0;
  const isLongDescription = description.length > 120;

  const techStack = project.tech_stack || [];

  // Intersection Observer for scroll reveal animation
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

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Truncate description for preview
  const getTruncatedDescription = () => {
    if (isDescriptionExpanded) return description;
    if (description.length <= 120) return description;
    return description.slice(0, 120) + "...";
  };

  return (
    <article
      ref={cardRef}
      className="group"
      style={{
        animationDelay: `${index * 80}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)"
      }}
    >
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-neutral-200 transition-all duration-300 hover:shadow-md hover:-translate-y-1 dark:bg-neutral-900 dark:border-neutral-800">
        {/* Content */}
        <div className="p-5">
          {/* Top row: category + links */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 transition-all duration-300 group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
              Project
            </span>
            <div className="flex items-center gap-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-300 transition-all duration-300 hover:scale-110"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-300 transition-all duration-300 hover:scale-110"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold leading-snug text-neutral-900 dark:text-white mb-2 transition-all duration-300 group-hover:text-neutral-700 dark:group-hover:text-neutral-200">
            {project.title}
          </h3>

          {/* Description with inline read more */}
          {hasDescription && (
            <div className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 transition-all duration-300">
              {isDescriptionExpanded ? (
                description
              ) : (
                <>
                  {getTruncatedDescription()}
                  {isLongDescription && (
                    <button
                      onClick={() => setIsDescriptionExpanded(true)}
                      className="inline font-medium text-[#c17650] hover:text-[#c17650] dark:text-[#c17650] dark:hover:text-[#c17650] transition-colors ml-0"
                    >
                       Read more
                    </button>
                  )}
                </>
              )}
              {isDescriptionExpanded && isLongDescription && (
                <button
                  onClick={() => setIsDescriptionExpanded(false)}
                  className="inline font-medium text-[#c17650] hover:text-[#c17650] dark:text-[#c17650] dark:hover:text-[#c17650] transition-colors ml-1"
                >
                  Show less
                </button>
              )}
            </div>
          )}

          {/* Tech stack */}
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {techStack.map((tech, techIndex) => (
                <span
                  key={tech}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 transition-all duration-300 hover:scale-105 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  style={{
                    animationDelay: `${techIndex * 50}ms`,
                    animation: isVisible ? "fadeInUp 0.4s ease-out forwards" : "none",
                    opacity: 0,
                    transform: "translateY(10px)"
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* CTA Buttons - rounded full */}
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-neutral-800 hover:gap-3 hover:scale-105 active:scale-95 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                View Live
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-700 transition-all duration-300 hover:bg-neutral-50 hover:gap-3 hover:scale-105 active:scale-95 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <Github className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                Code
              </a>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </article>
  );
}