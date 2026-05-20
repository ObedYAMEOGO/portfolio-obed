// components/sections/ManifestoSection.tsx

import Link from "next/link";

import { ArrowRight } from "lucide-react";

export default function ManifestoSection() {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        border-y
        border-neutral-800
        bg-[#050505]
        py-14
        md:mt-0
        md:py-18
      "
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[180px_1fr]">
          {/* SIDE LABEL */}
          <aside className="hidden lg:block">
            <p
              className="
                sticky
                top-32
                font-mono
                text-[10px]
                uppercase
                tracking-[0.35em]
                text-neutral-500
              "
            >
              Engineering Philosophy
            </p>
          </aside>

          {/* CONTENT */}
          <div className="space-y-8">
            {/* TOP */}
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-px w-8 bg-neutral-700" />

                <span
                  className="
                    font-mono
                    text-[10px]
                    uppercase
                    tracking-[0.28em]
                    text-neutral-500
                  "
                >
                  Commit_Message
                </span>
              </div>

              <h2
                className="
                  max-w-5xl
                  text-2xl
                  font-semibold
                  italic
                  leading-[1.02]
                  tracking-tighter
                  text-white
                  sm:text-4xl
                  md:text-5xl
                  lg:text-[3.0rem]
                "
              >
                “I don&apos;t only experiment
                with AI tools.
                <span className="font-bold not-italic text-neutral-500">
                  {" "}
                  I build the tools.
                </span>
                ”
              </h2>
            </div>

            {/* BODY */}
            <div
              className="
                grid
                grid-cols-1
                gap-8
                border-t
                border-neutral-800
                pt-8
                md:grid-cols-2
              "
            >
              {/* LEFT */}
              <div>
                <p
                  className="
                    text-[16px]
                    leading-relaxed
                    text-neutral-400
                    md:text-[17px]
                  "
                >
                  I am an engineer focused
                  on understanding what it
                  takes to make AI systems
                  actually deliver results
                  in the real world. My
                  skills range from rigorous
                  problem-solving and
                  architecting reliable
                  pipelines to serving
                  predictive models
                  efficiently at scale.
                </p>
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                <p
                  className="
                    text-[16px]
                    leading-relaxed
                    text-neutral-400
                    md:text-[17px]
                  "
                >
                  I specialize in Machine
                  Learning Engineering,
                  autonomous LLM systems,
                  retrieval architectures,
                  and RAG infrastructures —
                  solving the hard problems
                  of scaling, latency,
                  orchestration, and
                  production reliability.
                  If you are looking for the
                  same — I am your man.
                </p>

                {/* CTA */}
                <div className="pt-2">
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
                      text-[11px]
                      uppercase
                      tracking-[0.22em]
                      text-white
                      transition-all
                      duration-300
                      hover:border-white
                    "
                  >
                    Let&apos;s Connect

                    <ArrowRight
                      className="
                        h-3
                        w-3
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}