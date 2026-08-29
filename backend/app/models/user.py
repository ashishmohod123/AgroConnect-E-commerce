from enum import Enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class UserRole(str, Enum):
    FARMER = "FARMER"       # Farmer / FPO Seller
    RETAILER = "RETAILER"   # Wholesaler / Urban Retailer Buyer
    ADMIN = "ADMIN"         # APMC / Platform Admin

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default=UserRole.RETAILER, nullable=False)
    phone = Column(String(20), nullable=False)
    business_or_farm_name = Column(String(150), nullable=False)
    location_city = Column(String(100), default="Nagpur", nullable=False)
    state = Column(String(100), default="Maharashtra", nullable=False)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    produce_lots = relationship("ProduceLot", back_populates="farmer", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="retailer")
