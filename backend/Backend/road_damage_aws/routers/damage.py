
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from services.s3_service import upload_image_to_s3
from services.ai_service import analyze_image_with_ai, analyze_frame_with_ai
import uuid
import os
import imageio

router = APIRouter(
    prefix="/api/reports",
    tags=["Road Damage Reports"]
)

# Constants for validation
ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"]
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("/", response_model=schemas.RoadDamageOut, status_code=status.HTTP_201_CREATED)
async def create_damage_report(
    latitude: float = Form(...),
    longitude: float = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Uploads an image, sends it to AI for detection, saves to AWS S3 Storage, and stores in PostgreSQL.
    """
    try:
        # 1. Validate file type and size
        if file.content_type not in ALLOWED_FILE_TYPES:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG and PNG are allowed.")
        
        file.file.seek(0, 2)
        file_size = file.file.tell()
        await file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")

        # 2. Forward image to AI model service
        ai_result = await analyze_image_with_ai(file)
        
        # 3. Upload original image to AWS S3 Storage
        s3_url = await upload_image_to_s3(file)
        
        # 4. Store metadata in database
        db_report = models.RoadDamage(
            image_url=s3_url,
            damage_type=ai_result["damage_type"],
            severity=ai_result["severity"],
            latitude=latitude,
            longitude=longitude,
            confidence=ai_result["confidence"]
        )
        
        db.add(db_report)
        db.commit() # Ensure transactional consistency
        db.refresh(db_report)
        
        report_dict = {
            "id": db_report.id,
            "damage_type": db_report.damage_type,
            "severity": db_report.severity,
            "latitude": db_report.latitude,
            "longitude": db_report.longitude,
            "confidence": db_report.confidence,
            "image_url": db_report.image_url,
            "created_at": db_report.created_at,
            "analysis": ai_result.get("analysis", {})
        }
        
        return report_dict
        
    except Exception as e:
        import traceback
        try:
            log_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            log_path = os.path.join(log_dir, "backend_err.txt")
            with open(log_path, "w") as f:
                traceback.print_exc(file=f)
        except Exception:
            pass
        db.rollback()
        return JSONResponse(status_code=500, content={"detail": f"LOCAL: {str(e)}"})

@router.get("/", response_model=list[schemas.RoadDamageOut])
def get_all_reports(
    severity: str | None = None,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """API to fetch all damage reports with optional severity filter."""
    query = db.query(models.RoadDamage)
    
    if severity:
        query = query.filter(models.RoadDamage.severity == severity.capitalize())
        
    reports = query.order_by(models.RoadDamage.created_at.desc()).offset(skip).limit(limit).all()
    return reports

@router.get("/{report_id}", response_model=schemas.RoadDamageOut)
def get_report_by_id(report_id: int, db: Session = Depends(get_db)):
    """API to fetch a single report by ID."""
    report = db.query(models.RoadDamage).filter(models.RoadDamage.id == report_id).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    return report

@router.post("/video")
async def process_video(file: UploadFile = File(...)):
    """Real video processing endpoint using imageio and YOLOv8."""
    import tempfile
    
    temp_dir = tempfile.gettempdir()
    temp_file_name = f"{uuid.uuid4()}_{file.filename}"
    temp_file_path = os.path.join(temp_dir, temp_file_name)
    reader = None
    
    try:
        # 1. Save uploaded video to a temporary file
        with open(temp_file_path, "wb") as buffer:
            buffer.write(await file.read())
            
        # 2. Open video with imageio
        reader = imageio.get_reader(temp_file_path)
        meta = reader.get_meta_data()
        fps = meta.get("fps", 30.0)
        total_frames = reader.get_length()
        if fps <= 0:
            fps = 30.0 # fallback
            
        # 3. Extract and analyze frames (e.g., 5 frames per second to show smooth bounding boxes)
        timeline = []
        frame_interval = max(1, int(fps / 5)) # analyze 5 frames per second
        frames_scanned = 0
        damage_frames = 0
        highest_conf = 0.0
        worst_severity = "Low"
        
        # Loop through frames using step interval for maximum speed (supports inf length videos)
        current_frame = 0
        while True:
            if isinstance(total_frames, (int, float)) and total_frames != float('inf'):
                if current_frame >= total_frames:
                    break
            
            try:
                frame = reader.get_data(current_frame)
            except (IndexError, RuntimeError):
                break
                
            frames_scanned += 1
            timestamp = current_frame / fps
            
            # Analyze this frame using YOLO best.pt
            ai_result = analyze_frame_with_ai(frame)
            detected_issues = ai_result.get("analysis", {}).get("detected_issues", [])
            
            if detected_issues:
                damage_frames += 1
                timeline.append({
                    "frame_index": current_frame,
                    "timestamp": round(timestamp, 2),
                    "detected_issues": detected_issues
                })
                
                # Track worst severity and peak confidence across all frames
                for issue in detected_issues:
                    if issue["confidence"] > highest_conf:
                        highest_conf = issue["confidence"]
                    if issue["severity"] == "High":
                        worst_severity = "High"
                    elif issue["severity"] == "Medium" and worst_severity != "High":
                        worst_severity = "Medium"
                        
            # Cap at max 30 seconds of processing for demo to avoid timeouts
            if timestamp > 30:
                break
                
            current_frame += frame_interval
            
        reader.close()
        reader = None
        
        return {
            "success": True,
            "data": {
                "frames_scanned": frames_scanned,
                "damage_frames": damage_frames,
                "worst_severity": worst_severity if damage_frames > 0 else "None",
                "peak_confidence": round(highest_conf * 100) if damage_frames > 0 else 0,
                "timeline": timeline
            }
        }
        
    except Exception as e:
        print(f"Video processing error: {e}")
        return JSONResponse(status_code=500, content={"detail": f"Video processing failed: {str(e)}"})
        
    finally:
        # Close reader if not already closed (prevents WinError 32 lock on temp file deletion)
        if reader is not None:
            try:
                reader.close()
            except Exception:
                pass
        # Cleanup temporary file
        if os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as e:
                print(f"Error removing temp file: {e}")