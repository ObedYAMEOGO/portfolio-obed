// src/components/admin/projects/ProjectsTable.tsx

import Link from "next/link";

import type {
  Project,
} from "@/types";

import {
  projectsApi,
} from "@/lib/api/projects";

import {
  FolderOpen,
  Calendar,
  ExternalLink,
  Github,
  Pencil,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DeleteProjectButton from "./DeleteProjectButton";

export default async function ProjectsTable() {
  const projects: Project[] =
    await projectsApi.getAll();

  return (
    <section className="space-y-6">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div>
        <h2 className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          Projects
        </h2>
      </div>

      {/* =========================================================
          TABLE
      ========================================================= */}

      <div className="w-full overflow-x-auto border border-neutral-200 bg-white">
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow className="border-b border-neutral-200 hover:bg-transparent">
              {/* PROJECT */}

              <TableHead className="w-[280px] py-4 font-mono text-[10px] uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-3 w-3" />

                  Project
                </div>
              </TableHead>

              {/* DESCRIPTION */}

              <TableHead className="py-4 font-mono text-[10px] uppercase tracking-widest">
                Description
              </TableHead>

              {/* STATUS */}

              <TableHead className="w-[140px] py-4 font-mono text-[10px] uppercase tracking-widest">
                Status
              </TableHead>

              {/* LINKS */}

              <TableHead className="w-[180px] py-4 font-mono text-[10px] uppercase tracking-widest">
                Links
              </TableHead>

              {/* DATE */}

              <TableHead className="w-[180px] py-4 text-right font-mono text-[10px] uppercase tracking-widest">
                <div className="flex items-center justify-end gap-2">
                  <Calendar className="h-3 w-3" />

                  Created
                </div>
              </TableHead>

              {/* ACTIONS */}

              <TableHead className="w-[140px] py-4 text-right font-mono text-[10px] uppercase tracking-widest">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.length ===
            0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center font-mono text-[10px] uppercase tracking-widest text-neutral-400"
                >
                  NO_PROJECTS_FOUND
                </TableCell>
              </TableRow>
            ) : (
              projects.map(
                (
                  project: Project
                ) => (
                  <TableRow
                    key={
                      project.id
                    }
                    className="group border-b border-neutral-100 transition-colors hover:bg-neutral-50"
                  >
                    {/* =========================================================
                        TITLE
                    ========================================================= */}

                    <TableCell className="py-5">
                      <div className="space-y-2">
                        <p className="font-mono text-[12px] text-[#050505]">
                          {
                            project.title
                          }
                        </p>

                        <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                          /projects/
                          {
                            project.slug
                          }
                        </p>
                      </div>
                    </TableCell>

                    {/* =========================================================
                        DESCRIPTION
                    ========================================================= */}

                    <TableCell>
                      <p className="max-w-md font-sans text-[13px] text-neutral-600 line-clamp-2 transition-all duration-300 group-hover:line-clamp-none">
                        {
                          project.description
                        }
                      </p>
                    </TableCell>

                    {/* =========================================================
                        STATUS
                    ========================================================= */}

                    <TableCell>
                      <span
                        className={`inline-flex items-center border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${
                          project.is_published
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-yellow-200 bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {project.is_published
                          ? "Published"
                          : "Draft"}
                      </span>
                    </TableCell>

                    {/* =========================================================
                        LINKS
                    ========================================================= */}

                    <TableCell>
                      <div className="flex items-center gap-3">
                        {project.live_url && (
                          <Link
                            href={
                              project.live_url
                            }
                            target="_blank"
                            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:text-black"
                          >
                            <ExternalLink className="h-3 w-3" />

                            Live
                          </Link>
                        )}

                        {project.github_url && (
                          <Link
                            href={
                              project.github_url
                            }
                            target="_blank"
                            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:text-black"
                          >
                            <Github className="h-3 w-3" />

                            Code
                          </Link>
                        )}
                      </div>
                    </TableCell>

                    {/* =========================================================
                        CREATED DATE
                    ========================================================= */}

                    <TableCell className="text-right">
                      <span className="font-mono text-[10px] text-neutral-400">
                        {project.created_at
                          ? new Date(
                              project.created_at
                            )
                              .toLocaleString(
                                "en-GB",
                                {
                                  year:
                                    "numeric",
                                  month:
                                    "2-digit",
                                  day:
                                    "2-digit",
                                  hour:
                                    "2-digit",
                                  minute:
                                    "2-digit",
                                  hour12:
                                    false,
                                }
                              )
                              .replace(
                                ",",
                                ""
                              )
                              .replace(
                                /\//g,
                                "."
                              )
                          : "N/A"}
                      </span>
                    </TableCell>

                    {/* =========================================================
                        ACTIONS
                    ========================================================= */}

                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {/* EDIT */}

                        <Link
                          href={`/admin/dashboard/projects/${project.id}/edit`}
                          className="
                            inline-flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            border
                            border-neutral-200
                            bg-white
                            text-neutral-600
                            transition-colors
                            hover:border-black
                            hover:bg-black
                            hover:text-white
                          "
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        {/* DELETE */}

                        <DeleteProjectButton
                          projectId={
                            project.id
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}