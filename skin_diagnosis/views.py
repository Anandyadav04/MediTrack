import os
import numpy as np
import tensorflow as tf
from django.shortcuts import render
from .forms import SkinImageUploadForm
from PIL import Image

# ==============================
# Model loading (load once)
# ==============================
MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "ml_models/skin_disease_model.h5"
)
model = tf.keras.models.load_model(MODEL_PATH)

# ==============================
# Constants
# ==============================
CLASS_LABELS = [
    "Cellulitis",
    "Impetigo",
    "Athelete-Foot",
    "Nail-Fungus",
    "Ringworm",
    "Cutaneous-larva-migrans",
    "Chickenpox",
    "Shingles",
]

IMAGE_SIZE = (150, 150)
CONFIDENCE_THRESHOLD = 70.0  # % (tune 65–80)


# ==============================
# Image preprocessing
# ==============================
def process_image(image_file):
    """
    Preprocess image:
    - Force RGB (fix RGBA crash)
    - Resize
    - Normalize
    - Add batch dimension
    """
    img = Image.open(image_file).convert("RGB")
    img = img.resize(IMAGE_SIZE)

    img_array = np.array(img, dtype=np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    return img_array


# ==============================
# Simple non-skin guard (lightweight)
# ==============================
def is_probably_valid_image(img_array):
    """
    Very lightweight sanity check to reject obvious garbage images.
    Not medical-grade, but useful.
    """
    mean_pixel = np.mean(img_array)
    return 0.15 < mean_pixel < 0.85


# ==============================
# Main view
# ==============================
def skin_diagnosis(request):
    form = SkinImageUploadForm()
    result = None
    confidence = None
    warning = None

    if request.method == "POST":
        form = SkinImageUploadForm(request.POST, request.FILES)

        if form.is_valid():
            image = request.FILES["image"]

            try:
                processed_image = process_image(image)

                # Reject obvious non-skin images
                if not is_probably_valid_image(processed_image):
                    warning = "Please upload a clear image of affected skin."
                else:
                    predictions = model.predict(processed_image)
                    max_confidence = float(np.max(predictions)) * 100
                    predicted_index = int(np.argmax(predictions))

                    # Confidence threshold
                    if max_confidence < CONFIDENCE_THRESHOLD:
                        warning = (
                            "Image not confidently recognized as a skin disease. "
                            "Please upload a clearer skin image."
                        )
                    else:
                        result = CLASS_LABELS[predicted_index]
                        confidence = round(max_confidence, 2)

            except Exception as e:
                warning = "Prediction failed. Please try another image."
                print("Skin diagnosis error:", e)

    return render(
        request,
        "skin_diagnosis/upload.html",
        {
            "form": form,
            "result": result,
            "confidence": confidence,
            "warning": warning,
        },
    )
