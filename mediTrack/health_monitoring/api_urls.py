from django.urls import path
from .api_views import HealthRecordListCreateView

urlpatterns = [
    path('', HealthRecordListCreateView.as_view(), name='health_records'),
]
