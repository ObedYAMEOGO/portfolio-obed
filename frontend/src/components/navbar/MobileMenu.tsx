"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import {
  Menu,
} from "lucide-react";

import {
  cn,
} from "@/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Button,
} from "@/components/ui/button";

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
  const pathname =
    usePathname();

  const [
    mounted,
    setMounted,
  ] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
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

            {items.map((item) => {
              const isActive =
                pathname === item.path;

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
                      uppercase
                      tracking-[0.01em]
                      transition-colors
                      duration-300
                      after:absolute
                      after:-bottom-2
                      after:left-0
                      after:h-px
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
                uppercase
                tracking-[0.08em]
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
  );
}