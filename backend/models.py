import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class Route(Base):
    __tablename__ = "routes"

    id = Column(String(50), primary_key=True, index=True)
    route_number = Column(String(50), index=True, nullable=True)
    name = Column(String(100), nullable=True)
    origin = Column(String(100), nullable=True)
    destination = Column(String(100), nullable=True)
    service_type = Column(String(50), default="normal", nullable=True)

    stops = relationship("RouteStop", back_populates="route", cascade="all, delete-orphan", order_by="RouteStop.sequence")
    buses = relationship("Bus", back_populates="route")


class Stop(Base):
    __tablename__ = "stops"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)

    route_stops = relationship("RouteStop", back_populates="stop", cascade="all, delete-orphan")


class RouteStop(Base):
    __tablename__ = "route_stops"

    id = Column(Integer, primary_key=True, autoincrement=True)
    route_id = Column(String(50), ForeignKey("routes.id", ondelete="CASCADE"), nullable=False, index=True)
    stop_id = Column(String(50), ForeignKey("stops.id", ondelete="CASCADE"), nullable=False, index=True)
    sequence = Column(Integer, nullable=False)
    scheduled_offset_minutes = Column(Integer, nullable=False, default=0)

    route = relationship("Route", back_populates="stops")
    stop = relationship("Stop", back_populates="route_stops")


class Bus(Base):
    __tablename__ = "buses"

    id = Column(String(50), primary_key=True, index=True)
    route_id = Column(String(50), ForeignKey("routes.id", ondelete="SET NULL"), nullable=True, index=True)
    capacity = Column(Integer, nullable=False, default=50)

    route = relationship("Route", back_populates="buses")
    positions = relationship("BusPosition", back_populates="bus", cascade="all, delete-orphan", order_by="desc(BusPosition.recorded_at)")


class BusPosition(Base):
    __tablename__ = "bus_positions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    bus_id = Column(String(50), ForeignKey("buses.id", ondelete="CASCADE"), nullable=False, index=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    speed = Column(Float, nullable=False, default=0.0)
    recorded_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        nullable=False,
        index=True
    )

    bus = relationship("Bus", back_populates="positions")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    body = Column(Text, nullable=False)
    type = Column(String(50), default="info", nullable=False)
    bus_id = Column(String(50), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        nullable=False
    )
