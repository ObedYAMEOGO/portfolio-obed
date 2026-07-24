// components/SkillMatrix.tsx

"use client";

import { Cpu, Network, Globe } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const capabilities = [
  {
    num: "01",
    title: "Intelligence Engineering",
    icon: Cpu,
    tag: "Machine learning",
    description:
      "Scalable AI & ML systems — from predictive models to autonomous LLM/RAG pipelines that turn raw data into decisions teams can act on.",
  },
  {
    num: "02",
    title: "Systems & Orchestration",
    icon: Network,
    tag: "MLOps / DevOps",
    description:
      "Full-stack and MLOps infrastructures orchestration, built to cut deployment time and infra cost while scaling reliably as demand grows.",
  },
  {
    num: "03",
    title: "Adaptability & Communication",
    icon: Globe,
    tag: "Cross-functional",
    description:
      "Execution-driven engineer aligning technical depth with business goals, making tradeoffs clear, and discussing realities",
  },
];

export default function SkillMatrix() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 border-t border-neutral-200 dark:border-neutral-800"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-2">
            Capabilities
          </p>
          <h2 className="text-[30px] sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
            Capability & <em className="not-italic font-bold">Execution</em>
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
            Core competencies driving AI system development and deployment at scale.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <SkillCard key={capability.num} capability={capability} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillCard({ capability, index }: { capability: typeof capabilities[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { num, title, icon: Icon, tag, description } = capability;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 via-white to-white transition-all duration-300 ease-out hover:-translate-y-1 hover:border-amber-300/80 hover:shadow-[0_8px_24px_-4px_rgba(180,140,20,0.15)] dark:border-amber-900/40 dark:bg-gradient-to-br dark:from-amber-950/20 dark:via-neutral-900 dark:to-neutral-900 dark:hover:border-amber-700/60"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms`,
      }}
    >
      {/* Hover background wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-amber-900/20" />

      <div className="relative p-5">
        {/* Number */}
        <p className="font-mono text-[10px] font-semibold tracking-[0.15em] text-amber-500/70 dark:text-amber-600/60 mb-4">
          {num}
        </p>

        {/* Icon */}
        <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-amber-200/60 bg-gradient-to-br from-amber-50 to-white mb-4 transition-all duration-200 group-hover:border-amber-300 group-hover:from-amber-100 dark:border-amber-800/40 dark:from-amber-950/30 dark:to-neutral-900">
          <Icon className="h-4 w-4 text-amber-600/70 transition-all duration-200 group-hover:text-amber-700 dark:text-amber-500/70" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold leading-snug text-neutral-900 dark:text-white mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400 mb-4">
          {description}
        </p>

        {/* Divider */}
        <div className="mb-4 h-px bg-amber-100 transition-colors duration-300 group-hover:bg-amber-200 dark:bg-neutral-800 dark:group-hover:bg-amber-900/40" />

        {/* Tag/footer */}
        <div className="flex items-center gap-1.5">
          <svg
            width="12"
            height="12"
            viewBox="0 0 13 13"
            fill="none"
            className="text-amber-500/70 transition-colors duration-300 group-hover:text-amber-600 dark:text-amber-600/60"
          >
            <path
              d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-500 transition-colors duration-300 group-hover:text-neutral-600 dark:text-neutral-400 dark:group-hover:text-neutral-300">
            {tag}
          </span>
        </div>
      </div>
    </article>
  );
}