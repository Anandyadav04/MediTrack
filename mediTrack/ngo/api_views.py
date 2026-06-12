from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import NGO, Feedback
from .serializers import NGOSerializer, FeedbackSerializer

class NGOListView(generics.ListAPIView):
    queryset = NGO.objects.all().order_by('id')
    serializer_class = NGOSerializer
    permission_classes = [permissions.IsAuthenticated]

class NGODetailView(generics.RetrieveAPIView):
    queryset = NGO.objects.all()
    serializer_class = NGOSerializer
    permission_classes = [permissions.IsAuthenticated]

class NGOFeedbackCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, ngo_id):
        ngo = get_object_or_404(NGO, id=ngo_id)
        rating = request.data.get('rating')
        comment = request.data.get('comment', '')

        if not rating:
            return Response({'rating': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            rating_val = int(rating)
            if rating_val < 1 or rating_val > 5:
                return Response({'rating': ['Rating must be between 1 and 5.']}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'rating': ['Invalid rating format.']}, status=status.HTTP_400_BAD_REQUEST)

        feedback = Feedback.objects.create(
            ngo=ngo,
            user=request.user,
            rating=rating_val,
            comment=comment
        )

        serializer = FeedbackSerializer(feedback)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
