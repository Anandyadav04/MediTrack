from django.urls import path
from .api_views import NGOListView, NGODetailView, NGOFeedbackCreateView

urlpatterns = [
    path('', NGOListView.as_view(), name='api_ngos'),
    path('<int:pk>/', NGODetailView.as_view(), name='api_ngo_detail'),
    path('<int:ngo_id>/feedback/', NGOFeedbackCreateView.as_view(), name='api_ngo_feedback'),
]
