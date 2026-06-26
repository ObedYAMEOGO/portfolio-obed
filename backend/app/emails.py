import html
import logging
from typing import List, Optional
from urllib.parse import quote

import resend  # type: ignore

from app.core.config import settings

# =========================================================
# RESEND CONFIG
# =========================================================

resend.api_key = settings.RESEND_API_KEY

logger = logging.getLogger(__name__)

# =========================================================
# BRAND
# =========================================================
# Header/footer identity. Keeps the personal name, with
# TheHatBuddy as the nickname/brand riding alongside it.

BRAND_NAME = "Obed Yameogo"
BRAND_NICKNAME = "TheHatBuddy"
BRAND_TAGLINE = "AI Engineering · Machine Learning · LLM Systems"

# =========================================================
# BASE URL
# =========================================================


def get_base_url() -> str:
    return settings.FRONTEND_URL.rstrip("/")


# =========================================================
# UNSUBSCRIBE URLS
# =========================================================


def blog_unsubscribe_url(
    email: str,
) -> str:
    return (
        f"{get_base_url()}"
        f"/unsubscribe/blog"
        f"?email={quote(email)}"
    )


def platform_unsubscribe_url(
    email: str,
) -> str:
    return (
        f"{get_base_url()}"
        f"/unsubscribe/platform"
        f"?email={quote(email)}"
    )


# =========================================================
# SHARED STYLES
# =========================================================

FONT = (
    "font-family: -apple-system, BlinkMacSystemFont, "
    "'Segoe UI', Helvetica, Arial, sans-serif;"
)

# Bold / modern palette. One confident accent (signal orange)
# against deep ink, used sparingly against clean neutrals.
COLOR_INK = "#0f1115"
COLOR_TEXT = "#16181d"
COLOR_MUTED = "#5b6068"
COLOR_BORDER = "#e7e8ec"
COLOR_BG = "#f6f6f8"
COLOR_ACCENT = "#ff5a1f"
COLOR_ACCENT_DARK = "#e44e16"
COLOR_ACCENT_SOFT = "#fff1ea"

# =========================================================
# BASE EMAIL WRAPPER
# =========================================================


def base_wrapper(
    content: str,
    unsubscribe_link: str,
    unsubscribe_text: str,
) -> str:
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <body style="margin:0; padding:0; background:{COLOR_BG}; {FONT}">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:48px 16px;">

            <table
              width="600"
              cellpadding="0"
              cellspacing="0"
              style="
                max-width:600px;
                width:100%;
                background:#fff;
                border-radius:16px;
                border:1px solid {COLOR_BORDER};
                overflow:hidden;
                box-shadow:0 1px 3px rgba(15,17,21,0.04);
              "
            >

              <tr>
                <td style="
                  background:{COLOR_INK};
                  padding:24px 40px;
                  border-top:3px solid {COLOR_ACCENT};
                ">

                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="
                          margin:0;
                          color:#fff;
                          font-size:14px;
                          font-weight:700;
                          letter-spacing:0.2px;
                        ">
                          {BRAND_NAME}
                          <span style="
                            color:{COLOR_ACCENT};
                            font-weight:700;
                          ">
                            · {BRAND_NICKNAME}
                          </span>
                        </p>

                        <p style="
                          margin:4px 0 0;
                          color:#9a9da3;
                          font-size:11px;
                        ">
                          {BRAND_TAGLINE}
                        </p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              {content}

              <tr>
                <td style="
                  padding:24px 40px;
                  border-top:1px solid {COLOR_BORDER};
                  background:{COLOR_BG};
                ">

                  <p style="
                    margin:0;
                    font-size:11px;
                    color:#999;
                    line-height:1.7;
                  ">
                    You're receiving this email because you subscribed on
                    <a
                      href="{get_base_url()}"
                      style="color:{COLOR_INK}; font-weight:600;"
                    >
                      thehatbuddy.co.in
                    </a>
                  </p>

                  <p style="
                    margin:12px 0 0;
                    font-size:11px;
                  ">
                    <a
                      href="{unsubscribe_link}"
                      style="
                        color:#999;
                        text-decoration:underline;
                      "
                    >
                      {unsubscribe_text}
                    </a>
                  </p>

                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </body>
    </html>
    """


# =========================================================
# CTA BUTTON
# =========================================================


def cta_button(
    text: str,
    url: str,
) -> str:
    return f"""
    <a
      href="{url}"
      style="
        display:inline-block;
        background:{COLOR_ACCENT};
        color:#fff;
        padding:14px 28px;
        border-radius:999px;
        text-decoration:none;
        font-size:13px;
        font-weight:700;
        letter-spacing:0.2px;
      "
    >
      {text}
    </a>
    """


# =========================================================
# EYEBROW LABEL (small tag above a heading, e.g. "NEW ARTICLE")
# =========================================================


def eyebrow(
    text: str,
) -> str:
    return f"""
    <p style="
      margin:0 0 14px;
      display:inline-block;
      background:{COLOR_ACCENT_SOFT};
      color:{COLOR_ACCENT_DARK};
      font-size:11px;
      font-weight:700;
      letter-spacing:0.6px;
      text-transform:uppercase;
      padding:5px 12px;
      border-radius:999px;
    ">
      {text}
    </p>
    """


# =========================================================
# SAFE SEND
# =========================================================


def send_email(payload: dict):
    try:
        if not settings.EMAIL_FROM:
            logger.error("EMAIL_FROM is not configured")
            raise ValueError("EMAIL_FROM environment variable is not set")

        # Ensure 'from' field is a valid email string, stripping whitespace
        payload["from"] = str(settings.EMAIL_FROM).strip()
        resend.Emails.send(payload)

    except Exception as e:
        logger.exception(f"Failed sending email: {e}")


# =========================================================
# WELCOME EMAIL
# =========================================================


def send_welcome_email(
    to_email: str,
):
    content = f"""
    <tr>
      <td style="padding:40px;">

        {eyebrow("You're in")}

        <h1 style="
          font-size:28px;
          color:{COLOR_TEXT};
          margin:0 0 20px;
          line-height:1.3;
        ">
          Welcome to the list.
        </h1>

        <p style="
          font-size:15px;
          line-height:1.8;
          color:{COLOR_MUTED};
          margin:0;
        ">
          Thanks for subscribing. You'll hear from
          {BRAND_NICKNAME} whenever there's something
          worth your time: AI engineering deep dives, LLM
          systems, RAG architectures, MLOps, inference
          optimization, and production machine learning —
          no filler, no spam.
        </p>

        <div style="margin-top:32px;">
          {cta_button("Visit thehatbuddy.co.in →", get_base_url())}
        </div>

      </td>
    </tr>
    """

    send_email(
        {
            "to": [to_email],
            "subject": "Welcome to TheHatBuddy",
            "html": base_wrapper(
                content,
                blog_unsubscribe_url(to_email),
                "Unsubscribe from blog emails",
            ),
        }
    )


# =========================================================
# LEAD NOTIFICATION
# =========================================================


def send_lead_notification(
    lead_email: str,
    lead_name: str,
    message: str,
):
    safe_name = html.escape(lead_name)
    safe_email = html.escape(lead_email)
    safe_message = html.escape(message).replace("\n", "<br>")

    content = f"""
    <tr>
      <td style="padding:40px;">

        {eyebrow("New contact message")}

        <h1 style="
          font-size:24px;
          color:{COLOR_TEXT};
          margin:0 0 20px;
        ">
          {safe_name} reached out
        </h1>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
          <tr>
            <td style="
              font-size:13px;
              color:{COLOR_MUTED};
              padding:4px 0;
              width:70px;
            ">
              Name
            </td>
            <td style="
              font-size:13px;
              color:{COLOR_TEXT};
              font-weight:600;
              padding:4px 0;
            ">
              {safe_name}
            </td>
          </tr>
          <tr>
            <td style="
              font-size:13px;
              color:{COLOR_MUTED};
              padding:4px 0;
              width:70px;
            ">
              Email
            </td>
            <td style="
              font-size:13px;
              padding:4px 0;
            ">
              <a href="mailto:{safe_email}" style="color:{COLOR_ACCENT_DARK}; font-weight:600; text-decoration:none;">
                {safe_email}
              </a>
            </td>
          </tr>
        </table>

        <div style="
          background:{COLOR_BG};
          padding:20px;
          border-radius:12px;
          border-left:3px solid {COLOR_ACCENT};
        ">

          <p style="
            margin:0;
            line-height:1.8;
            font-size:14px;
            color:{COLOR_TEXT};
          ">
            {safe_message}
          </p>

        </div>

        <div style="margin-top:28px;">
          {cta_button("Reply now →", f"mailto:{safe_email}")}
        </div>

      </td>
    </tr>
    """

    send_email(
        {
            "to": [str(settings.ADMIN_EMAIL)],
            "subject": f"New message from {lead_name}",
            "html": base_wrapper(
                content,
                get_base_url(),
                "Visit website",
            ),
        }
    )


# =========================================================
# NEW BLOG POST EMAIL
# =========================================================


def broadcast_new_post(
    subscriber_emails: List[str],
    post_title: str,
    post_summary: Optional[str],
    post_slug: str,
):
    post_url = f"{get_base_url()}/blog/{post_slug}"

    safe_title = html.escape(post_title)
    summary = html.escape(
        post_summary
        or "A new AI engineering article has just been published."
    )

    for email in subscriber_emails:

        content = f"""
        <tr>
          <td style="padding:40px;">

            {eyebrow("New article")}

            <h1 style="
              font-size:26px;
              color:{COLOR_TEXT};
              margin:0 0 16px;
              line-height:1.35;
            ">
              {safe_title}
            </h1>

            <p style="
              font-size:15px;
              line-height:1.8;
              color:{COLOR_MUTED};
              margin:0;
            ">
              {summary}
            </p>

            <div style="margin-top:32px;">
              {cta_button("Read the article →", post_url)}
            </div>

          </td>
        </tr>
        """

        send_email(
            {
                "to": [email],
                "subject": f"New on TheHatBuddy: {post_title}",
                "html": base_wrapper(
                    content,
                    blog_unsubscribe_url(email),
                    "Unsubscribe from blog emails",
                ),
            }
        )


# =========================================================
# NEW PROJECT EMAIL
# =========================================================


def broadcast_new_project(
    subscriber_emails: List[str],
    project_title: str,
    project_description: Optional[str],
    project_slug: str,
):
    project_url = f"{get_base_url()}/projects/{project_slug}"

    safe_title = html.escape(project_title)
    description = html.escape(
        project_description
        or "A new AI project has been published."
    )

    for email in subscriber_emails:

        content = f"""
        <tr>
          <td style="padding:40px;">

            {eyebrow("New project")}

            <h1 style="
              font-size:26px;
              color:{COLOR_TEXT};
              margin:0 0 16px;
              line-height:1.35;
            ">
              {safe_title}
            </h1>

            <p style="
              font-size:15px;
              line-height:1.8;
              color:{COLOR_MUTED};
              margin:0;
            ">
              {description}
            </p>

            <div style="margin-top:32px;">
              {cta_button("View the project →", project_url)}
            </div>

          </td>
        </tr>
        """

        send_email(
            {
                "to": [email],
                "subject": f"New project on TheHatBuddy: {project_title}",
                "html": base_wrapper(
                    content,
                    platform_unsubscribe_url(email),
                    "Disable platform notifications",
                ),
            }
        )


# =========================================================
# NEW MATERIAL EMAIL
# =========================================================


def broadcast_new_material(
    subscriber_emails: List[str],
    material_title: str,
    material_description: Optional[str],
    material_slug: str,
):
    material_url = f"{get_base_url()}/materials/{material_slug}"

    safe_title = html.escape(material_title)
    description = html.escape(
        material_description
        or "A new learning resource has been added."
    )

    for email in subscriber_emails:

        content = f"""
        <tr>
          <td style="padding:40px;">

            {eyebrow("New resource")}

            <h1 style="
              font-size:26px;
              color:{COLOR_TEXT};
              margin:0 0 16px;
              line-height:1.35;
            ">
              {safe_title}
            </h1>

            <p style="
              font-size:15px;
              line-height:1.8;
              color:{COLOR_MUTED};
              margin:0;
            ">
              {description}
            </p>

            <div style="margin-top:32px;">
              {cta_button("Open the resource →", material_url)}
            </div>

          </td>
        </tr>
        """

        send_email(
            {
                "to": [email],
                "subject": f"New resource on TheHatBuddy: {material_title}",
                "html": base_wrapper(
                    content,
                    platform_unsubscribe_url(email),
                    "Disable platform notifications",
                ),
            }
        )