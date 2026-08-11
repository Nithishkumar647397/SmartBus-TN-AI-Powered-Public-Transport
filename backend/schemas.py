from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class GPSCreate(BaseModel):
    bus_id: str
    latitude: float
    longitude: float
    speed: float
    timestamp: datetime

class OccupancyCreate(BaseModel):
    bus_id: str
    passenger_count: int
    available_seats: int
    timestamp: datetime

class BusState(BaseModel):
    bus_id: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    speed: Optional[float] = None
    passenger_count: Optional[int] = None
    available_seats: Optional[int] = None
    last_updated: Optional[datetime] = None

    class Config:
        from_attributes = True
