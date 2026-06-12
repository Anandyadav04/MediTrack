from django.contrib import admin

# Register your models here.
from .models import Doctor

# Register the Doctor model with the admin site
admin.site.register(Doctor)
