"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Subscriber } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Mail } from "lucide-react";
import { toast } from "sonner";

export default function SubscriberTable() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    try {
      const res = await api.get("/subscribers");
      setSubscribers(res.data);
    } catch (error) {
      toast.error("Failed to fetch subscriber registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  if (loading)
    return (
      <div className="animate-pulse p-4 font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
        Scanning Subscriber Database...
      </div>
    );

  return (
    <div className="overflow-hidden border border-neutral-300 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-neutral-300 hover:bg-transparent">
            <TableHead className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
              Identity_Email
            </TableHead>

            <TableHead className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
              Status
            </TableHead>

            <TableHead className="text-right font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
              Registration_Date
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {subscribers.map((sub) => (
            <TableRow
              key={sub.id}
              className="border-neutral-200 transition-colors hover:bg-neutral-50"
            >
              <TableCell className="font-medium text-[#050505]">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center border border-neutral-300 bg-neutral-100">
                    <Mail className="h-3.5 w-3.5 text-[#050505]" />
                  </div>

                  <span className="font-mono text-[12px]">
                    {sub.email}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <span
                  className={`
                    inline-flex items-center rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]
                    ${
                      sub.is_active
                        ? "border border-neutral-300 bg-[#050505] text-[#f5f5f5]"
                        : "border border-neutral-300 bg-neutral-100 text-neutral-500"
                    }
                  `}
                >
                  {sub.is_active ? "Active" : "Disabled"}
                </span>
              </TableCell>

              <TableCell className="text-right font-mono text-[11px] text-neutral-500">
                {new Date(sub.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}

          {subscribers.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="py-16 text-center font-mono text-xs uppercase tracking-[0.18em] text-neutral-400"
              >
                Zero Subscribers Detected
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}