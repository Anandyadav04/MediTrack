from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from twilio.rest import Client
import logging

# Set up a logger
logger = logging.getLogger(__name__)

@shared_task
def send_reminder_email(user_email, message, phone_number=None):
    try:
        # Send email
        send_mail(
            'Reminder',
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user_email],
            fail_silently=False,
        )
        logger.info(f"Email successfully sent to {user_email}")
        
        # Send SMS if phone number is provided
        if phone_number:
    
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            
            # Send SMS
            message = client.messages.create(
                body=message,  # The text of the SMS
                from_=settings.TWILIO_PHONE_NUMBER, 
                to=phone_number  # The recipient's phone number
            )
            logger.info(f"SMS successfully sent to {phone_number}")
        
        return "Email and SMS sent successfully"
    
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return f"Error: {str(e)}"


