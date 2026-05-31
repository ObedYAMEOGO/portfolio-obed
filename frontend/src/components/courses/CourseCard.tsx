"use client";

import Image from "next/image";
import { ArrowUpRight, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Material } from "@/types";

interface Props {
  material: Material;
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
    // Compare scrollHeight vs clientHeight to detect overflow
    setIsClamped(el.scrollHeight > el.clientHeight + 1);
  }, [text]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent the <a> from navigating
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
          className="ml-1 font-semibold focus:outline-none"
          style={{ color: "#c17650" }}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </p>
  );
}

export default function CourseCard({ material }: Props) {
  return (
    <a
      href={material.resource_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      {/* =====================================================
          MOBILE
      ===================================================== */}
      <div className="flex md:hidden overflow-hidden rounded-xl border border-neutral-400 bg-white/80 backdrop-blur-sm transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900/80">
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

        <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
          <div>
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
                className="mt-1 text-[10px] text-neutral-600 dark:text-neutral-400"
              />
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          DESKTOP
      ===================================================== */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-white/20 bg-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/30 dark:border-white/10 dark:bg-white/5">
        <div className="relative aspect-video overflow-hidden bg-neutral-100">
          {material.thumbnail_url ? (
            <Image
              src={material.thumbnail_url}
              alt={material.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FileText className="h-8 w-8 text-neutral-300" />
            </div>
          )}
        </div>

        <div className="space-y-4 p-5">
          {material.category && (
            <span className="inline-flex rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white dark:bg-white dark:text-black">
              {material.category}
            </span>
          )}

          <div className="space-y-2">
            <h3 className="line-clamp-2 text-[16px] font-semibold leading-snug text-neutral-900 dark:text-white">
              {material.title}
            </h3>

            {material.description && (
              <ExpandableText
                text={material.description}
                maxLines={3}
                className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300"
              />
            )}
          </div>

          <div className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
            Open Course
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </a>
  );
}