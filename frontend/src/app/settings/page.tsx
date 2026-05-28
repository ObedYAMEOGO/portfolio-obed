import {
  currentUser,
} from "@clerk/nextjs/server";

import {
  redirect,
} from "next/navigation";

import NotificationSettings from "@/components/settings/NotificationSettings";

export default async function SettingsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const email =
    user.emailAddresses?.[0]?.emailAddress;

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">

      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-[-0.03em]">
          Account Settings
        </h1>

        <p className="mt-3 text-neutral-500">
          Manage your platform notifications and newsletter preferences.
        </p>
      </div>

      <NotificationSettings
        email={email || ""}
      />

    </div>
  );
}