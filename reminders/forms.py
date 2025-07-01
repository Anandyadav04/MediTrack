from django import forms
from .models import Reminder

class ReminderForm(forms.ModelForm):
    reminder_duration = forms.IntegerField(
        min_value=1, 
        max_value=30, 
        required=False,
        initial=1,  # Default to 1 day
        widget=forms.NumberInput(attrs={'class': 'form-control'}), 
        help_text="Set how many days you'd like the reminder to repeat (default is 1 day)."
    )

    class Meta:
        model = Reminder
        fields = ['message', 'remind_at', 'reminder_duration']
        widgets = {
            'remind_at': forms.DateTimeInput(attrs={'class': 'datetimepicker', 'type': 'datetime-local'}),
        }

