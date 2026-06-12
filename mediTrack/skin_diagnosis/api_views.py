import numpy as np
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .views import (
    model,
    CLASS_LABELS,
    process_image,
    is_probably_valid_image,
    CONFIDENCE_THRESHOLD
)

class SkinDiagnosisAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if 'image' not in request.FILES:
            return Response({'error': 'No image provided.'}, status=status.HTTP_400_BAD_REQUEST)
        
        image = request.FILES['image']
        try:
            processed_image = process_image(image)

            # Reject obvious non-skin images
            if not is_probably_valid_image(processed_image):
                return Response({
                    'warning': 'Please upload a clear image of affected skin.'
                }, status=status.HTTP_200_OK)

            predictions = model.predict(processed_image)
            max_confidence = float(np.max(predictions)) * 100
            predicted_index = int(np.argmax(predictions))

            if max_confidence < CONFIDENCE_THRESHOLD:
                return Response({
                    'warning': 'Image not confidently recognized as a skin disease. Please upload a clearer skin image.'
                }, status=status.HTTP_200_OK)

            result = CLASS_LABELS[predicted_index]
            confidence = round(max_confidence, 2)

            return Response({
                'result': result,
                'confidence': confidence
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print("Skin diagnosis API error:", e)
            return Response({
                'error': 'Prediction failed. Please try another image.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
