interface CoursesLayoutProps {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
}

export default function CoursesLayout({
  sidebar,
  topbar,
  content,
  footer,
}: CoursesLayoutProps) {
  return (
    <div
      className="
        h-screen
        overflow-hidden
        bg-neutral-50
        dark:bg-black
      "
    >

      <div
        className="
          grid
          h-full
          grid-cols-1
          lg:grid-cols-[280px_minmax(0,1fr)]
        "
      >

        {/* SIDEBAR */}

        <aside
          className="
            hidden
            border-r
            border-neutral-200
            bg-white
            dark:border-neutral-800
            dark:bg-neutral-950
            lg:flex
            lg:flex-col
          "
        >
          {sidebar}
        </aside>

        {/* MAIN */}

        <div
          className="
            flex
            min-h-0
            flex-col
          "
        >

          {/* TOPBAR */}

          <div
            className="
              shrink-0
              border-b
              border-neutral-200
              bg-white
              dark:border-neutral-800
              dark:bg-neutral-950
            "
          >
            {topbar}
          </div>

          {/* SCROLLABLE CONTENT */}

          <main
            className="
              min-h-0
              flex-1
              overflow-y-auto
            "
          >
            {content}
          </main>

          {/* FOOTER */}

          {footer && (
            <div
              className="
                shrink-0
                border-t
                border-neutral-200
                bg-white
                dark:border-neutral-800
                dark:bg-neutral-950
              "
            >
              {footer}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}