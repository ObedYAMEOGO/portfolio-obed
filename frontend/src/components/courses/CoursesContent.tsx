"use client";

import { Material } from "@/types";
import CoursesGrid from "./CoursesGrid";
import CoursesPagination from "./CoursesPagination";

interface CoursesContentProps {
  loading: boolean;
  materials: Material[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export default function CoursesContent({
  loading,
  materials,
  currentPage,
  totalPages,
  setCurrentPage,
}: CoursesContentProps) {
  return (
    <section className="w-full overflow-x-hidden overflow-y-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
        {/* Loading State - Centered */}
        {loading ? (
          <div className="flex min-h-100 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-600"></div>
              <p className="text-sm text-gray-500">Loading courses...</p>
            </div>
          </div>
        ) : materials.length === 0 ? (
          /* Not Found State - Centered */
          <div className="flex min-h-100 items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-gray-100 p-4">
                <svg
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  No courses found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <CoursesGrid loading={loading} materials={materials} />
            {totalPages > 1 && (
              <div className="mt-14">
                <CoursesPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}