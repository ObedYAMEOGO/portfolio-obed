"use client";

import { useTransition } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { materialsApi } from "@/lib/api/materials";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import {
  Loader2,
  Trash2,
} from "lucide-react";

interface Props {
  materialId: number;
  onRefresh?: () => void;
}

export default function DeleteMaterialDialog({
  materialId,
  onRefresh,
}: Props) {
  const [
    isPending,
    startTransition,
  ] = useTransition();

  const queryClient = useQueryClient();

  const handleDelete = () => {
    const confirmed =
      window.confirm(
        "Delete this material permanently? This action cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    startTransition(
      async () => {
        try {
          await materialsApi.delete(materialId);

          // Invalidate courses cache to refresh public courses page
          await queryClient.invalidateQueries({ queryKey: ["courses"] });

          toast.success("Material deleted successfully.");

          onRefresh?.();
        } catch (error) {
          console.error(error);

          toast.error("Failed to delete material.");
        }
      }
    );
  };

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={handleDelete}
      disabled={isPending}
      className="h-9 rounded-full px-4"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </>
      )}
    </Button>
  );
}