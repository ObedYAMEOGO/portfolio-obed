// src/actions/newsletter.ts

"use server";

const API = process.env.INTERNAL_API_URL;

async function parseResponse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { message: text || null };
  }
}

export async function subscribeToNewsletter(
  _: unknown,
  formData: FormData,
) {
  try {
    const email = formData.get("email");

    if (!email) {
      return { success: false, message: "Email is required." };
    }

    if (!API) {
      console.error("INTERNAL_API_URL missing");
      return { success: false, message: "Server configuration error." };
    }

    const response = await fetch(`${API}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      console.error("SUBSCRIBE_ERROR:", {
        status: response.status,
        data,
      });
    }

    return {
      success: response.ok,
      message:
        data.message ||
        data.detail ||
        (response.ok ? "Subscribed successfully." : "Subscription failed."),
    };
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return { success: false, message: "Something went wrong." };
  }
}

export async function unsubscribeFromNewsletter(
  _: unknown,
  formData: FormData,
) {
  try {
    const email = formData.get("email");

    if (!email) {
      return { success: false, message: "Email is required." };
    }

    if (!API) {
      console.error("INTERNAL_API_URL missing");
      return { success: false, message: "Server configuration error." };
    }

    const response = await fetch(`${API}/unsubscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      console.error("UNSUBSCRIBE_ERROR:", {
        status: response.status,
        data,
      });
    }

    return {
      success: response.ok,
      message:
        data.message ||
        data.detail ||
        (response.ok ? "Unsubscribed successfully." : "Unsubscribe failed."),
    };
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return { success: false, message: "Something went wrong." };
  }
}