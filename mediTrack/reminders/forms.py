from django import forms
from .models import Reminder

class ReminderForm(forms.ModelForm):
    class Meta:
        model = Reminder
        fields = ['message', 'remind_at']
        widgets = {
            'remind_at': forms.DateTimeInput(attrs={'class': 'datetimepicker', 'type': 'datetime-local'}),
        }

