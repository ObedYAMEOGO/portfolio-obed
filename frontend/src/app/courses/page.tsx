"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image"; // Injected Next.js Image Component
import api from "@/lib/api";
import { 
  FileText, 
  Video, 
  FolderOpen, 
  ExternalLink, 
  Layers, 
  Terminal, 
  Search,
  BookOpen
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

export default function LearningHubPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation & Filtering States
  const [selectedType, setSelectedType] = useState<"ALL" | "DOCUMENT" | "VIDEO">("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await api.get<Material[]>("/materials");
        setMaterials(res.data ?? []);
      } catch (err) {
        console.error("Fetch_Materials_Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  // Extract all unique categories dynamically from the data stream
  const categories = ["ALL", ...Array.from(new Set(materials.map((m) => m.category)))];

  // Pipeline Filtering Logic
  const filteredMaterials = materials.filter((material) => {
    const matchesType = selectedType === "ALL" || material.material_type === selectedType;
    const matchesCategory = selectedCategory === "ALL" || material.category === selectedCategory;
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (material.description && material.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#050505]">
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        
        {/* HUB HEADER */}
        <header className="mb-16 border-b border-neutral-200 pb-10">
          <div className="space-y-5">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-400">
              <BookOpen className="h-3.5 w-3.5" /> Open_Source_Intelligence_Matrix
            </div>
            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
              AI_Training_Vault
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg">
              Curated notes, research architectures, code modules, and deep-dive tutorial matrices for engineering advanced artificial intelligence systems.
            </p>
          </div>
        </header>

        {/* CONTROLS STRIP: SEARCH & FORMAT TABS */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between border border-neutral-300 bg-white p-6">
          
          {/* FORMAT FILTERS */}
          <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wider">
            {(["ALL", "DOCUMENT", "VIDEO"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`h-9 border px-4 font-bold transition-colors ${
                  selectedType === type
                    ? "bg-black text-white border-black"
                    : "border-neutral-200 bg-transparent text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                {type === "ALL" ? "All" : type === "DOCUMENT" ? "Notes & Documents" : "Video Streams"}
              </button>
            ))}
          </div>

          {/* SEARCH BAR */}
          <div className="relative flex items-center max-w-md w-full border border-neutral-300 bg-[#f5f5f5] px-3 focus-within:border-black transition-colors">
            <Search className="h-4 w-4 text-neutral-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent py-3 font-mono text-xs outline-none text-black"
            />
          </div>
        </div>

        {/* CORE WORKSPACE GRID */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
          
          {/* SIDEBAR: CATEGORY NODES */}
          <aside className="space-y-6 font-mono text-xs">
            <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-neutral-400 text-[10px]">
              <Layers className="h-3.5 w-3.5" /> Knowledge_Domains
            </div>
            <ul className="space-y-1.5 border-l border-neutral-200 pl-4">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left uppercase tracking-tight transition-colors hover:text-black hover:underline ${
                      selectedCategory === category 
                        ? "font-bold text-black border-l-2 border-black -ml-4.5 pl-4" 
                        : "text-neutral-500"
                    }`}
                  >
                    {category === "ALL" ? "Show_All_Nodes" : category.replace(/\s+/g, "_")}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* MAIN GRID: DISPLAY ITEMS */}
          <div>
            {loading ? (
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-neutral-400">
                <Terminal className="h-3.5 w-3.5 animate-spin" />
                <span>Decrypting_Vault_Data...</span>
              </div>
            ) : filteredMaterials.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMaterials.map((material) => (
                  <motion.div
                    key={material.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group flex flex-col justify-between border border-neutral-300 bg-white p-0 shadow-sm transition-all duration-300 hover:border-black hover:shadow-md overflow-hidden"
                  >
                    <div>
                      {/* THUMBNAIL CONTAINER AT TOP OF THE CARD */}
                      <div className="relative w-full h-44 bg-neutral-100 border-b border-neutral-200 overflow-hidden">
                        {material.thumbnail_url ? (
                          <Image
                            src={material.thumbnail_url}
                            alt={material.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority={false}
                          />
                        ) : (
                          /* Fallback brutalist graphic panel for documents */
                          <div className="flex h-full w-full items-center justify-center bg-neutral-50 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                            <FileText className="h-6 w-6 text-neutral-300 mb-1 block mx-auto" />
                            <span>Document_Node</span>
                          </div>
                        )}
                      </div>

                      {/* CARD CONTENT BUFFER */}
                      <div className="p-6">
                        {/* CARD METADATA HEADER */}
                        <div className="mb-4 flex items-center justify-between">
                          <span className="font-mono text-[9px] uppercase tracking-wider bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-neutral-600 font-medium">
                            {material.category}
                          </span>
                          
                          <div className="text-neutral-400 group-hover:text-black transition-colors">
                            {material.material_type === "DOCUMENT" ? (
                              <span title="Technical Document">
                                <FileText className="h-4 w-4" />
                              </span>
                            ) : material.video_context === "PLAYLIST" ? (
                              <span title="Course Playlist Directory">
                                <FolderOpen className="h-4 w-4 text-amber-600" />
                              </span>
                            ) : (
                              <span title="Single Lecture Video">
                                <Video className="h-4 w-4 text-blue-600" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* TITLE */}
                        <h3 className="font-sans text-lg font-bold leading-snug tracking-tight text-neutral-900 mb-3 line-clamp-2 min-h-14">
                          {material.title}
                        </h3>

                        {/* STRUCTURAL TYPE DESCRIPTION DISPLAY */}
                        {material.material_type === "VIDEO" && (
                          <p className="font-mono text-[9px] uppercase font-bold tracking-wider text-neutral-400 mb-2">
                            Structure: <span className="text-neutral-600">{material.video_context}</span>
                          </p>
                        )}

                        {/* DESCRIPTION */}
                        {material.description && (
                          <p className="font-sans text-xs leading-relaxed text-neutral-500 line-clamp-3">
                            {material.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* INTERACTION ACTION FOOTER */}
                    <div className="mx-6 mb-6 border-t border-neutral-100 pt-4">
                      <a
                        href={material.resource_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold tracking-wider text-neutral-900 group-hover:underline"
                      >
                        {material.material_type === "DOCUMENT" ? "Access Document" : "Launch Stream"}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-neutral-300 bg-white py-24 text-center">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-400">
                  Search_Matrix_Empty // No Nodes Matched Filters
                </span>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}