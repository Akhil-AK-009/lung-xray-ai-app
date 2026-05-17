from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from PIL import Image

from inference import predict_image
from gradcam import generate_gradcam


app = FastAPI()


# ---------------- CORS ---------------- #

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- STATIC FILES ---------------- #

app.mount(
    "/gradcam",
    StaticFiles(directory="gradcam_outputs"),
    name="gradcam"
)


# ---------------- HOME ROUTE ---------------- #

@app.get("/")
def home():

    return {
        "message": "Chest X-ray AI API is running"
    }


# ---------------- PREDICTION ROUTE ---------------- #

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    image = Image.open(file.file)

    # Predictions
    results = predict_image(image)

    # Get highest prediction
    top_class = max(
        results,
        key=results.get
    )

    class_index = list(results.keys()).index(top_class)

    # Generate Grad-CAM
    gradcam_path = generate_gradcam(
        image,
        class_idx=class_index
    )

    return {

        "predictions": results,

        "gradcam": f"http://127.0.0.1:8000/gradcam/{gradcam_path.split('/')[-1]}"

    }