from django.urls import path
from .views import bmi_bmr_calculator, bmi_bmr_result

urlpatterns = [
    path('bmi-bmr/', bmi_bmr_calculator, name='bmi_bmr_calculator'),
    path('bmi-bmr/result/<int:record_id>/', bmi_bmr_result, name='bmi_bmr_result'),
]
