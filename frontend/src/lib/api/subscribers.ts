// src/lib/api/subscribers.ts

import api from "./index";

import {
  Subscriber,
} from "@/types";

export const subscribersApi = {
  async subscribe(
    email: string,
  ) {
    const response =
      await api.post(
        "/subscribe",
        { email },
      );

    return response.data;
  },

  async unsubscribe(
    email: string,
  ) {
    const response =
      await api.post(
        "/unsubscribe",
        { email },
      );

    return response.data;
  },

  async getAll(): Promise<
    Subscriber[]
  > {
    const response =
      await api.get(
        "/admin/subscribers",
      );

    return response.data;
  },

  async delete(
    id: number,
  ): Promise<void> {
    await api.delete(
      `/admin/subscribers/${id}`,
    );
  },
};