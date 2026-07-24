"use client";

import { useActionState, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { subscribeToNewsletter } from "@/actions/newsletter";

const initialState = {
  success: false,
  message: "",
};

export default function NewsletterSubscribe() {
  const [state, formAction, pending] = useActionState(
    subscribeToNewsletter,
    initialState,
  );

  const [visibleMessage, setVisibleMessage] = useState(initialState);

  // Sync action state into local state, then auto-clear after 4 s
  useEffect(() => {
    if (!state.message) return;

    setVisibleMessage(state);

    const timer = setTimeout(() => {
      setVisibleMessage({ success: false, message: "" });
    }, 4000);

    return () => clearTimeout(timer);
  }, [state]);

  const showSuccess = visibleMessage.success && visibleMessage.message;
  const showError = !visibleMessage.success && visibleMessage.message;

  return (
    <section className="bg-white py-10">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-7 px-6 text-center">
        <div className="space-y-4">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Newsletter
          </span>

          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-neutral-900 md:text-4xl">
            Join the Builders List
          </h2>

          <p className="text-[16px] leading-relaxed text-neutral-500">
            Receive technical deep-dives on machine learning engineering, AI
            infrastructure, RAG systems, LLMs, AI agents etc, straight
            to your inbox.
          </p>
        </div>

        <form
          action={formAction}
          className="flex w-full max-w-sm flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            disabled={pending}
            className="
              flex-1 rounded-full border border-neutral-200 bg-white px-5 py-3
              text-[14px] text-neutral-900 outline-none transition-colors
              placeholder:text-neutral-400 focus:border-neutral-400 disabled:opacity-60
            "
          />

          <button
            type="submit"
            disabled={pending}
            className="
              inline-flex items-center justify-center gap-2 rounded-full
              bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500
              bg-[length:200%_auto] px-6 py-3 text-[12px] font-semibold uppercase
              text-white shadow-xs transition-all duration-300
              hover:bg-[position:right_center] hover:scale-[1.02]
              hover:shadow-lg hover:shadow-amber-300/40 active:scale-[0.98]
              disabled:opacity-60 disabled:hover:scale-100
            "
          >
            {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {pending ? "Subscribing…" : "Subscribe"}
          </button>
        </form>

        <div className="min-h-5" suppressHydrationWarning>
          {showSuccess && (
            <div className="flex items-center gap-2 text-[13px] font-medium text-green-600">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {visibleMessage.message}
            </div>
          )}

          {showError && (
            <div className="flex items-center gap-2 text-[13px] font-medium text-red-500">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {visibleMessage.message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}