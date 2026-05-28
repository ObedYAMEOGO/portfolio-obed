"use client";

import {
  useEffect,
} from "react";

import {
  useAuth,
} from "@clerk/nextjs";

import api from "@/lib/api";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    getToken,
  } = useAuth();

  useEffect(() => {
    const interceptor =
      api.interceptors.request.use(
        async (config) => {
          const token =
            await getToken();

          if (token) {
            config.headers.Authorization =
              `Bearer ${token}`;
          }

          return config;
        },
      );

    return () => {
      api.interceptors.request.eject(
        interceptor,
      );
    };
  }, [getToken]);

  return children;
}