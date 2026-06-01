"use client";

import { useState } from "react";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Comments() {
  const { resolvedTheme } = useTheme();
  const [open, setOpen] = useState(true);

  return (
    <div className="mt-16 border-t border-neutral-200 pt-10">

      {/* TOGGLE HEADER */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="group flex w-full items-center justify-between"
      >
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 transition-colors duration-200 group-hover:text-neutral-600">
          Discussion
        </h2>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-neutral-400 transition-transform duration-300 group-hover:text-neutral-600",
            open && "rotate-180",
          )}
        />
      </button>

      {/* GISCUS — always mounted, just hidden when collapsed */}
      <div className={cn("mt-6", !open && "hidden")}>
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

    </div>
  );
}