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
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "models/cnn_model.h5"
model = load_model(MODEL_PATH)

class_names = ["cocci", "healthy", "ncd", "salmo"]
IMAGE_SIZE = (256, 256)

def preprocess_image(image_file) -> np.ndarray:
    try:
        img = Image.open(image_file).convert("RGB")
        img = img.resize(IMAGE_SIZE)
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=415, detail="Only JPG or PNG images are allowed.")

    try:
        image_data = await file.read()
        img_array = preprocess_image(io.BytesIO(image_data))

        predictions = model.predict(img_array)
        predicted_class_index = np.argmax(predictions[0])
        predicted_class = class_names[predicted_class_index]
        confidence = float(predictions[0][predicted_class_index])

        return {"predicted_class": predicted_class, "confidence": confidence}

    except Exception as e:
        return {"error": str(e)}
