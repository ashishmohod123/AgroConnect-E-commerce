from enum import Enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class ProduceQualityGrade(str, Enum):
    GRADE_A = "Grade A (Export / Premium)"
    GRADE_B = "Grade B (Commercial Wholesale)"
    ORGANIC = "100% Certified Organic"

class ProduceLot(Base):
    __tablename__ = "produce_lots"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    commodity_name = Column(String(100), index=True, nullable=False)
    variety = Column(String(100), nullable=False)
    quality_grade = Column(String(50), default=ProduceQualityGrade.GRADE_A, nullable=False)
    
    total_quantity_kg = Column(Float, nullable=False)
    available_quantity_kg = Column(Float, nullable=False)
    min_order_quantity_kg = Column(Float, default=50.0, nullable=False)  # MOQ
    price_per_kg = Column(Float, nullable=False)
    
    harvest_date = Column(DateTime, nullable=False)
    description = Column(Text, nullable=True)
    farm_location = Column(String(150), nullable=False)
    image_url = Column(String(300), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    farmer = relationship("User", back_populates="produce_lots")
    order_items = relationship("OrderItem", back_populates="produce_lot")
