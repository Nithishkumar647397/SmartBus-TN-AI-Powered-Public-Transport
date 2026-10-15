import datetime
from fastapi.testclient import TestClient
from main import app
from database import SessionLocal, Base, engine
import models

client = TestClient(app)

def test_full_flow():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Test empty routes
    res = client.get("/routes")
    assert res.status_code == 200
    assert res.json() == []

    # 2. Add sample route and stops
    stop1 = models.Stop(id="S1", name="Stop 1", lat=11.0, lng=77.0)
    stop2 = models.Stop(id="S2", name="Stop 2", lat=11.1, lng=77.1)
    route1 = models.Route(id="R1", route_number="101A", name="Route 1", origin="Stop 1", destination="Stop 2", service_type="normal")
    db.add_all([stop1, stop2, route1])
    db.commit()

    rs1 = models.RouteStop(route_id="R1", stop_id="S1", sequence=1, scheduled_offset_minutes=0)
    rs2 = models.RouteStop(route_id="R1", stop_id="S2", sequence=2, scheduled_offset_minutes=25)
    bus1 = models.Bus(id="BUS1", route_id="R1", capacity=40)
    db.add_all([rs1, rs2, bus1])
    db.commit()

    # 3. GET /routes
    res = client.get("/routes")
    assert res.status_code == 200
    routes = res.json()
    assert len(routes) == 1
    assert routes[0]["id"] == "R1"
    assert routes[0]["stops_count"] == 2

    # 4. GET /routes/{id}/stops
    res = client.get("/routes/R1/stops")
    assert res.status_code == 200
    stops = res.json()
    assert len(stops) == 2
    assert stops[0]["stop_id"] == "S1"
    assert stops[0]["sequence"] == 1
    assert stops[1]["scheduled_offset_minutes"] == 25

    # 5. GET /buses/{id} (initial without live position)
    res = client.get("/buses/BUS1")
    assert res.status_code == 200
    bus_data = res.json()
    assert bus_data["id"] == "BUS1"
    assert bus_data["capacity"] == 40
    assert bus_data["live"]["has_live_data"] is False
    assert bus_data["live"]["status_text"] == "No live data"

    # 6. GET /buses/{id}/live before location posted
    res = client.get("/buses/BUS1/live")
    assert res.status_code == 200
    live_data = res.json()
    assert live_data["has_live_data"] is False
    assert live_data["is_stale"] is True

    # 7. POST /buses/{id}/location
    now = datetime.datetime.now(datetime.timezone.utc)
    res = client.post("/buses/BUS1/location", json={
        "lat": 11.05,
        "lng": 77.05,
        "speed": 35.0,
        "timestamp": now.isoformat()
    })
    assert res.status_code == 200
    pos_data = res.json()
    assert pos_data["lat"] == 11.05

    # 8. GET /buses/{id}/live after location posted
    res = client.get("/buses/BUS1/live")
    assert res.status_code == 200
    live_data = res.json()
    assert live_data["has_live_data"] is True
    assert live_data["is_stale"] is False
    assert live_data["status_text"] == "LIVE"
    assert live_data["seconds_since_last_update"] is not None
    assert live_data["seconds_since_last_update"] < 10

    # 9. Test stale location (> 2 minutes = > 120s)
    old_time = now - datetime.timedelta(seconds=180) # 3 minutes ago
    client.post("/buses/BUS1/location", json={
        "lat": 11.06,
        "lng": 77.06,
        "speed": 10.0,
        "timestamp": old_time.isoformat()
    })
    # Since latest position is ordered by recorded_at.desc(), let's insert with recorded_at in past
    # To test stale as latest, let's update BUS2 with old timestamp
    bus2 = models.Bus(id="BUS2", route_id="R1", capacity=50)
    db.add(bus2)
    db.commit()

    res = client.post("/buses/BUS2/location", json={
        "lat": 11.02,
        "lng": 77.02,
        "speed": 0.0,
        "timestamp": old_time.isoformat()
    })
    assert res.status_code == 200

    res = client.get("/buses/BUS2/live")
    assert res.status_code == 200
    live_stale = res.json()
    assert live_stale["has_live_data"] is False
    assert live_stale["is_stale"] is True
    assert "Last updated" in live_stale["status_text"]

    # 10. Test /stops
    res = client.get("/stops?q=Stop 1")
    assert res.status_code == 200
    assert len(res.json()) == 1

    db.close()
    print("ALL API TESTS PASSED!")

if __name__ == "__main__":
    test_full_flow()
