// app/admin/layout.tsx

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const primaryEmail =
    user.primaryEmailAddress?.emailAddress;

  // console.log("PRIMARY EMAIL:", primaryEmail);
  // console.log("ADMIN EMAIL:", ADMIN_EMAIL);

  if (
    !primaryEmail ||
    primaryEmail !== ADMIN_EMAIL
  ) {
    redirect("/");
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}