"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  BellOff,
  Search,
  Users,
} from "lucide-react";

/* GORDON: Import the admin users API from centralized api module */
import {
  adminUsers,
  type User,
} from "@/lib/api/admin-users";

export default function UsersTable() {
  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  /* GORDON: Changed to use the centralized admin-users API module
     instead of direct fetch. This keeps all API calls in one organized place. */
  async function fetchUsers() {
    try {
      setLoading(true);
      setError(null);

      /* GORDON: Call the admin users API which handles auth header automatically */
      const data = await adminUsers.getAll();

      setUsers(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      const message = 
        err instanceof Error 
          ? err.message 
          : "Unknown error";
      setError(message);
      console.error(
        "UsersTable error:",
        message
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers =
    users.filter((user) => {
      const query =
        search.toLowerCase();

      return (
        user.email
          .toLowerCase()
          .includes(query) ||
        user.full_name
          ?.toLowerCase()
          .includes(query)
      );
    });

  return (
    <section className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

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

        {/* SEARCH */}

        <div
          className="
            flex
            items-center
            gap-3
            rounded-full
            border
            border-neutral-200
            bg-white
            px-4
            py-2
          "
        >
          <Search className="h-4 w-4 text-neutral-400" />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              bg-transparent
              text-[14px]
              outline-none
              placeholder:text-neutral-400
            "
          />
        </div>

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

        {/* CONTENT */}

        {loading ? (
          <div className="p-8 text-sm text-neutral-500">
            Loading users...
          </div>
        ) : error ? (
          <div className="p-8 text-sm text-red-600">
            {error}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-sm text-neutral-500">
            No users found.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">

            {filteredUsers.map(
              (user) => (
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
                      {user.full_name ||
                        "Unnamed User"}
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
                    {user.is_newsletter_subscriber ? (
                      <span
                        className="
                          inline-flex
                          rounded-full
                          bg-green-100
                          px-3
                          py-1
                          text-[11px]
                          font-semibold
                          uppercase
                          tracking-wide
                          text-green-700
                        "
                      >
                        Active
                      </span>
                    ) : (
                      <span
                        className="
                          inline-flex
                          rounded-full
                          bg-neutral-100
                          px-3
                          py-1
                          text-[11px]
                          font-semibold
                          uppercase
                          tracking-wide
                          text-neutral-500
                        "
                      >
                        Inactive
                      </span>
                    )}
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

                  {/* CREATED */}

                  <div className="text-sm text-neutral-500">
                    {new Date(
                      user.created_at,
                    ).toLocaleDateString()}
                  </div>

                </div>
              ),
            )}

          </div>
        )}

      </div>
    </section>
  );
}
