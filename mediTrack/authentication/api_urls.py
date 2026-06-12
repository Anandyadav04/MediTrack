from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .api_views import UserProfileView, UserRegisterView, DoctorRegisterView

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', UserRegisterView.as_view(), name='api_register'),
    path('register/doctor/', DoctorRegisterView.as_view(), name='api_register_doctor'),
    path('profile/', UserProfileView.as_view(), name='api_profile'),
]
