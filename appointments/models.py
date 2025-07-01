from django.db import models

# Create your models here.
from django.core.exceptions import ValidationError
from django.utils import timezone
import json
from django.contrib.auth.models import User
from datetime import datetime  

class Doctor(models.Model):
    name = models.CharField(max_length=100)
    specialty = models.CharField(max_length=100)
    available_days = models.CharField(max_length=100)  # e.g. "Monday, Wednesday, Friday"
    available_times = models.TextField()  # Storing as a JSON field (list of times for each day)
    location = models.CharField(max_length=200, blank=True, null=True) 
    email = models.EmailField(unique=False, null=True, blank=True)  # Add this field for email notifications

    def __str__(self):
        return f"{self.name} - {self.specialty}" 

    def get_available_times(self, appointment_date):
        """Returns available times in HH:MM format"""
        try:
            # Ensure we have a date object
            if isinstance(appointment_date, str):
                from datetime import datetime
                appointment_date = datetime.strptime(appointment_date, "%Y-%m-%d").date()
            
            day_of_week = appointment_date.strftime('%A')
            all_times = json.loads(self.available_times).get(day_of_week, [])
            
            # Get booked appointments
            booked_times = Appointment.objects.filter(
                doctor=self,
                appointment_date=appointment_date,
                status='Scheduled'
            ).values_list('appointment_time', flat=True)
            
            # Convert to comparable string format
            booked_times_str = [t.strftime('%H:%M') for t in booked_times]
            
            # Return available times not in booked times
            return [t for t in all_times if t not in booked_times_str]
        
        except Exception as e:
            print(f"Error in get_available_times: {str(e)}")
            return []  # Return empty list on error

class Appointment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    status = models.CharField(max_length=20, choices=[('Scheduled', 'Scheduled'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled')], default='Scheduled')
    @property
    def is_upcoming(self):
        from django.utils import timezone
        appointment_datetime = datetime.combine(self.appointment_date, self.appointment_time)
        return appointment_datetime > timezone.now()

    def __str__(self):
        return f"{self.user.username} - {self.doctor.name} on {self.appointment_date} at {self.appointment_time}"

