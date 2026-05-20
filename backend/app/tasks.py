import resend # type: ignore
import logging
from .core.config import settings
from typing import List

# Initialize Resend with the API Key from your .env via settings
resend.api_key = settings.RESEND_API_KEY

def send_welcome_email(to_email: str):
    """Sends a system-styled welcome email to new subscribers."""
    try:
        params = {
            "from": "Obed Yameogo <onboarding@resend.dev>",
            "to": [to_email],
            "subject": "System Connection: AI Research Newsletter",
            "html": f"""
                <div style="font-family: monospace; border: 1px solid #000; padding: 30px; color: #050505; max-width: 600px;">
                    <h1 style="text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #000; padding-bottom: 10px;">Connection_Established</h1>
                    <p style="margin-top: 20px;">Hello,</p>
                    <p>Your identity has been added to the Research_Registry. You will now receive technical deep dives and system architecture notes.</p>
                    <div style="background: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #000;">
                        <strong>Status:</strong> Active<br>
                        <strong>Access_Level:</strong> Subscriber<br>
                        <strong>Node_ID:</strong> {to_email}
                    </div>
                    <p style="font-size: 10px; color: #888; text-transform: uppercase; margin-top: 40px;">
                        End_of_Transmission // 2026 AI Systems Portfolio
                    </p>
                </div>
            """,
        }
        resend.Emails.send(params)
        logging.info(f"Welcome email dispatched to {to_email}")
    except Exception as e:
        logging.error(f"Failed to dispatch welcome email to {to_email}: {str(e)}")

def send_lead_notification(lead_email: str, lead_name: str, message: str):
    """Notifies you (the Admin) when someone reaches out via the contact form."""
    try:
        params = {
            "from": "Portfolio System <onboarding@resend.dev>",
            "to": [settings.ADMIN_EMAIL],
            "subject": f"INBOUND_MESSAGE: {lead_name}",
            "html": f"""
                <div style="font-family: monospace; border: 1px solid #000; padding: 20px;">
                    <h2 style="text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 10px;">New_Communication_Received</h2>
                    <p><strong>Sender:</strong> {lead_name} ({lead_email})</p>
                    <p><strong>Content:</strong></p>
                    <div style="background: #f5f5f5; padding: 20px; border-left: 4px solid #000; font-size: 14px; line-height: 1.6;">
                        {message}
                    </div>
                </div>
            """,
        }
        resend.Emails.send(params)
        logging.info(f"Lead notification sent to admin: {settings.ADMIN_EMAIL}")
    except Exception as e:
        logging.error(f"Failed to send lead notification: {str(e)}")

def broadcast_new_post(subscriber_emails: List[str], post_title: str, post_summary: str, post_slug: str):
    """
    Broadcasts a new research article to all active nodes in the subscriber registry.
    """
    if not subscriber_emails:
        logging.info("Broadcast_Aborted: No active subscribers found.")
        return

    try:
        # Use localhost for dev, change to production domain in settings later
        base_url = "http://localhost:3000" if settings.DEBUG else "https://obedyameogo.com"
        post_url = f"{base_url}/blog/{post_slug}"
        
        params = {
            "from": "Obed Yameogo <onboarding@resend.dev>",
            "to": subscriber_emails, 
            "subject": f"Research_Log: {post_title}",
            "html": f"""
                <div style="font-family: monospace; border: 1px solid #000; padding: 30px; color: #050505;">
                    <h2 style="text-transform: uppercase; letter-spacing: 1px;">Research_Update_Published</h2>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">{post_title}</p>
                    <p style="color: #555; line-height: 1.7; margin-bottom: 30px;">{post_summary}</p>
                    <div>
                        <a href="{post_url}" style="background: #000; color: #fff; padding: 15px 30px; text-decoration: none; text-transform: uppercase; font-size: 11px; font-weight: bold; letter-spacing: 2px;">
                            Access_Full_Log →
                        </a>
                    </div>
                    <p style="margin-top: 50px; font-size: 9px; color: #aaa; text-transform: uppercase; letter-spacing: 1px;">
                        Broadcast_Signature: {post_slug} // Node: Global_Distribution
                    </p>
                </div>
            """,
        }
        resend.Emails.send(params)
        logging.info(f"System Broadcast successful for: {post_title}. Targets: {len(subscriber_emails)}")
    except Exception as e:
        logging.error(f"Broadcast_Failure: {str(e)}")