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
            appointment.status = 'Pending'  # Set to Pending until doctor approval
            appointment.save()

            # Get the assigned doctor's email
            doctor = appointment.doctor
            doctor_email = doctor.email  

            if doctor_email:
                # Email subject & message
                subject = f"Pending Approval: New Appointment Request by {appointment.user.username}"
                message = f"""
                Dear {doctor.name},

                A new appointment request has been submitted and is pending your approval.

                - Patient: {appointment.user.get_full_name() or appointment.user.username}
                - Date: {appointment.appointment_date}
                - Time: {appointment.appointment_time}
                - Specialty: {doctor.specialty}
                - Location: {doctor.location}

                Please log in to your dashboard to approve or decline this request.

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


from django.contrib import messages
from django.utils import timezone

@login_required
def doctor_dashboard(request):
    if not hasattr(request.user, 'doctor_profile'):
        messages.error(request, "Access Denied: You must be registered as a Doctor to access this dashboard.")
        return redirect('home')
        
    doctor = request.user.doctor_profile
    appointments = Appointment.objects.filter(doctor=doctor).order_by('-appointment_date', '-appointment_time')
    
    # Calculate statistics
    total_consultations = appointments.count()
    upcoming_appointments = appointments.filter(status='Scheduled', appointment_date__gte=timezone.now().date()).count()
    completed_consultations = appointments.filter(status='Completed').count()
    pending_appointments = appointments.filter(status='Pending').count()
    
    # Unique patient count
    patient_count = appointments.values('user').distinct().count()
    
    # Parse available times
    try:
        available_times_json = json.loads(doctor.available_times)
    except Exception:
        available_times_json = {}
        
    context = {
        'doctor': doctor,
        'appointments': appointments,
        'total_consultations': total_consultations,
        'upcoming_appointments': upcoming_appointments,
        'completed_consultations': completed_consultations,
        'pending_appointments': pending_appointments,
        'patient_count': patient_count,
        'available_times_json': available_times_json,
        'days_list': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        'slots_list': ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'],
    }
    return render(request, 'appointments/doctor_dashboard.html', context)


@login_required
def update_appointment_status(request, appointment_id, new_status):
    if not hasattr(request.user, 'doctor_profile'):
        return redirect('home')
        
    doctor = request.user.doctor_profile
    appointment = get_object_or_404(Appointment, id=appointment_id, doctor=doctor)
    old_status = appointment.status
    
    if new_status in ['Pending', 'Scheduled', 'Completed', 'Cancelled']:
        appointment.status = new_status
        appointment.save()
        messages.success(request, f"Appointment status updated to '{new_status}' successfully.")
        
        # Send Email to Patient
        patient_email = appointment.user.email
        if patient_email:
            if new_status == 'Scheduled':
                subject = f"Appointment Confirmed: Dr. {doctor.name}"
                message = f"""
                Dear {appointment.user.get_full_name() or appointment.user.username},

                We are pleased to inform you that Dr. {doctor.name} has APPROVED and confirmed your appointment request.

                Details:
                - Doctor: {doctor.name} ({doctor.specialty})
                - Date: {appointment.appointment_date}
                - Time: {appointment.appointment_time}
                - Location: {doctor.location}

                Please log in to your account to view your scheduled bookings.

                Regards,  
                MediTrack Team
                """
            elif new_status == 'Cancelled':
                if old_status == 'Pending':
                    subject = f"Appointment Request Declined: Dr. {doctor.name}"
                    message = f"""
                    Dear {appointment.user.get_full_name() or appointment.user.username},

                    We regret to inform you that Dr. {doctor.name} has declined your appointment request for {appointment.appointment_date} at {appointment.appointment_time}.

                    Please visit the booking portal to request another day or select a different provider.

                    Regards,  
                    MediTrack Team
                    """
                else:
                    subject = f"Appointment Cancelled: Dr. {doctor.name}"
                    message = f"""
                    Dear {appointment.user.get_full_name() or appointment.user.username},

                    This email is to notify you that your scheduled appointment with Dr. {doctor.name} on {appointment.appointment_date} has been cancelled.

                    Regards,  
                    MediTrack Team
                    """
            else:
                subject = None
                message = None

            if subject and message:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [patient_email],
                    fail_silently=True,
                )
    else:
        messages.error(request, "Invalid status choice.")
        
    return redirect('doctor_dashboard')


@login_required
def update_doctor_availability(request):
    if not hasattr(request.user, 'doctor_profile'):
        return redirect('home')
        
    doctor = request.user.doctor_profile
    
    if request.method == 'POST':
        # Working days checklist
        days = request.POST.getlist('available_days')
        location = request.POST.get('location', '')
        
        # Save working days as a string
        doctor.available_days = ", ".join(days)
        doctor.location = location
        
        # Working hours standard slots
        slots = request.POST.getlist('available_slots')
        if not slots:
            slots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]
            
        availability_dict = {day: slots for day in days}
        doctor.available_times = json.dumps(availability_dict)
        
        doctor.save()
        messages.success(request, "Availability profile updated successfully.")
        
    return redirect('doctor_dashboard')
