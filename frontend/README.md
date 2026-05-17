# Chest X-ray AI Screening System

AI-powered chest X-ray analysis web application for multi-label thoracic disease screening using Deep Learning and Explainable AI.

---

# Features

- Multi-label chest X-ray disease prediction
- EfficientNet-B0 + CBAM deep learning model
- FastAPI backend
- React + Tailwind CSS frontend
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
to visualize image regions influencing AI predictions.

## Heatmap Interpretation

- 🔴 Red / Yellow → High AI attention
- 🟢 Green → Moderate influence
- 🔵 Blue → Lower influence

Highlighted regions do not directly confirm disease.
They represent image regions considered important by the AI model.

---

# Project Workflow

1. Upload chest X-ray image
2. AI model performs inference
3. Multi-label predictions generated
4. Grad-CAM heatmap generated
5. Results displayed with medical explanations

---

# Medical Disclaimer

This application is intended for educational, research,
and AI demonstration purposes only.

It should NOT be used for clinical diagnosis or medical decision-making.
Always consult qualified healthcare professionals.

---

# Screenshots

(Add screenshots after deployment)

---

# Run Locally

## Backend

```bash
cd backend/app
uvicorn main:app --reload
```

Backend runs on:
```text
http://127.0.0.1:8000
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
```text
http://localhost:5173
```

---

# Project Structure

```text
lung-xray-ai-app/
│
├── backend/
│   └── app/
│       ├── main.py
│       ├── inference.py
│       ├── model.py
│       ├── preprocessing.py
│       ├── gradcam.py
│       └── labels.py
│
├── frontend/
│   ├── src/
│   └── public/
│
├── models/
│   └── best_model_finetuned.pth
│
└── README.md
```

---

# Model Information

EfficientNet-B0 + CBAM trained on chest X-ray datasets
for multi-label thoracic disease screening.

The system predicts:
- Atelectasis
- Cardiomegaly
- Consolidation
- Edema
- Pleural Effusion

---

# Future Improvements

- Cloud deployment
- PDF medical reports
- Authentication system
- DICOM support
- Advanced explainability
- Mobile responsiveness
- Doctor dashboard

---

# Author

## Akhil A K
BCA Artificial Intelligence Student

GitHub:
https://github.com/Akhil-AK-009