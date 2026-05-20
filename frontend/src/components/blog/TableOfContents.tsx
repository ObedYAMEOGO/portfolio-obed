"use client";

import { useMemo } from "react";

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

  /**
   * Memoized heading extraction
   * Prevents unnecessary recalculation
   * on every render
   */
  const headings = useMemo<Heading[]>(() => {
    return content
      .split("\n")
      .filter(
        (line) =>
          line.startsWith("## ") ||
          line.startsWith("### ")
      )
      .map((line) => {
        const level: 2 | 3 =
          line.startsWith("### ")
            ? 3
            : 2;

        const text = line.replace(
          /^###?\s+/,
          ""
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

  return (
    <aside className="sticky top-32 hidden h-fit w-64 lg:block">
      <nav className="border-l border-neutral-200 pl-6">
        {/* HEADER */}
        <div className="mb-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
            Navigation
          </p>

          <h3 className="mt-1 font-mono text-sm uppercase tracking-tight text-[#050505]">
            Table_Of_Contents
          </h3>
        </div>

        {/* LINKS */}
        <ul className="space-y-3">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={
                heading.level === 3
                  ? "pl-4"
                  : ""
              }
            >
              <a
                href={`#${heading.id}`}
                className="
                  block
                  text-[12px]
                  leading-relaxed
                  text-neutral-500
                  transition-colors
                  duration-200
                  hover:text-[#050505]
                "
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}