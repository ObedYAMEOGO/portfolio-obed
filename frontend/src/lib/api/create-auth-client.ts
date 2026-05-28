import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

export function createAuthClient(
  token: string,
) {
  return axios.create({
    baseURL: API_BASE_URL,

    headers: {
      Authorization:
        `Bearer ${token}`,

      "Content-Type":
        "application/json",
    },
  });
}