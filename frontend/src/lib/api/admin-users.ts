import api from "./index";

export interface User {
  id: number;
  email: string;
  full_name?: string;
  receive_notifications: boolean;
  is_newsletter_subscriber: boolean;
  created_at: string;
}

export const adminUsers = {
  getAll: async (): Promise<User[]> => {
    try {
      const response =
        await api.get(
          "/admin/users",
        );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch admin users:",
        error,
      );

      throw error;
    }
  },
};