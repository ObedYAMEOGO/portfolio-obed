"use client";

import { useActionState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Terminal,
} from "lucide-react";

import { subscribeToNewsletter } from "@/actions/newsletter";

const initialState = {
  success: false,
  message: "",
};

export default function Newsletter() {
  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    subscribeToNewsletter,
    initialState,
  );

  return (
    <section className="border-y border-neutral-200 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">

        <Terminal className="mx-auto mb-6 h-6 w-6 text-neutral-400" />

        <h2
          className="
            mb-4
            text-4xl
            font-semibold
            uppercase
            tracking-[-0.03em]
            text-[#050505]
            md:text-4xl
          "
        >
          Join the Research List
        </h2>

        <p
          className="
            mx-auto
            mb-10
            max-w-2xl
            text-xl
            uppercase
            leading-relaxed
            text-neutral-500
          "
        >
          Get technical deep-dives on AI infrastructure,
          production ML systems, and RAG engineering
          delivered directly to your inbox.
        </p>

        <form
          action={formAction}
          className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
        >

          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="engineer@research.com"
            disabled={pending}
            aria-label="Email address"
            className="
              flex-1
              border
              border-neutral-300
              bg-[#f5f5f5]
              px-4
              py-3
              font-mono
              text-xs
              text-[#050505]
              outline-none
              transition-colors
              placeholder:text-neutral-400
              focus:border-black
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />

          <button
            type="submit"
            disabled={pending}
            className="
              flex
              items-center
              justify-center
              gap-2
              bg-[#050505]
              px-8
              py-3
              font-mono
              text-[10px]
              uppercase
              tracking-[0.18em]
              text-white
              transition-colors
              hover:bg-neutral-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            {pending && (
              <Loader2 className="h-3 w-3 animate-spin" />
            )}

            {pending
              ? "Processing"
              : "Subscribe"}

          </button>

        </form>

        {/* STATUS MESSAGE */}

        <div className="mt-5 min-h-[20px]">

          {state.success && state.message && (
            <div
              className="
                flex
                items-center
                justify-center
                gap-2
                font-mono
                text-[10px]
                uppercase
                tracking-[0.12em]
                text-green-600
              "
            >

              <CheckCircle2 className="h-3.5 w-3.5" />

              {state.message}

            </div>
          )}

          {!state.success &&
            state.message && (
              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.12em]
                  text-red-500
                "
              >

                <AlertCircle className="h-3.5 w-3.5" />

                {state.message}

              </div>
            )}

        </div>

        <noscript>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#737373",
              fontFamily: "monospace",
            }}
          >
            JavaScript disabled — form still works.
          </p>
        </noscript>

      </div>
    </section>
  );
}