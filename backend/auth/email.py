# services/email.py or inside your existing services module
import os
import resend
import logging

logger = logging.getLogger(__name__)

# Initialize your API Key (ensure RESEND_API_KEY is in your environment/.env)
resend.api_key = os.getenv("RESEND_API_KEY")
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "onboarding@resend.dev")


def send_login_notification_email(recipient_email: str, username: str, login_time: str):
    """Worker function executed as a background task."""
    try:
        html_content = f"""
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
            <h2>New Login Detected</h2>
            <p>Hi <strong>{username}</strong>,</p>
            <p>We noticed a successful login to your account on <strong>{login_time}</strong>.</p>
            <p>If this was you, you can safely ignore this email. If not, please secure your account immediately.</p>
        </div>
        """
        
        params: resend.Emails.SendParams = {
            "from": SENDER_EMAIL,
            "to": [recipient_email],
            "subject": "Security Alert: New Login to Your Account",
            "html": html_content,
        }
        resend.Emails.send(params)
    except Exception as e:
        logger.error(f"Failed to send login notification to {recipient_email}: {str(e)}")