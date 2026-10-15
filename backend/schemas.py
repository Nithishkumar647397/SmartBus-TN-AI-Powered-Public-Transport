from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class StopBase(BaseModel):
    id: str
    name: str
    lat: float
    lng: float

class StopCreate(StopBase):
    pass

class StopResponse(StopBase):
    class Config:
        from_attributes = True

class RouteBase(BaseModel):
    id: str
    route_number: Optional[str] = None
    name: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    service_type: Optional[str] = "normal"

class RouteCreate(RouteBase):
    pass

class RouteResponse(RouteBase):
    stops_count: Optional[int] = 0

    class Config:
        from_attributes = True

class RouteStopResponse(BaseModel):
    route_id: str
    stop_id: str
    sequence: int
    scheduled_offset_minutes: int
    name: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

    class Config:
        from_attributes = True

class BusBase(BaseModel):
    id: str
    route_id: Optional[str] = None
    capacity: int = 50

class BusCreate(BusBase):
    pass

class LocationUpdate(BaseModel):
    lat: float
    lng: float
    timestamp: Optional[datetime] = None
    speed: Optional[float] = 0.0

class BusPositionResponse(BaseModel):
    id: int
    bus_id: str
    lat: float
    lng: float
    speed: float
    recorded_at: datetime

    class Config:
        from_attributes = True

class BusLiveResponse(BaseModel):
    bus_id: str
    has_live_data: bool
    lat: Optional[float] = None
    lng: Optional[float] = None
    speed: Optional[float] = None
    recorded_at: Optional[datetime] = None
    seconds_since_last_update: Optional[float] = None
    is_stale: bool
    status_text: str

    class Config:
        from_attributes = True

class BusResponse(BusBase):
    route: Optional[RouteResponse] = None
    live: Optional[BusLiveResponse] = None

    class Config:
        from_attributes = True

class AlertResponse(BaseModel):
    id: int
    title: str
    body: str
    type: str
    bus_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
