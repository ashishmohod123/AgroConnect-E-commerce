from datetime import datetime, timezone, timedelta
from app.database import SessionLocal, engine, Base
from app.models.user import User, UserRole
from app.models.produce import ProduceLot, ProduceQualityGrade
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus
from app.models.mandi import MandiPrice
from app.core.security import hash_password
from app.services.invoice import generate_order_invoice_pdf

def seed_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("[+] Seeding AgroConnect Database with Admin Ashish & rich Vidarbha produce varieties...")

        default_pwd = hash_password("password123")

        # 1. Users Setup (Admin Ashish + Farmers + Retailers)
        admin_ashish = User(
            full_name="Ashish Mohod",
            email="ashish@agroconnect.in",
            hashed_password=default_pwd,
            role=UserRole.ADMIN,
            phone="+91 98220 12345",
            business_or_farm_name="AgroConnect Central Administration, Nagpur",
            location_city="Nagpur",
            state="Maharashtra",
            is_verified=True
        )

        farmer1 = User(
            full_name="Ramesh Patil",
            email="ramesh@katolfarms.com",
            hashed_password=default_pwd,
            role=UserRole.FARMER,
            phone="+91 98230 11223",
            business_or_farm_name="Katol Citrus & Orange FPO",
            location_city="Katol, Nagpur Rural",
            state="Maharashtra",
            is_verified=True
        )

        farmer2 = User(
            full_name="Santosh Deshmukh",
            email="santosh@wardhaagro.com",
            hashed_password=default_pwd,
            role=UserRole.FARMER,
            phone="+91 94221 44556",
            business_or_farm_name="Wardha Organic Producers Group",
            location_city="Wardha",
            state="Maharashtra",
            is_verified=True
        )

        farmer3 = User(
            full_name="Gajanan Wankhede",
            email="gajanan@saonerfarms.com",
            hashed_password=default_pwd,
            role=UserRole.FARMER,
            phone="+91 97654 77889",
            business_or_farm_name="Saoner Agro & Grains FPO",
            location_city="Saoner, Nagpur",
            state="Maharashtra",
            is_verified=True
        )

        farmer4 = User(
            full_name="Prashant Bhende",
            email="prashant@ramtekfarms.com",
            hashed_password=default_pwd,
            role=UserRole.FARMER,
            phone="+91 98229 33445",
            business_or_farm_name="Ramtek Spices & Horticultural Society",
            location_city="Ramtek, Nagpur",
            state="Maharashtra",
            is_verified=True
        )

        retailer1 = User(
            full_name="Rajesh Gupta",
            email="rajesh@nagpurmart.com",
            hashed_password=default_pwd,
            role=UserRole.RETAILER,
            phone="+91 93710 99887",
            business_or_farm_name="Nagpur Central Supermarkets Pvt Ltd",
            location_city="Itwari, Nagpur",
            state="Maharashtra",
            is_verified=True
        )

        retailer2 = User(
            full_name="Amit Sharma",
            email="amit@mumbairetail.com",
            hashed_password=default_pwd,
            role=UserRole.RETAILER,
            phone="+91 98200 55443",
            business_or_farm_name="Metro Fresh Wholesale Stores",
            location_city="Vashi, Navi Mumbai",
            state="Maharashtra",
            is_verified=True
        )

        db.add_all([admin_ashish, farmer1, farmer2, farmer3, farmer4, retailer1, retailer2])
        db.commit()
        db.refresh(admin_ashish)
        db.refresh(farmer1)
        db.refresh(farmer2)
        db.refresh(farmer3)
        db.refresh(farmer4)
        db.refresh(retailer1)

        # 2. Rich Vidarbha & Nagpur Produce Lots
        now = datetime.now(timezone.utc)

        lots = [
            ProduceLot(
                farmer_id=farmer1.id,
                commodity_name="Nagpur Mandarin Oranges (Santra)",
                variety="GI-Tagged Nagpur Santra (Mrig Bahar Export)",
                quality_grade=ProduceQualityGrade.GRADE_A,
                total_quantity_kg=6000.0,
                available_quantity_kg=5200.0,
                min_order_quantity_kg=100.0,
                price_per_kg=48.0,
                harvest_date=now - timedelta(days=2),
                description="World-famous GI-Tagged Nagpur Santra from Katol black soil orchards. High brix sweetness, rich juice content, tree-ripened without artificial ethylene gassing.",
                farm_location="Katol Orchards, Nagpur Rural",
                image_url="https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80",
                is_active=True
            ),
            ProduceLot(
                farmer_id=farmer1.id,
                commodity_name="Narkhed Sweet Lemon (Mosambi)",
                variety="Desi Sweet Mosambi (Juice Grade-1)",
                quality_grade=ProduceQualityGrade.GRADE_A,
                total_quantity_kg=4500.0,
                available_quantity_kg=4500.0,
                min_order_quantity_kg=50.0,
                price_per_kg=42.0,
                harvest_date=now - timedelta(days=1),
                description="Lush sweet limes harvested from Narkhed citrus belt. Thin peel, dense juicy segments, ideal for commercial juice chains and retail produce aisles.",
                farm_location="Narkhed, Nagpur",
                image_url="https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=800&q=80",
                is_active=True
            ),
            ProduceLot(
                farmer_id=farmer2.id,
                commodity_name="Wardha Organic Curcumin Turmeric (Haldi)",
                variety="Salem Organic Finger (Curcumin 5.8%)",
                quality_grade=ProduceQualityGrade.ORGANIC,
                total_quantity_kg=2200.0,
                available_quantity_kg=1900.0,
                min_order_quantity_kg=25.0,
                price_per_kg=165.0,
                harvest_date=now - timedelta(days=5),
                description="100% Certified Organic whole dried turmeric fingers from Wardha organic cluster. Lab-certified 5.8% curcumin content with rich golden aroma.",
                farm_location="Seloo, Wardha District",
                image_url="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
                is_active=True
            ),
            ProduceLot(
                farmer_id=farmer4.id,
                commodity_name="Bhiwapur Hot Red Sun-Dried Chilli",
                variety="Teja Stemless Extra-Hot (SHU 35,000+)",
                quality_grade=ProduceQualityGrade.GRADE_A,
                total_quantity_kg=2000.0,
                available_quantity_kg=1800.0,
                min_order_quantity_kg=20.0,
                price_per_kg=195.0,
                harvest_date=now - timedelta(days=6),
                description="Famous pungent Bhiwapur red chillies known across Maharashtra for intense red pigment (ASTA 100+) and sharp heat. Sun-dried on hygienic tarpaulins.",
                farm_location="Bhiwapur, Nagpur Rural",
                image_url="https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80",
                is_active=True
            ),
            ProduceLot(
                farmer_id=farmer3.id,
                commodity_name="Vidarbha Desi Pigeon Pea (Tur Dal)",
                variety="Unpolished Fatka Desi Tur",
                quality_grade=ProduceQualityGrade.GRADE_A,
                total_quantity_kg=5500.0,
                available_quantity_kg=5500.0,
                min_order_quantity_kg=50.0,
                price_per_kg=115.0,
                harvest_date=now - timedelta(days=4),
                description="Unpolished laser-sorted whole pigeon peas directly sourced from Kalmeshwar / Hinganghat mandis. Zero water polish, rich in plant protein.",
                farm_location="Kalmeshwar, Nagpur",
                image_url="https://images.unsplash.com/photo-1585994192700-4e16104b60b9?auto=format&fit=crop&w=800&q=80",
                is_active=True
            ),
            ProduceLot(
                farmer_id=farmer3.id,
                commodity_name="Vidarbha Yellow Soybeans",
                variety="JS-335 High-Protein Oilseed",
                quality_grade=ProduceQualityGrade.GRADE_B,
                total_quantity_kg=15000.0,
                available_quantity_kg=13500.0,
                min_order_quantity_kg=200.0,
                price_per_kg=46.5,
                harvest_date=now - timedelta(days=7),
                description="Moisture-controlled (under 9.5%) clean yellow soybeans suitable for oil mills, soy chunk plants, and animal feed manufacturing.",
                farm_location="Saoner Tehsil, Nagpur",
                image_url="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
                is_active=True
            ),
            ProduceLot(
                farmer_id=farmer3.id,
                commodity_name="Vidarbha Sharbati Golden Wheat",
                variety="Sharbati Desi Tukdi (Heavy Grain)",
                quality_grade=ProduceQualityGrade.GRADE_A,
                total_quantity_kg=10000.0,
                available_quantity_kg=10000.0,
                min_order_quantity_kg=150.0,
                price_per_kg=34.0,
                harvest_date=now - timedelta(days=10),
                description="Heavy luster golden Sharbati wheat grains from Umred fields. High natural sweetness, ideal for premium rotis and chakki atta brands.",
                farm_location="Umred, Nagpur",
                image_url="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
                is_active=True
            ),
            ProduceLot(
                farmer_id=farmer2.id,
                commodity_name="Vidarbha White Gold Long-Staple Cotton",
                variety="BT-2 Hybrid (29mm+ Staple)",
                quality_grade=ProduceQualityGrade.GRADE_A,
                total_quantity_kg=8000.0,
                available_quantity_kg=8000.0,
                min_order_quantity_kg=100.0,
                price_per_kg=72.0,
                harvest_date=now - timedelta(days=8),
                description="Clean, trash-free raw unginned cotton from Hinganghat cotton hub. High tensile strength, bright white color with zero yellow stain.",
                farm_location="Hinganghat, Wardha",
                image_url="https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80",
                is_active=True
            ),
            ProduceLot(
                farmer_id=farmer4.id,
                commodity_name="Ramtek Desi Garlic (Lasan)",
                variety="Ramtek Local Pungent White Garlic",
                quality_grade=ProduceQualityGrade.GRADE_A,
                total_quantity_kg=2500.0,
                available_quantity_kg=2500.0,
                min_order_quantity_kg=25.0,
                price_per_kg=140.0,
                harvest_date=now - timedelta(days=3),
                description="High allicin content pungent desi garlic from Ramtek soil. Tight cloves, long shelf-life (4+ months), highly valued by spice and paste processors.",
                farm_location="Ramtek, Nagpur Rural",
                image_url="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80",
                is_active=True
            ),
            ProduceLot(
                farmer_id=farmer4.id,
                commodity_name="Nagbhid Chinnor Aromatic Rice",
                variety="Traditional Vidarbha Chinnor (Aromatic)",
                quality_grade=ProduceQualityGrade.ORGANIC,
                total_quantity_kg=4000.0,
                available_quantity_kg=4000.0,
                min_order_quantity_kg=50.0,
                price_per_kg=78.0,
                harvest_date=now - timedelta(days=12),
                description="Famous traditional aromatic rice variety of Eastern Vidarbha. Subtle natural fragrance, delicate grains, rich in minerals.",
                farm_location="Nagbhid, Vidarbha",
                image_url="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
                is_active=True
            ),
            ProduceLot(
                farmer_id=farmer2.id,
                commodity_name="Wardha Bold Groundnuts (Shengdana)",
                variety="Arvi Bold Oil-Grade Peanuts",
                quality_grade=ProduceQualityGrade.GRADE_A,
                total_quantity_kg=5000.0,
                available_quantity_kg=5000.0,
                min_order_quantity_kg=50.0,
                price_per_kg=88.0,
                harvest_date=now - timedelta(days=9),
                description="Two-kernel bold raw groundnuts with 48% natural oil content. Clean pods, zero aflatoxin, ideal for roasting, snacks, and cold-pressed oil.",
                farm_location="Arvi, Wardha",
                image_url="https://images.unsplash.com/photo-1567892328524-74c6d66e7456?auto=format&fit=crop&w=800&q=80",
                is_active=True
            ),
            ProduceLot(
                farmer_id=farmer1.id,
                commodity_name="Katol Kagzi Acid Lime (Nimbu)",
                variety="Kagzi Seedless Thin-Skin Lime",
                quality_grade=ProduceQualityGrade.GRADE_A,
                total_quantity_kg=3000.0,
                available_quantity_kg=3000.0,
                min_order_quantity_kg=25.0,
                price_per_kg=55.0,
                harvest_date=now - timedelta(days=1),
                description="Juicy, bright yellow-green paper-thin skin acid limes from Katol orchards. High acidity and citric juice volume.",
                farm_location="Katol, Nagpur Rural",
                image_url="https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80",
                is_active=True
            ),
        ]
        db.add_all(lots)
        db.commit()

        # 3. Mandi Benchmark Rates
        mandi_benchmarks = [
            MandiPrice(
                mandi_name="Kalamna APMC Market, Nagpur",
                commodity_name="Nagpur Orange (Santra)",
                variety="Mrig Bahar",
                min_price_quintal=4400.0,
                max_price_quintal=5800.0,
                modal_price_quintal=5200.0,
                modal_price_per_kg=52.0,
                trend="UP"
            ),
            MandiPrice(
                mandi_name="Katol APMC Sub-Market",
                commodity_name="Narkhed Sweet Lemon (Mosambi)",
                variety="Desi Mosambi",
                min_price_quintal=3900.0,
                max_price_quintal=4800.0,
                modal_price_quintal=4500.0,
                modal_price_per_kg=45.0,
                trend="STABLE"
            ),
            MandiPrice(
                mandi_name="Wardha APMC Yard",
                commodity_name="Wardha Organic Curcumin Turmeric (Haldi)",
                variety="Salem Finger",
                min_price_quintal=16000.0,
                max_price_quintal=19500.0,
                modal_price_quintal=18200.0,
                modal_price_per_kg=182.0,
                trend="UP"
            ),
            MandiPrice(
                mandi_name="Saoner APMC Market",
                commodity_name="Vidarbha Yellow Soybeans",
                variety="JS-335",
                min_price_quintal=4400.0,
                max_price_quintal=4900.0,
                modal_price_quintal=4750.0,
                modal_price_per_kg=47.5,
                trend="DOWN"
            ),
            MandiPrice(
                mandi_name="Kalamna APMC Market, Nagpur",
                commodity_name="Vidarbha Sharbati Golden Wheat",
                variety="Sharbati Tukdi",
                min_price_quintal=3300.0,
                max_price_quintal=3850.0,
                modal_price_quintal=3650.0,
                modal_price_per_kg=36.5,
                trend="STABLE"
            ),
            MandiPrice(
                mandi_name="Amravati Main APMC",
                commodity_name="Vidarbha Desi Pigeon Pea (Tur Dal)",
                variety="Desi Fatka",
                min_price_quintal=11500.0,
                max_price_quintal=13000.0,
                modal_price_quintal=12400.0,
                modal_price_per_kg=124.0,
                trend="UP"
            ),
            MandiPrice(
                mandi_name="Ramtek APMC Yard",
                commodity_name="Ramtek Desi Garlic (Lasan)",
                variety="Ramtek Local",
                min_price_quintal=13000.0,
                max_price_quintal=16500.0,
                modal_price_quintal=15200.0,
                modal_price_per_kg=152.0,
                trend="UP"
            ),
            MandiPrice(
                mandi_name="Hinganghat APMC Market, Wardha",
                commodity_name="Vidarbha White Gold Long-Staple Cotton",
                variety="BT-2 Medium Staple",
                min_price_quintal=6800.0,
                max_price_quintal=7800.0,
                modal_price_quintal=7500.0,
                modal_price_per_kg=75.0,
                trend="STABLE"
            ),
        ]
        db.add_all(mandi_benchmarks)
        db.commit()

        # 4. Sample Order for demo
        sample_order = Order(
            order_number="AGC-20260829-NAGPUR01",
            retailer_id=retailer1.id,
            total_amount=38400.0,
            mandi_cess_amount=576.0,
            logistics_cost=1200.0,
            grand_total=40176.0,
            status=OrderStatus.CONFIRMED,
            payment_status=PaymentStatus.PAID,
            payment_method="Razorpay (UPI / NetBanking)",
            payment_id="pay_ASHISH_NAGPUR_9918",
            shipping_address="Shop 14-16, Grain Market Complex, Itwari",
            destination_city="Nagpur",
            notes="Direct dispatch from Katol Orchards. Authorized by Admin Ashish.",
            created_at=now - timedelta(hours=3)
        )
        db.add(sample_order)
        db.flush()

        order_item = OrderItem(
            order_id=sample_order.id,
            produce_lot_id=lots[0].id,
            farmer_id=farmer1.id,
            quantity_kg=800.0,
            price_per_kg=48.0,
            subtotal=38400.0
        )
        db.add(order_item)
        db.flush()

        try:
            pdf_path = generate_order_invoice_pdf(
                sample_order,
                retailer1,
                [{
                    "produce_lot": lots[0],
                    "quantity_kg": 800.0,
                    "price_per_kg": 48.0,
                    "subtotal": 38400.0
                }]
            )
            sample_order.invoice_pdf_path = pdf_path
        except Exception as e:
            print(f"Warning: Sample invoice PDF generation: {e}")

        db.commit()
        print("[SUCCESS] Database updated with Admin Ashish & 12+ Vidarbha commodity lots!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
