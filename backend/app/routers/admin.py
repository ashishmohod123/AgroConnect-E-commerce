import csv
import io
from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.user import User, UserRole
from app.models.produce import ProduceLot
from app.models.order import Order, OrderItem
from app.models.mandi import MandiPrice
from app.routers.auth import require_role

router = APIRouter(prefix="/admin", tags=["Admin Ashish Central Control Panel"])

class UpdateMandiRateRequest(BaseModel):
    modal_price_per_kg: float
    trend: str # "UP", "DOWN", "STABLE"

@router.get("/metrics")
def get_admin_metrics(
    current_user: User = Depends(require_role([UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    """
    Super Admin Dashboard: High-level platform analytics for Admin Ashish.
    """
    total_farmers = db.query(User).filter(User.role == UserRole.FARMER).count()
    total_retailers = db.query(User).filter(User.role == UserRole.RETAILER).count()
    active_lots = db.query(ProduceLot).filter(ProduceLot.is_active == True).count()
    
    total_gmv = db.query(func.sum(Order.grand_total)).scalar() or 0.0
    total_cess = db.query(func.sum(Order.mandi_cess_amount)).scalar() or 0.0
    total_volume_kg = db.query(func.sum(OrderItem.quantity_kg)).scalar() or 0.0
    total_orders = db.query(Order).count()

    recent_orders = db.query(Order).order_by(Order.id.desc()).limit(8).all()

    return {
        "admin_name": current_user.full_name,
        "admin_city": current_user.location_city,
        "total_farmers": total_farmers,
        "total_retailers": total_retailers,
        "active_lots": active_lots,
        "total_gmv_inr": round(float(total_gmv), 2),
        "total_mandi_cess_collected_inr": round(float(total_cess), 2),
        "total_volume_kg": round(float(total_volume_kg), 1),
        "total_orders": total_orders,
        "recent_orders": [
            {
                "id": o.id,
                "order_number": o.order_number,
                "buyer_name": o.retailer.full_name if o.retailer else "Retailer",
                "city": o.destination_city,
                "grand_total": o.grand_total,
                "status": o.status,
                "date": o.created_at
            }
            for o in recent_orders
        ]
    }

@router.put("/mandi-rates/{rate_id}")
def update_mandi_rate(
    rate_id: int,
    req: UpdateMandiRateRequest,
    current_user: User = Depends(require_role([UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    """
    Live Mandi Rate Modifier: Admin Ashish can update prevailing modal prices.
    """
    rate = db.query(MandiPrice).filter(MandiPrice.id == rate_id).first()
    if not rate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mandi rate record not found.")

    rate.modal_price_per_kg = req.modal_price_per_kg
    rate.modal_price_quintal = req.modal_price_per_kg * 100.0
    rate.trend = req.trend.upper()
    db.commit()
    db.refresh(rate)
    return {"message": f"Mandi rate for {rate.commodity_name} updated successfully to Rs {rate.modal_price_per_kg}/kg ({rate.trend})."}

@router.get("/export-csv")
def export_trade_records_csv(
    db: Session = Depends(get_db)
):
    """
    Export all platform transactions as CSV for APMC audit and tax filing.
    """
    orders = db.query(Order).order_by(Order.id.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write CSV Header
    writer.writerow([
        "Order Number", 
        "Date", 
        "Buyer Name", 
        "Business Name", 
        "Destination City", 
        "Produce Subtotal (INR)", 
        "Mandi APMC Cess 1.5% (INR)", 
        "Freight (INR)", 
        "Grand Total (INR)", 
        "Status", 
        "Payment Method", 
        "Payment ID"
    ])

    for o in orders:
        writer.writerow([
            o.order_number,
            o.created_at.strftime("%Y-%m-%d %H:%M:%S") if o.created_at else "",
            o.retailer.full_name if o.retailer else "N/A",
            o.retailer.business_or_farm_name if o.retailer else "N/A",
            o.destination_city,
            o.total_amount,
            o.mandi_cess_amount,
            o.logistics_cost,
            o.grand_total,
            o.status,
            o.payment_method,
            o.payment_id
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=AgroConnect_Vidarbha_Trade_Records.csv"}
    )
