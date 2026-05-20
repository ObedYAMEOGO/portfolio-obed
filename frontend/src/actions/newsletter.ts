"use server";

import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email(),
});

export async function subscribeToNewsletter(
  _: {
    success: boolean;
    message: string;
  },
  formData: FormData,
) {
  try {
    const rawEmail =
      formData.get("email");

    const parsed =
      emailSchema.safeParse({
        email:
          typeof rawEmail ===
          "string"
            ? rawEmail
                .trim()
                .toLowerCase()
            : "",
      });

    if (!parsed.success) {
      return {
        success: false,
        message:
          "Invalid email address.",
      };
    }

    const { email } = parsed.data;

    const response =
      await fetch(
        `${process.env.INTERNAL_API_URL}/subscribe`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        },
      );

    if (!response.ok) {
      const error =
        await response.json();

      return {
        success: false,
        message:
          error.detail ||
          "Subscription failed.",
      };
    }

    return {
      success: true,
      message:
        "Subscription successful.",
    };
  } catch (error) {
    console.error(
      "NEWSLETTER_SUBSCRIPTION_ERROR:",
      error,
    );

    return {
      success: false,
      message:
        "Something went wrong. Please try again.",
    };
  }
}