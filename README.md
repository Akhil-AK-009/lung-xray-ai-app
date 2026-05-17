# Chest X-ray AI Screening System

AI-powered chest X-ray analysis web application for multi-label thoracic disease screening using Deep Learning and Explainable AI.

---

# Features

- Multi-label chest X-ray disease prediction
- EfficientNet-B0 + CBAM deep learning model
- FastAPI backend
- React + Tailwind frontend
- Explainable AI using Grad-CAM
- Professional medical-style workflow UI
- Real-time image upload and prediction
- Dynamic AI attention heatmaps

---

# Detectable Conditions

- Atelectasis
- Cardiomegaly
- Consolidation
- Edema
- Pleural Effusion

---

# Tech Stack

## Backend
- FastAPI
- PyTorch
- torchvision
- OpenCV
- Pillow

## Frontend
- React
- Vite
- Tailwind CSS
- Axios

---

# Explainable AI

This system uses Grad-CAM (Gradient-weighted Class Activation Mapping)
to visualize image regions influencing the AI prediction.

Color interpretation:
- Red/Yellow → high AI attention
- Green → moderate influence
- Blue → lower influence

---

# Project Workflow

1. Upload chest X-ray image
2. AI model performs inference
3. Multi-label predictions generated
4. Grad-CAM heatmap generated
5. Results displayed with medical explanations

---

# Disclaimer

This application is intended for educational, research,
and AI demonstration purposes only.

It should NOT be used for clinical diagnosis or medical decision-making.
Always consult qualified healthcare professionals.

---

# Run Locally

## Backend

```bash
cd backend/app
uvicorn main:app --reload
