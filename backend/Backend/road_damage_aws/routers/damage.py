
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from services.s3_service import upload_image_to_s3, upload_bytes_to_s3
from services.ai_service import analyze_image_with_ai, analyze_frame_with_ai
import uuid
import os
import json
import imageio
from starlette.concurrency import run_in_threadpool

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
        
        # 4. Upload YOLO-annotated image (with detection boxes) to S3
        annotated_url = None
        annotated_bytes = ai_result.get("annotated_image")
        if annotated_bytes:
            try:
                annotated_url = await upload_bytes_to_s3(annotated_bytes, extension="jpg")
            except Exception as ann_err:
                print(f"Failed to upload annotated image: {ann_err}")
        
        # 5. Store metadata in database (including detection bboxes)
        detection_issues = ai_result.get("analysis", {}).get("detected_issues", [])
        db_report = models.RoadDamage(
            image_url=s3_url,
            damage_type=ai_result["damage_type"],
            severity=ai_result["severity"],
            latitude=latitude,
            longitude=longitude,
            confidence=ai_result["confidence"],
            detection_data=json.dumps(detection_issues) if detection_issues else None,
            annotated_image_url=annotated_url
        )
        
        db.add(db_report)
        db.commit()
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

@router.get("/{report_id}/download-image")
def download_report_image(report_id: int, db: Session = Depends(get_db)):
    """Download the original image from S3 or local storage."""
    import requests as http_requests
    from fastapi.responses import StreamingResponse
    import io

    report = db.query(models.RoadDamage).filter(models.RoadDamage.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    image_url = report.image_url

    # If it's an S3 URL, fetch from S3
    if image_url.startswith("http"):
        try:
            resp = http_requests.get(image_url, timeout=15)
            resp.raise_for_status()
            content_type = resp.headers.get("Content-Type", "image/jpeg")
            ext = "jpg" if "jpeg" in content_type or "jpg" in content_type else "png"
            filename = f"road_damage_report_{report_id}.{ext}"
            return StreamingResponse(
                io.BytesIO(resp.content),
                media_type=content_type,
                headers={"Content-Disposition": f'attachment; filename="{filename}"'}
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch image from S3: {str(e)}")
    else:
        # Local file
        local_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", image_url.lstrip("/"))
        local_path = os.path.normpath(local_path)
        if not os.path.exists(local_path):
            raise HTTPException(status_code=404, detail="Image file not found on server")
        ext = local_path.rsplit(".", 1)[-1] if "." in local_path else "jpg"
        from fastapi.responses import FileResponse
        return FileResponse(
            local_path,
            media_type=f"image/{ext}",
            filename=f"road_damage_report_{report_id}.{ext}",
            headers={"Content-Disposition": f'attachment; filename="road_damage_report_{report_id}.{ext}"'}
        )


@router.get("/{report_id}/download-pdf")
def download_report_pdf(report_id: int, db: Session = Depends(get_db)):
    """Generate and download a professional PDF report with YOLO detection bounding boxes."""
    from fastapi.responses import StreamingResponse
    from services.pdf_service import generate_report_pdf

    report = db.query(models.RoadDamage).filter(models.RoadDamage.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    buffer = generate_report_pdf(report)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="StreetScan_Report_{report_id}.pdf"'}
    )


def _process_video_sync(temp_file_path: str) -> dict:
    """CPU-bound helper to extract and analyze video frames synchronously in a background thread."""
    reader = None
    try:
        reader = imageio.get_reader(temp_file_path)
        meta = reader.get_meta_data()
        fps = meta.get("fps", 30.0)
        total_frames = reader.get_length()
        if fps <= 0:
            fps = 30.0 # fallback
            
        timeline = []
        frame_interval = max(1, int(fps / 5)) # analyze 5 frames per second
        frames_scanned = 0
        damage_frames = 0
        highest_conf = 0.0
        worst_severity = "Low"
        
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
            
        return {
            "frames_scanned": frames_scanned,
            "damage_frames": damage_frames,
            "worst_severity": worst_severity if damage_frames > 0 else "None",
            "peak_confidence": round(highest_conf * 100) if damage_frames > 0 else 0,
            "timeline": timeline
        }
    finally:
        if reader is not None:
            try:
                reader.close()
            except Exception:
                pass

@router.post("/video")
async def process_video(file: UploadFile = File(...)):
    """Real video processing endpoint using imageio and YOLOv8 offloaded to thread pool."""
    import tempfile
    
    temp_dir = tempfile.gettempdir()
    temp_file_name = f"{uuid.uuid4()}_{file.filename}"
    temp_file_path = os.path.join(temp_dir, temp_file_name)
    
    try:
        # 1. Save uploaded video to a temporary file
        with open(temp_file_path, "wb") as buffer:
            buffer.write(await file.read())
            
        # 2. Run CPU-bound video processing in threadpool to prevent blocking the event loop
        result_data = await run_in_threadpool(_process_video_sync, temp_file_path)
        
        return {
            "success": True,
            "data": result_data
        }
        
    except Exception as e:
        print(f"Video processing error: {e}")
        return JSONResponse(status_code=500, content={"detail": f"Video processing failed: {str(e)}"})
        
    finally:
        # Cleanup temporary file
        if os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as e:
                print(f"Error removing temp file: {e}")