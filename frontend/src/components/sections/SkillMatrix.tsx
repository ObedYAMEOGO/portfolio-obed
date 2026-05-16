"use client";

import { Terminal, Cpu, Network, Globe } from "lucide-react";

export default function CapabilityMatrix() {
  return (
    <section className="border-t pt-10 border-neutral-200">
      <div className="space-y-20">
        
        {/* SECTION HEADER */}
        <div className="flex items-center gap-6">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#050505] flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5" /> Capability_&_Execution_Architecture
          </h2>
          <div className="h-px grow bg-neutral-200" />
        </div>

        {/* CENTERED CORE OPERATIONAL THESIS */}
        {/* STRUCTURED CAPABILITY PILLARS */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 font-mono text-xs">
          
          {/* PILLAR 1 */}
          <div className="border border-neutral-300 bg-white p-6 shadow-sm transition-all duration-300 hover:border-black flex flex-col">
            <div className="mb-4 flex items-center gap-2 font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-2 text-[11px]">
              <Cpu className="h-4 w-4 text-black" />
              <span>Intelligence_Engineering</span>
            </div>

            <p className="text-neutral-600 leading-relaxed text-[13px] text-justify">
              Develops scalable AI and machine learning systems using{" "}
              <span className="font-bold text-neutral-900">Python</span>,
              leveraging{" "}
              <span className="font-bold text-neutral-900">NumPy</span>,{" "}
              <span className="font-bold text-neutral-900">Pandas</span>,{" "}
              <span className="font-bold text-neutral-900">
                Scikit-Learn
              </span>
              ,{" "}
              <span className="font-bold text-neutral-900">
                TensorFlow
              </span>{" "}
              and{" "}
              <span className="font-bold text-neutral-900">PyTorch</span> to
              engineer predictive models, neural networks, and autonomous{" "}
              <span className="font-bold text-neutral-900">LLM/RAG</span>{" "}
              systems.
            </p>
          </div>

          {/* PILLAR 2 */}
          <div className="border border-neutral-300 bg-white p-6 shadow-sm transition-all duration-300 hover:border-black flex flex-col">
            <div className="mb-4 flex items-center gap-2 font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-2 text-[11px]">
              <Network className="h-4 w-4 text-black" />
              <span>Systems_&_Orchestration</span>
            </div>

            <p className="text-neutral-600 leading-relaxed text-[13px] text-justify">
              Engineers scalable full-stack and MLOps infrastructures using the{" "}
              <span className="font-bold text-neutral-900">
                PORN Stack
              </span>
              , orchestrated through{" "}
              <span className="font-bold text-neutral-900">ZenML</span>,{" "}
              <span className="font-bold text-neutral-900">Docker</span>, and{" "}
              <span className="font-bold text-neutral-900">
                Kubernetes
              </span>{" "}
              for efficient deployment and distributed execution.
            </p>
          </div>

          {/* PILLAR 3 */}
          <div className="border border-neutral-300 bg-white p-6 shadow-sm transition-all duration-300 hover:border-black flex flex-col">
            <div className="mb-4 flex items-center gap-2 font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-2 text-[11px]">
              <Globe className="h-4 w-4 text-black" />
              <span>Adaptability_&_Communication</span>
            </div>

            <p className="text-neutral-600 leading-relaxed text-[13px] text-justify">
              Adaptive and execution-driven engineer with strong communication
              skills in{" "}
              <span className="font-bold text-neutral-900">French</span> and{" "}
              <span className="font-bold text-neutral-900">English</span>,
              capable of bridging technical systems with impactful business
              outcomes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}