"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  path: string;
}

interface DesktopNavProps {
  items: NavItem[];
}

export default function DesktopNav({ items }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-10 md:flex">
      {/* NAV LINKS */}

      {items.map((item) => {
        const isActive = pathname === item.path;

        if (item.path === "/contact") {
          return (
            <Link
              key={item.path}
              href={item.path}
              className="hidden
              items-center
              justify-center
              rounded-full
              bg-linear-to-r
              from-[#e0a374]
              via-[#c17650]
              to-[#8b5a3c] 
              bg-size-[200%_auto]
              px-5
              py-2
              text-[12px]
              font-semibold
              uppercase
              tracking-widest
              text-white
              transition-all
              duration-300
              hover:bg-position-[right_center] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#c17650]/30 active:scale-[0.98]

              md:inline-flex"
            >
              {item.name}
            </Link>
          );
        }

        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              `
                relative
                py-2
                text-[15.5px]
                font-semibold
                uppercase
                tracking-[0.01em]
                transition-colors
                duration-300
                after:absolute
                after:bottom-0
                after:left-0
                after:h-[1.5px]
                after:bg-[#050505]
                after:transition-all
                after:duration-300
              `,
              isActive
                ? `
                  text-[#050505]
                  after:w-full
                `
                : `
                  text-neutral-500
                  hover:text-[#050505]
                  after:w-0
                  hover:after:w-full
                `,
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}