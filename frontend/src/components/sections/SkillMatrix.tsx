import { Cpu, Network, Globe } from "lucide-react";
import styles from "./SkillMatrix.module.css";

const capabilities = [
  {
    num: "01",
    title: "Intelligence Engineering",
    icon: Cpu,
    tag: "Machine learning",
    description:
      "Scalable AI & ML systems using Python, NumPy, Pandas, Scikit-Learn, TensorFlow and PyTorch — from predictive models to autonomous LLM/RAG pipelines.",
  },
  {
    num: "02",
    title: "Systems & Orchestration",
    icon: Network,
    tag: "MLOps / DevOps",
    description:
      "Full-stack and MLOps infrastructures orchestrated through ZenML, Docker and Kubernetes — built for efficient deployment and distributed execution at scale.",
  },
  {
    num: "03",
    title: "Adaptability & Communication",
    icon: Globe,
    tag: "Cross-functional",
    description:
      "Execution-driven engineer bridging technical depth with business impact — fluent in French and English, comfortable across contexts from startup to enterprise.",
  },
];

export default function CapabilityMatrix() {
  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>Capabilities</p>
      <h2 className={styles.title}>
        Capability &amp; <em>Execution</em>
      </h2>

      <div className={styles.grid}>
        {capabilities.map(({ num, title, icon: Icon, tag, description }) => (
          <article key={num} className={styles.card}>
            <div className={styles.dot} />
            <div className={styles.glow} />

            <div className={styles.num}>{num}</div>

            <div className={styles.iconWrap}>
              <Icon className={styles.icon} size={18} strokeWidth={1.5} />
            </div>

            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.desc}>{description}</p>

            <div className={styles.footer}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10"
                  stroke="#9b5c3d"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{tag}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}