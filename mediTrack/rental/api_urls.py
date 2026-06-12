from django.urls import path
from .api_views import RentalListView

urlpatterns = [
    path('', RentalListView.as_view(), name='api_rentals'),
]
