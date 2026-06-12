from django.shortcuts import render, redirect, get_object_or_404
from .models import NGO, Feedback
from .forms import FeedbackForm

def ngo_list(request):
    search_query = request.GET.get('search', '')
    location_filter = request.GET.get('location', '')
    
    ngos = NGO.objects.all()
    
    if search_query:
        ngos = ngos.filter(name__icontains=search_query) | ngos.filter(services__icontains=search_query)
    
    if location_filter:
        ngos = ngos.filter(location__icontains=location_filter)
    
    return render(request, 'ngo/ngo_list.html', {'ngos': ngos, 'search_query': search_query, 'location_filter': location_filter})


from django.contrib.auth.decorators import login_required

@login_required
def ngo_detail(request, ngo_id):
    ngo = get_object_or_404(NGO, id=ngo_id)
    feedback_form = FeedbackForm()

    if request.method == 'POST':
        feedback_form = FeedbackForm(request.POST)
        if feedback_form.is_valid():
            feedback = feedback_form.save(commit=False)
            feedback.ngo = ngo
            feedback.user = request.user  # Assign logged-in user
            feedback.save()
            return redirect('ngo_detail', ngo_id=ngo.id)

    feedbacks = Feedback.objects.filter(ngo=ngo)
    return render(request, 'ngo/ngo_detail.html', {'ngo': ngo, 'feedback_form': feedback_form, 'feedbacks': feedbacks})

