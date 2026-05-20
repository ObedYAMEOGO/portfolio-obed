import Link from "next/link";
import Image from "next/image";
import Newsletter from "./NewsLetter";


const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/obedyameogo/",
  },
  {
    label: "GitHub",
    href: "https://github.com/ObedYAMEOGO",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/burkimbila10xxkrt",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      {/* NEWSLETTER */}
      <Newsletter />

      {/* FOOTER CORE */}
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-center lg:justify-between">
        
        {/* IDENTITY */}
        <div className="flex items-center gap-5">
          {/* IMAGE */}
          <div className="relative h-24 w-24 overflow-hidden border border-neutral-200 bg-neutral-100">
            <Image
              src="/profile-obed.png"
              alt="Obed Yameogo"
              fill
              priority={false}
              sizes="96px"
              className="object-cover grayscale"
            />
          </div>

          {/* TEXT */}
          <div className="space-y-2">
            <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[#050505]">
              Obed Yameogo
            </h3>

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              PhD Scholar in AI · Machine Learning Engineer
            </p>

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
              © {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>
        </div>

        {/* SOCIALS */}
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-neutral-400">
            Connect
          </span>

          <div className="flex flex-wrap items-center gap-3">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  border
                  border-neutral-200
                  px-4
                  py-2
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  text-neutral-500
                  transition-colors
                  hover:border-black
                  hover:text-black
                "
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}