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
from django.core.mail import send_mail
from django.conf import settings
from .models import Appointment, Doctor



@login_required
def book_appointment(request):
    if request.method == 'POST':
        form = AppointmentForm(request.POST)
        if form.is_valid():
            appointment = form.save(commit=False)
            appointment.user = request.user  # Associate logged-in user
            appointment.save()

            # Get the assigned doctor's email
            doctor = appointment.doctor
            doctor_email = doctor.email  

            if doctor_email:
                # Email subject & message
                subject = f"New Appointment Booked by {appointment.user.username}"
                message = f"""
                Dear {doctor.name},

                A new appointment has been booked.

                - Patient: {appointment.user.get_full_name() or appointment.user.username}
                - Date: {appointment.appointment_date}
                - Time: {appointment.appointment_time}
                - Specialty: {doctor.specialty}
                - Location: {doctor.location}

                Please check your schedule.

                Regards,  
                MediTrack Team
                """

                # Send email to the doctor
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [doctor_email],
                    fail_silently=False,
                )

            return redirect('confirmation', appointment_id=appointment.id)
    else:
        form = AppointmentForm()
    
    return render(request, 'appointments/book_appointment.html', {'form': form})



@csrf_exempt
@require_POST
def update_available_times(request):
    try:
        from datetime import datetime  # Import here if not at top
        data = json.loads(request.body)
        doctor_id = data.get('doctor_id')
        appointment_date_str = data.get('appointment_date')

        if not doctor_id or not appointment_date_str:
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        # Convert string to date object
        try:
            appointment_date = datetime.strptime(appointment_date_str, "%Y-%m-%d").date()
        except ValueError as e:
            return JsonResponse({'error': f'Invalid date format: {str(e)}'}, status=400)

        doctor = Doctor.objects.get(id=doctor_id)
        available_times = doctor.get_available_times(appointment_date)
        
        return JsonResponse({
            'available_times': available_times,
            'status': 'success'
        })

    except Doctor.DoesNotExist:
        return JsonResponse({'error': 'Doctor not found'}, status=404)
    except Exception as e:
        import traceback
        traceback.print_exc()  # Print full traceback to console
        return JsonResponse({'error': str(e)}, status=500)


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
