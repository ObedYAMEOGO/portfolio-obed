// components/navbar/Navbar.tsx

import Link from "next/link";

import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";

const navItems = [
  {
    name: "Projects",
    path: "/projects",
  },
  {
    name: "Blog",
    path: "/blog",
  },
  {
    name: "Courses",
    path: "/courses",
  },
];

export default function Navbar() {
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

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-10">
          {/* DESKTOP NAV */}
          <DesktopNav items={navItems} />

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
          <MobileMenu items={navItems} />
        </div>
      </div>
    </header>
  );
}