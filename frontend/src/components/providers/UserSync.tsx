"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function UserSync() {
  const { user, isSignedIn } = useUser();

  // =====================================================
  // EFFECT: Sync user to database when authenticated
  // =====================================================
  // This effect runs whenever `user` or `isSignedIn` changes.
  // It automatically syncs the authenticated user's data
  // (clerk_id, email, full_name) to the backend database.
  useEffect(() => {
    // Guard clause: Exit early if user is not signed in or data is missing
    if (!isSignedIn || !user) {
      return;
    }

    // Define async function to sync user to database
    const sync = async () => {
      try {
        // FIX: Replaced double quotes (") with backticks (`)
        // so the environment variable is properly evaluated.
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/sync`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // Send user data from Clerk to backend for database insertion
            body: JSON.stringify({
              clerk_id: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              full_name: user.fullName,
            }),
          },
        );
      } catch (error) {
        // Log any errors that occur during sync
        // (e.g., network issues, endpoint not found)
        console.error("User sync failed:", error);
      }
    };

    // Call the sync function when effect runs
    sync();
  }, [user, isSignedIn]);

  // This component doesn't render anything to the UI;
  // it only handles side effects (database sync).
  return null;
}