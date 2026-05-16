"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Lead } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, Calendar, User, MessageSquare } from "lucide-react";

export default function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        // Targets the updated administrative route
        const res = await api.get<Lead[]>("/admin/leads");
        
        // Trier par date la plus récente
        const sortedLeads = (res.data ?? []).sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setLeads(sortedLeads);
      } catch (error) {
        console.error("Failed to fetch leads", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 w-full bg-neutral-100 animate-pulse rounded-none"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader className="bg-neutral-50">
          <TableRow className="border-b border-neutral-200 hover:bg-transparent">
            <TableHead className="w-50 font-mono text-[10px] uppercase tracking-widest py-4">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3" /> Sender_Identity
              </div>
            </TableHead>
            <TableHead className="w-62.5 font-mono text-[10px] uppercase tracking-widest py-4">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" /> Contact_Endpoint
              </div>
            </TableHead>
            <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3 h-3" /> Encrypted_Message
              </div>
            </TableHead>
            <TableHead className="w-45 font-mono text-[10px] uppercase tracking-widest py-4 text-right">
              <div className="flex items-center justify-end gap-2">
                <Calendar className="w-3 h-3" /> Timestamp
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-32 text-center font-mono text-[10px] text-neutral-400 uppercase tracking-widest"
              >
                NO_INBOUND_COMMUNICATIONS_FOUND
              </TableCell>
            </TableRow>
          ) : (
            Array.isArray(leads) && leads.map((lead) => (
              <TableRow
                key={lead.id}
                className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors group"
              >
                <TableCell className="font-medium py-5">
                  <span className="font-mono text-[12px] text-[#050505]">
                    {lead.full_name}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-[11px] text-neutral-500 lowercase">
                    {lead.email}
                  </span>
                </TableCell>
                <TableCell>
                  <p className="font-sans text-[13px] text-neutral-600 line-clamp-1 group-hover:line-clamp-none transition-all duration-300 max-w-md">
                    {lead.message}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-mono text-[10px] text-neutral-400">
                    {new Date(lead.created_at)
                      .toLocaleString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                      .replace(",", "")
                      .replace(/\//g, ".")}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}