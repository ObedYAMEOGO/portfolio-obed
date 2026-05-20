// app/admin/layout.tsx

import {
  auth,
  currentUser,
} from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

const ADMIN_EMAILS = [
  "obedyameogo4@gmail.com",
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await currentUser();

  const email =
    user?.emailAddresses?.[0]
      ?.emailAddress;

  const isAdmin =
    email &&
    ADMIN_EMAILS.includes(email);

  if (!isAdmin) {
    redirect("/");
  }

  return <>{children}</>;
}