"use client";

import { useEffect, useState } from "react";

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    const lines = content.split("\n");
    const extractedHeadings = lines
      .filter((line) => line.startsWith("##"))
      .map((line) => {
        const level = line.startsWith("###") ? 3 : 2;
        const text = line.replace(/^###?\s+/, "");
        const id = text.toLowerCase().replace(/[^\w]+/g, "-");
        return { id, text, level };
      });
    setHeadings(extractedHeadings);
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block sticky top-32 h-fit w-64 space-y-4 border-l border-neutral-200 pl-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Sections</p>
      <ul className="space-y-3">
        {headings.map((heading) => (
          <li 
            key={heading.id} 
            style={{ paddingLeft: heading.level === 3 ? "1rem" : "0" }}
          >
            <a 
              href={`#${heading.id}`}
              className="text-[12px] text-neutral-500 hover:text-black transition-colors"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}