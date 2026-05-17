import torch
from PIL import Image

from app.model import create_model
from app.preprocessing import transform
from app.labels import TARGET_LABELS


# ---------------- DEVICE ---------------- #

device = torch.device("cpu")


# ---------------- LOAD MODEL ---------------- #

MODEL_PATH = "../models/best_model_finetuned.pth"

model = create_model(num_classes=5)

model.load_state_dict(
    torch.load(MODEL_PATH, map_location=device)
)

model.to(device)
model.eval()


# ---------------- PREDICTION FUNCTION ---------------- #

def predict_image(image: Image.Image):

    image = image.convert("RGB")

    image_tensor = transform(image)

    image_tensor = image_tensor.unsqueeze(0).to(device)

    with torch.no_grad():

        outputs = model(image_tensor)

        probabilities = torch.sigmoid(outputs)[0]

    results = {}

    for idx, label in enumerate(TARGET_LABELS):

        results[label] = round(
            float(probabilities[idx]) * 100,
            2
        )

    return results