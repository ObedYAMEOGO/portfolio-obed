// src/components/admin/projects/ProjectsTable.tsx

import Link from "next/link";

import {
  ExternalLink,
  Github,
  Pencil,
} from "lucide-react";

import DeleteProjectButton from "./DeleteProjectButton";

import {
  getAdminProjects,
} from "@/lib/server-api";

import type {
  Project,
} from "@/types";

export default async function ProjectsTable() {
  const projects: Project[] =
    await getAdminProjects();

  return (
    <section
      className="
        overflow-hidden
        rounded-xl
        border
        border-neutral-200
        bg-white
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-neutral-200
          px-6
          py-5
        "
      >
        <div>
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.25em]
              text-neutral-400
            "
          >
            Portfolio
          </p>

          <h2
            className="
              mt-0.5
              text-lg
              font-semibold
              tracking-tight
              text-neutral-900
            "
          >
            Projects
          </h2>
        </div>

        <span
          className="
            rounded-full
            border
            border-neutral-200
            bg-neutral-50
            px-3
            py-1
            text-[11px]
            font-semibold
            text-neutral-500
          "
        >
          {projects.length} total
        </span>
      </div>

      {/* EMPTY */}

      {projects.length === 0 ? (
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            py-16
          "
        >
          <p
            className="
              text-sm
              text-neutral-400
            "
          >
            No projects yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table
            className="
              w-full
              border-collapse
            "
          >

            <thead>
              <tr
                className="
                  border-b
                  border-neutral-100
                  bg-neutral-50
                "
              >
                {[
                  "Project",
                  "Description",
                  "Status",
                  "Links",
                  "Created",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="
                      px-6
                      py-3
                      text-left
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-neutral-400
                      last:text-right
                    "
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody
              className="
                divide-y
                divide-neutral-100
              "
            >
              {projects.map(
                (project) => (
                  <tr
                    key={project.id}
                    className="
                      group
                      transition-colors
                      hover:bg-neutral-50
                    "
                  >

                    {/* PROJECT */}

                    <td className="px-6 py-4">
                      <div className="space-y-0.5">

                        <p
                          className="
                            max-w-55
                            truncate
                            text-[14px]
                            font-medium
                            text-neutral-900
                          "
                        >
                          {project.title}
                        </p>

                        <p
                          className="
                            text-[11px]
                            text-neutral-400
                          "
                        >
                          /projects/
                          {project.slug}
                        </p>

                      </div>
                    </td>

                    {/* DESCRIPTION */}

                    <td className="px-6 py-4">
                      <p
                        className="
                          max-w-sm
                          line-clamp-2
                          text-[13px]
                          leading-relaxed
                          text-neutral-500
                          transition-all
                          duration-300
                          group-hover:line-clamp-none
                        "
                      >
                        {
                          project.description
                        }
                      </p>
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-4">

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-1.5
                          text-[12px]
                          font-medium
                          ${
                            project.is_published
                              ? "text-green-600"
                              : "text-neutral-400"
                          }
                        `}
                      >

                        <span
                          className={`
                            h-1.5
                            w-1.5
                            rounded-full
                            ${
                              project.is_published
                                ? "bg-green-500"
                                : "bg-neutral-300"
                            }
                          `}
                        />

                        {project.is_published
                          ? "Published"
                          : "Draft"}

                      </span>

                    </td>

                    {/* LINKS */}

                    <td className="px-6 py-4">

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        {project.live_url && (
                          <Link
                            href={
                              project.live_url
                            }
                            target="_blank"
                            className="
                              flex
                              h-7
                              w-7
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-neutral-200
                              text-neutral-400
                              transition-colors
                              hover:border-neutral-400
                              hover:text-neutral-900
                            "
                            title="Live"
                          >
                            <ExternalLink
                              className="
                                h-3.5
                                w-3.5
                              "
                            />
                          </Link>
                        )}

                        {project.github_url && (
                          <Link
                            href={
                              project.github_url
                            }
                            target="_blank"
                            className="
                              flex
                              h-7
                              w-7
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-neutral-200
                              text-neutral-400
                              transition-colors
                              hover:border-neutral-400
                              hover:text-neutral-900
                            "
                            title="GitHub"
                          >
                            <Github
                              className="
                                h-3.5
                                w-3.5
                              "
                            />
                          </Link>
                        )}

                        {!project.live_url &&
                          !project.github_url && (
                            <span
                              className="
                                text-[12px]
                                text-neutral-300
                              "
                            >
                              —
                            </span>
                          )}

                      </div>

                    </td>

                    {/* DATE */}

                    <td className="px-6 py-4">

                      <span
                        className="
                          text-[12px]
                          text-neutral-400
                        "
                      >
                        {project.created_at
                          ? new Date(
                              project.created_at,
                            ).toLocaleDateString(
                              "en-US",
                              {
                                year:
                                  "numeric",
                                month:
                                  "short",
                                day:
                                  "2-digit",
                              },
                            )
                          : "—"}
                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-4">

                      <div
                        className="
                          flex
                          items-center
                          justify-end
                          gap-2
                        "
                      >

                        <Link
                          href={`/admin/dashboard/projects/${project.id}/edit`}
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-neutral-200
                            text-neutral-400
                            transition-colors
                            hover:border-neutral-400
                            hover:text-neutral-900
                          "
                        >
                          <Pencil
                            className="
                              h-3.5
                              w-3.5
                            "
                          />
                        </Link>

                        <DeleteProjectButton
                          projectId={
                            project.id
                          }
                        />

                      </div>

                    </td>

                  </tr>
                ),
              )}
            </tbody>

          </table>
        </div>
      )}

    </section>
  );
}