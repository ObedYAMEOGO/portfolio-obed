/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import { motion } from "framer-motion";

import api from "@/lib/api";

import {
  FileText,
  Video,
  FolderOpen,
  ExternalLink,
  Layers,
  Terminal,
  Search,
  BookOpen,
} from "lucide-react";

import { Material } from "@/types";

/* =========================================================
   PAGE
========================================================= */

export default function LearningHubPage() {
  const [materials, setMaterials] =
    useState<Material[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================================================
     FILTER STATES
  ========================================================= */

  const [
    selectedType,
    setSelectedType,
  ] = useState<
    "ALL" | "DOCUMENT" | "VIDEO"
  >("ALL");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("ALL");

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  /* =========================================================
     FETCH MATERIALS
  ========================================================= */

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
              res.data ?? []
            );
          }
        } catch (err) {
          console.error(
            "Fetch_Materials_Error:",
            err,
          );
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

  /* =========================================================
     DYNAMIC CATEGORIES
  ========================================================= */

  const categories =
    useMemo(() => {
      return [
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
      ];
    }, [materials]);

  /* =========================================================
     FILTERED MATERIALS
  ========================================================= */

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

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#050505]">
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        {/* =========================================================
            HEADER
        ========================================================= */}

        <header className="mb-16 border-b border-neutral-200 pb-10">
          <div className="space-y-5">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-400">
              <BookOpen className="h-3.5 w-3.5" />

              Open_Source_Intelligence_Matrix
            </div>

            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
              AI_Training_Vault
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg">
              Curated notes,
              research
              architectures,
              code modules,
              and deep-dive
              tutorial matrices
              for engineering
              advanced artificial
              intelligence systems.
            </p>
          </div>
        </header>

        {/* =========================================================
            CONTROLS
        ========================================================= */}

        <div className="mb-12 flex flex-col gap-6 border border-neutral-300 bg-white p-6 md:flex-row md:items-center md:justify-between">
          {/* TYPE FILTERS */}

          <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wider">
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
                className={`h-9 border px-4 font-bold transition-colors ${
                  selectedType ===
                  type
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                {type === "ALL"
                  ? "All"
                  : type ===
                      "DOCUMENT"
                    ? "Notes & Documents"
                    : "Video Streams"}
              </button>
            ))}
          </div>

          {/* SEARCH */}

          <div className="relative flex w-full max-w-md items-center border border-neutral-300 bg-[#f5f5f5] px-3 transition-colors focus-within:border-black">
            <Search className="mr-2 h-4 w-4 text-neutral-400" />

            <input
              type="text"
              placeholder="Search..."
              value={
                searchQuery
              }
              onChange={(e) =>
                setSearchQuery(
                  e.target.value,
                )
              }
              className="w-full bg-transparent py-3 font-mono text-xs text-black outline-none"
            />
          </div>
        </div>

        {/* =========================================================
            CONTENT GRID
        ========================================================= */}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
          {/* =========================================================
              SIDEBAR
          ========================================================= */}

          <aside className="space-y-6 font-mono text-xs">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              <Layers className="h-3.5 w-3.5" />

              Knowledge_Domains
            </div>

            <ul className="space-y-1.5 border-l border-neutral-200 pl-4">
              {categories.map(
                (
                  category,
                ) => (
                  <li
                    key={
                      category
                    }
                  >
                    <button
                      onClick={() =>
                        setSelectedCategory(
                          category,
                        )
                      }
                      className={`block w-full text-left uppercase tracking-tight transition-colors hover:text-black hover:underline ${
                        selectedCategory ===
                        category
                          ? "border-l-2 border-black -ml-4 pl-4 font-bold text-black"
                          : "text-neutral-500"
                      }`}
                    >
                      {category ===
                      "ALL"
                        ? "Show_All_Nodes"
                        : category.replace(
                            /\s+/g,
                            "_",
                          )}
                    </button>
                  </li>
                ),
              )}
            </ul>
          </aside>

          {/* =========================================================
              MATERIAL GRID
          ========================================================= */}

          <div>
            {loading ? (
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-neutral-400">
                <Terminal className="h-3.5 w-3.5 animate-spin" />

                <span>
                  Decrypting_Vault_Data...
                </span>
              </div>
            ) : filteredMaterials.length >
              0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMaterials.map(
                  (
                    material,
                  ) => (
                    <motion.div
                      key={
                        material.id
                      }
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      className="group flex flex-col justify-between overflow-hidden border border-neutral-300 bg-white shadow-sm transition-all duration-300 hover:border-black hover:shadow-md"
                    >
                      <div>
                        {/* =========================================================
                            IMAGE
                        ========================================================= */}

                        <div className="relative h-44 w-full overflow-hidden border-b border-neutral-200 bg-neutral-100">
                          {material.thumbnail_url ? (
                            <Image
                              src={
                                material.thumbnail_url
                              }
                              alt={
                                material.title
                              }
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center bg-neutral-50 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                              <FileText className="mb-2 h-6 w-6 text-neutral-300" />

                              <span>
                                Document_Node
                              </span>
                            </div>
                          )}
                        </div>

                        {/* =========================================================
                            CONTENT
                        ========================================================= */}

                        <div className="p-6">
                          {/* META */}

                          <div className="mb-4 flex items-center justify-between">
                            <span className="border border-neutral-200 bg-neutral-100 px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider text-neutral-600">
                              {
                                material.category
                              }
                            </span>

                            <div className="text-neutral-400 transition-colors group-hover:text-black">
                              {material.material_type ===
                              "DOCUMENT" ? (
                                <FileText className="h-4 w-4" />
                              ) : material.video_context ===
                                "PLAYLIST" ? (
                                <FolderOpen className="h-4 w-4 text-amber-600" />
                              ) : (
                                <Video className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                          </div>

                          {/* TITLE */}

                          <h3 className="mb-3 min-h-14 text-lg font-bold leading-snug tracking-tight text-neutral-900 line-clamp-2">
                            {
                              material.title
                            }
                          </h3>

                          {/* VIDEO STRUCTURE */}

                          {material.material_type ===
                            "VIDEO" && (
                            <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                              Structure:{" "}

                              <span className="text-neutral-600">
                                {
                                  material.video_context
                                }
                              </span>
                            </p>
                          )}

                          {/* DESCRIPTION */}

                          {material.description && (
                            <p className="line-clamp-3 text-xs leading-relaxed text-neutral-500">
                              {
                                material.description
                              }
                            </p>
                          )}
                        </div>
                      </div>

                      {/* =========================================================
                          FOOTER
                      ========================================================= */}

                      <div className="mx-6 mb-6 border-t border-neutral-100 pt-4">
                        <a
                          href={
                            material.resource_url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-900 hover:underline"
                        >
                          {material.material_type ===
                          "DOCUMENT"
                            ? "Access Document"
                            : "Launch Stream"}

                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </motion.div>
                  ),
                )}
              </div>
            ) : (
              <div className="border border-dashed border-neutral-300 bg-white py-24 text-center">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-400">
                  Search_Matrix_Empty
                  // No Nodes
                  Matched Filters
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}