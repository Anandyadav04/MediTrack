from django.db import models
from django.contrib.auth.models import User

class HealthRecord(models.Model):
    class GenderChoices(models.TextChoices):
        MALE = 'male', 'Male'
        FEMALE = 'female', 'Female'
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Connect to user model
    weight = models.FloatField(help_text="Weight in kg")  # Prevents confusion
    height = models.FloatField(help_text="Height in cm")  
    age = models.PositiveIntegerField(help_text="Age in years")  # Ensures no negative age
    gender = models.CharField(max_length=6, choices=GenderChoices.choices)
    bmi = models.FloatField(default=0.0)  # Avoid null values
    bmr = models.FloatField(default=0.0)  
    recorded_at = models.DateTimeField(auto_now_add=True)

    def calculate_bmi(self):
        """Calculate and return BMI (Body Mass Index)."""
        height_m = self.height / 100  # Convert cm to meters
        return round(self.weight / (height_m ** 2), 2)

    def calculate_bmr(self):
        """Calculate and return BMR (Basal Metabolic Rate)."""
        if self.gender == self.GenderChoices.MALE:
            return round((10 * self.weight) + (6.25 * self.height) - (5 * self.age) + 5, 2)
        return round((10 * self.weight) + (6.25 * self.height) - (5 * self.age) - 161, 2)

    def save(self, *args, **kwargs):
        """Override save method to auto-calculate BMI and BMR."""
        if not self.bmi or not self.bmr:  # Prevents unnecessary recalculations
            self.bmi = self.calculate_bmi()
            self.bmr = self.calculate_bmr()
        super().save(*args, **kwargs)

    def __str__(self):
        """String representation of the model instance."""
        return f"{self.user.username} | BMI: {self.bmi} | BMR: {self.bmr}"

