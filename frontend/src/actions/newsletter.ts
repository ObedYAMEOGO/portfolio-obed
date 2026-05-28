// src/actions/newsletter.ts

"use server";

const API =
  process.env.INTERNAL_API_URL;

export async function subscribeToNewsletter(
  _: unknown,
  formData: FormData,
) {
  try {
    const email =
      formData.get("email");

    if (!email) {
      return {
        success: false,
        message:
          "Email is required.",
      };
    }

    if (!API) {
      console.error(
        "INTERNAL_API_URL missing",
      );

      return {
        success: false,
        message:
          "Server configuration error.",
      };
    }

    const response = await fetch(
      `${API}/subscribe`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
        }),

        cache: "no-store",
      },
    );

    const data =
      await response.json();

    return {
      success: response.ok,

      message:
        data.message ||
        data.detail ||
        (response.ok
          ? "Subscribed successfully."
          : "Subscription failed."),
    };
  } catch (error) {
    console.error(
      "Newsletter subscribe error:",
      error,
    );

    return {
      success: false,

      message:
        "Something went wrong.",
    };
  }
}

export async function unsubscribeFromNewsletter(
  _: unknown,
  formData: FormData,
) {
  try {
    const email =
      formData.get("email");

    if (!email) {
      return {
        success: false,
        message:
          "Email is required.",
      };
    }

    if (!API) {
      console.error(
        "INTERNAL_API_URL missing",
      );

      return {
        success: false,
        message:
          "Server configuration error.",
      };
    }

    const response = await fetch(
      `${API}/unsubscribe`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
        }),

        cache: "no-store",
      },
    );

    const data =
      await response.json();

    return {
      success: response.ok,

      message:
        data.message ||
        data.detail ||
        (response.ok
          ? "Unsubscribed successfully."
          : "Unsubscribe failed."),
    };
  } catch (error) {
    console.error(
      "Newsletter unsubscribe error:",
      error,
    );

    return {
      success: false,

      message:
        "Something went wrong.",
    };
  }
}