from django.urls import path
from .api_views import SkinDiagnosisAPIView

urlpatterns = [
    path('predict/', SkinDiagnosisAPIView.as_view(), name='api_skin_predict'),
]
