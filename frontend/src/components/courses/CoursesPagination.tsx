"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Props {
  currentPage: number;

  totalPages: number;

  setCurrentPage: (
    page: number,
  ) => void;
}

export default function CoursesPagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="
        mt-12
        flex
        items-center
        justify-center
        gap-2
      "
    >

      <button
        onClick={() =>
          setCurrentPage(
            currentPage - 1,
          )
        }
        disabled={
          currentPage === 1
        }
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-white/20
          bg-white/30
          backdrop-blur-sm
          disabled:opacity-40
        "
      >

        <ChevronLeft
          className="
            h-4
            w-4
          "
        />

      </button>

      {Array.from({
        length: totalPages,
      }).map((_, index) => {

        const page =
          index + 1;

        const active =
          currentPage === page;

        return (

          <button
            key={page}
            onClick={() =>
              setCurrentPage(
                page,
              )
            }
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
              active
                ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                : "border border-white/20 bg-white/30 backdrop-blur-sm"
            }`}
          >
            {page}
          </button>

        );
      })}

      <button
        onClick={() =>
          setCurrentPage(
            currentPage + 1,
          )
        }
        disabled={
          currentPage ===
          totalPages
        }
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-white/20
          bg-white/30
          backdrop-blur-sm
          disabled:opacity-40
        "
      >

        <ChevronRight
          className="
            h-4
            w-4
          "
        />

      </button>

    </nav>
  );
}