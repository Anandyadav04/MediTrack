from django.urls import path
from .views import skin_diagnosis

urlpatterns = [
    path("upload/", skin_diagnosis, name="skin_diagnosis_upload"),
]
