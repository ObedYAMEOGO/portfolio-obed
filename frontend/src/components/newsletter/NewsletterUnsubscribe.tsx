"use client";

import { useActionState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import {
  unsubscribeFromNewsletter,
} from "@/actions/newsletter";

const initialState = {
  success: false,
  message: "",
};

export default function NewsletterUnsubscribe() {
  const [state, formAction, pending] =
    useActionState(
      unsubscribeFromNewsletter,
      initialState,
    );

  return (
    <section className="bg-white py-10">
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-6">

        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">
            Unsubscribe from Newsletter
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Stop receiving blog and article updates.
          </p>
        </div>

        <form
          action={formAction}
          className="flex flex-col gap-3"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            disabled={pending}
            className="
              rounded-xl
              border
              border-neutral-200
              px-4
              py-3
              text-sm
              outline-none
              focus:border-neutral-400
            "
          />

          <button
            type="submit"
            disabled={pending}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-red-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition-colors
              hover:bg-red-700
              disabled:opacity-50
            "
          >
            {pending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            Unsubscribe
          </button>
        </form>

        <div className="min-h-5">
          {state.success && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              {state.message}
            </div>
          )}

          {!state.success && state.message && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              {state.message}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}