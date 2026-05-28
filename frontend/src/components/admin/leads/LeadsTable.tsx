// src/components/admin/LeadsTable.tsx

import { getLeads } from "@/lib/server-api";
import DeleteLeadButton from "../leads/DeleteLeadButton";

interface Lead {
  id: number | string;
  full_name?: string;
  email?: string;
  message?: string;
  created_at?: string;
}

export default async function LeadsTable() {
  const leads: Lead[] = await getLeads();
  const validLeads = Array.isArray(leads) ? leads : [];

  return (
    <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
            Contact
          </p>
          <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-neutral-900">
            Leads
          </h2>
        </div>

        <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-semibold text-neutral-500">
          {validLeads.length} total
        </span>
      </div>

      {/* EMPTY */}
      {validLeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-sm text-neutral-400">No leads yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">

            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                {["Name", "Email", "Message", "Date", ""].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 last:text-right"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {validLeads.map((lead) => (
                <tr key={lead.id} className="group transition-colors hover:bg-neutral-50">

                  {/* NAME */}
                  <td className="px-6 py-4">
                    <span className="text-[14px] font-medium text-neutral-900">
                      {lead.full_name ?? "—"}
                    </span>
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4">
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-[13px] text-neutral-500 transition-colors hover:text-neutral-900"
                    >
                      {lead.email ?? "—"}
                    </a>
                  </td>

                  {/* MESSAGE */}
                  <td className="px-6 py-4">
                    <p className="max-w-sm line-clamp-1 text-[13px] leading-relaxed text-neutral-500 transition-all duration-300 group-hover:line-clamp-none">
                      {lead.message ?? "No message provided."}
                    </p>
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4">
                    <span className="text-[12px] text-neutral-400">
                      {lead.created_at
                        ? new Date(lead.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                          })
                        : "—"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <DeleteLeadButton leadId={Number(lead.id)} />
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </section>
  );
}