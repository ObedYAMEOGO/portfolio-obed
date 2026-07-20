"use client";

import { useState, useRef } from "react";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import styles from "@/components/contact/ContactPage.module.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const btnRef = useRef<HTMLButtonElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  const fireParticles = () => {
    const container = particlesRef.current;
    if (!container) return;
    container.innerHTML = "";

    const colors = ["#9b5c3d", "#d4a574", "#171717", "#a3a3a3", "#e5e5e5"];
    const count = 20;

    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = styles.particle;
      const angle = (i / count) * 360;
      const dist = 60 + Math.random() * 60;
      const size = 3 + Math.random() * 5;
      const rx = Math.cos((angle * Math.PI) / 180) * dist;
      const ry = Math.sin((angle * Math.PI) / 180) * dist;
      const isRound = Math.random() > 0.5;

      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${colors[i % colors.length]};
        border-radius: ${isRound ? "50%" : "2px"};
        --rx: ${rx}px;
        --ry: ${ry}px;
        animation: particleBurst 0.7s ease-out ${i * 25}ms forwards;
      `;
      container.appendChild(p);
    }

    setTimeout(() => {
      if (container) container.innerHTML = "";
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");

    try {
      await api.post("/leads", formData);
      fireParticles(); // only fire on success
      setTimeout(() => {
        setStatus("success");
        setFormData({ full_name: "", email: "", message: "" });
      }, 900);
    } catch (error) {
      console.error("Submission error:", error);
      setTimeout(() => {
        setStatus("error");
        // auto-clear error after 4s so user can retry
        setTimeout(() => setStatus("idle"), 4000);
      }, 900);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.wrap}>

        {/* ── LEFT ─────────────────────────────────── */}
        <div className={styles.left}>
          <p className={styles.eyebrow}>Contact</p>

          <h1 className={styles.h1}>
            Let&apos;s build<br />
            <em>something.</em>
          </h1>

          <p className={styles.sub}>
            Available for freelance collaborations on Data Science,
            Machine Learning projects, and AI Systems Engineering.
          </p>

          <div className={styles.meta}>
            <p className={styles.metaLabel}>Location</p>
            <p className={styles.metaVal}>Remote / Global</p>
          </div>

          <div className={styles.divider} />

          <p className={styles.note}>
            Typically responds within 48 hours.
          </p>
        </div>

        {/* ── RIGHT ────────────────────────────────── */}
        <div className={styles.right}>

          {status === "success" ? (

            <div className={styles.successCard} role="alert">
              <div className={styles.checkCircle}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                  <path
                    className={styles.checkPath}
                    d="M5 14l5 5L21 8"
                    stroke="#16a34a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className={styles.successText}>
                <p className={styles.successTitle}>Message sent!</p>
                <p className={styles.successSub}>
                  I&apos;ll get back to you within 48 hours.
                </p>
              </div>

              <button
                onClick={() => setStatus("idle")}
                className={styles.resetBtn}
              >
                Send another →
              </button>
            </div>

          ) : (

            <form
              onSubmit={handleSubmit}
              className={styles.form}
              aria-label="Contact form"
            >

              <div className={styles.formCard}>

                {/* NAME */}
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Full Name</label>
                  <Input
                    required
                    placeholder="Enter Your Fullname"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, full_name: e.target.value }))
                    }
                    className={styles.fieldInput}
                  />
                </div>

                {/* EMAIL */}
                <div className={`${styles.field} ${styles.fieldBorder}`}>
                  <label className={styles.fieldLabel}>Email Address</label>
                  <Input
                    required
                    type="email"
                    placeholder="Your Email Id"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
                    }
                    className={styles.fieldInput}
                  />
                </div>

                {/* MESSAGE */}
                <div className={`${styles.field} ${styles.fieldBorder}`}>
                  <label className={styles.fieldLabel}>Message</label>
                  <Textarea
                    required
                    maxLength={2000}
                    placeholder="Tell me about your project…"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, message: e.target.value }))
                    }
                    className={`${styles.fieldInput} ${styles.textarea}`}
                  />
                </div>

              </div>

              {/* SUBMIT */}
              <button
                ref={btnRef}
                type="submit"
                disabled={status === "loading"}
                className={styles.submitBtn}
              >
                <div ref={particlesRef} className={styles.particles} aria-hidden="true" />

                {status === "loading" ? (
                  <>
                    <span className={styles.spinner} />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <span className={styles.btnArrow} aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </>
                )}
              </button>

              {/* ERROR */}
              {status === "error" && (
                <div className={styles.errorBanner} role="alert">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                    <circle cx="7.5" cy="7.5" r="6.5" stroke="#dc2626" strokeWidth="1.2" />
                    <path d="M7.5 4.5v4M7.5 10.5v.5" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  Something went wrong. Please try again.
                </div>
              )}

            </form>

          )}

        </div>
      </main>
    </div>
  );
}