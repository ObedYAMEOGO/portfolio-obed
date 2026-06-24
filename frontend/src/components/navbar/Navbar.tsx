"use client";

import Link from "next/link";

import {
  useUser,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";

const navItems = [
  { name: "Projects", path: "/projects" },
  { name: "Blog", path: "/blog" },
  { name: "Materials", path: "/courses" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const {
    isSignedIn,
    isLoaded,
  } = useUser();

  return (
    <header
      className="
        fixed
        top-0
        z-50
        w-full
        border-b
        border-neutral-200/80
        bg-white/80
        backdrop-blur-xl
      "
    >
      <div
        className="
          relative
          mx-auto
          flex
          h-16
          max-w-7xl
          items-center
          px-6
        "
      >

        {/* LEFT — LOGO */}

        <div className="flex flex-1 items-center">
          <Link
            href="/"
            className="
              text-[22px]
              font-semibold
              tracking-[-0.02em]
              text-neutral-900
              transition-colors
              duration-150
              hover:text-neutral-600
            "
          >TheHatBuddy
          </Link>
        </div>

        {/* CENTER — NAV */}

        <div
          className="
            absolute
            left-1/2
            hidden
            -translate-x-1/2
            md:block
          "
        >
          <DesktopNav items={navItems} />
        </div>

        {/* RIGHT */}

        <div className="ml-auto flex items-center gap-3">

          {/* AUTH */}

          {isLoaded && (
            !isSignedIn ? (
              <SignInButton mode="modal">
                <button
                  className="
                    hidden
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-neutral-300
                    px-5
                    py-2
                    text-[12px]
                    font-semibold
                    uppercase
                    tracking-widest
                    text-neutral-900
                    transition-colors
                    duration-200
                    hover:bg-neutral-100
                    md:inline-flex
                  "
                >
                  Login
                </button>
              </SignInButton>
            ) : (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "h-9 w-9",
                  },
                }}
              />
            )
          )}

          {/* MOBILE */}

          <MobileMenu items={navItems} />

        </div>
      </div>
    </header>
  );
}
