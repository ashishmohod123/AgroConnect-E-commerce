from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.user import User, UserRole
from app.models.produce import ProduceLot, ProduceQualityGrade
from app.schemas.produce import ProduceLotCreate, ProduceLotUpdate, ProduceLotResponse
from app.routers.auth import get_current_user, require_role

router = APIRouter(prefix="/produce", tags=["Produce Catalog & Lot Management"])

@router.get("", response_model=List[ProduceLotResponse])
def list_produce_lots(
    search: Optional[str] = Query(None, description="Search commodity name, variety, or farm location"),
    commodity: Optional[str] = Query(None, description="Filter by exact commodity name"),
    grade: Optional[str] = Query(None, description="Filter by quality grade"),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    max_moq: Optional[float] = Query(None, ge=0, description="Max minimum order quantity"),
    sort_by: Optional[str] = Query("newest", description="newest, price_asc, price_desc, moq_asc"),
    db: Session = Depends(get_db)
):
    """
    Search and filter available agricultural produce lots from Vidarbha & Nagpur region.
    """
    query = db.query(ProduceLot).filter(ProduceLot.is_active == True, ProduceLot.available_quantity_kg > 0)

    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                ProduceLot.commodity_name.ilike(search_fmt),
                ProduceLot.variety.ilike(search_fmt),
                ProduceLot.farm_location.ilike(search_fmt),
                ProduceLot.description.ilike(search_fmt)
            )
        )
    
    if commodity:
        query = query.filter(ProduceLot.commodity_name.ilike(f"%{commodity.strip()}%"))

    if grade:
        query = query.filter(ProduceLot.quality_grade == grade)

    if min_price is not None:
        query = query.filter(ProduceLot.price_per_kg >= min_price)

    if max_price is not None:
        query = query.filter(ProduceLot.price_per_kg <= max_price)

    if max_moq is not None:
        query = query.filter(ProduceLot.min_order_quantity_kg <= max_moq)

    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(ProduceLot.price_per_kg.asc())
    elif sort_by == "price_desc":
        query = query.order_by(ProduceLot.price_per_kg.desc())
    elif sort_by == "moq_asc":
        query = query.order_by(ProduceLot.min_order_quantity_kg.asc())
    else:
        query = query.order_by(ProduceLot.id.desc())

    return query.all()

@router.get("/farmer/my-lots", response_model=List[ProduceLotResponse])
def get_my_produce_lots(
    current_user: User = Depends(require_role([UserRole.FARMER, UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    """
    Farmer Dashboard: Retrieve all produce lots owned by the current logged-in farmer.
    """
    return db.query(ProduceLot).filter(ProduceLot.farmer_id == current_user.id).order_by(ProduceLot.id.desc()).all()

@router.get("/categories")
def get_commodity_categories(db: Session = Depends(get_db)):
    """
    Returns unique commodity names and grades for frontend filter chips.
    """
    commodities = db.query(ProduceLot.commodity_name).distinct().all()
    grades = db.query(ProduceLot.quality_grade).distinct().all()
    return {
        "commodities": [c[0] for c in commodities if c[0]],
        "grades": [g[0] for g in grades if g[0]]
    }

@router.get("/{lot_id}", response_model=ProduceLotResponse)
def get_produce_lot(lot_id: int, db: Session = Depends(get_db)):
    """
    Get detailed information about a specific produce lot.
    """
    lot = db.query(ProduceLot).filter(ProduceLot.id == lot_id).first()
    if not lot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produce lot not found."
        )
    return lot

@router.post("", response_model=ProduceLotResponse, status_code=status.HTTP_201_CREATED)
def create_produce_lot(
    lot_in: ProduceLotCreate,
    current_user: User = Depends(require_role([UserRole.FARMER, UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    """
    Farmer Action: List a new produce batch on the marketplace.
    """
    new_lot = ProduceLot(
        farmer_id=current_user.id,
        commodity_name=lot_in.commodity_name,
        variety=lot_in.variety,
        quality_grade=lot_in.quality_grade,
        total_quantity_kg=lot_in.total_quantity_kg,
        available_quantity_kg=lot_in.total_quantity_kg,
        min_order_quantity_kg=lot_in.min_order_quantity_kg,
        price_per_kg=lot_in.price_per_kg,
        harvest_date=lot_in.harvest_date,
        description=lot_in.description,
        farm_location=lot_in.farm_location or current_user.location_city,
        image_url=lot_in.image_url,
        is_active=True
    )
    db.add(new_lot)
    db.commit()
    db.refresh(new_lot)
    return new_lot

@router.put("/{lot_id}", response_model=ProduceLotResponse)
def update_produce_lot(
    lot_id: int,
    lot_in: ProduceLotUpdate,
    current_user: User = Depends(require_role([UserRole.FARMER, UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    """
    Update stock, price, or details of a produce lot owned by the farmer.
    """
    lot = db.query(ProduceLot).filter(ProduceLot.id == lot_id).first()
    if not lot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produce lot not found.")

    if current_user.role != UserRole.ADMIN and lot.farmer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only edit your own produce lots.")

    update_data = lot_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(lot, field, value)

    db.commit()
    db.refresh(lot)
    return lot

@router.delete("/{lot_id}")
def delete_produce_lot(
    lot_id: int,
    current_user: User = Depends(require_role([UserRole.FARMER, UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    """
    Deactivate / remove a produce lot.
    """
    lot = db.query(ProduceLot).filter(ProduceLot.id == lot_id).first()
    if not lot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produce lot not found.")

    if current_user.role != UserRole.ADMIN and lot.farmer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only delete your own produce lots.")

    lot.is_active = False
    db.commit()
    return {"message": f"Produce lot #{lot_id} successfully deactivated."}
