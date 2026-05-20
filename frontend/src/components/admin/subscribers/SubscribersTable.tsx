// src/components/admin/SubscriberTable.tsx

import {
  Trash2,
} from "lucide-react";

import {
  getSubscribers,
} from "@/lib/server-api";

import DeleteSubscriberButton from "../subscribers/DeleteSubscriberButton";

export default async function SubscriberTable() {
  const subscribers =
    await getSubscribers();

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          Subscribers
        </h2>
      </div>

      <div className="overflow-hidden border border-neutral-300 bg-white">
        <table className="w-full">
          <thead className="border-b border-neutral-300 bg-neutral-100">
            <tr>
              <th className="p-4 text-left font-mono text-xs uppercase">
                Email
              </th>

              <th className="p-4 text-left font-mono text-xs uppercase">
                Status
              </th>

              <th className="p-4 text-right font-mono text-xs uppercase">
                <div className="flex items-center justify-end gap-2">
                  <Trash2 className="h-3.5 w-3.5" />
                  Actions
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {subscribers.map(
              (subscriber) => (
                <tr
                  key={subscriber.id}
                  className="border-b border-neutral-200"
                >
                  <td className="p-4">
                    {
                      subscriber.email
                    }
                  </td>

                  <td className="p-4">
                    {subscriber.is_active
                      ? "Active"
                      : "Inactive"}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end">
                      <DeleteSubscriberButton
                        subscriberId={
                          subscriber.id
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
    </section>
  );
}