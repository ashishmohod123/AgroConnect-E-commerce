import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.database import engine, Base
from app.routers import auth, produce, orders, mandi, analytics, ai_chat, admin

# Create database tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="🌾 AgroConnect API — Nagpur B2B Farm Marketplace",
    description="""
## AgroConnect B2B Agricultural Produce Trading Platform
A high-performance Python FastAPI backend for direct farm-to-retailer trade in the Nagpur & Vidarbha APMC Corridor.

### Key Capabilities:
* 🔐 **JWT Authentication & RBAC**: Dedicated permissions for Farmers, Retailers, and Admins.
* 📦 **Lot & Batch Management**: Bulk agriculture batches, Minimum Order Quantities (MOQ), and freshness tracking.
* 💳 **Orders & Invoicing**: Automated inventory deduction, simulated Razorpay payments, and PDF Tax Invoice generation.
* 📈 **Mandi Intelligence**: APMC benchmark rates (Kalamna, Katol, Wardha) and buyer savings analysis.
* 🤖 **Kisan AI Assistant**: Real-time agro advisory and mandi lookups.
* 👑 **Super Admin Suite**: Full administration dashboard for Admin Ashish.
    """,
    version="1.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(produce.router, prefix=settings.API_V1_STR)
app.include_router(orders.router, prefix=settings.API_V1_STR)
app.include_router(mandi.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(ai_chat.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health & Status"])
def root():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "region": "Nagpur, Maharashtra, India",
        "documentation": "/docs",
        "api_v1": settings.API_V1_STR
    }
