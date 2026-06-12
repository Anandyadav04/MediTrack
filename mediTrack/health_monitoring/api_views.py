from rest_framework import generics, permissions
from .models import HealthRecord
from .serializers import HealthRecordSerializer

class HealthRecordListCreateView(generics.ListCreateAPIView):
    serializer_class = HealthRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return records belonging to the current user
        return HealthRecord.objects.filter(user=self.request.user).order_by('-recorded_at')

    def perform_create(self, serializer):
        # Assign user automatically
        serializer.save(user=self.request.user)
