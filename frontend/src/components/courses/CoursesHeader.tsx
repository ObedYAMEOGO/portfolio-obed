"use client";

import { Search } from "lucide-react";

interface Props {
  searchQuery: string;
  setSearchQuery: (
    value: string,
  ) => void;

  selectedType:
    | "ALL"
    | "DOCUMENT"
    | "VIDEO";

  setSelectedType: (
    value:
      | "ALL"
      | "DOCUMENT"
      | "VIDEO",
  ) => void;

  totalCourses: number;
}

export default function CoursesHeader({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  totalCourses,
}: Props) {
  return (
    <header>

      <div className="space-y-6">
{/* 
        <div className="space-y-3">

          <span
            className="
              inline-block
              font-mono
              text-[10px]
              uppercase
              tracking-[0.35em]
              text-neutral-500
            "
          >
            Learning Hub
          </span>

          <h1
            className="
              text-4xl
              font-semibold
              tracking-[-0.03em]
              text-neutral-900
              dark:text-white
              md:text-5xl
            "
          >
            AI Training Vault
          </h1>

          <p
            className="
              max-w-2xl
              text-[15px]
              leading-relaxed
              text-neutral-600
              dark:text-neutral-300
            "
          >
            Curated AI notes,
            tutorials,
            architectures,
            and engineering
            resources.
          </p>

        </div> */}

        <div
          className="
            flex
            flex-col
            gap-4
            xl:flex-row
            xl:items-center
            xl:justify-between
          "
        >

          <div className="flex flex-wrap gap-2">

            {(
              [
                "ALL",
                "DOCUMENT",
                "VIDEO",
              ] as const
            ).map((type) => (

              <button
                key={type}
                onClick={() =>
                  setSelectedType(
                    type,
                  )
                }
                className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition-all ${
                  selectedType ===
                  type
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-white/20 bg-white/30 text-neutral-700 backdrop-blur-sm hover:bg-white/50 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10"
                }`}
              >
                {type}
              </button>

            ))}

          </div>

          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
            "
          >

            <p
              className="
                text-sm
                text-neutral-500
                dark:text-neutral-400
              "
            >
              {totalCourses} courses
            </p>

            <div
              className="
                relative
                flex
                w-full
                sm:w-[320px]
                items-center
                rounded-full
                border
                border-white/20
                bg-white/30
                px-4
                py-2.5
                backdrop-blur-sm
                dark:border-white/10
                dark:bg-white/5
              "
            >

              <Search
                className="
                  mr-2
                  h-4
                  w-4
                  text-neutral-500
                "
              />

              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value,
                  )
                }
                className="
                  w-full
                  bg-transparent
                  text-sm
                  outline-none
                "
              />

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}