from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout
from django import forms
from django.contrib.auth.models import User
from .models import Profile


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



def login_page(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
    else:
        form = AuthenticationForm()

    return render(request, 'authentication/login.html', {'form': form})

def logout_page(request):
    logout(request)
    return redirect('home')