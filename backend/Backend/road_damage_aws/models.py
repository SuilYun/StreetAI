from sqlalchemy import Column, Integer, String, Float, DateTime
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
    created_at = Column(DateTime(timezone=True), server_default=func.now())