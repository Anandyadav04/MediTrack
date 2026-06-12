import json
import datetime
from django.conf import settings
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Doctor, Appointment
from .serializers import DoctorSerializer, AppointmentSerializer

class DoctorListView(generics.ListAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]

class DoctorAvailabilityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        doctor_id = request.data.get('doctor_id')
        date_str = request.data.get('appointment_date')
        if not doctor_id or not date_str:
            return Response({'error': 'Missing doctor_id or appointment_date'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            appointment_date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
            doctor = Doctor.objects.get(id=doctor_id)
            available_times = doctor.get_available_times(appointment_date)
            return Response({'available_times': available_times})
        except Doctor.DoesNotExist:
            return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValueError:
            return Response({'error': 'Invalid date format (use YYYY-MM-DD)'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AppointmentListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # If user is a doctor, list their consultations. Otherwise, list patient appointments.
        if hasattr(request.user, 'doctor_profile'):
            doctor = request.user.doctor_profile
            appointments = Appointment.objects.filter(doctor=doctor).order_by('-appointment_date', '-appointment_time')
        else:
            appointments = Appointment.objects.filter(user=request.user).order_by('-appointment_date', '-appointment_time')
        
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            appointment = serializer.save(user=request.user, status='Pending')
            
            # Send notification email to doctor
            doctor = appointment.doctor
            doctor_email = doctor.email
            if doctor_email:
                subject = f"Pending Approval: New Appointment Request by {appointment.user.username}"
                message = f"Dear {doctor.name},\n\nA new appointment request has been submitted and is pending your approval.\n\n" \
                          f"- Patient: {appointment.user.get_full_name() or appointment.user.username}\n" \
                          f"- Date: {appointment.appointment_date}\n" \
                          f"- Time: {appointment.appointment_time}\n" \
                          f"- Specialty: {doctor.specialty}\n" \
                          f"- Location: {doctor.location}\n\n" \
                          f"Please log in to your dashboard to approve or decline this request.\n\n" \
                          f"Regards,\nMediTrack Team"
                try:
                    send_mail(
                        subject,
                        message,
                        settings.DEFAULT_FROM_EMAIL,
                        [doctor_email],
                        fail_silently=True
                    )
                except Exception as mail_err:
                    print("Mail failed to send to doctor:", mail_err)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AppointmentDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        # A user can delete their own appointments
        appointment = get_object_or_404(Appointment, id=pk)
        if appointment.user != request.user and getattr(request.user, 'doctor_profile', None) != appointment.doctor:
            return Response({'error': 'You do not have permission to delete this appointment.'}, status=status.HTTP_403_FORBIDDEN)
        
        appointment.delete()
        return Response({'success': True}, status=status.HTTP_200_OK)

class DoctorDashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, 'doctor_profile'):
            return Response({'error': 'Access Denied: Not a Doctor.'}, status=status.HTTP_403_FORBIDDEN)
        
        doctor = request.user.doctor_profile
        appointments = Appointment.objects.filter(doctor=doctor).order_by('-appointment_date', '-appointment_time')
        
        total_consultations = appointments.count()
        upcoming_appointments = appointments.filter(status='Scheduled', appointment_date__gte=timezone.now().date()).count()
        completed_consultations = appointments.filter(status='Completed').count()
        pending_appointments = appointments.filter(status='Pending').count()
        patient_count = appointments.values('user').distinct().count()

        try:
            available_times_json = json.loads(doctor.available_times)
        except Exception:
            available_times_json = {}

        return Response({
            'stats': {
                'total_consultations': total_consultations,
                'upcoming_appointments': upcoming_appointments,
                'completed_consultations': completed_consultations,
                'pending_appointments': pending_appointments,
                'patient_count': patient_count,
            },
            'availability': {
                'available_days': doctor.available_days,
                'available_times': available_times_json,
                'location': doctor.location,
            }
        })

class DoctorUpdateStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        if not hasattr(request.user, 'doctor_profile'):
            return Response({'error': 'Access Denied: Not a Doctor.'}, status=status.HTTP_403_FORBIDDEN)
        
        doctor = request.user.doctor_profile
        appointment = get_object_or_404(Appointment, id=pk, doctor=doctor)
        new_status = request.data.get('status')
        old_status = appointment.status

        if new_status not in ['Pending', 'Scheduled', 'Completed', 'Cancelled']:
            return Response({'error': 'Invalid status choice.'}, status=status.HTTP_400_BAD_REQUEST)

        appointment.status = new_status
        appointment.save()

        # Send Email to Patient
        patient_email = appointment.user.email
        if patient_email:
            subject, message = None, None
            if new_status == 'Scheduled':
                subject = f"Appointment Confirmed: {doctor.name}"
                message = f"Dear {appointment.user.get_full_name() or appointment.user.username},\n\n" \
                          f"We are pleased to inform you that Dr. {doctor.name} has APPROVED and confirmed your appointment request.\n\n" \
                          f"Details:\n" \
                          f"- Doctor: {doctor.name} ({doctor.specialty})\n" \
                          f"- Date: {appointment.appointment_date}\n" \
                          f"- Time: {appointment.appointment_time}\n" \
                          f"- Location: {doctor.location}\n\n" \
                          f"Regards,\nMediTrack Team"
            elif new_status == 'Cancelled':
                if old_status == 'Pending':
                    subject = f"Appointment Request Declined: Dr. {doctor.name}"
                    message = f"Dear {appointment.user.get_full_name() or appointment.user.username},\n\n" \
                              f"We regret to inform you that Dr. {doctor.name} has declined your appointment request for {appointment.appointment_date} at {appointment.appointment_time}.\n\n" \
                              f"Please visit the portal to request another slot.\n\n" \
                              f"Regards,\nMediTrack Team"
                else:
                    subject = f"Appointment Cancelled: Dr. {doctor.name}"
                    message = f"Dear {appointment.user.get_full_name() or appointment.user.username},\n\n" \
                              f"This is to notify you that your scheduled appointment with Dr. {doctor.name} on {appointment.appointment_date} has been cancelled.\n\n" \
                              f"Regards,\nMediTrack Team"
            
            if subject and message:
                try:
                    send_mail(
                        subject,
                        message,
                        settings.DEFAULT_FROM_EMAIL,
                        [patient_email],
                        fail_silently=True
                    )
                except Exception as mail_err:
                    print("Mail failed to patient:", mail_err)

        return Response({'success': True, 'status': new_status})

class DoctorUpdateAvailabilityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not hasattr(request.user, 'doctor_profile'):
            return Response({'error': 'Access Denied: Not a Doctor.'}, status=status.HTTP_403_FORBIDDEN)
        
        doctor = request.user.doctor_profile
        days = request.data.get('available_days', []) # List of strings
        location = request.data.get('location', '')
        slots = request.data.get('available_slots', []) # List of strings in HH:MM format

        if not slots:
            slots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]

        doctor.available_days = ", ".join(days)
        doctor.location = location
        availability_dict = {day: slots for day in days}
        doctor.available_times = json.dumps(availability_dict)
        doctor.save()

        return Response({'success': True})
