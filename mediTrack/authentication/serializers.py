import json
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile
from appointments.models import Doctor

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['phone_number']

class UserSerializer(serializers.ModelSerializer):
    phone_number = serializers.SerializerMethodField()
    is_doctor = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'is_doctor']

    def get_phone_number(self, obj):
        try:
            return obj.profile.phone_number
        except Profile.DoesNotExist:
            return None

    def get_is_doctor(self, obj):
        return hasattr(obj, 'doctor_profile')

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    phone_number = serializers.CharField(max_length=15, required=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'phone_number', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        profile, created = Profile.objects.get_or_create(user=user)
        profile.phone_number = validated_data['phone_number']
        profile.save()
        return user

class DoctorRegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=100, required=True)
    email = serializers.EmailField(required=True)
    phone_number = serializers.CharField(max_length=15, required=True)
    specialty = serializers.CharField(max_length=100, required=True)
    location = serializers.CharField(max_length=200, required=False, allow_blank=True)
    available_days = serializers.ListField(
        child=serializers.CharField(), required=True
    )
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'name', 'phone_number', 'specialty', 'location', 'available_days', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        # Create standard profile
        profile, created = Profile.objects.get_or_create(user=user)
        profile.phone_number = validated_data['phone_number']
        profile.save()

        # Define default availability times
        default_slots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]
        selected_days = validated_data['available_days']
        availability_dict = {day: default_slots for day in selected_days}

        # Create Doctor object
        Doctor.objects.create(
            user=user,
            name=validated_data['name'],
            specialty=validated_data['specialty'],
            location=validated_data.get('location', ''),
            email=user.email,
            available_days=", ".join(selected_days),
            available_times=json.dumps(availability_dict)
        )
        return user
