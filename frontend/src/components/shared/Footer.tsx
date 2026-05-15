"use client";

import Newsletter from "./NewsLetter";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-6 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400 md:flex-row">
        
        {/* IDENTITY */}
        <div className="flex items-center gap-4">
          
          {/* PROFILE IMAGE */}
          <div className="relative h-40 w-40 overflow-hidden border border-neutral-200">
            <Image
              src="/profile-obed.png"
              alt="Obed Yameogo"
              fill
              className="object-cover grayscale"
            />
          </div>

          {/* NAME + TITLE */}
          <div className="flex flex-col">
            <span className="text-neutral-700">
              OBED YAMEOGO
            </span>

            <span className="mt-1 text-[9px] tracking-[0.18em] text-neutral-400">
              PhD Scholar in AI, Machine Learning Engineer <br />© {currentYear} 
            </span>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className="w-full md:w-auto">
          <Newsletter />
        </div>

{/* SOCIAL LINKS */}
<div className="flex flex-col items-center gap-3">
  
  {/* FOLLOW ME TITLE */}
  <span className="text-xs tracking-[0.35em] text-black">
    Follow Me
  </span>

  {/* LINKS */}
  <div className="flex items-center gap-3 text-[10px] tracking-[0.2em]">
    
    <Link
      href="https://www.linkedin.com/in/obedyameogo/"
      target="_blank"
      className="border border-neutral-200 px-3 py-2 transition-all duration-300 hover:border-black hover:text-black"
    >
      LinkedIn
    </Link>
    <Link
      href="https://github.com/ObedYAMEOGO"
      target="_blank"
      className="border border-neutral-200 px-3 py-2 transition-all duration-300 hover:border-black hover:text-black"
    >
      GitHub
    </Link>

    <Link
      href="https://www.facebook.com/burkimbila10xxkrt"
      target="_blank"
      className="border border-neutral-200 px-3 py-2 transition-all duration-300 hover:border-black hover:text-black"
    >
      Facebook
    </Link>
  </div>
</div>
      </div>
    </footer>
  );
}