// src/components/admin/LeadsTable.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getLeads,
} from "@/lib/server-api";

import {
  Mail,
  MessageSquare,
  User,
  Calendar,
  Trash2,
} from "lucide-react";

import DeleteLeadButton from "../leads/DeleteLeadButton";

interface Lead {
  id: number | string;
  full_name?: string;
  email?: string;
  message?: string;
  created_at?: string;
}

export default async function LeadsTable() {
  const leads: Lead[] =
    await getLeads();

  return (
    <section className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          Leads
        </h2>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden border border-neutral-200 bg-white">
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow className="border-b border-neutral-200 hover:bg-transparent">
              <TableHead className="w-55 py-4 font-mono text-[10px] uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  Sender_Identity
                </div>
              </TableHead>

              <TableHead className="w-65 py-4 font-mono text-[10px] uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  Contact_Endpoint
                </div>
              </TableHead>

              <TableHead className="py-4 font-mono text-[10px] uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-3 w-3" />
                  Encrypted_Message
                </div>
              </TableHead>

              <TableHead className="w-45 py-4 text-right font-mono text-[10px] uppercase tracking-widest">
                <div className="flex items-center justify-end gap-2">
                  <Calendar className="h-3 w-3" />
                  Timestamp
                </div>
              </TableHead>

              <TableHead className="w-32 py-4 text-right font-mono text-[10px] uppercase tracking-widest">
                <div className="flex items-center justify-end gap-2">
                  <Trash2 className="h-3 w-3" />
                  Actions
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!Array.isArray(leads) ||
            leads.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center font-mono text-[10px] uppercase tracking-widest text-neutral-400"
                >
                  NO_INBOUND_COMMUNICATIONS_FOUND
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="group border-b border-neutral-100 transition-colors hover:bg-neutral-50"
                >
                  {/* NAME */}
                  <TableCell className="py-5">
                    <span className="font-mono text-[12px] text-[#050505]">
                      {lead.full_name ??
                        "Unknown"}
                    </span>
                  </TableCell>

                  {/* EMAIL */}
                  <TableCell>
                    <span className="font-mono text-[11px] lowercase text-neutral-500">
                      {lead.email ??
                        "No Email"}
                    </span>
                  </TableCell>

                  {/* MESSAGE */}
                  <TableCell>
                    <p className="max-w-md font-sans text-[13px] text-neutral-600 transition-all duration-300 line-clamp-1 group-hover:line-clamp-none">
                      {lead.message ??
                        "No message provided."}
                    </p>
                  </TableCell>

                  {/* DATE */}
                  <TableCell className="text-right">
                    <span className="font-mono text-[10px] text-neutral-400">
                      {lead.created_at
                        ? new Date(
                            lead.created_at ??
                              "",
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
                              },
                            )
                            .replace(
                              ",",
                              "",
                            )
                            .replace(
                              /\//g,
                              ".",
                            )
                        : "N/A"}
                    </span>
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell>
                    <div className="flex justify-end">
                      <DeleteLeadButton
                        leadId={Number(
                          lead.id,
                        )}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}