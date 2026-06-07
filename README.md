# 🛣️ StreetScan AI Mission Control
**Advanced Road Damage Detection & Analytics Dashboard**

StreetScan AI is a cutting-edge hybrid computer vision and AI system designed to automatically analyze road media (images and videos) and detect structural defects such as alligator cracks, transverse cracks, and potholes in real-time. 

![StreetScan AI Preview](https://img.shields.io/badge/Project_Status-Active_Development-brightgreen?style=for-the-badge) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi) ![YOLO](https://img.shields.io/badge/YOLO-black?style=for-the-badge&logo=yolo)

---

## ⚡ Features
- 🎥 **Frame-by-Frame Video Analysis:** Upload driving footage and receive a detailed, scrubbable breakdown of every detected damage instance per frame.
- 🧠 **Hybrid AI Pipeline:** Uses a pre-trained **YOLOv8** model as an object-exclusion mask (ignoring cars/pedestrians) and advanced **OpenCV** geometric morphology to classify specific crack types.
- 📊 **Dynamic Radar Profiling:** Live-updating analytics that mathematically graph the structural integrity profile of the road surface.
- 🗄️ **Historical Management:** Dedicated history dashboard that safely tracks and preserves the severity of all past detections.

---

## 📂 Project Structure

This repository is uniquely structured to allow seamless collaboration across our 3-person team:

- `/frontend` — **(React / Vite + TailwindCSS)** Contains the Mission Control UI, interactive video player, and real-time radar charts.  
- `/backend` — **(Python / FastAPI)** Hosts the API endpoints and the OpenCV image-processing fallback layer.  
- `/ai-model` — **(YOLOv8)** Reserved directory for our final trained road-damage AI weights (`best.pt`).

---

## 🚀 Getting Started

Follow these steps to run the StreetScan AI system locally:

### 1. Start the Backend API
The backend requires Python 3.8+.
```sh
cd backend
python -m venv venv
venv\Scripts\activate    # On Windows
pip install -r requirements.txt
uvicorn main:app --reload
```
*The API will start running at `http://127.0.0.1:8000`*

### 2. Start the Frontend Dashboard
Open a new terminal window to launch the React interface.
```sh
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser to view the dashboard!*

---

## 🤝 Collaboration Workflow (For the Team)

- **AI Engineer:** Once your YOLOv8 model finishes training on the road dataset, drop your `best.pt` file into the `ai-model/` folder.
- **Backend Engineer:** Modify `backend/detection.py` to point `MODEL_PATH = "best.pt"` to instantly switch the backend from the OpenCV fallback script over to the new native AI model. 
- **Frontend Engineer:** Design, test, and merge new modules.

---
*Created for our Road Damage Detection initiative.*


to run the code Backend :
cd backend/Backend/road_damage_aws
venv\Scripts\activate
uvicorn main:app --reload


pip install -r requirements.txt
