from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import damage

from fastapi.staticfiles import StaticFiles
import os

# Create database tables
if engine:
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Warning: Database connection failed. Details: {e}")

app = FastAPI(
    title="Road Damage Detection API (AWS)",
    description="Backend API for Cloud-Based Road Damage Detection and Smart Reporting System",
    version="1.0.0"
)

# Mount uploads directory to serve images locally (fallback for AWS S3)
uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Enable CORS for frontend access (Usman's React app)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact React domain
    allow_credentials=False, # Must be False when allow_origins is ['*']
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import JSONResponse
from fastapi.requests import Request
import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Global Error: {exc}")
    traceback.print_exc()
    return JSONResponse(status_code=500, content={"detail": f"GLOBAL: {str(exc)}"})

# Include Routers
app.include_router(damage.router)

@app.get("/")
def root():
    return {"status": "Active", "database": "AWS RDS connected"}