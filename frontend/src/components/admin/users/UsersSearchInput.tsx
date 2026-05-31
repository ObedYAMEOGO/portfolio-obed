// src/components/admin/users/UsersSearchInput.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";

export default function UsersSearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    startTransition(() => {
      const params = new URLSearchParams(
        searchParams.toString(),
      );

      if (e.target.value) {
        params.set("q", e.target.value);
      } else {
        params.delete("q");
      }

      router.replace(`?${params.toString()}`);
    });
  };

  return (
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
      <Search
        className={`h-4 w-4 transition-colors ${
          isPending
            ? "animate-pulse text-neutral-300"
            : "text-neutral-400"
        }`}
      />

      <input
        type="text"
        placeholder="Search users..."
        defaultValue={searchParams.get("q") ?? ""}
        onChange={handleChange}
        className="
          bg-transparent
          text-[14px]
          outline-none
          placeholder:text-neutral-400
        "
      />
    </div>
  );
}