from django.urls import path
from .views import rental_list

urlpatterns = [
    path('list/', rental_list, name='rental_list'),
]
