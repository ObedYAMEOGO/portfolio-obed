import { Suspense } from "react";
import CoursesClient from "@/components/courses/CoursesClient";

export const revalidate = 300; // ISR: revalidate every 5 minutes

export default function CoursesPage() {
  return (
    <Suspense fallback={<CoursesSkeleton />}>
      <CoursesClient />
    </Suspense>
  );
}

function CoursesSkeleton() {
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-gray-100 animate-pulse"
              style={{ height: "400px" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
