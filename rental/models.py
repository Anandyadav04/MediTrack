from django.db import models

# Create your models here.
from django.db import models

class Rental(models.Model):
    name = models.CharField(max_length=255)  # Rental Name
    image = models.ImageField(upload_to='rental/')  # Image Upload
    cost = models.DecimalField(max_digits=10, decimal_places=2)  # Cost
    phone_number = models.CharField(max_length=15)  # Phone Number

    def __str__(self):
        
        return self.name