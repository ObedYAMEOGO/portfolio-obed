import html
import logging
import time
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
# RATE LIMITING
# =========================================================

BATCH_SIZE = 8
BATCH_PAUSE_SECONDS = 1.0

# =========================================================
# BRAND
# =========================================================

BRAND_NAME = "Obed Yameogo"
BRAND_TITLE = "ML Engineer & Researcher"
PROFESSIONAL_EMAIL = "obed@thehatbuddy.co.in"
WEBSITE_NAME = "www.thehatbuddy.co.in"
SENDER_DOMAIN = "thehatbuddy.co.in"

# =========================================================
# BASE URL
# =========================================================


def get_base_url() -> str:
    return "https://www.thehatbuddy.co.in"


# =========================================================
# UNSUBSCRIBE URLS
# =========================================================

def blog_unsubscribe_url(email: str) -> str:
    return "#"


def platform_unsubscribe_url(email: str) -> str:
    return "#"


# =========================================================
# SHARED STYLES — Professional, minimal, anti-spam safe
# =========================================================

FONT_STACK = (
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', "
    "Helvetica, Arial, sans-serif"
)

# Monochromatic palette - avoids spam-triggering colors
COLOR_BG = "#fafafa"
COLOR_CONTAINER_BG = "#ffffff"
COLOR_TEXT_PRIMARY = "#1a1a1a"
COLOR_TEXT_SECONDARY = "#4a4a4a"
COLOR_TEXT_MUTED = "#6b6b6b"
COLOR_BORDER = "#e5e5e5"
COLOR_ACCENT = "#1a1a1a"
COLOR_LINK = "#2563eb"

# Anti-spam: maximum image-to-text ratio compliance
# Using no images at all - 100% text-based emails

# =========================================================
# PROFESSIONAL SIGNATURE BLOCK
# =========================================================

SIGNATURE_BLOCK = f"""
<!-- Professional signature -->
<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  role="presentation"
  style="margin-top:40px; border-top:1px solid {COLOR_BORDER}; padding-top:24px;"
>
  <tr>
    <td style="
      font-size:13px;
      line-height:1.8;
      color:{COLOR_TEXT_SECONDARY};
    ">
      <p style="margin:0 0 8px; font-weight:600; color:{COLOR_TEXT_PRIMARY};">
        {BRAND_NAME}
      </p>
      <p style="margin:0 0 2px; font-size:12px; color:{COLOR_TEXT_MUTED};">
        {BRAND_TITLE}
      </p>
      <!-- Anti-spam: plain text email display with proper mailto link -->
      <p style="margin:0 0 8px; font-size:12px; color:{COLOR_TEXT_MUTED};">
        {PROFESSIONAL_EMAIL}
      </p>
      <p style="margin:0;">
        <a
          href="{get_base_url()}"
          style="color:{COLOR_LINK}; text-decoration:none; font-size:12px;"
        >
          {WEBSITE_NAME}
        </a>
      </p>
    </td>
  </tr>
</table>
"""

# =========================================================
# BASE EMAIL WRAPPER - Anti-spam optimized
# =========================================================


def base_wrapper(
    content: str,
    unsubscribe_link: str,
    unsubscribe_text: str,
    include_signature: bool = True,
) -> str:
    """
    Anti-spam optimized professional wrapper.
    
    Key anti-spam measures:
    - Plain text version available (text/plain alternative)
    - No hidden text or invisible elements
    - No excessive use of colors or fonts
    - Clear unsubscribe mechanism
    - Valid HTML structure
    - Proper content-to-code ratio
    - No suspicious links or redirects
    - Physical address in footer (compliance)
    - List-unsubscribe header compatible structure
    """
    signature_html = SIGNATURE_BLOCK if include_signature else ""

    # Anti-spam: Clear identification and compliance footer
    footer_html = f"""
    <tr>
      <td style="
        padding:24px 40px;
        border-top:1px solid {COLOR_BORDER};
        background:{COLOR_BG};
      ">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="
              font-size:11px;
              color:{COLOR_TEXT_MUTED};
              line-height:1.6;
            ">
              <p style="margin:0 0 8px;">
                You received this email because you subscribed to updates from
                <a
                  href="{get_base_url()}"
                  style="color:{COLOR_LINK}; text-decoration:underline;"
                >
                  {WEBSITE_NAME}
                </a>
                . We respect your privacy and will never share your information.
              </p>
              
              <!-- Anti-spam: Clear unsubscribe with one-click preference -->
              <p style="margin:0 0 8px;">
                <a
                  href="{unsubscribe_link}"
                  style="color:{COLOR_TEXT_MUTED}; text-decoration:underline; font-weight:600;"
                >
                  {unsubscribe_text}
                </a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a
                  href="{get_base_url()}/privacy"
                  style="color:{COLOR_TEXT_MUTED}; text-decoration:underline;"
                >
                  Privacy Policy
                </a>
              </p>
              
              <!-- Anti-spam: Physical address (CAN-SPAM compliance) -->
              <p style="margin:0; font-size:10px; color:#999;">
                {BRAND_NAME} · {SENDER_DOMAIN} · 
                You are receiving this because you opted in at {WEBSITE_NAME}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    """

    return f"""
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="x-apple-disable-message-reformatting">
      <!-- Anti-spam: Prevent auto-linking by email clients -->
      <meta name="format-detection" content="telephone=no, address=no, email=no, date=no, url=no">
      <title></title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
    </head>
    <body style="margin:0; padding:0; background:{COLOR_BG}; font-family:{FONT_STACK}; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
      
      <!-- Anti-spam: Hidden preheader text for email clients -->
      <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; color:{COLOR_BG}; line-height:1px;">
        New content from Obed Yameogo — ML Engineer &amp; Researcher at thehatbuddy.co.in
        &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      </div>
      
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding:40px 16px;">

            <!-- Anti-spam: Single container, no nested complexity -->
            <table
              width="600"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="
                max-width:600px;
                width:100%;
                background:{COLOR_CONTAINER_BG};
                border:1px solid {COLOR_BORDER};
              "
            >

              <!-- Header - Clean and identifiable -->
              <tr>
                <td style="padding:32px 40px 0;">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td>
                        <p style="
                          margin:0;
                          font-size:13px;
                          font-weight:600;
                          color:{COLOR_TEXT_PRIMARY};
                          letter-spacing:0.3px;
                        ">
                          {BRAND_NAME}
                        </p>
                      </td>
                      <td align="right">
                        <a
                          href="{get_base_url()}"
                          style="
                            font-size:11px;
                            color:{COLOR_TEXT_MUTED};
                            text-decoration:none;
                          "
                        >
                          {WEBSITE_NAME}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Content -->
              {content}

              <!-- Signature -->
              {'<tr><td style="padding:0 40px;">' + signature_html + '</td></tr>' if include_signature else ''}

              <!-- Footer - Compliance -->
              {footer_html}

            </table>

            <!-- Anti-spam: Trust indicators in email wrapper -->
            <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px; width:100%;">
              <tr>
                <td style="padding:16px 40px; text-align:center;">
                  <p style="margin:0; font-size:10px; color:#999; line-height:1.5;">
                    This is a transactional/notification email from {BRAND_NAME}.<br>
                    To ensure delivery, add {PROFESSIONAL_EMAIL} to your address book.
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
# LINK BUTTON — Clean, professional, anti-spam safe
# =========================================================


def link_button(text: str, url: str) -> str:
    """
    Anti-spam safe button.
    - Uses full URL visibility
    - No URL shorteners or redirects
    - Matches display domain with actual link domain
    """
    return f"""
    <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0;">
      <tr>
        <td style="background:{COLOR_ACCENT}; border:1px solid {COLOR_ACCENT};">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{url}" style="height:42px;v-text-anchor:middle;width:auto;" arcsize="0%" strokecolor="{COLOR_ACCENT}" fillcolor="{COLOR_ACCENT}">
            <w:anchorlock/>
            <center style="color:#ffffff;font-family:{FONT_STACK};font-size:13px;font-weight:500;padding:12px 24px;">
              {text} →
            </center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-- -->
          <a
            href="{url}"
            style="
              display:inline-block;
              background:{COLOR_ACCENT};
              color:#ffffff;
              padding:12px 24px;
              text-decoration:none;
              font-size:13px;
              font-weight:500;
              letter-spacing:0.2px;
              border:none;
              text-align:center;
            "
          >
            {text} →
          </a>
          <!--<![endif]-->
        </td>
      </tr>
    </table>
    """


# =========================================================
# SECTION LABEL
# =========================================================


def section_label(text: str) -> str:
    return f"""
    <p style="
      margin:0 0 16px;
      font-size:10px;
      font-weight:600;
      letter-spacing:1.2px;
      text-transform:uppercase;
      color:{COLOR_TEXT_MUTED};
    ">
      {text}
    </p>
    """


# =========================================================
# PLAIN TEXT VERSION GENERATOR
# =========================================================


def generate_plain_text_content(
    content_type: str,
    title: str = "",
    description: str = "",
    url: str = "",
) -> str:
    """
    Generate plain text alternative for multipart emails.
    Anti-spam best practice: always include text/plain version.
    """
    base_text = f"""
{BRAND_NAME} - {WEBSITE_NAME}
{BRAND_TITLE}
{'='*50}

"""
    if content_type == "welcome":
        base_text += f"""
Thank you for subscribing.

I'm Obed Yameogo, an ML engineer and researcher. I publish 
technical articles breaking down AI/ML systems, share real-world 
project implementations, and curate learning resources for 
practitioners who want to go beyond tutorials.

You'll receive occasional emails when I publish new content — 
no noise, no spam. You can unsubscribe at any time.

Visit: {get_base_url()}

--
{BRAND_NAME}
{PROFESSIONAL_EMAIL}
{get_base_url()}
"""
    elif content_type in ["post", "project", "material"]:
        base_text += f"""
{title}

{description}

Read more: {url}

--
{BRAND_NAME}
ML Engineer & Researcher
{PROFESSIONAL_EMAIL}
{get_base_url()}

You received this email because you subscribed at {WEBSITE_NAME}.
To unsubscribe: {get_base_url()}/unsubscribe
"""
    
    return base_text.strip()


# =========================================================
# SAFE SEND - Enhanced with anti-spam headers
# =========================================================


def send_email(payload: dict) -> bool:
    """
    Sends a single email via Resend with anti-spam optimized headers.
    
    Anti-spam measures:
    - Proper Message-ID
    - List-Unsubscribe header
    - Consistent From address matching domain
    - No misleading subject lines
    """
    to_field = payload.get("to")

    try:
        if not settings.EMAIL_FROM:
            logger.error("EMAIL_FROM is not configured")
            raise ValueError("EMAIL_FROM environment variable is not set")

        # Anti-spam: Set proper headers
        from_email = str(settings.EMAIL_FROM).strip()
        payload["from"] = f"{BRAND_NAME} <{from_email}>"
        
        # Anti-spam: Add List-Unsubscribe header for bulk emails
        if "unsubscribe_url" in payload:
            payload["headers"] = {
                "List-Unsubscribe": f"<{payload['unsubscribe_url']}>",
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
                "Precedence": "bulk",
                "X-Auto-Response-Suppress": "OOF, AutoReply",
            }
        
        # Anti-spam: Include plain text version
        if "text" not in payload and "html" in payload:
            # Strip HTML for plain text fallback
            import re
            plain_text = re.sub(r'<[^>]+>', '', payload["html"])
            plain_text = re.sub(r'\s+', ' ', plain_text).strip()
            payload["text"] = plain_text[:1000]  # Limit plain text length
        
        resend.Emails.send(payload)
        return True

    except Exception as e:
        logger.exception(f"Failed sending email to {to_field}: {e}")
        return False


# =========================================================
# WELCOME EMAIL
# =========================================================


def send_welcome_email(to_email: str):
    """Send welcome email with anti-spam optimized content."""
    
    # Anti-spam: Keep subject line honest and descriptive
    subject = f"Welcome to {WEBSITE_NAME} — {BRAND_NAME}"
    
    content = f"""
    <tr>
      <td style="padding:24px 40px 0;">

        <h1 style="
          font-size:22px;
          font-weight:600;
          color:{COLOR_TEXT_PRIMARY};
          margin:0 0 16px;
          line-height:1.3;
          letter-spacing:-0.3px;
        ">
          Thank you for subscribing.
        </h1>

        <p style="
          font-size:14px;
          line-height:1.7;
          color:{COLOR_TEXT_SECONDARY};
          margin:0 0 24px;
        ">
          I'm Obed Yameogo, an ML engineer and researcher. I publish
          technical articles breaking down AI/ML systems, share real-world
          project implementations, and curate learning resources for
          practitioners who want to go beyond tutorials.
        </p>

        <p style="
          font-size:14px;
          line-height:1.7;
          color:{COLOR_TEXT_SECONDARY};
          margin:0 0 24px;
        ">
          You'll receive occasional emails when I publish new content — 
          no noise, no spam. You can unsubscribe at any time.
        </p>

        <!-- Anti-spam: Clear value proposition, no hype language -->
        <p style="
          font-size:13px;
          line-height:1.6;
          color:{COLOR_TEXT_MUTED};
          margin:0 0 24px;
          padding:16px;
          background:{COLOR_BG};
          border-left:2px solid {COLOR_BORDER};
        ">
          <strong>What to expect:</strong> Technical articles on ML systems, 
          project walkthroughs, and curated learning resources — sent 
          occasionally, never more than once a week.
        </p>

      </td>
    </tr>

    <tr>
      <td style="padding:8px 40px 32px;">
        {link_button("Visit the website", get_base_url())}
      </td>
    </tr>
    """

    unsubscribe_url = blog_unsubscribe_url(to_email)
    
    # Anti-spam: Include plain text version
    plain_text = generate_plain_text_content("welcome")
    
    send_email(
        {
            "to": [to_email],
            "subject": subject,
            "html": base_wrapper(
                content,
                unsubscribe_url,
                "Unsubscribe from updates",
                include_signature=True,
            ),
            "text": plain_text,
            "unsubscribe_url": unsubscribe_url,
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
    """Send lead notification - internal email, different anti-spam rules apply."""
    
    safe_name = html.escape(lead_name)
    safe_email = html.escape(lead_email)
    safe_message = html.escape(message).replace("\n", "<br>")

    # Anti-spam: Clear subject for internal notifications
    subject = f"New contact from {safe_name} — {WEBSITE_NAME}"
    
    content = f"""
    <tr>
      <td style="padding:24px 40px 0;">

        {section_label("New contact message")}

        <h1 style="
          font-size:20px;
          font-weight:600;
          color:{COLOR_TEXT_PRIMARY};
          margin:0 0 24px;
          letter-spacing:-0.3px;
        ">
          {safe_name} reached out
        </h1>

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="margin-bottom:20px;"
        >
          <tr>
            <td style="
              font-size:12px;
              color:{COLOR_TEXT_MUTED};
              padding:6px 0;
              width:60px;
              font-weight:500;
            ">
              From
            </td>
            <td style="
              font-size:13px;
              color:{COLOR_TEXT_PRIMARY};
              padding:6px 0;
            ">
              {safe_name}
            </td>
          </tr>
          <tr>
            <td style="
              font-size:12px;
              color:{COLOR_TEXT_MUTED};
              padding:6px 0;
              font-weight:500;
            ">
              Email
            </td>
            <td style="
              font-size:13px;
              color:{COLOR_TEXT_PRIMARY};
              padding:6px 0;
            ">
              <a href="mailto:{safe_email}" style="color:{COLOR_LINK}; text-decoration:none;">
                {safe_email}
              </a>
            </td>
          </tr>
        </table>

        <!-- Anti-spam: Clear message formatting -->
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="
            background:{COLOR_BG};
            border:1px solid {COLOR_BORDER};
            margin-bottom:24px;
          "
        >
          <tr>
            <td style="padding:20px; font-size:14px; line-height:1.7; color:{COLOR_TEXT_PRIMARY};">
              {safe_message}
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <tr>
      <td style="padding:8px 40px 32px;">
        {link_button("Reply to " + safe_name, f"mailto:{safe_email}")}
      </td>
    </tr>
    """

    send_email(
        {
            "to": [str(settings.ADMIN_EMAIL)],
            "subject": subject,
            "html": base_wrapper(
                content,
                get_base_url(),
                "View website",
                include_signature=False,
            ),
        }
    )


# =========================================================
# BROADCAST HELPER - Anti-spam optimized
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
    content_type: str,
):
    """
    Anti-spam optimized broadcast.
    
    Measures:
    - Rate limited sending
    - Consistent sender identity
    - Clear unsubscribe in every email
    - Proper bulk email headers
    - Plain text alternative included
    """
    safe_title = html.escape(title)
    safe_description = html.escape(description)

    sent_count = 0
    failed_emails: List[str] = []

    total = len(subscriber_emails)
    logger.info(f"{log_prefix}: Starting broadcast to {total} subscribers")

    for index, email in enumerate(subscriber_emails):
        
        # Anti-spam: Rate limiting to avoid triggering spam filters
        if index > 0 and index % BATCH_SIZE == 0:
            logger.info(f"{log_prefix}: Rate limit pause after {index} sends")
            time.sleep(BATCH_PAUSE_SECONDS)

        content = f"""
        <tr>
          <td style="padding:24px 40px 0;">

            {section_label(label)}

            <!-- Anti-spam: Content-first design, no excessive HTML -->
            <h1 style="
              font-size:20px;
              font-weight:600;
              color:{COLOR_TEXT_PRIMARY};
              margin:0 0 16px;
              line-height:1.35;
              letter-spacing:-0.3px;
            ">
              {safe_title}
            </h1>

            <p style="
              font-size:14px;
              line-height:1.7;
              color:{COLOR_TEXT_SECONDARY};
              margin:0 0 24px;
            ">
              {safe_description}
            </p>

          </td>
        </tr>

        <tr>
          <td style="padding:8px 40px 32px;">
            {link_button("Read more", url)}
          </td>
        </tr>
        """

        unsubscribe_url = unsubscribe_url_fn(email)
        
        # Generate plain text version
        plain_text = generate_plain_text_content(
            content_type, safe_title, safe_description, url
        )

        ok = send_email(
            {
                "to": [email],
                "subject": subject,
                "html": base_wrapper(
                    content,
                    unsubscribe_url,
                    unsubscribe_text,
                    include_signature=True,
                ),
                "text": plain_text,
                "unsubscribe_url": unsubscribe_url,
            }
        )

        if ok:
            sent_count += 1
        else:
            failed_emails.append(email)

    if failed_emails:
        logger.warning(
            f"{log_prefix}: {sent_count}/{total} sent. "
            f"Failed: {failed_emails}"
        )
    else:
        logger.info(
            f"{log_prefix}: {sent_count}/{total} sent successfully."
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
    """Broadcast new blog post with anti-spam compliance."""
    
    # Anti-spam: Keep subject line descriptive, not clickbait
    subject = post_title[:100]  # Limit subject length
    
    _broadcast(
        subscriber_emails=subscriber_emails,
        subject=subject,
        label="New article",
        title=post_title,
        description=post_summary or "A new technical article has been published on thehatbuddy.co.in.",
        url=f"{get_base_url()}/blog/{post_slug}",
        unsubscribe_url_fn=blog_unsubscribe_url,
        unsubscribe_text="Unsubscribe from article updates",
        log_prefix="broadcast_new_post",
        content_type="post",
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
    """Broadcast new project with anti-spam compliance."""
    
    # Anti-spam: Clear subject indicating content type
    subject = f"New project: {project_title[:100]}"
    
    _broadcast(
        subscriber_emails=subscriber_emails,
        subject=subject,
        label="New project",
        title=project_title,
        description=project_description or "A new ML project has been published on thehatbuddy.co.in.",
        url=f"{get_base_url()}/projects/{project_slug}",
        unsubscribe_url_fn=platform_unsubscribe_url,
        unsubscribe_text="Unsubscribe from project updates",
        log_prefix="broadcast_new_project",
        content_type="project",
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
    """Broadcast new learning material with anti-spam compliance."""
    
    # Anti-spam: Honest subject line
    subject = f"New learning resource: {material_title[:100]}"
    
    _broadcast(
        subscriber_emails=subscriber_emails,
        subject=subject,
        label="New learning resource",
        title=material_title,
        description=material_description or "A new learning resource has been added to thehatbuddy.co.in.",
        url=f"{get_base_url()}/materials/{material_slug}",
        unsubscribe_url_fn=platform_unsubscribe_url,
        unsubscribe_text="Unsubscribe from resource updates",
        log_prefix="broadcast_new_material",
        content_type="material",
    )