from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_reminder, name='add_reminder'),
    path('list/', views.reminder_list, name='reminder_list'),  # View the list of reminders
    path('reminders/remove/<int:id>/', views.remove_reminder, name='remove_reminder'),
]
