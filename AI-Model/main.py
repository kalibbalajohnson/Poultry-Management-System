from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import io
from PIL import Image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "models/bigDatasetWithDinaNCD_10E.h5"  # Ensure your model path is correct
model = load_model(MODEL_PATH)

# Define your class names as per the notebook's label encoding
# 0 -> Coccidiosis, 1 -> Healthy, 2 -> New Castle Disease, 3 -> Salmonella
class_names = ["cocci", "healthy", "ncd", "salmo"]
IMAGE_SIZE = (180, 180)  # Updated to match training size from notebook

def preprocess_image(image_file) -> np.ndarray:
    try:
        img = Image.open(image_file).convert("RGB")
        print("📂 Processing image file")
        print(f"🔍 Received image - Size: {img.size}, Mode: {img.mode}")
        img.save("debug_latest_image.jpg")  # Save for debugging if needed

        img = img.resize(IMAGE_SIZE)  # Resize image to 180x180 to match training
        img_array = image.img_to_array(img) / 255.0  # Normalize pixel values to [0, 1]
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension: (1, 180, 180, 3)
        return img_array
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=415, detail="Only JPG or PNG images are allowed.")

    try:
        print(f"📂 Received file: {file.filename}")
        print(f"Model expects input shape: {model.input_shape}")

        image_data = await file.read()  # Read image data
        img_array = preprocess_image(io.BytesIO(image_data))  # Preprocess image

        print(f"Input image shape: {img_array.shape}")

        # Make prediction directly without padding
        predictions = model.predict(img_array)  # Shape: (1, 4)
        predicted_class_index = np.argmax(predictions[0])  # Get the predicted class index
        predicted_class = class_names[predicted_class_index]  # Get the class name
        confidence = float(predictions[0][predicted_class_index])  # Get the confidence score

        return {"predicted_class": predicted_class, "confidence": confidence}

    except Exception as e:
        return {"error": str(e)}