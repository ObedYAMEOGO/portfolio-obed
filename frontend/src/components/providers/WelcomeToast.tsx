"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, X } from "lucide-react";

export default function WelcomeToast() {
  const { user, isSignedIn } = useUser();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const key = `welcomed_${user.id}`;
    if (!sessionStorage.getItem(key)) {
      setShow(true);
      sessionStorage.setItem(key, "true");
    }
  }, [user, isSignedIn]);

  if (!show) return null;

  return (
    <div
      className="
        absolute
        right-0
        top-[calc(100%+8px)]
        z-50
        w-[272px]
        rounded-xl
        border
        border-neutral-200/80
        bg-white
        p-4
        shadow-[0_4px_24px_rgba(0,0,0,0.07)]
        animate-in
        fade-in-0
        zoom-in-95
        slide-in-from-top-2
        duration-200
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-neutral-900">
            Hey, {user?.firstName || "there"} 👋
          </p>
          <p className="text-xs leading-relaxed text-neutral-500">
            Glad you&apos;re here. Explore whenever you&apos;re ready.
          </p>
        </div>

        <button
          onClick={() => setShow(false)}
          className="
            mt-0.5
            flex
            h-5
            w-5
            shrink-0
            items-center
            justify-center
            rounded
            text-neutral-400
            transition-colors
            hover:bg-neutral-100
            hover:text-neutral-600
          "
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => setShow(false)}
          className="
            h-7
            rounded-full
            border
            border-neutral-200
            px-3
            text-xs
            text-neutral-500
            transition-colors
            hover:bg-neutral-50
          "
        >
          Later
        </button>

        <button
          onClick={() => setShow(false)}
          className="
            flex
            h-7
            items-center
            gap-1
            rounded-full
            bg-neutral-900
            px-3
            text-xs
            text-white
            transition-colors
            hover:bg-neutral-700
          "
        >
          Explore
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}