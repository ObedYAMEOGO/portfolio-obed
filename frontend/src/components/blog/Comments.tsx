"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export default function Comments() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="mt-16 border-t border-neutral-200 pt-10">
      <h2 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
        Discussion
      </h2>

      <Giscus
        repo="ObedYAMEOGO/portfolio-obed"
        repoId="R_kgDOSevWdA"
        category="Announcements"
        categoryId="DIC_kwDOSevWdM4C-RPz"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}