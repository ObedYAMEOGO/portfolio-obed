// src/components/admin/SubscriberTable.tsx

import { getSubscribers } from "@/lib/server-api";
import DeleteSubscriberButton from "../subscribers/DeleteSubscriberButton";

export default async function SubscribersTable() {
  const subscribers = await getSubscribers();
  const validSubscribers = Array.isArray(subscribers) ? subscribers : [];

  return (
    <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
            Newsletter
          </p>
          <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-neutral-900">
            Subscribers
          </h2>
        </div>

        <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-semibold text-neutral-500">
          {validSubscribers.length} total
        </span>
      </div>

      {/* EMPTY */}
      {validSubscribers.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-neutral-400">No subscribers yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">

            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                {["Email", "Status", ""].map((h) => (
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
              {validSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="transition-colors hover:bg-neutral-50">

                  {/* EMAIL */}
                  <td className="px-6 py-4">
                    <a
                      href={`mailto:${subscriber.email}`}
                      className="text-[14px] font-medium text-neutral-900 transition-colors hover:text-neutral-600"
                    >
                      {subscriber.email}
                    </a>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${
                        subscriber.is_active ? "text-green-600" : "text-neutral-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          subscriber.is_active ? "bg-green-500" : "bg-neutral-300"
                        }`}
                      />
                      {subscriber.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <DeleteSubscriberButton subscriberId={subscriber.id} />
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