import {
  Terminal,
  Cpu,
  Network,
  Globe,
} from "lucide-react";

const capabilities = [
  {
    title: "Intelligence_Engineering",
    icon: Cpu,
    description:
      "Develops scalable AI and machine learning systems using Python, leveraging NumPy, Pandas, Scikit-Learn, TensorFlow, and PyTorch to engineer predictive models, neural networks, and autonomous LLM/RAG systems.",
  },
  {
    title: "Systems_&_Orchestration",
    icon: Network,
    description:
      "Engineers scalable full-stack and MLOps infrastructures using the PORN Stack, orchestrated through ZenML, Docker, and Kubernetes for efficient deployment and distributed execution.",
  },
  {
    title: "Adaptability_&_Communication",
    icon: Globe,
    description:
      "Adaptive and execution-driven engineer with strong communication skills in French and English, capable of bridging technical systems with impactful business outcomes.",
  },
];

export default function CapabilityMatrix() {
  return (
    <section className="border-t border-neutral-200 pt-16">
      <div className="space-y-20">
        {/* HEADER */}
        <div className="flex items-center gap-6">
          <h2
            className="
              flex
              items-center
              gap-2
              font-mono
              text-xs
              font-bold
              uppercase
              tracking-[0.25em]
              text-[#050505]
            "
          >
            <Terminal className="h-3.5 w-3.5" />

            Capability_&_Execution_Architecture
          </h2>

          <div className="h-px grow bg-neutral-200" />
        </div>

        {/* CAPABILITIES */}
        <div
          className="
            grid
            grid-cols-1
            gap-8
            md:grid-cols-3
          "
        >
          {capabilities.map(
            ({
              title,
              icon: Icon,
              description,
            }) => (
              <article
                key={title}
                className="
                  flex
                  flex-col
                  border
                  border-neutral-300
                  bg-white
                  p-6
                  shadow-sm
                  transition-colors
                  duration-300
                  hover:border-black
                "
              >
                {/* TITLE */}
                <div
                  className="
                    mb-4
                    flex
                    items-center
                    gap-2
                    border-b
                    border-neutral-100
                    pb-2
                    font-mono
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-neutral-400
                  "
                >
                  <Icon className="h-4 w-4 text-black" />

                  <span>{title}</span>
                </div>

                {/* DESCRIPTION */}
                <p
                  className="
                    text-[13px]
                    leading-relaxed
                    text-neutral-600
                  "
                >
                  {description}
                </p>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}