from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import timezone as dt_timezone
from django.shortcuts import get_object_or_404
from .models import Reminder
from .serializers import ReminderSerializer
from .tasks import send_reminder_email
from authentication.models import Profile

class ReminderListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        reminders = Reminder.objects.filter(user=request.user).order_by('remind_at')
        serializer = ReminderSerializer(reminders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ReminderSerializer(data=request.data)
        if serializer.is_valid():
            remind_at = serializer.validated_data['remind_at']
            
            # Ensure the reminder time is in the future
            if remind_at < timezone.now():
                return Response({'remind_at': ['Reminder time must be in the future.']}, status=status.HTTP_400_BAD_REQUEST)
            
            reminder = serializer.save(user=request.user)

            # Schedule multiple reminders if duration > 1
            if reminder.reminder_duration > 1:
                reminder.schedule_multiple_reminders()

            # Retrieve phone number
            try:
                user_profile = Profile.objects.get(user=request.user)
                phone_number = user_profile.phone_number
            except Profile.DoesNotExist:
                phone_number = None

            reminder_time_in_utc = reminder.remind_at.astimezone(dt_timezone.utc)

            # Schedule the first reminder task
            try:
                send_reminder_email.apply_async(
                    (request.user.email, reminder.message, phone_number),
                    eta=reminder_time_in_utc,
                )
            except Exception as cel_err:
                print("Celery scheduling failed in API:", cel_err)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReminderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        reminder = get_object_or_404(Reminder, id=pk, user=request.user)
        reminder.delete()
        return Response({'success': True}, status=status.HTTP_200_OK)
