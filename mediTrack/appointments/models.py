from django.db import models

# Create your models here.
import json
from django.contrib.auth.models import User
from datetime import datetime  

class Doctor(models.Model):
    name = models.CharField(max_length=100)
    specialty = models.CharField(max_length=100)
    available_days = models.CharField(max_length=100)  # e.g. "Monday, Wednesday, Friday"
    available_times = models.TextField()  # Storing as a JSON field (list of times for each day)
    location = models.CharField(max_length=200, blank=True, null=True) 

    def __str__(self):
        return f"{self.name} - {self.specialty}" 

    def get_available_times(self, appointment_date):
        # Convert the available times from JSON string to Python list
        available_times = json.loads(self.available_times)
        
        # Convert string to date object
        appointment_date = datetime.strptime(appointment_date, "%Y-%m-%d").date()
        day_of_week = appointment_date.strftime('%A')
        
        # If the doctor is available that day, return the available times
        if day_of_week in available_times:
            return available_times[day_of_week]
        return []

class Appointment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    status = models.CharField(max_length=20, choices=[('Scheduled', 'Scheduled'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled')], default='Scheduled')

    def __str__(self):
        return f"{self.user.username} - {self.doctor.name} on {self.appointment_date} at {self.appointment_time}"

