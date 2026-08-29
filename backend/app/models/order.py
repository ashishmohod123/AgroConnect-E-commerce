from enum import Enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class OrderStatus(str, Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    DISPATCHED = "DISPATCHED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"

class PaymentStatus(str, Enum):
    PAID = "PAID"
    ESCROW_HELD = "ESCROW_HELD"
    PENDING = "PENDING"

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    retailer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    total_amount = Column(Float, nullable=False)        # Subtotal of produce
    mandi_cess_amount = Column(Float, default=0.0)      # 1.5% APMC regulatory cess
    logistics_cost = Column(Float, default=0.0)         # Freight & transport cost
    grand_total = Column(Float, nullable=False)         # Final payable amount
    
    status = Column(String(30), default=OrderStatus.CONFIRMED, nullable=False)
    payment_status = Column(String(30), default=PaymentStatus.PAID, nullable=False)
    payment_method = Column(String(50), default="Razorpay (UPI / NetBanking)", nullable=False)
    payment_id = Column(String(100), nullable=True)     # Transaction reference ID
    
    shipping_address = Column(Text, nullable=False)
    destination_city = Column(String(100), default="Nagpur", nullable=False)
    notes = Column(Text, nullable=True)
    invoice_pdf_path = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    retailer = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    produce_lot_id = Column(Integer, ForeignKey("produce_lots.id"), nullable=False)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    quantity_kg = Column(Float, nullable=False)
    price_per_kg = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)

    # Relationships
    order = relationship("Order", back_populates="items")
    produce_lot = relationship("ProduceLot", back_populates="order_items")
    farmer = relationship("User")
