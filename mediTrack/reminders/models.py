from django.db import models

# Create your models here.
from django.contrib.auth.models import User

class Reminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link to logged-in user
    message = models.TextField()
    remind_at = models.DateTimeField()

    def __str__(self):
        return f"{self.user.email} - {self.message}"

