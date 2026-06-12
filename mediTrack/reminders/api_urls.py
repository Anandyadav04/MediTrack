from django.urls import path
from .api_views import ReminderListCreateView, ReminderDetailView

urlpatterns = [
    path('', ReminderListCreateView.as_view(), name='api_reminders'),
    path('<int:pk>/', ReminderDetailView.as_view(), name='api_reminder_detail'),
]
