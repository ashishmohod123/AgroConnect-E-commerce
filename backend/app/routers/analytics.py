from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User, UserRole
from app.models.produce import ProduceLot
from app.models.order import Order, OrderItem
from app.routers.auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["Dashboard & Metrics Analytics"])

@router.get("/overview")
def get_platform_overview(db: Session = Depends(get_db)):
    """
    Get top-level platform trade metrics: total volume traded (kg), total GMV (INR), active lots, registered farmers.
    """
    total_farmers = db.query(User).filter(User.role == UserRole.FARMER).count()
    total_retailers = db.query(User).filter(User.role == UserRole.RETAILER).count()
    active_lots = db.query(ProduceLot).filter(ProduceLot.is_active == True, ProduceLot.available_quantity_kg > 0).count()
    
    total_revenue = db.query(func.sum(Order.grand_total)).scalar() or 0.0
    total_volume_kg = db.query(func.sum(OrderItem.quantity_kg)).scalar() or 0.0
    total_orders = db.query(Order).count()

    return {
        "total_farmers": total_farmers,
        "total_retailers": total_retailers,
        "active_lots": active_lots,
        "total_revenue_inr": round(float(total_revenue), 2),
        "total_volume_traded_kg": round(float(total_volume_kg), 1),
        "total_orders_completed": total_orders,
        "primary_region": "Nagpur & Vidarbha APMC Corridor, Maharashtra"
    }

@router.get("/farmer-summary")
def get_farmer_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Personalized analytics for the logged-in farmer: total lots, active inventory kg, total sales revenue.
    """
    my_lots = db.query(ProduceLot).filter(ProduceLot.farmer_id == current_user.id).all()
    my_items = db.query(OrderItem).filter(OrderItem.farmer_id == current_user.id).all()

    total_revenue = sum(item.subtotal for item in my_items)
    total_kg_sold = sum(item.quantity_kg for item in my_items)
    available_stock_kg = sum(lot.available_quantity_kg for lot in my_lots if lot.is_active)

    return {
        "farmer_name": current_user.full_name,
        "farm_name": current_user.business_or_farm_name,
        "location": current_user.location_city,
        "active_listings_count": len(my_lots),
        "available_stock_kg": available_stock_kg,
        "total_kg_sold": total_kg_sold,
        "total_earnings_inr": round(total_revenue, 2),
        "recent_orders_count": len(my_items)
    }
