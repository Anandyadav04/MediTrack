from datetime import timedelta
from django.db import models
from django.contrib.auth.models import User
from .tasks import send_reminder_email
from datetime import timezone

from datetime import timedelta

class Reminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    remind_at = models.DateTimeField()
    reminder_duration = models.PositiveIntegerField(default=1)  # In days
    
    def __str__(self):
        return f"{self.user.email} - {self.message}"

    def schedule_multiple_reminders(self):
        """Schedule reminders for multiple days based on reminder_duration."""
        for i in range(self.reminder_duration):
            reminder_time = self.remind_at + timedelta(days=i)
            # Convert the reminder time to UTC
            reminder_time_in_utc = reminder_time.astimezone(timezone.utc)
            
            # Schedule the Celery task for each reminder
            send_reminder_email.apply_async(
                (self.user.email, self.message, self.user.profile.phone_number),
                eta=reminder_time_in_utc
            )


