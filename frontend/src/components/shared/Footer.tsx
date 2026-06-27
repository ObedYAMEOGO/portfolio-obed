import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";


/* =========================================================
   SOCIAL LINKS
========================================================= */

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/obedyameogo/" },
  { label: "GitHub",   href: "https://github.com/ObedYAMEOGO" },
  { label: "Facebook", href: "https://www.facebook.com/burkimbila10xxkrt" },
];

const navLinks = [
  { label: "Projects",  href: "/projects" },
  { label: "Blog",      href: "/blog" },
  { label: "Courses",   href: "/courses" },
  { label: "Let's Connect",   href: "/contact" },
];

/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
  return (
    <footer className="bg-black">
      {/* MAIN FOOTER */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">

          {/* =========================================================
              LEFT — IDENTITY & NAVIGATION
          ========================================================= */}

          <div className="flex flex-col gap-6">
            {/* PROFILE ROW */}
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-neutral-700 bg-neutral-800">
                <Image
                  src="/profile-obed.png"
                  alt="Obed Yameogo"
                  fill
                  priority={false}
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div>
                <p className="text-[15px] font-semibold tracking-tight text-white">
                  Obed Yameogo
                </p>
                <p className="text-[12px] text-neutral-400">
                  ML Engineer · PhD Scholar
                </p>
              </div>
            </div>

            {/* BIO */}
            <p className="max-w-md text-[14px] leading-relaxed text-neutral-400">
              Building production-grade intelligent systems from ML
              infrastructure and RAG pipelines to autonomous LLM architectures.
            </p>

            {/* SOCIAL LINKS */}
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-neutral-700
                    bg-black
                    px-4
                    py-2
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-widest
                    text-neutral-400
                    transition-all
                    duration-200
                    hover:border-neutral-600
                    hover:bg-neutral-900
                    hover:text-white
                  "
                >
                  {link.label}
                  <ArrowUpRight
                    className="
                      h-3
                      w-3
                      transition-transform
                      duration-200
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* =========================================================
              RIGHT — NAVIGATION LINKS & CTA (INLINE)
          ========================================================= */}

          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12 lg:gap-16">
            {/* Navigation Links - Inline */}
            <div className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                Pages
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[14px] text-neutral-400 transition-colors duration-150 hover:text-white whitespace-nowrap"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                Work together
              </p>
              <div className="space-y-2">
                <p className="text-[18px] font-semibold leading-snug tracking-[-0.02em] text-white md:text-[20px]">
                  Let&apos;s build<br />intelligence.
                </p>
                <Link
                  href="/contact"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-1.5
                    text-[13px]
                    font-medium
                    text-neutral-400
                    transition-colors
                    duration-150
                    hover:text-white
                  "
                >
                  Get in touch
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="mt-12 border-t border-neutral-800 pt-6">
          <p className="text-[11px] text-neutral-500">
            © {new Date().getFullYear()} Obed Yameogo · All rights reserved
          </p>
        </div>

      </div>
    </footer>
  );
}