"use client";

import { useMemo, useState } from "react";

import Image from "next/image";

import { motion } from "framer-motion";

import {
  FileText,
  Video,
  FolderOpen,
  ExternalLink,
  Layers,
  Search,
  BookOpen,
} from "lucide-react";

interface Material {
  id: number;
  title: string;
  slug: string;
  description: string;
  material_type: "DOCUMENT" | "VIDEO";
  video_context: "SINGLE" | "PLAYLIST" | "NONE";
  category: string;
  resource_url: string;
  thumbnail_url: string | null;
  created_at: string;
}

interface Props {
  materials: Material[];
}

export default function CoursesClient({
  materials,
}: Props) {

  const [selectedType, setSelectedType] =
    useState<"ALL" | "DOCUMENT" | "VIDEO">("ALL");

  const [selectedCategory, setSelectedCategory] =
    useState("ALL");

  const [searchQuery, setSearchQuery] =
    useState("");

  const categories = useMemo(() => {
    return [
      "ALL",
      ...Array.from(
        new Set(materials.map((m) => m.category))
      ),
    ];
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {

      const matchesType =
        selectedType === "ALL" ||
        material.material_type === selectedType;

      const matchesCategory =
        selectedCategory === "ALL" ||
        material.category === selectedCategory;

      const matchesSearch =
        material.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        material.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      return (
        matchesType &&
        matchesCategory &&
        matchesSearch
      );
    });
  }, [
    materials,
    selectedType,
    selectedCategory,
    searchQuery,
  ]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#050505]">
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">

        {/* HEADER */}
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
              Curated notes, research architectures,
              code modules, and deep-dive tutorial matrices.
            </p>

          </div>
        </header>

        {/* CONTROLS */}
        <div className="mb-12 flex flex-col gap-6 border border-neutral-300 bg-white p-6 md:flex-row md:items-center md:justify-between">

          {/* TYPE FILTERS */}
          <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wider">

            {(["ALL", "DOCUMENT", "VIDEO"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`h-9 border px-4 font-bold transition-colors ${
                  selectedType === type
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                {type}
              </button>
            ))}

          </div>

          {/* SEARCH */}
          <div className="relative flex w-full max-w-md items-center border border-neutral-300 bg-[#f5f5f5] px-3">

            <Search className="mr-2 h-4 w-4 text-neutral-400" />

            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="w-full bg-transparent py-3 font-mono text-xs outline-none"
            />

          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">

          {/* SIDEBAR */}
          <aside className="space-y-6 font-mono text-xs">

            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              <Layers className="h-3.5 w-3.5" />
              Knowledge_Domains
            </div>

            <ul className="space-y-1.5 border-l border-neutral-200 pl-4">

              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() =>
                      setSelectedCategory(category)
                    }
                    className={`block w-full text-left uppercase transition-colors hover:text-black ${
                      selectedCategory === category
                        ? "font-bold text-black"
                        : "text-neutral-500"
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}

            </ul>
          </aside>

          {/* MATERIAL GRID */}
          <div>

            {filteredMaterials.length > 0 ? (

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {filteredMaterials.map((material) => (

                  <motion.div
                    key={material.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group overflow-hidden border border-neutral-300 bg-white"
                  >

                    {/* IMAGE */}
                    <div className="relative h-44 w-full overflow-hidden border-b border-neutral-200 bg-neutral-100">

                      {material.thumbnail_url ? (
                        <Image
                          src={material.thumbnail_url}
                          alt={material.title}
                          fill
                          sizes="(max-width:768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <FileText className="h-8 w-8 text-neutral-300" />
                        </div>
                      )}

                    </div>

                    {/* CONTENT */}
                    <div className="p-6">

                      <div className="mb-4 flex items-center justify-between">

                        <span className="border border-neutral-200 bg-neutral-100 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-neutral-600">
                          {material.category}
                        </span>

                        {material.material_type === "DOCUMENT" ? (
                          <FileText className="h-4 w-4 text-neutral-400" />
                        ) : material.video_context === "PLAYLIST" ? (
                          <FolderOpen className="h-4 w-4 text-amber-600" />
                        ) : (
                          <Video className="h-4 w-4 text-blue-600" />
                        )}

                      </div>

                      <h3 className="mb-3 min-h-14 text-lg font-bold leading-snug tracking-tight text-neutral-900">
                        {material.title}
                      </h3>

                      {material.description && (
                        <p className="line-clamp-3 text-xs leading-relaxed text-neutral-500">
                          {material.description}
                        </p>
                      )}

                      <div className="mt-6 border-t border-neutral-100 pt-4">

                        <a
                          href={material.resource_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-900 hover:underline"
                        >
                          Open Resource
                          <ExternalLink className="h-3 w-3" />
                        </a>

                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

            ) : (

              <div className="border border-dashed border-neutral-300 bg-white py-24 text-center">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-400">
                  Search_Matrix_Empty
                </span>
              </div>

            )}

          </div>
        </div>
      </main>
    </div>
  );
}