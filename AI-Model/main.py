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

MODEL_PATH = "models/cnn_model.h5"  # Ensure your model path is correct
model = load_model(MODEL_PATH)

# Define your class names as per your model's output
class_names = ["cocci", "healthy", "ncd", "salmo"]
IMAGE_SIZE = (256, 256)  # Resize all images to 256x256

def preprocess_image(image_file) -> np.ndarray:
    try:
        img = Image.open(image_file).convert("RGB")
        print("📂 Processing image file")
        print(f"🔍 Received image - Size: {img.size}, Mode: {img.mode}")
        img.save("debug_latest_image.jpg")  # Save for debugging if needed

        img = img.resize(IMAGE_SIZE)  # Resize image to 256x256
        img_array = image.img_to_array(img) / 255.0  # Normalize pixel values to [0, 1]
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension: (1, 256, 256, 3)
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

        print(f"Input image shape before padding: {img_array.shape}")

        # Pad image to match batch size of 32 if needed
        batch_size = model.input_shape[0] or 32  # If model expects a batch size, use it (otherwise use 32)
        padded_input = np.repeat(img_array, batch_size, axis=0)  # Shape: (32, 256, 256, 3)

        print(f"Padded input shape: {padded_input.shape}")

        predictions = model.predict(padded_input)  # Make prediction
        predicted_class_index = np.argmax(predictions[0])  # Get the predicted class index
        predicted_class = class_names[predicted_class_index]  # Get the class name
        confidence = float(predictions[0][predicted_class_index])  # Get the confidence score

        return {"predicted_class": predicted_class, "confidence": confidence}

    except Exception as e:
        return {"error": str(e)}
