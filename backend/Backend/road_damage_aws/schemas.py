from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RoadDamageBase(BaseModel):
    damage_type: str
    severity: str
    latitude: float
    longitude: float
    confidence: float

class RoadDamageCreate(RoadDamageBase):
    image_url: str

class RoadDamageOut(RoadDamageBase):
    id: int
    image_url: str
    created_at: datetime
    analysis: Optional[dict] = None
    detection_data: Optional[str] = None
    annotated_image_url: Optional[str] = None

    class Config:
        from_attributes = True


class VideoReportOut(BaseModel):
    id: int
    video_url: str
    filename: str
    duration_seconds: Optional[float] = None
    frames_scanned: int
    damage_frames: int
    worst_severity: str
    peak_confidence: float
    timeline_data: Optional[str] = None
    best_frame_url: Optional[str] = None
    best_frame_annotated_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True