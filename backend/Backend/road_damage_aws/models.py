from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class RoadDamage(Base):
    __tablename__ = "road_damage"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String, nullable=False)
    damage_type = Column(String, index=True, nullable=False)
    severity = Column(String, index=True, nullable=False) # e.g., Low, Medium, High
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    detection_data = Column(Text, nullable=True)  # JSON string of detected_issues with bboxes
    annotated_image_url = Column(String, nullable=True)  # URL to YOLO-annotated image with boxes
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class VideoReport(Base):
    __tablename__ = "video_reports"

    id = Column(Integer, primary_key=True, index=True)
    video_url = Column(String, nullable=False)         # S3 URL of original video
    filename = Column(String, nullable=False)           # Original filename
    duration_seconds = Column(Float, nullable=True)     # Video duration
    frames_scanned = Column(Integer, default=0)
    damage_frames = Column(Integer, default=0)
    worst_severity = Column(String, default="None")
    peak_confidence = Column(Float, default=0.0)
    timeline_data = Column(Text, nullable=True)         # JSON string of frame-by-frame detections
    best_frame_url = Column(String, nullable=True)      # S3 URL of best detection frame
    best_frame_annotated_url = Column(String, nullable=True)  # S3 URL of annotated best frame
    created_at = Column(DateTime(timezone=True), server_default=func.now())