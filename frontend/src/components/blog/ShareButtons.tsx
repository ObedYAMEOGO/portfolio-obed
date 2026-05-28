"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

export default function ShareButtons() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled or failed:", err);
      }
    } else {
      // Fallback to copy URL
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Share button (uses native share API or falls back to copy) */}
      <button
        onClick={handleShare}
        className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-300 hover:scale-110"
        aria-label="Share article"
      >
        <Share2 className="h-4 w-4 text-neutral-600" />
      </button>
      
      {/* Copy link button */}
      <button
        onClick={handleCopy}
        className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-300 hover:scale-110 relative"
        aria-label="Copy link"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4 text-neutral-600" />
        )}
      </button>
    </div>
  );
}