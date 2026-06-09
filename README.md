# 🛣️ StreetScan AI — Road Damage Detection System
**Advanced Road Damage Detection & Analytics Dashboard**

StreetScan AI is a cutting-edge hybrid computer vision and AI system designed to automatically analyze road media (images and videos) and detect structural defects such as alligator cracks, transverse cracks, and potholes in real-time. 

![StreetScan AI Preview](https://img.shields.io/badge/Project_Status-Active_Development-brightgreen?style=for-the-badge) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi) ![YOLO](https://img.shields.io/badge/YOLO-black?style=for-the-badge&logo=yolo) ![AWS](https://img.shields.io/badge/AWS_S3-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

---

## ⚡ Features
- 🎥 **Frame-by-Frame Video Analysis:** Upload driving footage and receive a detailed breakdown of every detected damage instance per frame.
- 🧠 **YOLOv8 AI Detection:** Pre-trained model detects potholes, alligator cracks, transverse cracks, and longitudinal cracks with bounding boxes.
- ☁️ **AWS S3 Storage:** All images (original + YOLO-annotated) are stored securely in AWS S3.
- 📄 **Professional PDF Reports:** Download detailed PDF reports with branded header, severity gauge, side-by-side images, recommended actions, and detection breakdown.
- 📊 **Dynamic Radar Profiling:** Live-updating analytics that graph the structural integrity of road surfaces.
- 🗄️ **Report Registry:** Historical dashboard with severity filters, image previews, and one-click downloads.

---

## 📂 Project Structure

```
├── frontend/               # React + Vite frontend
├── backend/
│   └── Backend/
│       └── road_damage_aws/ # FastAPI backend
│           ├── main.py
│           ├── models.py
│           ├── schemas.py
│           ├── database.py
│           ├── routers/
│           │   └── damage.py
│           └── services/
│               ├── ai_service.py
│               ├── s3_service.py
│               └── pdf_service.py
└── ai-model/
    └── best.pt             # YOLOv8 trained weights
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** and **npm**
- **Git**

---

### 1. Clone the Repository

```bash
git clone https://github.com/SuilYun/updatedProject.git
cd updatedProject
```

---

### 2. Start the Backend API

#### 🍎 macOS / 🐧 Linux

```bash
cd backend/Backend/road_damage_aws
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

#### 🪟 Windows (PowerShell)

```powershell
cd backend\Backend\road_damage_aws
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

#### 🪟 Windows (Command Prompt)

```cmd
cd backend\Backend\road_damage_aws
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
uvicorn main:app --reload
```

> **Note:** If `uvicorn` is not found, try `python -m uvicorn main:app --reload`

✅ The API will start at **http://127.0.0.1:8000**

---

### 3. Start the Frontend Dashboard

Open a **new terminal** window:

```bash
cd frontend
npm install
npm run dev
```

✅ Open **http://localhost:5173** in your browser.

> Works the same on Windows, macOS, and Linux — npm is cross-platform.

---

### 4. AWS S3 Configuration (Optional)

Create a `.env` file inside `backend/Backend/road_damage_aws/`:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_S3_BUCKET_NAME=your_bucket_name
```

> If no `.env` is provided, images are stored locally in the `uploads/` folder.

---

## 📄 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Server health check |
| `POST` | `/api/reports/` | Upload image for AI analysis |
| `GET` | `/api/reports/` | List all reports |
| `GET` | `/api/reports/{id}` | Get specific report |
| `GET` | `/api/reports/{id}/download-image` | Download original image |
| `GET` | `/api/reports/{id}/download-pdf` | Download professional PDF report |
| `POST` | `/api/reports/analyze-video` | Analyze video frame-by-frame |

---

## 🔧 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` |
| `uvicorn not found` | Use `python -m uvicorn main:app --reload` |
| Port already in use | Kill the process: `lsof -ti:8000 \| xargs kill -9` (Mac) or use Task Manager (Windows) |
| YOLO model not found | Ensure `ai-model/best.pt` exists |
| S3 upload fails | Check `.env` credentials and bucket region |

### Windows-Specific Tips
- Use **PowerShell** (recommended) or **Command Prompt** — avoid Git Bash for venv activation.
- If you get `execution policy` errors in PowerShell, run: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`
- Use `python` instead of `python3` on Windows.

---

## 🤝 Team

- **AI Engineer:** Drop trained `best.pt` into `ai-model/` folder.
- **Backend Engineer:** Modify services in `backend/Backend/road_damage_aws/services/`.
- **Frontend Engineer:** Components in `frontend/src/components/`.

---

*Built with ❤️ for road safety — StreetScan AI*
