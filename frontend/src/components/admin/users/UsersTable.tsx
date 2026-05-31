// src/components/admin/users/UsersTable.tsx

import { Bell, BellOff, Users } from "lucide-react";

import { getUsers } from "@/lib/server-api";
import type { AdminUserResponse } from "@/types";

import UsersSearchInput from "./UsersSearchInput";

interface UsersTableProps {
  searchQuery?: string;
}

export default async function UsersTable({
  searchQuery = "",
}: UsersTableProps) {
  let users: AdminUserResponse[] = [];

  try {
    users = await getUsers();
  } catch {
    return (
      <section className="space-y-6">
        <p className="text-sm text-red-600">
          Failed to load users.
        </p>
      </section>
    );
  }

  const filteredUsers = searchQuery
    ? users.filter((user) => {
        const q = searchQuery.toLowerCase();
        return (
          user.email.toLowerCase().includes(q) ||
          user.full_name?.toLowerCase().includes(q)
        );
      })
    : users;

  return (
    <section className="space-y-6">

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-neutral-500" />

            <span
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-neutral-400
              "
            >
              Platform Users
            </span>
          </div>

          <h2
            className="
              text-2xl
              font-semibold
              tracking-tight
              text-neutral-900
            "
          >
            Registered Users
          </h2>
        </div>

        <UsersSearchInput />
      </div>

      {/* TABLE */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-neutral-200
          bg-white
        "
      >

        {/* TABLE HEADER */}

        <div
          className="
            hidden
            grid-cols-5
            border-b
            border-neutral-200
            bg-neutral-50
            px-6
            py-4
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-neutral-400
            lg:grid
          "
        >
          <span>User</span>
          <span>Email</span>
          <span>Newsletter</span>
          <span>Notifications</span>
          <span>Joined</span>
        </div>

        {/* ROWS */}

        {filteredUsers.length === 0 ? (
          <div className="p-8 text-sm text-neutral-500">
            No users found.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="
                  grid
                  gap-4
                  px-6
                  py-5
                  lg:grid-cols-5
                  lg:items-center
                "
              >

                {/* USER */}

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-neutral-900">
                    {user.full_name || "Unnamed User"}
                  </p>

                  <p className="text-xs text-neutral-400 lg:hidden">
                    {user.email}
                  </p>
                </div>

                {/* EMAIL */}

                <div className="hidden text-sm text-neutral-600 lg:block">
                  {user.email}
                </div>

                {/* NEWSLETTER */}

                <div>
                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-3
                      py-1
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-wide
                      ${
                        user.is_newsletter_subscriber
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }
                    `}
                  >
                    {user.is_newsletter_subscriber
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                {/* NOTIFICATIONS */}

                <div>
                  {user.receive_notifications ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <Bell className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Enabled
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-neutral-400">
                      <BellOff className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Disabled
                      </span>
                    </div>
                  )}
                </div>

                {/* JOINED */}

                <div className="text-sm text-neutral-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}