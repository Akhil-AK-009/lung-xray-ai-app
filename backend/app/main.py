from fastapi import FastAPI, File, UploadFile
from PIL import Image

from inference import predict_image


app = FastAPI()


@app.get("/")
def home():

    return {
        "message": "Chest X-ray AI API is running"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    image = Image.open(file.file)

    results = predict_image(image)

    return {
        "predictions": results
    }