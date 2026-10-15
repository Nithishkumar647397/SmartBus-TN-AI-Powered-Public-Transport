from datetime import datetime, timezone
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from database import engine, get_db

# Create all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartBus TN Backend",
    description="Real-time public transport tracking backend with SQLAlchemy & SQLite/PostgreSQL",
    version="2.0.0"
)

# Enable CORS for React Native / web access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def calculate_live_state(bus_id: str, pos: Optional[models.BusPosition]) -> schemas.BusLiveResponse:
    if not pos:
        return schemas.BusLiveResponse(
            bus_id=bus_id,
            has_live_data=False,
            lat=None,
            lng=None,
            speed=None,
            recorded_at=None,
            seconds_since_last_update=None,
            is_stale=True,
            status_text="No live data"
        )

    now = datetime.now(timezone.utc)
    rec_time = pos.recorded_at
    if rec_time.tzinfo is None:
        rec_time = rec_time.replace(tzinfo=timezone.utc)

    diff_seconds = max(0.0, (now - rec_time).total_seconds())
    is_stale = diff_seconds > 120.0

    if is_stale:
        mins_ago = int(diff_seconds // 60)
        status_text = "No live data" if mins_ago > 60 else f"Last updated {mins_ago} min ago"
    else:
        status_text = "LIVE"

    return schemas.BusLiveResponse(
        bus_id=bus_id,
        has_live_data=not is_stale,
        lat=pos.lat,
        lng=pos.lng,
        speed=pos.speed,
        recorded_at=pos.recorded_at,
        seconds_since_last_update=round(diff_seconds, 1),
        is_stale=is_stale,
        status_text=status_text
    )


@app.get("/routes", response_model=List[schemas.RouteResponse])
def get_routes(db: Session = Depends(get_db)):
    routes = db.query(models.Route).all()
    res = []
    for r in routes:
        stops_count = db.query(models.RouteStop).filter(models.RouteStop.route_id == r.id).count()
        res.append(schemas.RouteResponse(
            id=r.id,
            route_number=r.route_number or r.id,
            name=r.name,
            origin=r.origin,
            destination=r.destination,
            service_type=r.service_type,
            stops_count=stops_count
        ))
    return res


@app.get("/routes/{id}/stops", response_model=List[schemas.RouteStopResponse])
def get_route_stops(id: str, db: Session = Depends(get_db)):
    route = db.query(models.Route).filter(models.Route.id == id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    results = (
        db.query(models.RouteStop, models.Stop)
        .join(models.Stop, models.RouteStop.stop_id == models.Stop.id)
        .filter(models.RouteStop.route_id == id)
        .order_by(models.RouteStop.sequence.asc())
        .all()
    )

    stops_list = []
    for rs, stop in results:
        stops_list.append(schemas.RouteStopResponse(
            route_id=rs.route_id,
            stop_id=rs.stop_id,
            sequence=rs.sequence,
            scheduled_offset_minutes=rs.scheduled_offset_minutes,
            name=stop.name,
            lat=stop.lat,
            lng=stop.lng
        ))
    return stops_list


@app.get("/buses", response_model=List[schemas.BusResponse])
def get_all_buses(route_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Bus)
    if route_id:
        query = query.filter(models.Bus.route_id == route_id)
    buses = query.all()

    result = []
    for bus in buses:
        route_resp = None
        if bus.route:
            stops_count = len(bus.route.stops)
            route_resp = schemas.RouteResponse(
                id=bus.route.id,
                route_number=bus.route.route_number or bus.route.id,
                name=bus.route.name,
                origin=bus.route.origin,
                destination=bus.route.destination,
                service_type=bus.route.service_type,
                stops_count=stops_count
            )

        latest_pos = (
            db.query(models.BusPosition)
            .filter(models.BusPosition.bus_id == bus.id)
            .order_by(models.BusPosition.recorded_at.desc())
            .first()
        )
        live_state = calculate_live_state(bus.id, latest_pos)

        result.append(schemas.BusResponse(
            id=bus.id,
            route_id=bus.route_id,
            capacity=bus.capacity,
            route=route_resp,
            live=live_state
        ))
    return result


@app.get("/buses/{id}", response_model=schemas.BusResponse)
def get_bus(id: str, db: Session = Depends(get_db)):
    bus = db.query(models.Bus).filter(models.Bus.id == id).first()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")

    route_resp = None
    if bus.route:
        stops_count = len(bus.route.stops)
        route_resp = schemas.RouteResponse(
            id=bus.route.id,
            route_number=bus.route.route_number or bus.route.id,
            name=bus.route.name,
            origin=bus.route.origin,
            destination=bus.route.destination,
            service_type=bus.route.service_type,
            stops_count=stops_count
        )

    latest_pos = (
        db.query(models.BusPosition)
        .filter(models.BusPosition.bus_id == id)
        .order_by(models.BusPosition.recorded_at.desc())
        .first()
    )
    live_state = calculate_live_state(id, latest_pos)

    return schemas.BusResponse(
        id=bus.id,
        route_id=bus.route_id,
        capacity=bus.capacity,
        route=route_resp,
        live=live_state
    )


@app.post("/buses/{id}/location", response_model=schemas.BusPositionResponse)
def update_bus_location(id: str, loc: schemas.LocationUpdate, db: Session = Depends(get_db)):
    bus = db.query(models.Bus).filter(models.Bus.id == id).first()
    if not bus:
        # Create bus if not existing
        bus = models.Bus(id=id, capacity=50)
        db.add(bus)
        db.commit()

    rec_time = loc.timestamp or datetime.now(timezone.utc)
    if rec_time.tzinfo is None:
        rec_time = rec_time.replace(tzinfo=timezone.utc)

    position = models.BusPosition(
        bus_id=id,
        lat=loc.lat,
        lng=loc.lng,
        speed=loc.speed if loc.speed is not None else 0.0,
        recorded_at=rec_time
    )
    db.add(position)
    db.commit()
    db.refresh(position)
    return position


@app.get("/buses/{id}/live", response_model=schemas.BusLiveResponse)
def get_bus_live(id: str, db: Session = Depends(get_db)):
    bus = db.query(models.Bus).filter(models.Bus.id == id).first()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")

    latest_pos = (
        db.query(models.BusPosition)
        .filter(models.BusPosition.bus_id == id)
        .order_by(models.BusPosition.recorded_at.desc())
        .first()
    )
    return calculate_live_state(id, latest_pos)


@app.get("/stops", response_model=List[schemas.StopResponse])
def get_stops(q: Optional[str] = Query(None), limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.Stop)
    if q:
        query = query.filter(models.Stop.name.ilike(f"%{q}%"))
    return query.limit(limit).all()


@app.get("/alerts", response_model=List[schemas.AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    return db.query(models.Alert).order_by(models.Alert.created_at.desc()).all()
