// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - data becomes stale after 5 min
            gcTime: 10 * 60 * 1000,   // 10 minutes - keep in cache for 10 min
            refetchOnWindowFocus: false, // Don't refetch when tab refocuses
            refetchOnMount: false,       // Don't refetch when component remounts
            refetchOnReconnect: false,   // Don't refetch on network reconnect
            retry: 1,                    // Retry once on failure
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}