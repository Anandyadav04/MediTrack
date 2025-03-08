from django.shortcuts import render, redirect, get_object_or_404

# Create your views here.
from .forms import AppointmentForm
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import Doctor, Appointment
import json
import datetime


@login_required
def book_appointment(request):
    if request.method == 'POST':
        form = AppointmentForm(request.POST)
        if form.is_valid():
            appointment = form.save(commit=False)
            appointment.user = request.user  # Automatically associate the logged-in user
            appointment.save()
            return redirect('confirmation', appointment_id=appointment.id)
    else:
        form = AppointmentForm()
    
    return render(request, 'appointments/book_appointment.html', {'form': form})


@csrf_exempt
@require_POST
def update_available_times(request):
    try:
        data = json.loads(request.body)
        doctor_id = data.get('doctor_id')
        appointment_date_str = data.get('appointment_date')

        if not doctor_id or not appointment_date_str:
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        # Convert string to date object
        appointment_date = datetime.datetime.strptime(appointment_date_str, "%Y-%m-%d").date()
        doctor = Doctor.objects.get(id=doctor_id)
        available_times = doctor.get_available_times(appointment_date)

        print(f"API Response: {available_times}")  # Debugging in server logs
        return JsonResponse({'available_times': available_times})

    except Doctor.DoesNotExist:
        return JsonResponse({'error': 'Doctor not found.'}, status=404)
    except ValueError:
        return JsonResponse({'error': 'Invalid date format.'}, status=400)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)


def confirmation(request, appointment_id):
    # Fetch the appointment object using the appointment_id passed in the URL
    appointment = Appointment.objects.get(id=appointment_id)
    return render(request, 'appointments/confirmation.html', {'appointment': appointment})


def my_appointments(request):
    if request.user.is_authenticated:  # Ensure the user is logged in
        appointments = Appointment.objects.filter(user=request.user)  # Get appointments for the logged-in user
    else:
        appointments = None  # If user is not logged in, don't show appointments

    return render(request, 'appointments/my_appointments.html', {'appointments': appointments})


def delete_appointment(request, appointment_id):
    # Ensure the user is authenticated and owns the appointment
    appointment = get_object_or_404(Appointment, id=appointment_id, user=request.user)
    
    if request.method == 'POST':
        # If the request is POST, delete the appointment
        appointment.delete()
        return redirect('my_appointments')  # Redirect to the list of appointments
    
    return render(request, 'appointments/delete_appointment.html', {'appointment': appointment})
