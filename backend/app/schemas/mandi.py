from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class MandiPriceBase(BaseModel):
    mandi_name: str
    commodity_name: str
    variety: str
    min_price_quintal: float
    max_price_quintal: float
    modal_price_quintal: float
    modal_price_per_kg: float
    trend: str = "STABLE"

class MandiPriceCreate(MandiPriceBase):
    pass

class MandiPriceResponse(MandiPriceBase):
    id: int
    updated_date: datetime

    model_config = ConfigDict(from_attributes=True)

class PriceComparisonItem(BaseModel):
    commodity_name: str
    mandi_name: str
    mandi_modal_price_kg: float
    farm_direct_avg_price_kg: float
    savings_percentage: float
    trend: str
