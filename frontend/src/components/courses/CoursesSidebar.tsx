"use client";

import { Layers } from "lucide-react";

interface CoursesSidebarProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function CoursesSidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CoursesSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      {/* HERO */}
      <div className="border-b border-neutral-200 px-6 py-8 dark:border-neutral-800">
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Learning Hub
            </span>
            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-900 dark:text-white">
              AI Training Vault
            </h1>
          </div>
          <p className="text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            Some of my curated and recommended notes, research architectures,
            code modules, and deep-dive tutorials for engineering advanced AI
            systems.
          </p>
        </div>
      </div>

      {/* CATEGORY HEADER */}
      <div className="flex items-center gap-2 border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <Layers className="h-4 w-4 text-neutral-400" />
        <h2 className="text-sm font-semibold tracking-wide text-neutral-700 dark:text-neutral-200">
          Categories
        </h2>
      </div>

      {/* CATEGORY LIST */}
      {/* Added suppressHydrationWarning here to cover child buttons */}
      <div 
        className="flex-1 overflow-y-auto px-3 py-4" 
        suppressHydrationWarning={true}
      >
        <div className="space-y-1">
          {categories.map((category) => {
            const active = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  flex
                  w-full
                  items-center
                  rounded-xl
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  ${
                    active
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                      : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
                  }
                `}
              >
                {category === "ALL" ? "All Courses" : category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}