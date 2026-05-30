// components/sections/ManifestoSection.tsx

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export default function ManifestoSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-neutral-950 py-20 md:py-28"
    >
      {/* Dotted Glow Background Layer */}
      <DottedGlowBackground
        gap={24}
        radius={2}
        color="rgba(255,255,255,0.7)"
        glowColor="rgba(255, 255, 255, 0.6)"
        opacity={0.4}
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={0.8}
        speedScale={0.5}
        className="z-0"
      />

      {/* Spotlight Effect Layer */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60 z-1"
        fill="white"
      />

      {/* Optional: Second Spotlight for more depth */}
      <Spotlight
        className="bottom-0 right-0 md:bottom-20 md:right-40 z-1"
        fill="white"
      />

      {/* Subtle overlay to blend the effects */}
      <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-transparent to-neutral-950/50 pointer-events-none z-2" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[160px_1fr]">

          {/* SIDE LABEL */}
          <aside className="hidden lg:block">
            <p className="sticky top-32 text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Philosophy
            </p>
          </aside>

          {/* CONTENT */}
          <div className="space-y-10">

            {/* EYEBROW */}
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="h-px w-6 bg-neutral-700" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
                Commit_Message
              </span>
            </div>

            {/* QUOTE */}
            <h2
              className="
                max-w-4xl
                text-3xl sm:text-4x1
                font-semibold
                text-center
                italic
                leading-[1.1]
                tracking-[-0.02em]
                text-neutral-400
              "
            >
              {" "}
              &quot;I don&apos;t only experiment with AI tools.
              <span className="not-italic text-white">
                {" "}
                I build the tools.
              </span>
              &quot;
            </h2>

            {/* BODY */}
            <div
              className="
                grid
                grid-cols-1
                gap-8
                border-t
                border-[#9b5c3d]
                pt-10
                md:grid-cols-2
                md:gap-16
              "
            >
              {/* LEFT */}
              <p className="text-[16px] font-semibold leading-[1.85] text-neutral-300 text-center md:text-left">
                I&apos;m an engineer focused on understanding what it takes to
                make AI systems actually deliver results in the real world. My
                skills range from rigorous problem-solving and architecting
                reliable pipelines to serving predictive models efficiently at
                scale.
              </p>

              {/* RIGHT */}
              <div className="flex flex-col justify-between gap-8">
                <p className="text-[16px] font-semibold leading-[1.85] text-neutral-300 text-center md:text-left">
                  I specialize in Machine Learning Engineering, autonomous LLM
                  systems, retrieval architectures, and RAG infrastructures
                  solving the hard problems of scaling, latency, orchestration,
                  and production reliability. If you are looking for the same, I
                  am your man.
                </p>

                {/* CTA */}
                <Link
                  href="/contact"
                  className="
                    group
                    inline-flex
                    w-fit
                    self-center
                    md:self-start
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-neutral-700
                    px-5
                    py-2.5
                    text-[12px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-white
                    transition-all
                    duration-200
                    hover:border-neutral-400
                    hover:bg-white/5
                  "
                >
                  Let&apos;s connect
                  <ArrowUpRight
                    className="
                      h-3.5
                      w-3.5
                      transition-transform
                      duration-200
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}