"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "@/lib/api";

import { Material } from "@/types";

import CoursesLayout from "@/components/courses/CoursesLayout";
import CoursesSidebar from "@/components/courses/CoursesSidebar";
import CoursesTopbar from "@/components/courses/CoursesTopBar";
import CoursesContent from "@/components/courses/CoursesContent";

export default function CoursesClient() {
  const [materials, setMaterials] =
    useState<Material[]>([]);

  const [loading, setLoading] =
    useState(true);

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
          const res =
            await api.get<
              Material[]
            >("/materials");

          if (mounted) {
            setMaterials(
              res.data ?? [],
            );
          }
        } catch (err) {
          console.error(err);
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

  return (
    <CoursesLayout
      sidebar={
        <CoursesSidebar
          categories={
            categories
          }
          selectedCategory={
            selectedCategory
          }
          setSelectedCategory={
            setSelectedCategory
          }
        />
      }
      topbar={
        <CoursesTopbar
          selectedType={
            selectedType
          }
          setSelectedType={
            setSelectedType
          }
          searchQuery={
            searchQuery
          }
          setSearchQuery={
            setSearchQuery
          }
        />
      }
      content={
        <CoursesContent
          loading={loading}
          materials={
            paginatedMaterials
          }
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
      }
    />
  );
}