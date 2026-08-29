from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.user import UserResponse
from app.schemas.produce import ProduceLotResponse

class OrderItemCreate(BaseModel):
    produce_lot_id: int
    quantity_kg: float = Field(gt=0, description="Quantity to purchase in kg (must satisfy MOQ)")

class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    produce_lot_id: int
    farmer_id: int
    quantity_kg: float
    price_per_kg: float
    subtotal: float
    produce_lot: Optional[ProduceLotResponse] = None

    model_config = ConfigDict(from_attributes=True)

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: str
    destination_city: str = "Nagpur"
    payment_method: str = "Razorpay (UPI / NetBanking)"
    payment_id: Optional[str] = "pay_demo_nagpur_12345"
    notes: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    status: str # "CONFIRMED", "DISPATCHED", "DELIVERED", "CANCELLED"

class OrderResponse(BaseModel):
    id: int
    order_number: str
    retailer_id: int
    total_amount: float
    mandi_cess_amount: float
    logistics_cost: float
    grand_total: float
    status: str
    payment_status: str
    payment_method: str
    payment_id: Optional[str] = None
    shipping_address: str
    destination_city: str
    notes: Optional[str] = None
    invoice_pdf_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    retailer: Optional[UserResponse] = None
    items: List[OrderItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
