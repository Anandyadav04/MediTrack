from rest_framework import serializers
from django.contrib.auth.models import User
from .models import NGO, Feedback
from authentication.serializers import UserSerializer

class FeedbackSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Feedback
        fields = ['id', 'username', 'rating', 'comment', 'date']
        read_only_fields = ['id', 'username', 'date']

class NGOSerializer(serializers.ModelSerializer):
    feedbacks = FeedbackSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = NGO
        fields = ['id', 'name', 'services', 'location', 'contact_number', 'website', 'email', 'working_hours', 'social_media', 'description', 'feedbacks', 'average_rating']

    def get_average_rating(self, obj):
        feedbacks = obj.feedbacks.all()
        if not feedbacks:
            return 0
        total = sum(fb.rating for fb in feedbacks)
        return round(total / len(feedbacks), 1)
