from django.shortcuts import render

# Create your views here.
from .models import Rental

def rental_list(request):
    rentals = Rental.objects.all()
    print("Rentals:", rentals)  # Debugging line
    return render(request, 'rental/rental_list.html', {'rentals': rentals})