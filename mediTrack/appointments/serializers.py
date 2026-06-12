import json
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Doctor, Appointment
from authentication.serializers import UserSerializer

class DoctorSerializer(serializers.ModelSerializer):
    available_times_parsed = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = ['id', 'name', 'specialty', 'available_days', 'available_times', 'available_times_parsed', 'location', 'email']

    def get_available_times_parsed(self, obj):
        try:
            return json.loads(obj.available_times)
        except Exception:
            return {}

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_detail = DoctorSerializer(source='doctor', read_only=True)
    patient_detail = UserSerializer(source='user', read_only=True)
    is_upcoming = serializers.ReadOnlyField()

    class Meta:
        model = Appointment
        fields = ['id', 'user', 'patient_detail', 'doctor', 'doctor_detail', 'appointment_date', 'appointment_time', 'status', 'is_upcoming']
        read_only_fields = ['id', 'user', 'status']
