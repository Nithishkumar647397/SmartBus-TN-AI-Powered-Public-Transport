from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from database import Base
import datetime

class Bus(Base):
    __tablename__ = "buses"
    id = Column(String, primary_key=True, index=True)

class GPSRecord(Base):
    __tablename__ = "gps_records"
    id = Column(Integer, primary_key=True, index=True)
    bus_id = Column(String, ForeignKey("buses.id"), index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    speed = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class OccupancyRecord(Base):
    __tablename__ = "occupancy_records"
    id = Column(Integer, primary_key=True, index=True)
    bus_id = Column(String, ForeignKey("buses.id"), index=True)
    passenger_count = Column(Integer, nullable=False)
    available_seats = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
