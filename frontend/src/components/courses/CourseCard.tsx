"use client";

import Image from "next/image";
import { ArrowUpRight, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Material } from "@/types";

interface Props {
  material: Material;
  index?: number;
}

interface ExpandableTextProps {
  text: string;
  maxLines: number;
  className?: string;
}

function ExpandableText({ text, maxLines, className = "" }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    setIsClamped(el.scrollHeight > el.clientHeight + 1);
  }, [text]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  return (
    <p className={className}>
      <span
        ref={textRef}
        style={
          !expanded
            ? {
                display: "-webkit-box",
                WebkitLineClamp: maxLines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
            : undefined
        }
      >
        {text}
      </span>
      {(isClamped || expanded) && (
        <button
          onClick={handleToggle}
          className="ml-1 font-medium text-neutral-900 underline-offset-2 hover:underline dark:text-neutral-200 focus:outline-none"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </p>
  );
}

export default function CourseCard({ material, index = 0 }: Props) {
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1, rootMargin: "50px" }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      ref={cardRef}
      href={material.resource_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms`,
      }}
    >

      {/* =====================================================
          MOBILE
      ===================================================== */}
      <div className="relative flex overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)] md:hidden dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700">

        {/* Hover wash */}
        <div className="absolute inset-0 bg-neutral-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-neutral-800/40" />

        <div className="relative w-32 shrink-0 self-stretch bg-neutral-100 dark:bg-neutral-800">
          {material.thumbnail_url ? (
            <Image
              src={material.thumbnail_url}
              alt={material.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FileText className="h-6 w-6 text-neutral-400 dark:text-neutral-600" />
            </div>
          )}
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col justify-between p-3">
          {material.category && (
            <span className="mb-2 inline-flex rounded-full bg-neutral-900 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white dark:bg-white dark:text-black">
              {material.category}
            </span>
          )}

          <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900 dark:text-white">
            {material.title}
          </h3>

          {material.description && (
            <ExpandableText
              text={material.description}
              maxLines={3}
              className="mt-1 text-[10px] text-neutral-500 dark:text-neutral-400"
            />
          )}
        </div>
      </div>

      {/* =====================================================
          DESKTOP
      ===================================================== */}
      <div className="relative hidden overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] md:block dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700">

        {/* Hover wash */}
        <div className="absolute inset-0 bg-neutral-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-neutral-800/40" />

        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          {material.thumbnail_url ? (
            <Image
              src={material.thumbnail_url}
              alt={material.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FileText className="h-8 w-8 text-neutral-300 dark:text-neutral-600" />
            </div>
          )}
        </div>

        <div className="relative space-y-3 p-5">

          {/* Category */}
          {material.category && (
            <span className="inline-flex rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white dark:bg-white dark:text-black">
              {material.category}
            </span>
          )}

          {/* Title + description */}
          <div className="space-y-1.5">
            <h3 className="line-clamp-2 text-[16px] font-semibold leading-snug text-neutral-900 dark:text-white">
              {material.title}
            </h3>

            {material.description && (
              <ExpandableText
                text={material.description}
                maxLines={3}
                className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400"
              />
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-neutral-100 transition-colors duration-300 group-hover:bg-neutral-200 dark:bg-neutral-800 dark:group-hover:bg-neutral-700" />

          {/* CTA */}
          <div className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-900 transition-all duration-200 group-hover:gap-3 dark:text-white">
            Open Course
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>

        </div>
      </div>

    </a>
  );
}