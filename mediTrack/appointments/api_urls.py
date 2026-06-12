from django.urls import path
from .api_views import (
    DoctorListView,
    DoctorAvailabilityView,
    AppointmentListCreateView,
    AppointmentDetailView,
    DoctorDashboardStatsView,
    DoctorUpdateStatusView,
    DoctorUpdateAvailabilityView
)

urlpatterns = [
    path('doctors/', DoctorListView.as_view(), name='api_doctors'),
    path('availability/', DoctorAvailabilityView.as_view(), name='api_doctor_availability_check'),
    path('bookings/', AppointmentListCreateView.as_view(), name='api_bookings'),
    path('bookings/<int:pk>/', AppointmentDetailView.as_view(), name='api_booking_detail'),
    path('doctor/dashboard/', DoctorDashboardStatsView.as_view(), name='api_doctor_dashboard'),
    path('bookings/<int:pk>/status/', DoctorUpdateStatusView.as_view(), name='api_booking_status_update'),
    path('doctor/availability/', DoctorUpdateAvailabilityView.as_view(), name='api_doctor_availability_update'),
]
