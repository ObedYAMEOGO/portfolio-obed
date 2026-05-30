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
        {/* Show skeletons only on initial load */}
        {loading && materials.length === 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm border border-neutral-200 animate-pulse">
                <div className="aspect-video w-full bg-neutral-200" />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-4 w-16 bg-neutral-200 rounded-full" />
                    <div className="flex gap-3">
                      <div className="h-4 w-4 bg-neutral-200 rounded" />
                      <div className="h-4 w-4 bg-neutral-200 rounded" />
                    </div>
                  </div>
                  <div className="h-6 w-3/4 bg-neutral-200 rounded mb-2" />
                  <div className="space-y-2 mt-2">
                    <div className="h-4 w-full bg-neutral-200 rounded" />
                    <div className="h-4 w-5/6 bg-neutral-200 rounded" />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <div className="h-6 w-16 bg-neutral-200 rounded-full" />
                    <div className="h-6 w-20 bg-neutral-200 rounded-full" />
                    <div className="h-6 w-14 bg-neutral-200 rounded-full" />
                  </div>
                  <div className="flex gap-3 mt-6 pt-2 border-t border-neutral-100">
                    <div className="h-9 w-24 bg-neutral-200 rounded-full" />
                    <div className="h-9 w-20 bg-neutral-200 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : materials.length === 0 ? (
          /* Not Found State */
          <div className="flex min-h-100 items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-gray-100 p-4">
                <svg
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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