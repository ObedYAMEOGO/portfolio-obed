import html
import logging
import time
from typing import List, Optional
import re

import resend  # type: ignore

from app.core.config import settings

# =========================================================
# RESEND CONFIG
# =========================================================

resend.api_key = settings.RESEND_API_KEY

logger = logging.getLogger(__name__)

# =========================================================
# RATE LIMITING
# =========================================================

BATCH_SIZE = 8
BATCH_PAUSE_SECONDS = 1.0

# =========================================================
# BRAND
# =========================================================

FULL_NAME = "Obed Yameogo"
NICKNAME = "TheHatBuddy"
BRAND_TAGLINE = "Production AI Systems Engineer"
BRAND_EMAIL = "obed@thehatbuddyai.space"
BRAND_DOMAIN = "thehatbuddyai.space"
BRAND_URL = "https://www.thehatbuddyai.space"

# =========================================================
# UNSUBSCRIBE URLS
# =========================================================
# TODO: Unsubscribe functionality not yet implemented.
# These return placeholder links until the unsubscribe
# routing and logic are finalized.


def blog_unsubscribe_url(email: str) -> str:
    return "#"


def platform_unsubscribe_url(email: str) -> str:
    return "#"


# =========================================================
# SHARED STYLES
# =========================================================

FONT_STACK = (
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', "
    "Helvetica, Arial, sans-serif"
)

COLOR_BG            = "#f4f4f5"
COLOR_CONTAINER_BG  = "#ffffff"
COLOR_HEADER_BG     = "#18181b"
COLOR_TEXT_PRIMARY  = "#18181b"
COLOR_TEXT_SECONDARY= "#3f3f46"
COLOR_TEXT_MUTED    = "#71717a"
COLOR_BORDER        = "#e4e4e7"
COLOR_LINK          = "#2563eb"

# =========================================================
# SIGNATURE BLOCK
# =========================================================

SIGNATURE_BLOCK = f"""
<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
       style="margin-top:24px; border-top:1px solid {COLOR_BORDER}; padding-top:16px;">
  <tr>
    <td style="font-size:12px; line-height:1.6; color:{COLOR_TEXT_SECONDARY};">
      <p style="margin:0 0 4px; font-weight:600; color:{COLOR_TEXT_PRIMARY};">
        {FULL_NAME}
      </p>
      <p style="margin:0; font-size:12px; color:{COLOR_TEXT_MUTED};">
        {BRAND_TAGLINE}
      </p>
    </td>
  </tr>
</table>
"""

# =========================================================
# BASE EMAIL WRAPPER
# =========================================================


def base_wrapper(
    content: str,
    preheader: str,
    include_signature: bool = True,
) -> str:
    signature_html = SIGNATURE_BLOCK if include_signature else ""

    # ── Header bar ──────────────────────────────────────────────────────────
    header_html = f"""
    <tr>
      <td style="background:{COLOR_HEADER_BG}; padding:16px 24px; border-bottom:1px solid {COLOR_BORDER};">
        <p style="margin:0; font-size:14px; font-weight:600; color:#ffffff;">
          {NICKNAME}
        </p>
        <p style="margin:4px 0 0; font-size:12px; color:#a1a1aa;">
          {FULL_NAME}
        </p>
      </td>
    </tr>
    """

    # ── Footer ──────────────────────────────────────────────────────────────
    footer_html = f"""
    <tr>
      <td style="padding:16px 24px; border-top:1px solid {COLOR_BORDER}; background:{COLOR_BG};">
        <p style="margin:0; font-size:11px; color:{COLOR_TEXT_MUTED};">
          You're receiving this because you subscribed at 
          <a href="{BRAND_URL}" style="color:{COLOR_LINK}; text-decoration:none;">{BRAND_DOMAIN}</a>
        </p>
      </td>
    </tr>
    """

    # ── Preheader ──────────────────────────────────────────────────────────
    safe_preheader = html.escape(preheader)
    preheader_html = f"""
    <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px;">
      {safe_preheader}
    </div>
    """

    return f"""
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title></title>
    </head>
    <body style="margin:0; padding:0; background:{COLOR_BG}; font-family:{FONT_STACK}; 
                 -webkit-font-smoothing:antialiased; -webkit-text-size-adjust:100%;">

      {preheader_html}

      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding:24px 16px;">
            <table width="600" cellpadding="0" cellspacing="0" role="presentation"
                   style="max-width:600px; width:100%; background:{COLOR_CONTAINER_BG}; 
                          border:1px solid {COLOR_BORDER}; border-radius:3px; overflow:hidden;">

              {header_html}

              {content}

              {'<tr><td style="padding:0 24px;">' + signature_html + '</td></tr>' if include_signature else ''}

              {footer_html}
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """


# =========================================================
# PLAIN TEXT FALLBACK
# =========================================================


def _strip_html(html_content: str) -> str:
    text = re.sub(
        r'<a\s[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
        lambda m: f"{m.group(2).strip()} ({m.group(1)})",
        html_content,
        flags=re.IGNORECASE | re.DOTALL,
    )
    text = re.sub(r'<(?:br\s*/?|/(?:p|tr|td|li|h[1-6]|div))>', '\n', text,
                  flags=re.IGNORECASE)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = '\n'.join(line.strip() for line in text.splitlines())
    return text.strip()[:2000]


# =========================================================
# SEND
# =========================================================


def send_email(payload: dict) -> bool:
    to_field = payload.get("to")

    try:
        if not settings.EMAIL_FROM:
            logger.error("EMAIL_FROM is not configured")
            raise ValueError("EMAIL_FROM environment variable is not set")

        from_email = str(settings.EMAIL_FROM).strip()
        payload["from"] = f"{NICKNAME} <{from_email}>"
        payload["reply_to"] = BRAND_EMAIL

        if "html" in payload and "text" not in payload:
            payload["text"] = _strip_html(payload["html"])

        payload.setdefault("headers", {}).update({
            "List-Unsubscribe": "#",
            "Precedence": "bulk",
            "X-Mailer": f"{NICKNAME}-mailer/1.0",
            "X-Auto-Response-Suppress": "OOF, AutoReply",
        })

        resend.Emails.send(payload)
        return True

    except Exception as e:
        logger.exception(f"Failed sending email to {to_field}: {e}")
        return False


# =========================================================
# WELCOME
# =========================================================


def send_welcome_email(to_email: str):
    preheader = f"Welcome to {NICKNAME}"

    content = f"""
    <tr>
      <td style="padding:24px;">
        <h1 style="font-size:18px; font-weight:600; color:{COLOR_TEXT_PRIMARY};
                   margin:0 0 12px; line-height:1.3;">
          Thanks for subscribing.
        </h1>
        <p style="font-size:14px; line-height:1.6; color:{COLOR_TEXT_SECONDARY};
                   margin:0 0 16px;">
          I'm Obed. I build production AI systems, write about shipping LLMs and 
          RAG architectures, and share what it takes to scale intelligence in 
          the real world. No theory — just engineering that works.
        </p>
        <p style="font-size:14px; line-height:1.6; color:{COLOR_TEXT_SECONDARY};
                   margin:0;">
          You'll receive updates when new articles, projects, and resources go live. 
          <a href="{BRAND_URL}" style="color:{COLOR_LINK}; text-decoration:underline;">
            View my work
          </a>
        </p>
      </td>
    </tr>
    """

    send_email({
        "to": [to_email],
        "subject": f"Welcome to {NICKNAME}",
        "html": base_wrapper(content, preheader, include_signature=True),
    })


# =========================================================
# LEAD NOTIFICATION
# =========================================================


def send_lead_notification(lead_email: str, lead_name: str, message: str):
    safe_name    = html.escape(lead_name)
    safe_email   = html.escape(lead_email)
    safe_message = html.escape(message).replace("\n", "<br>")
    preheader    = f"New message from {lead_name}"

    content = f"""
    <tr>
      <td style="padding:24px;">
        <h1 style="font-size:16px; font-weight:600; color:{COLOR_TEXT_PRIMARY};
                   margin:0 0 16px;">
          {safe_name} sent a message
        </h1>
        <p style="font-size:12px; color:{COLOR_TEXT_MUTED}; margin:0 0 12px;">
          <strong>From:</strong> {safe_name} 
          (<a href="mailto:{safe_email}" style="color:{COLOR_LINK}; text-decoration:none;">
            {safe_email}
          </a>)
        </p>
        <div style="background:{COLOR_BG}; padding:12px; border-left:2px solid {COLOR_LINK}; margin:0;">
          <p style="font-size:13px; line-height:1.6; color:{COLOR_TEXT_PRIMARY}; margin:0;">
            {safe_message}
          </p>
        </div>
      </td>
    </tr>
    """

    send_email({
        "to": [str(settings.ADMIN_EMAIL)],
        "subject": f"Message from {safe_name}",
        "html": base_wrapper(content, preheader, include_signature=False),
    })


# =========================================================
# BROADCAST
# =========================================================


def _broadcast(
    subscriber_emails: List[str],
    subject: str,
    title: str,
    description: str,
    url: str,
    unsubscribe_url_fn,
    log_prefix: str,
    preheader: str = "",
):
    safe_title       = html.escape(title)
    safe_description = html.escape(description)
    sent_count       = 0
    failed_emails: List[str] = []
    total = len(subscriber_emails)

    logger.info(f"{log_prefix}: Sending to {total} subscribers")

    for index, email in enumerate(subscriber_emails):
        if index > 0 and index % BATCH_SIZE == 0:
            time.sleep(BATCH_PAUSE_SECONDS)

        _preheader = preheader or safe_title

        content = f"""
        <tr>
          <td style="padding:24px;">
            <h1 style="font-size:16px; font-weight:600; color:{COLOR_TEXT_PRIMARY};
                       margin:0 0 12px;">
              {safe_title}
            </h1>
            <p style="font-size:13px; line-height:1.6; color:{COLOR_TEXT_SECONDARY};
                       margin:0;">
              {safe_description}
              <a href="{url}" style="color:{COLOR_LINK}; text-decoration:underline; display:block; margin-top:12px;">
                Read more →
              </a>
            </p>
          </td>
        </tr>
        """

        ok = send_email({
            "to": [email],
            "subject": subject,
            "html": base_wrapper(content, _preheader, include_signature=True),
        })

        if ok:
            sent_count += 1
        else:
            failed_emails.append(email)

    if failed_emails:
        logger.warning(
            f"{log_prefix}: {sent_count}/{total} sent. Failed: {failed_emails}"
        )
    else:
        logger.info(f"{log_prefix}: {sent_count}/{total} sent successfully.")


# =========================================================
# NEW POST
# =========================================================


def broadcast_new_post(
    subscriber_emails: List[str],
    post_title: str,
    post_summary: Optional[str],
    post_slug: str,
):
    _broadcast(
        subscriber_emails=subscriber_emails,
        subject=f"New article: {post_title[:60]}",
        title=post_title,
        description=post_summary or "A new article has been published.",
        url=f"{BRAND_URL}/blog/{post_slug}",
        unsubscribe_url_fn=blog_unsubscribe_url,
        log_prefix="broadcast_new_post",
        preheader=post_summary or post_title,
    )


# =========================================================
# NEW PROJECT
# =========================================================


def broadcast_new_project(
    subscriber_emails: List[str],
    project_title: str,
    project_description: Optional[str],
):
    _broadcast(
        subscriber_emails=subscriber_emails,
        subject=f"New project: {project_title[:60]}",
        title=project_title,
        description=project_description or "A new project has been published.",
        url=f"{BRAND_URL}/projects",
        unsubscribe_url_fn=platform_unsubscribe_url,
        log_prefix="broadcast_new_project",
        preheader=project_description or project_title,
    )


# =========================================================
# NEW MATERIAL
# =========================================================


def broadcast_new_material(
    subscriber_emails: List[str],
    material_title: str,
    material_description: Optional[str],
):
    _broadcast(
        subscriber_emails=subscriber_emails,
        subject=f"New resource: {material_title[:60]}",
        title=material_title,
        description=material_description or "A new learning resource has been added.",
        url=f"{BRAND_URL}/courses",
        unsubscribe_url_fn=platform_unsubscribe_url,
        log_prefix="broadcast_new_material",
        preheader=material_description or material_title,
    )