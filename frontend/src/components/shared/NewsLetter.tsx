"use client";

import { useState } from "react";
import { blogApi } from "@/lib/api";
import {
  Terminal,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubscribe = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setStatus("loading");

    try {
      await blogApi.subscribe(email);

      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("Subscription_Error:", err);
      setStatus("error");
    }
  };

  return (
    <section className="border-y border-neutral-200 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* ICON */}
        <Terminal className="mx-auto mb-6 h-6 w-6 text-neutral-400" />

        {/* HEADING */}
        <h2
          className="
            mb-4
            text-3xl
            font-semibold
            tracking-[-0.03em]
            text-[#050505]
            md:text-4xl
          "
        >
          Join the Research List
        </h2>

        {/* DESCRIPTION */}
        <p
          className="
            mx-auto
            mb-10
            max-w-2xl
            text-[15px]
            leading-relaxed
            text-neutral-500
          "
        >
          Get technical deep-dives on AI infrastructure,
          production ML systems, and RAG engineering
          delivered directly to your inbox.
        </p>

        {/* SUCCESS STATE */}
        {status === "success" ? (
          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              font-mono
              text-xs
              uppercase
              tracking-[0.18em]
              text-green-600
            "
          >
            <CheckCircle2 className="h-4 w-4" />
            Subscription confirmed
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="
              mx-auto
              flex
              max-w-md
              flex-col
              gap-3
              sm:flex-row
            "
          >
            {/* INPUT */}
            <input
              type="email"
              required
              placeholder="engineer@research.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                flex-1
                border
                border-neutral-300
                bg-[#f5f5f5]
                px-4
                py-3
                font-mono
                text-xs
                outline-none
                transition-colors
                focus:border-black
                focus:ring-0
              "
            />

            {/* BUTTON */}
            <button
              disabled={status === "loading"}
              className="
                bg-[#050505]
                px-8
                py-3
                font-mono
                text-[10px]
                uppercase
                tracking-[0.18em]
                text-white
                transition-all
                hover:bg-neutral-800
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <span className="flex items-center justify-center gap-2">
                {status === "loading" && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}

                {status === "loading"
                  ? "Processing"
                  : "Subscribe"}
              </span>
            </button>
          </form>
        )}

        {/* ERROR STATE */}
        {status === "error" && (
          <p
            className="
              mt-4
              font-mono
              text-[10px]
              uppercase
              tracking-[0.12em]
              text-red-500
            "
          >
            Subscription failed. Try another email.
          </p>
        )}
      </div>
    </section>
  );
}