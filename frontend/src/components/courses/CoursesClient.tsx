"use client";

import {
  useMemo,
  useState,
} from "react";

import { useQuery } from "@tanstack/react-query";
import { materialsApi } from "@/lib/api/materials";

import CoursesLayout from "@/components/courses/CoursesLayout";
import CoursesSidebar from "@/components/courses/CoursesSidebar";
import CoursesTopbar from "@/components/courses/CoursesTopBar";
import CoursesContent from "@/components/courses/CoursesContent";

type MaterialType = "ALL" | "DOCUMENT" | "VIDEO";
const ITEMS_PER_PAGE = 8;

export default function CoursesClient() {
  const [selectedType, setSelectedType] = useState<MaterialType>("ALL");

  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);


  // Use React Query for caching
  const { 
    data: materials = [], 
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: () => materialsApi.getPublicCourses(),
    staleTime: 5 * 60 * 1000, // 5 minutes - data becomes stale after 5 min
    gcTime: 10 * 60 * 1000,   // 10 minutes - keep in cache for 10 min
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const categories = useMemo(
    () => [
      "ALL",
      ...Array.from(
        new Set(
          materials
            .map((m) => m.category)
            .filter(Boolean)
        )
      ),
    ],
    [materials]
  );

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesType =
        selectedType === "ALL" || material.material_type === selectedType;

      const matchesCategory =
        selectedCategory === "ALL" || material.category === selectedCategory;

      const matchesSearch =
        material.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesCategory && matchesSearch;
    });
  }, [materials, selectedType, selectedCategory, searchQuery]);

  // Reset to page 1 when filters change
  const handleFilterChange = (updates: {
    selectedType?: MaterialType;
    selectedCategory?: string;
    searchQuery?: string;
  }) => {
    if (updates.selectedType !== undefined) setSelectedType(updates.selectedType);
    if (updates.selectedCategory !== undefined) setSelectedCategory(updates.selectedCategory);
    if (updates.searchQuery !== undefined) setSearchQuery(updates.searchQuery);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredMaterials.length / ITEMS_PER_PAGE) || 1;

  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedMaterials = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredMaterials.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMaterials, safePage]);

  // Error state
  if (queryError) {
    const errorMessage = queryError instanceof Error ? queryError.message : "Failed to load courses. Please try again later.";
    
    return (
      <CoursesLayout
        sidebar={
          <CoursesSidebar
            categories={["ALL"]}
            selectedCategory={selectedCategory}
            setSelectedCategory={(cat) => handleFilterChange({ selectedCategory: cat })}
          />
        }
        topbar={
          <CoursesTopbar
            selectedType={selectedType}
            setSelectedType={(type) => handleFilterChange({ selectedType: type })}
            searchQuery={searchQuery}
            setSearchQuery={(query) => handleFilterChange({ searchQuery: query })}
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
              <p className="mt-2 text-sm text-gray-500">{errorMessage}</p>
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
          setSelectedCategory={(cat) => handleFilterChange({ selectedCategory: cat })}
        />
      }
      topbar={
        <CoursesTopbar
          selectedType={selectedType}
          setSelectedType={(type) => handleFilterChange({ selectedType: type })}
          searchQuery={searchQuery}
          setSearchQuery={(query) => handleFilterChange({ searchQuery: query })}
        />
      }
      content={
        <CoursesContent
          loading={loading && materials.length === 0} // Only show loading on first load
          materials={paginatedMaterials}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      }
    />
  );
}