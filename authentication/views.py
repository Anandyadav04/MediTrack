from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout
from django import forms
from django.contrib.auth.models import User
from .models import Profile
import json
from appointments.models import Doctor


#  Custom Form that Includes Email Field

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.validators import RegexValidator

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    phone_number = forms.CharField(
        max_length=15,
        required=True,
        label="Phone Number",
        validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Enter a valid phone number.")]
    )

    class Meta:
        model = User
        fields = ['username', 'email','phone_number', 'password1', 'password2'] 

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()

            # Check if a Profile already exists for the user
            profile, created = Profile.objects.get_or_create(user=user)

            # If the Profile exists, update the phone number
            profile.phone_number = self.cleaned_data['phone_number']
            profile.save()

        return user


# Doctor Creation Form
class DoctorCreationForm(UserCreationForm):
    name = forms.CharField(max_length=100, required=True, label="Full Name")
    email = forms.EmailField(required=True)
    phone_number = forms.CharField(
        max_length=15,
        required=True,
        label="Phone Number",
        validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Enter a valid phone number.")]
    )
    specialty = forms.CharField(max_length=100, required=True, label="Specialty")
    location = forms.CharField(max_length=200, required=False, label="Location")
    
    AVAILABLE_DAYS_CHOICES = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ]
    available_days = forms.MultipleChoiceField(
        choices=AVAILABLE_DAYS_CHOICES,
        widget=forms.CheckboxSelectMultiple,
        required=True,
        label="Available Days"
    )

    class Meta:
        model = User
        fields = ['username', 'email']

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
            # Also create standard profile
            profile, created = Profile.objects.get_or_create(user=user)
            profile.phone_number = self.cleaned_data['phone_number']
            profile.save()

            # Define default availability times: Monday to Sunday get a standard list of slots
            default_slots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]
            selected_days = self.cleaned_data['available_days']
            availability_dict = {day: default_slots for day in selected_days}
            
            # Create Doctor object
            Doctor.objects.create(
                user=user,
                name=self.cleaned_data['name'],
                specialty=self.cleaned_data['specialty'],
                location=self.cleaned_data['location'],
                email=user.email,
                available_days=", ".join(selected_days),
                available_times=json.dumps(availability_dict)
            )
        return user


# Updated Signup View
def signup_page(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = CustomUserCreationForm()

    return render(request, 'authentication/signup.html', {'form': form})


# Doctor Signup View
def doctor_signup_page(request):
    if request.method == 'POST':
        form = DoctorCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('doctor_dashboard')
    else:
        form = DoctorCreationForm()

    return render(request, 'authentication/doctor_signup.html', {'form': form})


def login_page(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            if hasattr(user, 'doctor_profile'):
                return redirect('doctor_dashboard')
            return redirect('home')
    else:
        form = AuthenticationForm()

    return render(request, 'authentication/login.html', {'form': form})

def logout_page(request):
    logout(request)
    return redirect('home')