from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict

import models
import schemas
from database import engine, get_db

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartBus TN Backend",
    description="Basic backend for GPS and Occupancy tracking",
    version="1.0.0"
)

# In-memory cache for latest state, to avoid complex queries for basic setup
# Dictionary mapping bus_id -> schemas.BusState
latest_bus_states: Dict[str, schemas.BusState] = {}

def ensure_bus_exists(db: Session, bus_id: str):
    bus = db.query(models.Bus).filter(models.Bus.id == bus_id).first()
    if not bus:
        bus = models.Bus(id=bus_id)
        db.add(bus)
        db.commit()
    return bus

@app.post("/gps", response_model=schemas.GPSCreate)
def add_gps(record: schemas.GPSCreate, db: Session = Depends(get_db)):
    ensure_bus_exists(db, record.bus_id)
    
    db_record = models.GPSRecord(
        bus_id=record.bus_id,
        latitude=record.latitude,
        longitude=record.longitude,
        speed=record.speed,
        timestamp=record.timestamp
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    # Update in-memory state
    if record.bus_id not in latest_bus_states:
        latest_bus_states[record.bus_id] = schemas.BusState(bus_id=record.bus_id)
    state = latest_bus_states[record.bus_id]
    state.latitude = record.latitude
    state.longitude = record.longitude
    state.speed = record.speed
    if not state.last_updated or record.timestamp > state.last_updated:
        state.last_updated = record.timestamp
        
    return record

@app.post("/occupancy", response_model=schemas.OccupancyCreate)
def add_occupancy(record: schemas.OccupancyCreate, db: Session = Depends(get_db)):
    ensure_bus_exists(db, record.bus_id)
    
    db_record = models.OccupancyRecord(
        bus_id=record.bus_id,
        passenger_count=record.passenger_count,
        available_seats=record.available_seats,
        timestamp=record.timestamp
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    # Update in-memory state
    if record.bus_id not in latest_bus_states:
        latest_bus_states[record.bus_id] = schemas.BusState(bus_id=record.bus_id)
    state = latest_bus_states[record.bus_id]
    state.passenger_count = record.passenger_count
    state.available_seats = record.available_seats
    if not state.last_updated or record.timestamp > state.last_updated:
        state.last_updated = record.timestamp

    return record

@app.get("/bus/{bus_id}", response_model=schemas.BusState)
def get_bus(bus_id: str):
    if bus_id not in latest_bus_states:
        raise HTTPException(status_code=404, detail="Bus not found or no data available")
    return latest_bus_states[bus_id]

@app.get("/buses", response_model=List[schemas.BusState])
def get_all_buses():
    return list(latest_bus_states.values())
