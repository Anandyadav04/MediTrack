from django.db import models
from django.contrib.auth.models import User


# Create your models here.
from django.db import models

class NGO(models.Model):
    name = models.CharField(max_length=255)
    services = models.TextField()  # Description of services provided (free check-ups, medical camps, etc.)
    location = models.CharField(max_length=255)  # City, region, or specific area
    contact_number = models.CharField(max_length=15)
    website = models.URLField(blank=True, null=True)  # Optional website
    email = models.EmailField(blank=True, null=True)  # Contact email
    working_hours = models.CharField(max_length=255, blank=True, null=True)  # Opening hours
    social_media = models.URLField(blank=True, null=True)  # Link to social media (optional)
    description = models.TextField(blank=True, null=True)  # Short description about the NGO

    def __str__(self):
        return self.name
    
class Feedback(models.Model):
    ngo = models.ForeignKey(NGO, on_delete=models.CASCADE, related_name="feedbacks")
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link to Django User
    rating = models.IntegerField(default=0)  # Rating from 1 to 5
    comment = models.TextField(blank=True, null=True)  # User comment/feedback
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback from {self.user.username} for {self.ngo.name}"

