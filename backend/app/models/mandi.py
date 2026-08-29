from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database import Base

class MandiPrice(Base):
    __tablename__ = "mandi_prices"

    id = Column(Integer, primary_key=True, index=True)
    mandi_name = Column(String(120), index=True, nullable=False) # e.g. "Kalamna APMC Market, Nagpur"
    commodity_name = Column(String(100), index=True, nullable=False) # e.g. "Nagpur Orange (Santra)"
    variety = Column(String(100), nullable=False)
    
    min_price_quintal = Column(Float, nullable=False)   # Rate per 100 kg (Quintal)
    max_price_quintal = Column(Float, nullable=False)
    modal_price_quintal = Column(Float, nullable=False) # Prevailing modal price
    modal_price_per_kg = Column(Float, nullable=False)  # Calculated INR/kg
    
    trend = Column(String(20), default="STABLE")        # "UP", "DOWN", "STABLE"
    updated_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
