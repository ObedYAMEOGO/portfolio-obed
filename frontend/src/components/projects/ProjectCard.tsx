// components/ProjectCard.tsx

"use client";

import Image from "next/image";
import { Project } from "@/types";
import { ArrowUpRight, Github } from "lucide-react";
import { useState } from "react";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isTechExpanded, setIsTechExpanded] = useState(false);

  const description = project.description || "";
  const hasDescription = description.length > 0;
  const isLongDescription = description.length > 120;

  const DESKTOP_TECH_LIMIT = 5;

  const techStack = project.tech_stack || [];
  const visibleTech = isTechExpanded
    ? techStack
    : techStack.slice(0, DESKTOP_TECH_LIMIT);

  const desktopRemainingCount = isTechExpanded
    ? 0
    : techStack.length - DESKTOP_TECH_LIMIT;

  return (
    <article
      className="group relative flex flex-col cursor-pointer transform transition-all duration-500 hover:-translate-y-1"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* =========================================================
          CARD CONTAINER WITH IMAGE BACKGROUND
      ========================================================= */}

      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-linear-to-br from-neutral-900 to-neutral-800 shadow-lg transition-shadow duration-500 group-hover:shadow-2xl">

        {/* BACKGROUND IMAGE */}
        {project.image_url ? (
          <>
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index < 2}
              className="object-cover transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.08]"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/30 transition-all duration-500 group-hover:from-black/80 group-hover:via-black/40 group-hover:to-black/20" />

            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-white/20 via-transparent to-white/20" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-linear-to-br from-neutral-800 to-neutral-900 text-xs font-medium tracking-widest uppercase text-neutral-500">
            No Preview Available
          </div>
        )}

        {/* =========================================================
            CONTENT OVERLAYED ON IMAGE
        ========================================================= */}

        <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-7 lg:p-8 pb-6 md:pb-8 lg:pb-10">

          {/* TOP ROW: category + live (mobile) / github (desktop) */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 transition-all duration-300 group-hover:bg-black/60 group-hover:border-white/30 group-hover:scale-105">
              Featured Project
            </span>

            {/* MOBILE: View Live — white pill */}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="md:hidden flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-900 bg-white px-3 py-1.5 rounded-full shadow-lg transition-all duration-300 hover:bg-neutral-100 active:scale-95"
              >
                View Live
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}

            {/* DESKTOP: Github */}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                className="hidden md:flex items-center gap-1.5 text-[11px] font-medium text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 transition-all duration-300 hover:bg-black/60 hover:border-white/30 hover:scale-105 hover:gap-2"
              >
                <Github className="h-3.5 w-3.5" />
                Source Code
              </a>
            )}
          </div>

          {/* BOTTOM CONTENT */}
          <div className="space-y-3 transform translate-y-2 transition-all duration-500 ease-out group-hover:translate-y-0">

            {/* TITLE */}
            <div className="relative inline-block">
              <h3 className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] font-bold leading-tight tracking-[-0.02em] text-white drop-shadow-lg transition-all duration-300">
                {project.title}
              </h3>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-white to-white/50 transition-all duration-500 group-hover:w-full" />
            </div>

            {/* DESCRIPTION */}
            {hasDescription && (
              <>
                <p className={`text-[12px] sm:text-[13px] md:text-[14px] leading-relaxed text-white/85 drop-shadow-md transition-all duration-300 ${isDescriptionExpanded ? "line-clamp-none" : "line-clamp-2"}`}>
                  {description}
                </p>

                {isLongDescription && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDescriptionExpanded(!isDescriptionExpanded);
                    }}
                    className="text-[11px] font-medium text-white/70 hover:text-white transition-all duration-300 flex items-center gap-1 group/readmore"
                  >
                    {isDescriptionExpanded ? "Show less" : "Read more"}
                    <ArrowUpRight className={`h-3 w-3 transition-all duration-300 ${isDescriptionExpanded ? "rotate-90" : "group-hover/readmore:translate-x-0.5 group-hover/readmore:-translate-y-0.5"}`} />
                  </button>
                )}
              </>
            )}

            {/* TECH STACK — desktop only */}
            {techStack.length > 0 && (
              <div className="hidden md:block pt-2">
                <div className="flex flex-wrap items-center gap-1.5">

                  {visibleTech.map((tech, techIndex) => (
                    <span
                      key={tech}
                      className="inline-flex rounded-full bg-white/10 backdrop-blur-sm px-2.5 py-1 text-[10px] md:text-[11px] font-medium text-white/80 border border-white/20 transition-all duration-300 hover:bg-white/20 hover:text-white hover:border-white/30 hover:scale-105 hover:-translate-y-0.5"
                      style={{ transitionDelay: `${techIndex * 25}ms` }}
                    >
                      {tech}
                    </span>
                  ))}

                  {desktopRemainingCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsTechExpanded(true);
                      }}
                      className="inline-flex rounded-full bg-white/5 backdrop-blur-sm px-2.5 py-1 text-[10px] md:text-[11px] font-medium text-white/70 border border-white/10 transition-all duration-300 hover:bg-white/15 hover:text-white hover:border-white/20"
                    >
                      +{desktopRemainingCount} more
                    </button>
                  )}

                  {isTechExpanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsTechExpanded(false);
                      }}
                      className="inline-flex rounded-full bg-white/5 backdrop-blur-sm px-2.5 py-1 text-[10px] md:text-[11px] font-medium text-white/70 border border-white/10 transition-all duration-300 hover:bg-white/15 hover:text-white hover:border-white/20"
                    >
                      Show less
                    </button>
                  )}

                </div>
              </div>
            )}

            {/* CTA Buttons — desktop only (hover reveal) */}
            <div className="hidden md:flex flex-wrap items-center gap-3 pt-3 pb-1 opacity-0 transform translate-y-2 transition-all duration-500 delay-100 group-hover:opacity-100 group-hover:translate-y-0">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] md:text-[12px] font-semibold uppercase tracking-wide text-neutral-900 shadow-lg transition-all duration-300 hover:bg-neutral-100 hover:scale-105 hover:shadow-xl hover:gap-3"
                >
                  View Live
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}

              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-[11px] md:text-[12px] font-medium text-white border border-white/30 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:gap-3"
                >
                  <Github className="h-3.5 w-3.5" />
                  Code
                </a>
              )}
            </div>

          </div>
        </div>

        {/* Animated border ring */}
        <div className="absolute inset-0 rounded-xl ring-2 ring-white/0 transition-all duration-500 group-hover:ring-white/30 pointer-events-none" />

        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-xl">
          <div className="absolute -inset-full top-0 h-full w-1/2 z-5 block transform -skew-x-12 bg-linear-to-r from-transparent via-white/10 to-transparent group-hover:animate-shine" />
        </div>

      </div>

      {/* Optional Loading State */}
      {!project.image_url && (
        <div className="mt-3 text-center text-[11px] text-neutral-500">
          Image coming soon
        </div>
      )}

    </article>
  );
}