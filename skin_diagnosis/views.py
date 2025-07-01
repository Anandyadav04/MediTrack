
# # Create your views here.
import os
import numpy as np
import tensorflow as tf
from django.shortcuts import render
from .forms import SkinImageUploadForm
from PIL import Image

# Load the ML model (only once)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "ml_models/skin_disease_model.h5")
model = tf.keras.models.load_model(MODEL_PATH)

# Define class labels (modify as per your dataset)
CLASS_LABELS = ["Cellulitis", "Impetigo", "Athelete-Foot", "Nail-Fungus", "Ringworm", "Cutaneous-larva-migrans", "Chickenpox", "Shingles"]
IMAGE_SIZE = (150, 150)  # Match the input size of your model

def process_image(image_path, target_size=(150, 150)):
    img = Image.open(image_path)
    img = img.resize(target_size)
    img_array = np.array(img) / 255.0  # Normalize the image
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array

def skin_diagnosis(request):
    result = None
    form = SkinImageUploadForm()

    if request.method == "POST":
        form = SkinImageUploadForm(request.POST, request.FILES)
        if form.is_valid():
            image = request.FILES["image"]
            processed_image = process_image(image)  # Preprocess image
            
            # Get prediction
            predictions = model.predict(processed_image)
            predicted_class = np.argmax(predictions)  # Get highest probability class
            result = CLASS_LABELS[predicted_class]  # Map to class label
    
    return render(request, "skin_diagnosis/upload.html", {"form": form, "result": result})