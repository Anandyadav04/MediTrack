from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .forms import ReminderForm
from .models import Reminder
from django.core.mail import send_mail
from django.conf import settings
from .tasks import send_reminder_email
from django.utils import timezone
from datetime import timezone as dt_timezone  # Import timezone from datetime correctly

@login_required
def add_reminder(request):
    if request.method == "POST":
        form = ReminderForm(request.POST)
        if form.is_valid():
            reminder = form.save(commit=False)
            reminder.user = request.user
            reminder.save()

            # Validate that the reminder time is in the future
            if reminder.remind_at < timezone.now():
                form.add_error('remind_at', 'Reminder time must be in the future.')
                return render(request, "reminders/add_reminder.html", {"form": form})

            # Schedule the email to be sent at the reminder time
            reminder_time_in_utc = reminder.remind_at.astimezone(dt_timezone.utc)  # Convert to UTC
            send_reminder_email.apply_async(
                (request.user.email, reminder.message),
                eta=reminder_time_in_utc,   # Ensure reminder time is in UTC
            )

            return redirect("reminder_list")  # Redirect to reminder list page
    else:
        form = ReminderForm()

    return render(request, "reminders/add_reminder.html", {"form": form})

@login_required
def reminder_list(request):
    # Code to list reminders
    reminders = Reminder.objects.filter(user=request.user)
    return render(request, 'reminders/reminder_list.html', {'reminders': reminders})
