from django.urls import path
from . import views
# from .views import update_available_times

# app_name = 'appointments'  # This creates the namespace

urlpatterns = [
    path('book/', views.book_appointment, name='book_appointment'),
    path('update-times/', views.update_available_times, name='update_times'),
    path('confirmation/<int:appointment_id>/', views.confirmation, name='confirmation'),  # Pass appointment_id as a URL parameter
    path('my-appointments/', views.my_appointments, name='my_appointments'),  # New URL for viewing appointments
    path('delete/<int:appointment_id>/', views.delete_appointment, name='delete_appointment'),  # Delete appointment


]
