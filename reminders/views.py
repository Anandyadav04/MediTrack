from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from datetime import timezone as dt_timezone
from .forms import ReminderForm
from .models import Reminder
from .tasks import send_reminder_email
from authentication.models import Profile 

@login_required
def add_reminder(request):
    if request.method == "POST":
        form = ReminderForm(request.POST)
        if form.is_valid():
            reminder = form.save(commit=False)
            reminder.user = request.user

            # Ensure the reminder time is in the future
            if reminder.remind_at < timezone.now():
                form.add_error('remind_at', 'Reminder time must be in the future.')
                return render(request, "reminders/add_reminder.html", {"form": form})

            reminder.save()

            if reminder.reminder_duration > 1:
                reminder.schedule_multiple_reminders()

            # Get user's phone number from the Profile model
            try:
                user_profile = Profile.objects.get(user=request.user)
                phone_number = user_profile.phone_number
            except Profile.DoesNotExist:
                phone_number = None 

            reminder_time_in_utc = reminder.remind_at.astimezone(dt_timezone.utc)

            # Schedule the Celery task for the first reminder
            send_reminder_email.apply_async(
                (request.user.email, reminder.message, phone_number),
                eta=reminder_time_in_utc,  # First reminder time in UTC
            )

            return redirect("reminder_list")
    else:
        form = ReminderForm()

    return render(request, "reminders/add_reminder.html", {"form": form})


@login_required
def reminder_list(request):
    # Code to list reminders
    reminders = Reminder.objects.filter(user=request.user)
    return render(request, 'reminders/reminder_list.html', {'reminders': reminders})


def remove_reminder(request, id):
    print(id)  # Check the value of `id`
    reminder = get_object_or_404(Reminder, id=id)
    reminder.delete()
    return redirect('reminder_list')