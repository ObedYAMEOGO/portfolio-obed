"use client";

import { Material } from "@/types";

import CoursesGrid from "./CoursesGrid";
import CoursesPagination from "./CoursesPagination";

interface CoursesContentProps {
  loading: boolean;
  materials: Material[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (
    page: number,
  ) => void;
}

export default function CoursesContent({
  loading,
  materials,
  currentPage,
  totalPages,
  setCurrentPage,
}: CoursesContentProps) {
  return (
    <section
      className="
        w-full
        overflow-x-hidden
        overflow-y-hidden
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-4
          py-6
          md:px-6
        "
      >

        {/* Loading State - Centered */}
        {loading ? (
          <div className="flex min-h-100 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-600"></div>
              <p className="text-sm text-gray-500">Loading courses...</p>
            </div>
          </div>
        ) : (
          <>
            <CoursesGrid
              loading={loading}
              materials={materials}
            />

            {totalPages > 1 && (
              <div className="mt-14">
                <CoursesPagination
                  currentPage={
                    currentPage
                  }
                  totalPages={
                    totalPages
                  }
                  setCurrentPage={
                    setCurrentPage
                  }
                />
              </div>
            )}
          </>
        )}

      </div>

    </section>
  );
}