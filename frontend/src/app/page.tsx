"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";

import { ArrowRight, GraduationCap } from "lucide-react";

import api from "@/lib/api";
import { Project } from "@/types";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get<Project[]>("/projects");
        setProjects(res.data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5] text-[#050505] font-serif selection:bg-neutral-200">
      <main className="relative flex flex-col items-center overflow-hidden px-4 pt-28 pb-14 sm:px-6">
        {/* GRID BACKGROUND */}
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* HERO SECTION */}
        <div className="flex min-h-[58vh] w-full max-w-7xl items-center">
          <div className="grid w-full grid-cols-1 items-center gap-14 lg:grid-cols-[60%_40%]">
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="
                flex
                flex-col
                items-center
                space-y-6
                text-center
                lg:items-start
                lg:text-left
              "
            >
              <div className="inline-flex items-center gap-2 border border-neutral-300 bg-white px-5 py-2 text-[10px] font-mono uppercase tracking-[0.35em] text-neutral-500 shadow-sm">
                A Machine Learning Engineer
              </div>

              <h1
                className="
                  max-w-3xl
                  text-[2.6rem]
                  font-semibold
                  leading-[0.95]
                  tracking-[-0.04em]
                  text-[#050505]
                  text-balance
                  sm:text-[3.5rem]
                  md:text-[5rem]
                "
              >
                Focused on Building Production-Grade ML & Intelligent Systems.
              </h1>

              <div className="space-y-4">
                <span className="block font-mono text-sm font-bold uppercase tracking-[0.35em] text-neutral-400">
                  Research — Engineering — Deployment
                </span>
              </div>

              <div
                className="
                  flex
                  flex-col
                  items-center
                  gap-4
                  pt-1
                  sm:flex-row
                  lg:items-start
                "
              >
                <Button
                  asChild
                  size="lg"
                  className="h-11 w-full bg-[#050505] px-8 font-mono text-[10px] uppercase tracking-widest text-[#f5f5f5] transition-all hover:bg-neutral-800 sm:w-auto"
                >
                  <Link href="/projects" className="flex items-center gap-2">
                    View My Projects
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-11 w-full border-neutral-300 bg-white font-mono text-[10px] uppercase tracking-widest transition-all hover:bg-neutral-100 sm:w-auto"
                >
                  <Link href="/admin/dashboard">Dashboard</Link>
                </Button>
              </div>
            </motion.div>
            {/* RIGHT IMAGE SECTION */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <div className="relative flex aspect-square w-70 items-center justify-center sm:w-[320px] md:w-107.5 lg:h-125 lg:w-125">
                {/* GLOW */}
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-neutral-200/90 via-white to-neutral-300/80 blur-3xl" />

                {/* FLOATING INFO CARD */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute hidden md:flex -left-6 top-3 lg:-left-14 z-20 max-w-55 flex-col gap-2 border border-white/40 bg-white/80 p-5 backdrop-blur-md"
                >
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">
                    Identity_Verified
                  </p>

                  <h3 className="font-serif text-2xl font-bold leading-none text-[#050505]">
                    Obed Yameogo
                  </h3>

                  <div className="flex flex-col gap-2 border-t border-neutral-200 pt-3">
                    <p className="flex items-center gap-2 text-[11px] font-medium text-neutral-700">
                      <GraduationCap className="h-4 w-4 text-neutral-500" />
                      PhD Scholar in AI · MLE
                    </p>
                  </div>
                </motion.div>

                {/* PROFILE IMAGE */}
                <div className="relative z-10 h-full w-full overflow-hidden rounded-none md:rounded-full lg:rounded-4xl">
                  <Image
                    src="/profile-obed.png"
                    alt="Obed Yameogo"
                    fill
                    priority
                    className=" pointer-events-none select-none object-cover md:object-contain md:p-2 "
                  />
                </div>

                {/* MOBILE NAME TAG */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className=" absolute bottom-0 left-0 right-0 z-30 md:hidden"
                >
                  <div className="w-full border-t border-white/40 bg-white/88 px-4 py-3 text-center backdrop-blur-md">
                    <p className="text-[1rem] font-bold uppercase tracking-[0.12em] leading-none text-[#050505]">
                      OBED YAMEOGO
                    </p>
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-600">
                      PhD Scholar in AI · MLE
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* MANIFESTO SECTION */}
        <section
          className="
            relative
            mt-16
            w-full
            overflow-hidden
            bg-[#050505]
            py-14
            sm:mt-12
            md:mt-6
            lg:-mt-1
          "
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[160px_1fr]">
              {/* SIDE LABEL */}
              <div className="hidden lg:block">
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500">
                  Engineering Philosophy
                </p>
              </div>

              {/* CONTENT */}
              <div className="space-y-6">
                {/* HEADER */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-px w-8 bg-neutral-700" />

                    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                      Commit_Message
                    </span>
                  </div>

                  <h2
                    className="
                      max-w-5xl
                      font-serif
                      text-3xl
                      font-semibold
                      italic
                      leading-[1.05]
                      tracking-[-0.04em]
                      text-white
                      md:text-5xl
                    "
                  >
                    “I don&apos;t only experiment with AI tools.
                    <span className="font-bold not-italic text-neutral-500">
                      {" "}
                      I build the tools.
                    </span>
                    ”
                  </h2>
                </motion.div>

                {/* BODY */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="
                    grid
                    grid-cols-1
                    gap-6
                    border-t
                    border-neutral-800
                    pt-6
                    md:grid-cols-2
                  "
                >
                  <div>
                    <p className="text-[17px] leading-relaxed text-neutral-400">
                      I am an engineer focused on understanding what it takes to
                      make AI systems actually deliver results in the real
                      world. From architecting reliable pipelines to serving
                      predictive models efficiently at scale.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <p className="text-[17px] leading-relaxed text-neutral-400">
                      I specialize in MLE and LLM pipelines, improving RAG
                      performance, and solving the hard problems of scaling,
                      latency, and production reliability. If you are looking
                      for the same — I am your man.
                    </p>

                    {/* CTA */}
                    <div className="pt-4">
                      <Link
                        href="/contact"
                        className="
                          group
                          inline-flex
                          items-center
                          gap-3
                          border-b
                          border-white/20
                          pb-2
                          font-mono
                          text-xs
                          uppercase
                          tracking-widest
                          text-white
                          transition-all
                          hover:border-white
                        "
                      >
                        Let&apos;s Connect
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section className="mt-16 w-full max-w-7xl space-y-10">
          <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 md:flex-row md:items-end">
            <div className="space-y-3">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-400">
                01 // Selected_Works
              </h2>

              <h3 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Projects
              </h3>
            </div>

            <Button
              asChild
              variant="link"
              className="group p-0 font-mono text-[10px] uppercase tracking-widest text-neutral-900"
            >
              <Link href="/projects" className="flex items-center gap-2">
                Explore All Projects
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {projects.length > 0
              ? projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              : Array(2)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="
                        h-64
                        w-full
                        animate-pulse
                        rounded-2xl
                        border
                        border-neutral-300
                        bg-neutral-200
                      "
                    />
                  ))}
          </div>
        </section>
      </main>
    </div>
  );
}
