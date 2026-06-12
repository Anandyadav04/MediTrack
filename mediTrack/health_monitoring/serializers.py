from rest_framework import serializers
from .models import HealthRecord

class HealthRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthRecord
        fields = ['id', 'weight', 'height', 'age', 'gender', 'bmi', 'bmr', 'recorded_at']
        read_only_fields = ['id', 'bmi', 'bmr', 'recorded_at']
