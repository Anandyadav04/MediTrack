from django import forms

class SkinImageUploadForm(forms.Form):
    image = forms.ImageField(label="Upload a skin image")
