from django import forms
from .models import HealthRecord

class HealthRecordForm(forms.ModelForm):
    class Meta:
        model = HealthRecord
        fields = ['weight', 'height', 'age', 'gender']
        
        widgets = {
            'weight': forms.NumberInput(attrs={
                'class': 'form-control', 
                'placeholder': 'Enter weight in kg', 
                'min': '1'
            }),
            'height': forms.NumberInput(attrs={
                'class': 'form-control', 
                'placeholder': 'Enter height in cm', 
                'min': '1'
            }),
            'age': forms.NumberInput(attrs={
                'class': 'form-control', 
                'placeholder': 'Enter age',
                'min': '1'
            }),
            'gender': forms.Select(attrs={
                'class': 'form-control'
            }),
        }
