"use client";

import Link from "next/link";

import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";

const navItems = [
  { name: "Projects", path: "/projects" },
  { name: "Blog", path: "/blog" },
  { name: "Courses", path: "/courses" },
];

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

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
          mx-auto
          flex
          h-16
          max-w-7xl
          items-center
          justify-between
          px-6
        "
      >
        {/* LEFT — LOGO */}

        <div className="flex items-center">
          <Link
            href="/"
            className="
             text-[25px]
              font-semibold
              tracking-widest
              text-neutral-900
              transition-colors
              duration-150
              hover:text-neutral-600
              whitespace-nowrap
            "
          >
            obed.ai
          </Link>
        </div>

        {/* CENTER — NAV */}

        <div className="hidden flex-1 justify-center md:flex">
          <DesktopNav items={navItems} />
        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-5">
          {/* CONTACT */}

          <Link
            href="/contact"
            className="
            hidden
            items-center
            justify-center
            rounded-full
            bg-[#9b5c3d]
            px-6
            py-3
            text-[12px]
            font-semibold
            uppercase
            tracking-widest
            text-white
            shadow-xs
            transition-all
            duration-300
            hover:bg-[#7f4b31]
            hover:scale-[1.02]
            hover:shadow-lg
            active:scale-[0.98]
            md:inline-flex
          "
          >
            Contact_Me
          </Link>

          {/* AUTH */}

          {isLoaded &&
            (!isSignedIn ? (
              <SignInButton mode="modal">
                <button
                  className="
                  hidden
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-neutral-900
                  bg-white
                  px-6
                  py-3
                  text-[12px]
                  font-semibold
                  uppercase
                  tracking-widest
                  text-black
                  transition-all
                  duration-300
                  hover:bg-black
                  hover:border-white
                  hover:text-white
                  hover:shadow-lg
                  active:scale-[0.98]
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
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
            ))}

          {/* MOBILE */}

          <MobileMenu items={navItems} />
        </div>
      </div>
    </header>
  );
}
