from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import NGO

@admin.register(NGO)
class NGOAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'contact_number', 'website']
    search_fields = ['name', 'location', 'services']
    list_filter = ['location']
