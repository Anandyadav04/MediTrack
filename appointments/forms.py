from django import forms
from .models import Appointment, Doctor

class AppointmentForm(forms.ModelForm):
    class Meta:
        model = Appointment
        fields = ['doctor', 'appointment_date', 'appointment_time']

    doctor = forms.ModelChoiceField(
        queryset=Doctor.objects.none(),  # Load dynamically
        empty_label="Select a Doctor"
    )

    appointment_date = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date'})  # Calendar picker
    )

    appointment_time = forms.ChoiceField(choices=[], required=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Load doctors dynamically when the form is initialized
        self.fields['doctor'].queryset = Doctor.objects.all()

        # If form is submitted with doctor and date, update available times
        if 'doctor' in self.data and 'appointment_date' in self.data:
            doctor_id = self.data.get('doctor')
            appointment_date = self.data.get('appointment_date')
            self.update_available_times(doctor_id, appointment_date)

    def update_available_times(self, doctor_id, appointment_date):
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            available_times = doctor.get_available_times(appointment_date)
            self.fields['appointment_time'].choices = [(time, time) for time in available_times]
        except Doctor.DoesNotExist:
            self.fields['appointment_time'].choices = []
