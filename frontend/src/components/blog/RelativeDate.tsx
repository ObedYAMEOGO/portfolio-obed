"use client";

import { useEffect, useState } from "react";

import { formatPostDate, formatRelativeDate } from "@/types/blog-utils";

interface RelativeDateProps {
  dateString?: string | null;
  /** Extra class names forwarded to the wrapping <time> element. */
  className?: string;
}

/**
 * Renders a date string without causing a hydration mismatch.
 *
 * How it works:
 *   1. Server + first client render  → stable absolute label ("Jan 5, 2025")
 *      via formatPostDate — identical on both sides, no mismatch.
 *   2. After hydration (useEffect)   → swaps to relative label ("Yesterday",
 *      "3 days ago", etc.) via formatRelativeDate which calls new Date().
 *
 * Replace every <span>{formatPostDate(...)}</span> that shows a relative
 * label with <RelativeDate dateString={...} /> and the error disappears.
 */
export default function RelativeDate({
  dateString,
  className,
}: RelativeDateProps) {
  // Initial state: stable absolute format safe for SSR
  const [label, setLabel] = useState(() => formatPostDate(dateString));

  useEffect(() => {
    // After hydration: swap to the human-readable relative label
    setLabel(formatRelativeDate(dateString));
  }, [dateString]);

  return (
    <time
      dateTime={dateString ?? undefined}
      className={className}
      // suppressHydrationWarning is intentional here — the one-tick swap
      // from absolute → relative label is expected and harmless.
      suppressHydrationWarning
    >
      {label}
    </time>
  );
}