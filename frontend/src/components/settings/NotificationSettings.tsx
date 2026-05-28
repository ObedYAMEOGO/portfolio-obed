"use client";

import { useState } from "react";

import {
  Bell,
  Loader2,
} from "lucide-react";

interface Props {
  email: string;
}

export default function NotificationSettings({
  email,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [enabled, setEnabled] =
    useState(true);

  async function toggleNotifications() {
    try {
      setLoading(true);

      const endpoint = enabled
        ? "/notifications/unsubscribe"
        : "/notifications/subscribe";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Request failed",
        );
      }

      setEnabled(!enabled);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-8">

      <div className="flex items-start justify-between gap-6">

        <div>
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-neutral-900" />

            <h2 className="text-xl font-semibold">
              Platform Notifications
            </h2>
          </div>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-500">
            Receive notifications when new projects,
            learning materials and platform updates are published.
          </p>
        </div>

        <button
          onClick={toggleNotifications}
          disabled={loading}
          className={`
            inline-flex
            items-center
            justify-center
            rounded-full
            px-5
            py-3
            text-sm
            font-semibold
            transition-colors
            disabled:opacity-50

            ${
              enabled
                ? "bg-neutral-900 text-white hover:bg-neutral-700"
                : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
            }
          `}
        >
          {loading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}

          {enabled
            ? "Disable"
            : "Enable"}
        </button>

      </div>

    </div>
  );
}