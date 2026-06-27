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
BRAND_TAGLINE = "ML Engineer & Researcher"
BRAND_EMAIL = "obed@thehatbuddy.co.in"
BRAND_DOMAIN = "thehatbuddy.co.in"
BRAND_URL = "https://www.thehatbuddy.co.in"

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

COLOR_BG            = "#f4f4f5"   # outer page background
COLOR_CONTAINER_BG  = "#ffffff"   # email card
COLOR_HEADER_BG     = "#18181b"   # top brand bar
COLOR_TEXT_PRIMARY  = "#18181b"
COLOR_TEXT_SECONDARY= "#3f3f46"
COLOR_TEXT_MUTED    = "#71717a"
COLOR_BORDER        = "#e4e4e7"
COLOR_ACCENT        = "#18181b"   # button fill
COLOR_LINK          = "#2563eb"
COLOR_RULE          = "#e4e4e7"

# =========================================================
# SIGNATURE BLOCK
# =========================================================

SIGNATURE_BLOCK = f"""
<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  role="presentation"
  style="margin-top:36px; border-top:1px solid {COLOR_BORDER}; padding-top:20px;"
>
  <tr>
    <td style="font-size:13px; line-height:1.9; color:{COLOR_TEXT_SECONDARY};">
      <p style="margin:0 0 4px; font-weight:600; color:{COLOR_TEXT_PRIMARY};">
        {FULL_NAME}
      </p>
      <p style="margin:0 0 6px; font-size:12px; color:{COLOR_TEXT_MUTED};">
        {BRAND_TAGLINE}
      </p>
      <p style="margin:0 0 3px; font-size:12px; color:{COLOR_TEXT_MUTED};">
        Website:&nbsp;<a href="{BRAND_URL}" style="color:{COLOR_LINK}; text-decoration:none;">{BRAND_DOMAIN}</a>
      </p>
      <p style="margin:0; font-size:12px; color:{COLOR_TEXT_MUTED};">
        Email:&nbsp;<a href="mailto:{BRAND_EMAIL}" style="color:{COLOR_LINK}; text-decoration:none;">{BRAND_EMAIL}</a>
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
    unsubscribe_link: str,
    unsubscribe_text: str,
    include_signature: bool = True,
) -> str:
    signature_html = SIGNATURE_BLOCK if include_signature else ""

    # ── Header bar ──────────────────────────────────────────────────────────
    header_html = f"""
    <tr>
      <td style="background:{COLOR_HEADER_BG}; padding:18px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td>
              <p style="margin:0; font-size:14px; font-weight:700;
                         color:#ffffff; letter-spacing:0.4px;">
                {NICKNAME}
              </p>
              <p style="margin:3px 0 0; font-size:11px; color:#a1a1aa;">
                {FULL_NAME}&nbsp;&middot;&nbsp;{BRAND_TAGLINE}
              </p>
            </td>
            <td align="right" style="vertical-align:middle;">
              <a href="{BRAND_URL}"
                 style="font-size:11px; color:#a1a1aa; text-decoration:none;
                        letter-spacing:0.3px;">
                {BRAND_DOMAIN}&nbsp;&rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    """

    # ── Footer ──────────────────────────────────────────────────────────────
    # TODO: Unsubscribe link in footer is currently a placeholder.
    # Restore the <a> tag and List-Unsubscribe header once routing is done.
    footer_html = f"""
    <tr>
      <td style="padding:20px 32px 24px;
                 border-top:1px solid {COLOR_BORDER};
                 background:{COLOR_BG};">
        <p style="margin:0 0 6px; font-size:11px;
                   color:{COLOR_TEXT_MUTED}; line-height:1.6;">
          You received this because you subscribed at
          <a href="{BRAND_URL}"
             style="color:{COLOR_LINK}; text-decoration:underline;">{BRAND_DOMAIN}</a>.
          <!-- Unsubscribe temporarily disabled – routing not yet implemented: -->
          <!-- <a href="{unsubscribe_link}" style="color:{COLOR_TEXT_MUTED};
               text-decoration:underline;">{unsubscribe_text}</a> -->
        </p>
        <p style="margin:0; font-size:10px; color:#a1a1aa;">
          {FULL_NAME} ({NICKNAME})&nbsp;&middot;&nbsp;{BRAND_DOMAIN}
        </p>
      </td>
    </tr>
    """

    # ── Preheader (hidden preview text) ─────────────────────────────────────
    safe_preheader = html.escape(preheader)
    preheader_html = f"""
    <div style="display:none; max-height:0; overflow:hidden;
                mso-hide:all; font-size:1px; color:{COLOR_BG}; line-height:1px;">
      {safe_preheader}
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
    </div>
    """

    return f"""
    <!DOCTYPE html>
    <html lang="en"
          xmlns="http://www.w3.org/1999/xhtml"
          xmlns:v="urn:schemas-microsoft-com:vml"
          xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="format-detection"
            content="telephone=no, address=no, email=no, date=no, url=no">
      <!--[if mso]>
      <noscript><xml><o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings></xml></noscript>
      <![endif]-->
      <title></title>
    </head>
    <body style="margin:0; padding:0; background:{COLOR_BG};
                 font-family:{FONT_STACK};
                 -webkit-font-smoothing:antialiased;
                 -webkit-text-size-adjust:100%;
                 -ms-text-size-adjust:100%;">

      {preheader_html}

      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding:40px 16px;">
            <table width="600" cellpadding="0" cellspacing="0" role="presentation"
                   style="max-width:600px; width:100%;
                          background:{COLOR_CONTAINER_BG};
                          border:1px solid {COLOR_BORDER};
                          border-radius:4px;
                          overflow:hidden;">

              {header_html}

              {content}

              {'<tr><td style="padding:0 32px;">' + signature_html + '</td></tr>'
                if include_signature else ''}

              {footer_html}
            </table>

            <p style="margin:14px 0 0; font-size:10px; color:#a1a1aa;">
              Add&nbsp;
              <a href="mailto:{BRAND_EMAIL}"
                 style="color:#a1a1aa;">{BRAND_EMAIL}</a>
              &nbsp;to your address book to ensure delivery.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """


# =========================================================
# LINK BUTTON
# =========================================================


def link_button(text: str, url: str) -> str:
    return f"""
    <table cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td style="background:{COLOR_ACCENT}; border-radius:3px;">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml"
                       xmlns:w="urn:schemas-microsoft-com:office:word"
                       href="{url}"
                       style="height:40px;v-text-anchor:middle;width:auto;"
                       arcsize="3%"
                       strokecolor="{COLOR_ACCENT}"
                       fillcolor="{COLOR_ACCENT}">
            <w:anchorlock/>
            <center style="color:#ffffff;font-family:{FONT_STACK};
                           font-size:13px;font-weight:600;
                           padding:11px 22px;">{text}&nbsp;&rarr;</center>
          </v:roundrect>
          <![endif]-->
          <a href="{url}"
             style="display:inline-block; background:{COLOR_ACCENT};
                    color:#ffffff; padding:11px 22px;
                    text-decoration:none; border-radius:3px;
                    font-size:13px; font-weight:600; letter-spacing:0.2px;">
            {text}&nbsp;&rarr;
          </a>
        </td>
      </tr>
    </table>
    """


# =========================================================
# SECTION LABEL
# =========================================================


def section_label(text: str) -> str:
    return f"""
    <p style="margin:0 0 14px; font-size:10px; font-weight:700;
               letter-spacing:1.4px; text-transform:uppercase;
               color:{COLOR_TEXT_MUTED};">
      {text}
    </p>
    """


# =========================================================
# PLAIN TEXT FALLBACK  (improved – preserves links & line breaks)
# =========================================================


def _strip_html(html_content: str) -> str:
    # Expand <a href="...">label</a> → "label (url)"
    text = re.sub(
        r'<a\s[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
        lambda m: f"{m.group(2).strip()} ({m.group(1)})",
        html_content,
        flags=re.IGNORECASE | re.DOTALL,
    )
    # Block-level tags → newlines
    text = re.sub(r'<(?:br\s*/?|/(?:p|tr|td|li|h[1-6]|div))>', '\n', text,
                  flags=re.IGNORECASE)
    # Strip remaining tags
    text = re.sub(r'<[^>]+>', '', text)
    # Collapse excessive whitespace while keeping paragraph breaks
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
        payload["reply_to"] = BRAND_EMAIL  # helps deliverability / inbox placement

        if "html" in payload and "text" not in payload:
            payload["text"] = _strip_html(payload["html"])

        # Anti-spam headers always included (improves deliverability).
        # List-Unsubscribe value is a placeholder "#" until routing is done.
        # TODO: Replace "#" with the real per-recipient unsubscribe URL once
        #       the unsubscribe routing and logic are finalized.
        # TODO: Re-enable the unsubscribe_url pop-and-set block below once
        #       routing is implemented (currently hardcoded to "#").
        unsubscribe_url = payload.pop("unsubscribe_url", None)
        payload.setdefault("headers", {}).update({
            # Unsubscribe URL is a placeholder ("#") – swap for real URL later:
            "List-Unsubscribe": f"<{unsubscribe_url or '#'}>",
            # TODO: enable One-Click unsubscribe once the POST endpoint exists:
            # "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
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
    preheader = f"Welcome — here's what to expect from {NICKNAME}."

    content = f"""
    <tr>
      <td style="padding:32px 32px 0;">
        <h1 style="font-size:22px; font-weight:700; color:{COLOR_TEXT_PRIMARY};
                   margin:0 0 14px; line-height:1.3; letter-spacing:-0.4px;">
          Thanks for subscribing.
        </h1>
        <p style="font-size:14px; line-height:1.75; color:{COLOR_TEXT_SECONDARY};
                   margin:0 0 20px;">
          I'm Obed — better known as {NICKNAME}. I share technical deep dives
          on AI/ML systems, real-world project walkthroughs, and curated resources
          for practitioners. No noise — just content worth your time.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
               style="border-left:3px solid {COLOR_ACCENT};
                      background:{COLOR_BG}; margin-bottom:28px;">
          <tr>
            <td style="padding:14px 18px; font-size:13px; line-height:1.65;
                        color:{COLOR_TEXT_SECONDARY};">
              <strong>What to expect:</strong>&nbsp;Regular emails when new
              articles, projects, or learning resources go live. 
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 36px;">
        {link_button(f"Visit {BRAND_DOMAIN}", BRAND_URL)}
      </td>
    </tr>
    """

    send_email({
        "to": [to_email],
        "subject": f"Welcome to {NICKNAME}",
        "html": base_wrapper(
            content,
            preheader,
            blog_unsubscribe_url(to_email),
            "Unsubscribe",
            include_signature=True,
        ),
        "unsubscribe_url": blog_unsubscribe_url(to_email),
    })


# =========================================================
# LEAD NOTIFICATION
# =========================================================


def send_lead_notification(lead_email: str, lead_name: str, message: str):
    safe_name    = html.escape(lead_name)
    safe_email   = html.escape(lead_email)
    safe_message = html.escape(message).replace("\n", "<br>")
    preheader    = f"New message from {lead_name} via {BRAND_DOMAIN}."

    content = f"""
    <tr>
      <td style="padding:32px 32px 0;">
        {section_label("New message from your website")}
        <h1 style="font-size:20px; font-weight:700; color:{COLOR_TEXT_PRIMARY};
                   margin:0 0 22px; letter-spacing:-0.3px;">
          {safe_name} reached out
        </h1>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
               style="margin-bottom:20px; border-top:1px solid {COLOR_BORDER};
                      border-bottom:1px solid {COLOR_BORDER};">
          <tr>
            <td style="font-size:11px; color:{COLOR_TEXT_MUTED}; padding:10px 0 10px;
                        width:52px; font-weight:600; text-transform:uppercase;
                        letter-spacing:0.8px;">From</td>
            <td style="font-size:13px; color:{COLOR_TEXT_PRIMARY}; padding:10px 0;">
              {safe_name}
            </td>
          </tr>
          <tr>
            <td style="font-size:11px; color:{COLOR_TEXT_MUTED}; padding:0 0 10px;
                        font-weight:600; text-transform:uppercase; letter-spacing:0.8px;">
              Email
            </td>
            <td style="font-size:13px; padding:0 0 10px;">
              <a href="mailto:{safe_email}"
                 style="color:{COLOR_LINK}; text-decoration:none;">{safe_email}</a>
            </td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
               style="background:{COLOR_BG}; border:1px solid {COLOR_BORDER};
                      border-radius:3px; margin-bottom:24px;">
          <tr>
            <td style="padding:18px 20px; font-size:14px; line-height:1.75;
                        color:{COLOR_TEXT_PRIMARY};">{safe_message}</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 36px;">
        {link_button(f"Reply to {safe_name}", f"mailto:{safe_email}")}
      </td>
    </tr>
    """

    send_email({
        "to": [str(settings.ADMIN_EMAIL)],
        "subject": f"New message from {safe_name} — {BRAND_DOMAIN}",
        "html": base_wrapper(
            content,
            preheader,
            BRAND_URL,
            "View website",
            include_signature=False,
        ),
    })


# =========================================================
# BROADCAST  (internal helper)
# =========================================================


def _broadcast(
    subscriber_emails: List[str],
    subject: str,
    label: str,
    title: str,
    description: str,
    url: str,
    unsubscribe_url_fn,
    unsubscribe_text: str,
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
          <td style="padding:32px 32px 0;">
            {section_label(label)}
            <h1 style="font-size:20px; font-weight:700; color:{COLOR_TEXT_PRIMARY};
                       margin:0 0 14px; line-height:1.4; letter-spacing:-0.3px;">
              {safe_title}
            </h1>
            <p style="font-size:14px; line-height:1.75; color:{COLOR_TEXT_SECONDARY};
                       margin:0 0 28px;">{safe_description}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 36px;">
            {link_button("Read more", url)}
          </td>
        </tr>
        """

        ok = send_email({
            "to": [email],
            "subject": subject,
            "html": base_wrapper(
                content,
                _preheader,
                unsubscribe_url_fn(email),
                unsubscribe_text,
                include_signature=True,
            ),
            "unsubscribe_url": unsubscribe_url_fn(email),
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
        subject=f"New article: {post_title[:100]}",
        label=f"New article from {NICKNAME}",
        title=post_title,
        description=post_summary or "A new article has been published.",
        url=f"{BRAND_URL}/blog/{post_slug}",
        unsubscribe_url_fn=blog_unsubscribe_url,
        unsubscribe_text="Unsubscribe",
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
    project_slug: str,
):
    _broadcast(
        subscriber_emails=subscriber_emails,
        subject=f"New project: {project_title[:100]}",
        label=f"New project from {NICKNAME}",
        title=project_title,
        description=project_description or "A new project has been published.",
        url=f"{BRAND_URL}/projects/{project_slug}",
        unsubscribe_url_fn=platform_unsubscribe_url,
        unsubscribe_text="Unsubscribe",
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
    material_slug: str,
):
    _broadcast(
        subscriber_emails=subscriber_emails,
        subject=f"New resource: {material_title[:100]}",
        label=f"New resource from {NICKNAME}",
        title=material_title,
        description=material_description or "A new learning resource has been added.",
        url=f"{BRAND_URL}/materials/{material_slug}",
        unsubscribe_url_fn=platform_unsubscribe_url,
        unsubscribe_text="Unsubscribe",
        log_prefix="broadcast_new_material",
        preheader=material_description or material_title,
    )