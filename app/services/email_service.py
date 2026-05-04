import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
import random
import string

from ..core.config import settings

logger = logging.getLogger(__name__)

class EmailService:
    @staticmethod
    def generate_otp(length: int = 6) -> str:
        """Generate a numeric OTP."""
        return ''.join(random.choices(string.digits, k=length))

    @staticmethod
    def send_verification_email(to_email: str, otp: str):
        """Send verification email with OTP."""
        subject = "Your Scholar Access Verification Code"
        body = f"""
        <html>
          <body>
            <h2>Welcome to Scholar Access!</h2>
            <p>Your email verification code is:</p>
            <h1 style="color: #4f46e5; letter-spacing: 2px;">{otp}</h1>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
          </body>
        </html>
        """

        if not settings.SMTP_HOST or not settings.SMTP_USER:
            # Fallback for local development
            logger.warning(f"SMTP not configured. Generated OTP for {to_email}: {otp}")
            print(f"==================================================")
            print(f"SMTP not configured. OTP for {to_email}: {otp}")
            print(f"==================================================")
            return

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = settings.SMTP_USER
            msg["To"] = to_email

            part = MIMEText(body, "html")
            msg.attach(part)

            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
            if settings.SMTP_TLS:
                server.starttls()
            
            if settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                
            server.send_message(msg)
            server.quit()
            logger.info(f"Verification email sent successfully to {to_email}")
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            # In development, don't crash, just log it.
            if settings.ENV == "dev":
                print(f"==================================================")
                print(f"Failed to send email. OTP for {to_email}: {otp}")
                print(f"==================================================")
