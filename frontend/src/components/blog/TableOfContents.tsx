"use client";

import { useMemo } from "react";

import { Layers3 } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({
  content,
}: TableOfContentsProps) {

  /* =========================================================
     EXTRACT HEADINGS
  ========================================================= */

  const headings = useMemo<Heading[]>(() => {
    return content
      .split("\n")
      .filter(
        (line) =>
          line.startsWith("## ") ||
          line.startsWith("### "),
      )
      .map((line) => {

        const level: 2 | 3 =
          line.startsWith("### ")
            ? 3
            : 2;

        const text = line.replace(
          /^###?\s+/,
          "",
        );

        const id = text
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");

        return {
          id,
          text,
          level,
        };
      });
  }, [content]);

  if (headings.length === 0) {
    return null;
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <aside className="sticky top-32 hidden h-fit w-72 lg:block">
      
      <div className="border border-neutral-200 bg-white p-7 shadow-sm">
        
        {/* =========================================================
            HEADER
        ========================================================= */}

        <div className="mb-8 border-b border-neutral-100 pb-5">
          
          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-400">
            <Layers3 className="h-3.5 w-3.5" />

            Navigation
          </div>

          <h3 className="text-xl font-semibold tracking-tight text-black">
            Table of Contents
          </h3>

        </div>

        {/* =========================================================
            LINKS
        ========================================================= */}

        <nav>
          <ul className="space-y-2">
            
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={
                  heading.level === 3
                    ? "ml-4"
                    : ""
                }
              >
                <a
                  href={`#${heading.id}`}
                  className="
                    group
                    flex
                    items-start
                    gap-3
                    rounded-sm
                    px-3
                    py-2.5
                    transition-all
                    duration-200
                    hover:bg-neutral-50
                  "
                >
                  {/* INDICATOR */}

                  <span
                    className={`
                      mt-1.75
                      block
                      shrink-0
                      transition-all
                      duration-200
                      group-hover:bg-black
                      ${
                        heading.level === 2
                          ? "h-1.25 w-1.25 bg-neutral-400"
                          : "h-1 w-4.5 bg-neutral-300"
                      }
                    `}
                  />

                  {/* TEXT */}

                  <span
                    className={`
                      leading-relaxed
                      transition-colors
                      duration-200
                      group-hover:text-black
                      ${
                        heading.level === 2
                          ? "text-[14px] font-medium text-neutral-700"
                          : "text-[13px] text-neutral-500"
                      }
                    `}
                  >
                    {heading.text}
                  </span>
                </a>
              </li>
            ))}

          </ul>
        </nav>
      </div>
    </aside>
  );
}