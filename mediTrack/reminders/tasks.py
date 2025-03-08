from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
import logging

# Set up a logger
logger = logging.getLogger(__name__)

@shared_task
def send_reminder_email(user_email, message):
    logger.info(f"Sending email to {user_email} with message: {message}")
    
    try:
        send_mail(
            "MediTrack Reminder",
            message,
            settings.EMAIL_HOST_USER,
            [user_email],
            fail_silently=False,
        )
        logger.info(f"Email successfully sent to {user_email}")
        return "Email sent successfully"
    except Exception as e:
        logger.error(f"Email sending failed to {user_email}. Error: {str(e)}")
        return f"Email failed: {str(e)}"
