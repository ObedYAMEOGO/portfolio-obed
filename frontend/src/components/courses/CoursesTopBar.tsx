"use client";

import { Search } from "lucide-react";

interface CoursesTopbarProps {
  selectedType: "ALL" | "DOCUMENT" | "VIDEO";
  setSelectedType: (type: "ALL" | "DOCUMENT" | "VIDEO") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function CoursesTopbar({
  selectedType,
  setSelectedType,
  searchQuery,
  setSearchQuery,
}: CoursesTopbarProps) {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        px-4
        py-4
        md:px-6
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
      suppressHydrationWarning={true} // Silences form filler extensions injecting properties onto buttons/inputs
    >
      {/* FILTERS */}
      <div className="flex flex-wrap gap-2">
        {([ "ALL", "DOCUMENT", "VIDEO" ] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`
              rounded-xl
              border
              px-4
              py-2.5
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.15em]
              transition-all
              duration-200
              ${
                selectedType === type
                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:text-white"
              }
            `}
          >
            {type === "ALL"
              ? "All"
              : type === "DOCUMENT"
                ? "Documents"
                : "Videos"}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div
        className="
          flex
          w-full
          max-w-md
          items-center
          gap-3
          rounded-xl
          border
          border-neutral-200
          bg-white
          px-4
          py-3
          dark:border-neutral-800
          dark:bg-neutral-950
        "
      >
        <Search className="h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off" // Optional safety enhancement to discourage aggressive browser form caching/filling here
          className="
            w-full
            bg-transparent
            text-sm
            outline-none
            placeholder:text-neutral-400
          "
        />
      </div>
    </div>
  );
}