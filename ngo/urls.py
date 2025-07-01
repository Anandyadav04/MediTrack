from django.urls import path
from .views import ngo_list, ngo_detail

urlpatterns = [
    path('ngos/', ngo_list, name='ngo_list'),
    path('ngo/<int:ngo_id>/', ngo_detail, name='ngo_detail'),
]
