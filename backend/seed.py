import argparse
import csv
import os
import sys
from typing import Optional

from database import SessionLocal, engine
import models

def get_field(row: dict, *candidates, default=None):
    """Retrieve value from row matching any of the candidate names case-insensitively."""
    row_lower = {k.strip().lower(): v for k, v in row.items() if k is not None}
    for candidate in candidates:
        if candidate.lower() in row_lower:
            val = row_lower[candidate.lower()]
            return val.strip() if val is not None else default
    return default

def seed_stops(db, file_path: str):
    if not os.path.exists(file_path):
        print(f"Stops CSV not found at: {file_path}")
        return 0

    count = 0
    with open(file_path, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):
            stop_id = get_field(row, "id", "stop_id")
            name = get_field(row, "name", "stop_name")
            lat_str = get_field(row, "lat", "latitude")
            lng_str = get_field(row, "lng", "lon", "longitude")

            if not stop_id or not name or lat_str is None or lng_str is None:
                print(f"[Warning] Skipping stops row {i}: missing required fields (id, name, lat, lng).")
                continue

            try:
                lat = float(lat_str)
                lng = float(lng_str)
            except ValueError:
                print(f"[Warning] Skipping stops row {i}: invalid coordinates ({lat_str}, {lng_str}).")
                continue

            existing = db.query(models.Stop).filter(models.Stop.id == stop_id).first()
            if existing:
                existing.name = name
                existing.lat = lat
                existing.lng = lng
            else:
                db.add(models.Stop(id=stop_id, name=name, lat=lat, lng=lng))
            count += 1

    db.commit()
    print(f"Successfully processed {count} stops from {file_path}.")
    return count

def seed_routes(db, file_path: str):
    if not os.path.exists(file_path):
        print(f"Routes CSV not found at: {file_path}")
        return 0

    count = 0
    with open(file_path, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):
            route_id = get_field(row, "id", "route_id")
            if not route_id:
                print(f"[Warning] Skipping routes row {i}: missing route id.")
                continue

            route_number = get_field(row, "route_number", "number", "route", default=route_id)
            name = get_field(row, "name", "route_name")
            origin = get_field(row, "origin", "start", "from")
            destination = get_field(row, "destination", "dest", "to")
            service_type = get_field(row, "service_type", "type", default="normal")

            existing = db.query(models.Route).filter(models.Route.id == route_id).first()
            if existing:
                existing.route_number = route_number
                existing.name = name
                existing.origin = origin
                existing.destination = destination
                existing.service_type = service_type
            else:
                db.add(models.Route(
                    id=route_id,
                    route_number=route_number,
                    name=name,
                    origin=origin,
                    destination=destination,
                    service_type=service_type
                ))
            count += 1

    db.commit()
    print(f"Successfully processed {count} routes from {file_path}.")
    return count

def seed_route_stops(db, file_path: str):
    if not os.path.exists(file_path):
        print(f"Route-Stops CSV not found at: {file_path}")
        return 0

    count = 0
    with open(file_path, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):
            route_id = get_field(row, "route_id")
            stop_id = get_field(row, "stop_id")
            seq_str = get_field(row, "sequence", "seq", "order")
            offset_str = get_field(row, "scheduled_offset_minutes", "offset_minutes", "offset", default="0")

            if not route_id or not stop_id or seq_str is None:
                print(f"[Warning] Skipping route_stops row {i}: missing route_id, stop_id, or sequence.")
                continue

            try:
                sequence = int(seq_str)
                scheduled_offset_minutes = int(offset_str) if offset_str else 0
            except ValueError:
                print(f"[Warning] Skipping route_stops row {i}: invalid sequence or offset integer.")
                continue

            existing = (
                db.query(models.RouteStop)
                .filter(models.RouteStop.route_id == route_id, models.RouteStop.stop_id == stop_id)
                .first()
            )
            if existing:
                existing.sequence = sequence
                existing.scheduled_offset_minutes = scheduled_offset_minutes
            else:
                db.add(models.RouteStop(
                    route_id=route_id,
                    stop_id=stop_id,
                    sequence=sequence,
                    scheduled_offset_minutes=scheduled_offset_minutes
                ))
            count += 1

    db.commit()
    print(f"Successfully processed {count} route_stops from {file_path}.")
    return count

def seed_buses(db, file_path: str):
    if not os.path.exists(file_path):
        return 0

    count = 0
    with open(file_path, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):
            bus_id = get_field(row, "id", "bus_id")
            if not bus_id:
                continue

            route_id = get_field(row, "route_id")
            capacity_str = get_field(row, "capacity", default="50")
            try:
                capacity = int(capacity_str) if capacity_str else 50
            except ValueError:
                capacity = 50

            existing = db.query(models.Bus).filter(models.Bus.id == bus_id).first()
            if existing:
                existing.route_id = route_id
                existing.capacity = capacity
            else:
                db.add(models.Bus(id=bus_id, route_id=route_id, capacity=capacity))
            count += 1

    db.commit()
    print(f"Successfully processed {count} buses from {file_path}.")
    return count

def main():
    parser = argparse.ArgumentParser(description="Seed SmartBus database from supplied CSV files.")
    parser.add_argument("--routes", help="Path to routes.csv", default=os.path.join("data", "routes.csv"))
    parser.add_argument("--stops", help="Path to stops.csv", default=os.path.join("data", "stops.csv"))
    parser.add_argument("--route-stops", help="Path to route_stops.csv", default=os.path.join("data", "route_stops.csv"))
    parser.add_argument("--buses", help="Path to buses.csv (optional)", default=os.path.join("data", "buses.csv"))
    parser.add_argument("--clear", action="store_true", help="Clear all database tables before seeding")

    args = parser.parse_args()

    # Ensure tables exist
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        if args.clear:
            print("Clearing existing tables...")
            db.query(models.BusPosition).delete()
            db.query(models.RouteStop).delete()
            db.query(models.Bus).delete()
            db.query(models.Route).delete()
            db.query(models.Stop).delete()
            db.commit()
            print("Database cleared.")

        print("=== Seeding SmartBus Database from CSV files ===")
        print(f"Routes file:      {args.routes}")
        print(f"Stops file:       {args.stops}")
        print(f"Route Stops file: {args.route_stops}")
        print(f"Buses file:       {args.buses}")
        print("-------------------------------------------------")

        seed_stops(db, args.stops)
        seed_routes(db, args.routes)
        seed_route_stops(db, args.route_stops)
        seed_buses(db, args.buses)

        print("Seeding complete.")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    main()
