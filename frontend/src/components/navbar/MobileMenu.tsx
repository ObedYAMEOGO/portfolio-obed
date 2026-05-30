"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import {
  Menu,
  X,
} from "lucide-react";

import {
  useUser,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

interface NavItem {
  name: string;
  path: string;
}

interface MobileMenuProps {
  items: NavItem[];
}

export default function MobileMenu({
  items,
}: MobileMenuProps) {
  const pathname = usePathname();

  const {
    isSignedIn,
    isLoaded,
  } = useUser();

  const [mounted, setMounted] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // CLOSE MENU ON ROUTE CHANGE

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="md:hidden">
      <Sheet
        open={open}
        onOpenChange={setOpen}
      >
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="
              h-10
              w-10
              rounded-full
              border
              border-neutral-200
              bg-white/80
              backdrop-blur-sm
              transition-all
              duration-200
              hover:bg-white
              hover:border-neutral-300
              active:scale-95
            "
          >
            <Menu className="h-5 w-5 text-neutral-700" />

            <span className="sr-only">
              Open menu
            </span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="
            w-[300px]
            border-l
            border-neutral-200
            bg-white/95
            backdrop-blur-xl
            px-0
            py-0
            sm:w-87.5
          "
        >
          <SheetTitle className="sr-only">
            Mobile Navigation Menu
          </SheetTitle>

          {/* HEADER */}

          <div
            className="
              flex
              h-16
              items-center
              justify-between
              border-b
              border-neutral-200
              px-6
            "
          >
            <span
              className="
                text-sm
                font-medium
                uppercase
                tracking-widest
                text-neutral-400
              "
            >
              Menu
            </span>

            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="
                  h-8
                  w-8
                  rounded-full
                  border
                  border-neutral-200
                  bg-white
                  transition-all
                  duration-200
                  hover:bg-neutral-50
                  active:scale-95
                "
              >
                <X className="h-4 w-4 text-neutral-700" />

                <span className="sr-only">
                  Close menu
                </span>
              </Button>
            </SheetClose>
          </div>

          {/* NAVIGATION */}

          <div
            className="
              flex
              flex-col
              gap-1
              px-6
              py-8
            "
          >
            {items.map((item) => {
              const isActive =
                pathname ===
                item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    `
                      relative
                      rounded-lg
                      px-4
                      py-3
                      text-[15px]
                      font-medium
                      transition-all
                      duration-200
                    `,
                    isActive
                      ? `
                        bg-neutral-100
                        text-neutral-900
                      `
                      : `
                        text-neutral-500
                        hover:bg-neutral-50
                        hover:text-neutral-900
                      `,
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* DIVIDER */}

          <div className="mx-6 h-px bg-neutral-200" />

          {/* CTA + AUTH */}

          <div className="space-y-4 px-6 py-8">

            {/* CONTACT */}

            <Link
              href="/contact"
              className="
                flex
                w-full
                items-center
                justify-center
                rounded-full
                bg-neutral-900
                px-6
                py-3
                text-[12px]
                font-semibold
                uppercase
                tracking-widest
                text-white
                transition-all
                duration-200
                hover:bg-neutral-700
                active:scale-[0.98]
              "
            >
              Let&apos;s Connect
            </Link>

            {/* AUTH */}

            {isLoaded && (
              !isSignedIn ? (
                <SignInButton mode="modal">
                  <button
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-neutral-300
                      bg-white
                      px-6
                      py-3
                      text-[12px]
                      font-semibold
                      uppercase
                      tracking-widest
                      text-neutral-900
                      transition-all
                      duration-200
                      hover:bg-neutral-50
                      active:scale-[0.98]
                    "
                  >
                    Login
                  </button>
                </SignInButton>
              ) : (
                <div
                  className="
                    flex
                    items-center
                    justify-center
                  "
                >
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox:
                          "h-10 w-10",
                      },
                    }}
                  />
                </div>
              )
            )}

          </div>

          {/* SOCIALS */}

          <div
            className="
              border-t
              border-neutral-200
              px-6
              py-6
            "
          >
            <p
              className="
                mb-4
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.25em]
                text-neutral-400
              "
            >
              Connect
            </p>

            <div className="flex gap-3">

              <a
                href="https://www.linkedin.com/in/obedyameogo/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-[12px]
                  text-neutral-500
                  transition-colors
                  duration-200
                  hover:text-neutral-900
                "
              >
                LinkedIn
              </a>

              <a
                href="https://github.com/ObedYAMEOGO"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-[12px]
                  text-neutral-500
                  transition-colors
                  duration-200
                  hover:text-neutral-900
                "
              >
                GitHub
              </a>

              <a
                href="https://www.facebook.com/burkimbila10xxkrt"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-[12px]
                  text-neutral-500
                  transition-colors
                  duration-200
                  hover:text-neutral-900
                "
              >
                Facebook
              </a>

            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}