from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.user import UserResponse

class ProduceLotBase(BaseModel):
    commodity_name: str
    variety: str
    quality_grade: str
    total_quantity_kg: float = Field(gt=0, description="Total harvest quantity in kg")
    available_quantity_kg: float = Field(ge=0, description="Available stock quantity in kg")
    min_order_quantity_kg: float = Field(default=50.0, gt=0, description="Minimum Order Quantity (MOQ) in kg")
    price_per_kg: float = Field(gt=0, description="Wholesale price per kg in INR")
    harvest_date: datetime
    description: Optional[str] = None
    farm_location: str
    image_url: Optional[str] = None
    is_active: bool = True

class ProduceLotCreate(BaseModel):
    commodity_name: str
    variety: str
    quality_grade: str
    total_quantity_kg: float = Field(gt=0)
    min_order_quantity_kg: float = Field(default=50.0, gt=0)
    price_per_kg: float = Field(gt=0)
    harvest_date: datetime
    description: Optional[str] = None
    farm_location: str
    image_url: Optional[str] = None

class ProduceLotUpdate(BaseModel):
    available_quantity_kg: Optional[float] = None
    price_per_kg: Optional[float] = None
    min_order_quantity_kg: Optional[float] = None
    is_active: Optional[bool] = None
    description: Optional[str] = None

class ProduceLotResponse(ProduceLotBase):
    id: int
    farmer_id: int
    created_at: datetime
    farmer: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)
