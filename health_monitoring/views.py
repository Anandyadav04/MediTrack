
# Create your views here.
from django.shortcuts import render, redirect,  get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import HealthRecord
from .forms import HealthRecordForm

@login_required  # Ensures only logged-in users can access this view
def bmi_bmr_calculator(request):
    if request.method == "POST":
        form = HealthRecordForm(request.POST)
        if form.is_valid():
            health_record = form.save(commit=False)
            health_record.user = request.user  # Assign current user
            health_record.save()
            return redirect('bmi_bmr_result', record_id=health_record.id)  
    else:
        form = HealthRecordForm()

    return render(request, 'health_monitoring/bmi_bmr_form.html', {'form': form})

@login_required
def bmi_bmr_result(request, record_id):
    health_record = get_object_or_404(HealthRecord, id=record_id, user=request.user)
    return render(request, 'health_monitoring/bmi_bmr_result.html', {'health_record': health_record})
