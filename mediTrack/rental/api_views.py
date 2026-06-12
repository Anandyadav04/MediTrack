from rest_framework import generics, permissions
from .models import Rental
from .serializers import RentalSerializer

class RentalListView(generics.ListAPIView):
    queryset = Rental.objects.all().order_by('id')
    serializer_class = RentalSerializer
    permission_classes = [permissions.IsAuthenticated]
