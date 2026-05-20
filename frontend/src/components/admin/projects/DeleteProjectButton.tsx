// src/components/admin/projects/DeleteProjectButton.tsx

"use client";

import {
  useTransition,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Trash2,
  Loader2,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  projectsApi,
} from "@/lib/api/projects";

interface DeleteProjectButtonProps {
  projectId: number;
}

export default function DeleteProjectButton({
  projectId,
}: DeleteProjectButtonProps) {
  const router =
    useRouter();

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const handleDelete =
    () => {
      const confirmed =
        window.confirm(
          "Delete this project permanently?",
        );

      if (!confirmed) {
        return;
      }

      startTransition(
        async () => {
          try {
            await projectsApi.delete(
              projectId,
            );

            toast.success(
              "Project deleted successfully.",
            );

            router.refresh();
          } catch (
            error: unknown
          ) {
            console.error(
              error,
            );

            toast.error(
              error instanceof
                Error
                ? error.message
                : "Failed to delete project.",
            );
          }
        },
      );
    };

  return (
    <button
      type="button"
      onClick={
        handleDelete
      }
      disabled={
        isPending
      }
      className="inline-flex h-9 w-9 items-center justify-center border border-red-200 bg-white text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}