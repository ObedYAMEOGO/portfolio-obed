"use client";

import { useCallback } from "react";

import { Share2 } from "lucide-react";

export default function PrintButton() {
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <button
      type="button"
      onClick={handlePrint}
      aria-label="Print page"
      className="
        flex
        items-center
        gap-2
        font-mono
        text-[10px]
        uppercase
        tracking-widest
        text-neutral-400
        transition-colors
        hover:text-black
      "
    >
      <Share2 className="h-3 w-3" />

      Archive_Report
    </button>
  );
}