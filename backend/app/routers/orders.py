import os
from datetime import datetime, timezone
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, UserRole
from app.models.produce import ProduceLot
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus
from app.schemas.order import OrderCreate, OrderStatusUpdate, OrderResponse
from app.routers.auth import get_current_user, require_role
from app.services.invoice import generate_order_invoice_pdf, INVOICE_DIR

router = APIRouter(prefix="/orders", tags=["Orders & Invoicing Management"])

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def place_bulk_order(
    order_in: OrderCreate,
    current_user: User = Depends(require_role([UserRole.RETAILER, UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    """
    Retailer Action: Place a bulk agricultural produce order.
    Validates MOQ and available stock atomically, deducts inventory, and generates a PDF invoice.
    """
    if not order_in.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order must contain at least one produce lot.")

    subtotal = 0.0
    total_weight_kg = 0.0
    order_items_to_create = []
    prepared_items_data = []

    # 1. Validation & Calculation Loop
    for item_in in order_in.items:
        lot = db.query(ProduceLot).filter(ProduceLot.id == item_in.produce_lot_id, ProduceLot.is_active == True).first()
        if not lot:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Produce lot #{item_in.produce_lot_id} is unavailable.")

        # Validate MOQ (Minimum Order Quantity)
        if item_in.quantity_kg < lot.min_order_quantity_kg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Order quantity ({item_in.quantity_kg} kg) for '{lot.commodity_name}' is below Minimum Order Quantity ({lot.min_order_quantity_kg} kg)."
            )

        # Validate Stock Availability
        if item_in.quantity_kg > lot.available_quantity_kg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Requested {item_in.quantity_kg} kg exceeds available stock ({lot.available_quantity_kg} kg) for '{lot.commodity_name}'."
            )

        # Deduct stock
        lot.available_quantity_kg -= item_in.quantity_kg
        
        item_subtotal = item_in.quantity_kg * lot.price_per_kg
        subtotal += item_subtotal
        total_weight_kg += item_in.quantity_kg

        order_items_to_create.append({
            "produce_lot_id": lot.id,
            "farmer_id": lot.farmer_id,
            "quantity_kg": item_in.quantity_kg,
            "price_per_kg": lot.price_per_kg,
            "subtotal": item_subtotal,
            "lot_obj": lot
        })

    # 2. Financial Breakdowns: Mandi Cess (1.5%) + Flat Freight Logistics (₹1.5 per kg)
    mandi_cess = round(subtotal * 0.015, 2)
    logistics_cost = round(total_weight_kg * 1.5, 2)
    grand_total = round(subtotal + mandi_cess + logistics_cost, 2)

    # 3. Create Unique Order Identifier
    order_num = f"AGC-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

    new_order = Order(
        order_number=order_num,
        retailer_id=current_user.id,
        total_amount=subtotal,
        mandi_cess_amount=mandi_cess,
        logistics_cost=logistics_cost,
        grand_total=grand_total,
        status=OrderStatus.CONFIRMED,
        payment_status=PaymentStatus.PAID,
        payment_method=order_in.payment_method,
        payment_id=order_in.payment_id or f"pay_{uuid.uuid4().hex[:10]}",
        shipping_address=order_in.shipping_address,
        destination_city=order_in.destination_city or current_user.location_city,
        notes=order_in.notes
    )
    db.add(new_order)
    db.flush() # obtain new_order.id

    # 4. Insert Order Items
    for item_data in order_items_to_create:
        item = OrderItem(
            order_id=new_order.id,
            produce_lot_id=item_data["produce_lot_id"],
            farmer_id=item_data["farmer_id"],
            quantity_kg=item_data["quantity_kg"],
            price_per_kg=item_data["price_per_kg"],
            subtotal=item_data["subtotal"]
        )
        db.add(item)
        prepared_items_data.append({
            "produce_lot": item_data["lot_obj"],
            "quantity_kg": item_data["quantity_kg"],
            "price_per_kg": item_data["price_per_kg"],
            "subtotal": item_data["subtotal"]
        })

    # 5. Generate Tax Invoice PDF
    try:
        pdf_path = generate_order_invoice_pdf(new_order, current_user, prepared_items_data)
        new_order.invoice_pdf_path = pdf_path
    except Exception as e:
        print(f"Warning: Invoice generation failed: {e}")

    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/my-orders", response_model=List[OrderResponse])
def get_retailer_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve all orders placed by the current user.
    """
    return db.query(Order).filter(Order.retailer_id == current_user.id).order_by(Order.id.desc()).all()

@router.get("/farmer-orders")
def get_incoming_farmer_orders(
    current_user: User = Depends(require_role([UserRole.FARMER, UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    """
    Farmer Dashboard: Retrieve all order items that contain the logged-in farmer's produce.
    """
    items = db.query(OrderItem).filter(OrderItem.farmer_id == current_user.id).order_by(OrderItem.id.desc()).all()
    
    results = []
    for item in items:
        order = item.order
        lot = item.produce_lot
        results.append({
            "order_item_id": item.id,
            "order_number": order.order_number,
            "order_date": order.created_at,
            "order_status": order.status,
            "commodity_name": lot.commodity_name if lot else "Produce",
            "variety": lot.variety if lot else "Standard",
            "quantity_kg": item.quantity_kg,
            "price_per_kg": item.price_per_kg,
            "subtotal": item.subtotal,
            "buyer_name": order.retailer.full_name if order.retailer else "Retailer",
            "buyer_business": order.retailer.business_or_farm_name if order.retailer else "",
            "destination_city": order.destination_city
        })
    return results

@router.get("/{order_id}", response_model=OrderResponse)
def get_order_by_id(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific order.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")

    if current_user.role != UserRole.ADMIN and order.retailer_id != current_user.id:
        # Also allow farmer if they are part of the order items
        farmer_ids = [item.farmer_id for item in order.items]
        if current_user.id not in farmer_ids:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this order.")

    return order

@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    status_in: OrderStatusUpdate,
    current_user: User = Depends(require_role([UserRole.FARMER, UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    """
    Farmer/Admin Action: Update delivery lifecycle status (CONFIRMED -> DISPATCHED -> DELIVERED).
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")

    order.status = status_in.status.upper()
    db.commit()
    db.refresh(order)
    return order

@router.get("/{order_id}/invoice")
def download_invoice_pdf(
    order_id: int,
    db: Session = Depends(get_db)
):
    """
    Stream and download the official PDF Tax Invoice for the given order.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")

    filename = f"Invoice_{order.order_number}.pdf"
    filepath = os.path.join(INVOICE_DIR, filename)

    if not os.path.exists(filepath):
        # Generate on-the-fly if not already generated
        retailer = order.retailer or db.query(User).filter(User.id == order.retailer_id).first()
        items_data = []
        for item in order.items:
            items_data.append({
                "produce_lot": item.produce_lot,
                "quantity_kg": item.quantity_kg,
                "price_per_kg": item.price_per_kg,
                "subtotal": item.subtotal
            })
        filepath = generate_order_invoice_pdf(order, retailer, items_data)

    return FileResponse(
        filepath,
        media_type="application/pdf",
        filename=filename
    )
