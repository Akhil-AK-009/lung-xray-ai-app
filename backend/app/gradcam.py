import torch
import torch.nn.functional as F
import numpy as np
import cv2
import os
import time

from PIL import Image

from model import create_model
from preprocessing import transform


device = torch.device("cpu")

MODEL_PATH = "../../models/best_model_finetuned.pth"

model = create_model(num_classes=5)

model.load_state_dict(
    torch.load(MODEL_PATH, map_location=device)
)

model.eval()


class GradCAM:

    def __init__(self, model, target_layer):

        self.model = model
        self.target_layer = target_layer
        self.activations = None

        self.target_layer.register_forward_hook(
            self.forward_hook
        )

    def forward_hook(self, module, input, output):

        self.activations = output

    def generate(self, input_tensor, class_idx):

        self.model.zero_grad()

        output = self.model(input_tensor)

        score = output[:, class_idx]

        grads = torch.autograd.grad(
            outputs=score,
            inputs=self.activations,
            grad_outputs=torch.ones_like(score),
            retain_graph=True
        )[0]

        weights = grads.mean(dim=(2, 3), keepdim=True)

        cam = (weights * self.activations).sum(dim=1)

        cam = F.relu(cam)

        cam -= cam.min()

        cam /= (cam.max() + 1e-8)

        return cam.detach().numpy()[0]


target_layer = model.backbone.features[-1]

gradcam = GradCAM(model, target_layer)


def generate_gradcam(image: Image.Image, class_idx=0):

    image = image.convert("RGB")

    original = np.array(image)

    original = cv2.resize(original, (224, 224))

    input_tensor = transform(image).unsqueeze(0)

    cam = gradcam.generate(input_tensor, class_idx)

    cam = cv2.resize(cam, (224, 224))

    heatmap = cv2.applyColorMap(
        np.uint8(255 * cam),
        cv2.COLORMAP_JET
    )

    overlay = cv2.addWeighted(
        original,
        0.6,
        heatmap,
        0.4,
        0
    )

    os.makedirs("gradcam_outputs", exist_ok=True)

    save_path = f"gradcam_outputs/gradcam_{int(time.time())}.jpg"

    cv2.imwrite(
        save_path,
        cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR)
    )

    return save_path