"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Projects", path: "/projects" },
  { name: "Blog", path: "/blog" },
  { name: "Courses", path: "/courses" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="
        fixed
        top-0
        z-50
        w-full
        border-b
        border-neutral-300/70
        bg-[#f5f5f5]/85
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex
          h-16
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:px-6
        "
      >
        {/* LOGO */}
        <Link
          href="/"
          className="
            text-[1rem]
            font-semibold
            tracking-[-0.03em]
            text-[#050505]
            transition-opacity
            hover:opacity-80
            sm:text-[1.05rem]
          "
        >
          OBED_YAMEOGO
        </Link>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-10">
          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-10 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.path;

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
                      tracking-[0.01em]
                      uppercase
                      transition-all
                      duration-300
                    `,
                    isActive
                      ? "text-[#050505]"
                      : "text-neutral-500 hover:text-[#050505]",
                  )}
                >
                  {item.name}

                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="
                        absolute
                        left-0
                        right-0
                        -bottom-px
                        h-[1.5px]
                        bg-[#050505]
                      "
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CONTACT BUTTON */}
          <Link
            href="/contact"
            className="
              hidden
              sm:inline-flex
              items-center
              justify-center
              rounded-sm
              bg-[#050505]
              px-5
              py-2.5
              text-[12px]
              font-medium
              tracking-[0.08em]
              uppercase
              text-[#f5f5f5]
              shadow-sm
              transition-all
              duration-300
              hover:scale-[1.03]
              hover:bg-neutral-800
              active:scale-[0.98]
            "
          >
            Let&apos;s Connect
          </Link>

          {/* MOBILE MENU */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="
                    border
                    border-neutral-300
                    bg-white/70
                    backdrop-blur-sm
                  "
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="
                  border-l
                  border-neutral-200
                  bg-[#f5f5f5]
                  px-8
                  pt-20
                "
              >
                <SheetTitle className="sr-only">
                  Mobile Navigation Menu
                </SheetTitle>

                <div className="flex flex-col gap-8">
                  {navItems.map((item) => {
                    const isActive = pathname === item.path;

                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={cn(
                          `
                            relative
                            w-fit
                            text-[1.1rem]
                            font-semibold
                            tracking-[0.01em]
                            uppercase
                            transition-colors
                          `,
                          isActive
                            ? "text-[#050505]"
                            : "text-neutral-500 hover:text-[#050505]",
                        )}
                      >
                        {item.name}

                        {isActive && (
                          <motion.div
                            layoutId="mobile-nav-underline"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 30,
                            }}
                            className="
                              absolute
                              left-0
                              right-0
                              -bottom-2
                              h-px
                              bg-[#050505]
                            "
                          />
                        )}
                      </Link>
                    );
                  })}

                  {/* MOBILE CONTACT BUTTON */}
                  <Link
                    href="/contact"
                    className="
                      mt-4
                      inline-flex
                      items-center
                      justify-center
                      rounded-sm
                      bg-[#050505]
                      px-5
                      py-3
                      text-[12px]
                      font-medium
                      tracking-[0.08em]
                      uppercase
                      text-[#f5f5f5]
                      transition-all
                      hover:bg-neutral-800
                    "
                  >
                    Let&apos;s Connect
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}