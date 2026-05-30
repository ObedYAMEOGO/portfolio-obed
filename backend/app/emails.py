import logging
from typing import List, Optional

import resend  # type: ignore

from app.core.config import settings

# =========================================================
# RESEND CONFIG
# =========================================================

resend.api_key = settings.RESEND_API_KEY

logger = logging.getLogger(__name__)

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
        f"?email={email}"
    )


def platform_unsubscribe_url(
    email: str,
) -> str:
    return (
        f"{get_base_url()}"
        f"/unsubscribe/platform"
        f"?email={email}"
    )


# =========================================================
# SHARED STYLES
# =========================================================

FONT = (
    "font-family: -apple-system, BlinkMacSystemFont, "
    "'Segoe UI', Helvetica, Arial, sans-serif;"
)

COLOR_TEXT = "#111111"
COLOR_MUTED = "#6b7280"
COLOR_BORDER = "#e5e7eb"
COLOR_BG = "#f9fafb"

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
    <body style="margin:0; padding:0; background:#f3f4f6; {FONT}">
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
                border-radius:12px;
                border:1px solid {COLOR_BORDER};
                overflow:hidden;
              "
            >

              <tr>
                <td style="background:#111;padding:20px 40px;">

                  <p style="
                    margin:0;
                    color:#fff;
                    font-size:13px;
                    font-weight:600;
                  ">
                    Obed Yameogo
                  </p>

                  <p style="
                    margin:4px 0 0;
                    color:#aaa;
                    font-size:11px;
                  ">
                    AI Engineering · Machine Learning · LLM Systems
                  </p>

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
                      style="color:#111;"
                    >
                      obedyameogo.com
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
        background:#111;
        color:#fff;
        padding:14px 28px;
        border-radius:999px;
        text-decoration:none;
        font-size:13px;
        font-weight:600;
      "
    >
      {text}
    </a>
    """


# =========================================================
# SAFE SEND
# =========================================================


def send_email(payload: dict):
    try:
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

        <h1 style="
          font-size:28px;
          color:{COLOR_TEXT};
          margin-bottom:20px;
        ">
          Welcome aboard.
        </h1>

        <p style="
          font-size:15px;
          line-height:1.8;
          color:{COLOR_MUTED};
        ">
          Thanks for subscribing to the newsletter.
          You'll receive updates about AI Engineering,
          LLM systems, RAG architectures,
          MLOps, inference optimization,
          and production machine learning.
        </p>

        <div style="margin-top:32px;">
          {cta_button("Visit Website →", get_base_url())}
        </div>

      </td>
    </tr>
    """

    send_email(
        {
            "from": str(settings.EMAIL_FROM),
            "to": [to_email],
            "subject": "Welcome to the AI Engineering Newsletter",
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
    content = f"""
    <tr>
      <td style="padding:40px;">

        <h1 style="
          font-size:24px;
          color:{COLOR_TEXT};
        ">
          New Contact Message
        </h1>

        <p>
          <strong>Name:</strong>
          {lead_name}
        </p>

        <p>
          <strong>Email:</strong>
          {lead_email}
        </p>

        <div style="
          background:{COLOR_BG};
          padding:20px;
          border-radius:8px;
          margin-top:20px;
        ">

          <p style="
            margin:0;
            line-height:1.8;
          ">
            {message}
          </p>

        </div>

      </td>
    </tr>
    """

    send_email(
        {
            "from": str(settings.EMAIL_FROM),
            "to": [str(settings.ADMIN_EMAIL)],
            "subject": f"New message from {lead_name}",
            "html": base_wrapper(
                content,
                get_base_url(),
                "Visit Website",
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

    summary = (
        post_summary
        or "A new AI engineering article has just been published."
    )

    for email in subscriber_emails:

        content = f"""
        <tr>
          <td style="padding:40px;">

            <h1 style="
              font-size:28px;
              color:{COLOR_TEXT};
              margin-bottom:18px;
            ">
              {post_title}
            </h1>

            <p style="
              font-size:15px;
              line-height:1.8;
              color:{COLOR_MUTED};
            ">
              {summary}
            </p>

            <div style="margin-top:32px;">
              {cta_button("Read Article →", post_url)}
            </div>

          </td>
        </tr>
        """

        send_email(
            {
                "from": str(settings.EMAIL_FROM),
                "to": [email],
                "subject": f"New AI Article: {post_title}",
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

    description = (
        project_description
        or "A new AI project has been published."
    )

    for email in subscriber_emails:

        content = f"""
        <tr>
          <td style="padding:40px;">

            <h1 style="
              font-size:28px;
              color:{COLOR_TEXT};
              margin-bottom:18px;
            ">
              {project_title}
            </h1>

            <p style="
              font-size:15px;
              line-height:1.8;
              color:{COLOR_MUTED};
            ">
              {description}
            </p>

            <div style="margin-top:32px;">
              {cta_button("View Project →", project_url)}
            </div>

          </td>
        </tr>
        """

        send_email(
            {
                "from": str(settings.EMAIL_FROM),
                "to": [email],
                "subject": f"New AI Project: {project_title}",
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

    description = (
        material_description
        or "A new learning resource has been added."
    )

    for email in subscriber_emails:

        content = f"""
        <tr>
          <td style="padding:40px;">

            <h1 style="
              font-size:28px;
              color:{COLOR_TEXT};
              margin-bottom:18px;
            ">
              {material_title}
            </h1>

            <p style="
              font-size:15px;
              line-height:1.8;
              color:{COLOR_MUTED};
            ">
              {description}
            </p>

            <div style="margin-top:32px;">
              {cta_button("Open Material →", material_url)}
            </div>

          </td>
        </tr>
        """

        send_email(
            {
                "from": str(settings.EMAIL_FROM),
                "to": [email],
                "subject": f"New Resource: {material_title}",
                "html": base_wrapper(
                    content,
                    platform_unsubscribe_url(email),
                    "Disable platform notifications",
                ),
            }
        )