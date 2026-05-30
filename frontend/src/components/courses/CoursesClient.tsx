"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { materialsApi } from "@/lib/api/materials";
import { Material } from "@/types";
import { AxiosError } from "axios";

import CoursesLayout from "@/components/courses/CoursesLayout";
import CoursesSidebar from "@/components/courses/CoursesSidebar";
import CoursesTopbar from "@/components/courses/CoursesTopBar";
import CoursesContent from "@/components/courses/CoursesContent";

// Type guard to check if error is AxiosError
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

// Type for error response
interface ErrorResponse {
  message?: string;
}

export default function CoursesClient() {
  const [materials, setMaterials] =
    useState<Material[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState<string | null>(null);

  const [selectedType, setSelectedType] =
    useState<
      "ALL" | "DOCUMENT" | "VIDEO"
    >("ALL");

  const [selectedCategory, setSelectedCategory] =
    useState("ALL");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    let mounted = true;

    const fetchMaterials =
      async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Use materialsApi instead of direct api call
          const data = await materialsApi.getPublicCourses();
          console.log("Fetched materials:", data);

          if (mounted) {
            setMaterials(Array.isArray(data) ? data : []);
          }
        } catch (err: unknown) {
          console.error("Failed to fetch materials:", err);
          
          let errorMessage = "Failed to load courses. Please try again later.";
          
          if (isAxiosError(err)) {
            // Handle Axios error
            const errorData = err.response?.data as ErrorResponse;
            errorMessage = errorData?.message || err.message || errorMessage;
          } else if (err instanceof Error) {
            // Handle regular Error object
            errorMessage = err.message;
          }
          
          if (mounted) {
            setError(errorMessage);
            setMaterials([]);
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    fetchMaterials();

    return () => {
      mounted = false;
    };
  }, []);

  const categories =
    useMemo(
      () => [
        "ALL",
        ...Array.from(
          new Set(
            materials
              .map(
                (m) =>
                  m.category,
              )
              .filter(Boolean),
          ),
        ),
      ],
      [materials],
    );

  const filteredMaterials =
    useMemo(() => {
      return materials.filter(
        (material) => {
          const matchesType =
            selectedType ===
              "ALL" ||
            material.material_type ===
              selectedType;

          const matchesCategory =
            selectedCategory ===
              "ALL" ||
            material.category ===
              selectedCategory;

          const matchesSearch =
            material.title
              ?.toLowerCase()
              .includes(
                searchQuery.toLowerCase(),
              ) ||
            material.description
              ?.toLowerCase()
              .includes(
                searchQuery.toLowerCase(),
              );

          return (
            matchesType &&
            matchesCategory &&
            matchesSearch
          );
        },
      );
    }, [
      materials,
      selectedType,
      selectedCategory,
      searchQuery,
    ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedType,
    selectedCategory,
    searchQuery,
  ]);

  const totalPages =
    Math.ceil(
      filteredMaterials.length /
        ITEMS_PER_PAGE,
    ) || 1;

  const safePage = Math.min(
    Math.max(currentPage, 1),
    totalPages,
  );

  const paginatedMaterials =
    useMemo(() => {
      const start =
        (safePage - 1) *
        ITEMS_PER_PAGE;

      return filteredMaterials.slice(
        start,
        start +
          ITEMS_PER_PAGE,
      );
    }, [
      filteredMaterials,
      safePage,
    ]);

  // Error state
  if (error) {
    return (
      <CoursesLayout
        sidebar={
          <CoursesSidebar
            categories={["ALL"]}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        }
        topbar={
          <CoursesTopbar
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        }
        content={
          <div className="flex min-h-100 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 w-fit rounded-full bg-red-100 p-4">
                <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Error Loading Courses</h3>
              <p className="mt-2 text-sm text-gray-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-full bg-neutral-900 px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-700"
              >
                Try Again
              </button>
            </div>
          </div>
        }
      />
    );
  }

  return (
    <CoursesLayout
      sidebar={
        <CoursesSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      }
      topbar={
        <CoursesTopbar
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      }
      content={
        <CoursesContent
          loading={loading}
          materials={paginatedMaterials}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      }
    />
  );
}