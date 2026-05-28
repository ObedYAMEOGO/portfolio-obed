"use client";

import { Material } from "@/types";

import CourseCard from "./CourseCard";

interface Props {
  loading: boolean;
  materials: Material[];
}

export default function CoursesGrid({ loading, materials }: Props) {
  if (loading) {
    return <div className="py-24">Loading courses...</div>;
  }

  if (materials.length === 0) {
    return <div className="py-24">No courses found.</div>;
  }

  return (
    <div
      className="
        grid
    grid-cols-1
    gap-8
    sm:grid-cols-2
    xl:grid-cols-4
      "
    >
      {materials.map((material) => (
        <CourseCard key={material.id} material={material} />
      ))}
    </div>
  );
}
