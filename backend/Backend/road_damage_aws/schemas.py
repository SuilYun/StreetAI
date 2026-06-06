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

    class Config:
        from_attributes = True