import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "AgroConnect" in data["service"]

def test_demo_accounts_endpoint():
    response = client.get("/api/auth/demo-accounts")
    assert response.status_code == 200
    accounts = response.json()
    assert len(accounts) >= 3
    roles = [acc["role"] for acc in accounts]
    assert "FARMER" in roles
    assert "RETAILER" in roles

def test_login_success():
    response = client.post("/api/auth/login", json={
        "email": "ramesh@katolfarms.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "FARMER"

def test_login_invalid_password():
    response = client.post("/api/auth/login", json={
        "email": "ramesh@katolfarms.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_list_produce_catalog():
    response = client.get("/api/produce")
    assert response.status_code == 200
    lots = response.json()
    assert len(lots) > 0
    # Check that each lot has commodity name and MOQ
    for lot in lots:
        assert "commodity_name" in lot
        assert lot["min_order_quantity_kg"] > 0
        assert lot["price_per_kg"] > 0

def test_filter_produce_by_grade():
    response = client.get("/api/produce?grade=100%25%20Certified%20Organic")
    assert response.status_code == 200
    lots = response.json()
    for lot in lots:
        assert "Organic" in lot["quality_grade"]

def test_mandi_rates_and_comparison():
    rates_resp = client.get("/api/mandi/rates")
    assert rates_resp.status_code == 200
    rates = rates_resp.json()
    assert len(rates) > 0

    comp_resp = client.get("/api/mandi/comparison")
    assert comp_resp.status_code == 200
    comparisons = comp_resp.json()
    assert len(comparisons) > 0
    for comp in comparisons:
        assert "savings_percentage" in comp
        assert comp["savings_percentage"] >= 0

def test_order_moq_validation_failure():
    # Login as retailer
    login_resp = client.post("/api/auth/login", json={
        "email": "rajesh@nagpurmart.com",
        "password": "password123"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get a lot
    lots = client.get("/api/produce").json()
    first_lot = lots[0]
    moq = first_lot["min_order_quantity_kg"]

    # Try to order below MOQ (e.g. MOQ - 10)
    invalid_qty = max(1.0, moq - 10.0)
    order_resp = client.post("/api/orders", json={
        "items": [{"produce_lot_id": first_lot["id"], "quantity_kg": invalid_qty}],
        "shipping_address": "Test Address",
        "destination_city": "Nagpur"
    }, headers=headers)

    # Should fail with 400 Bad Request
    assert order_resp.status_code == 400
    assert "below Minimum Order Quantity" in order_resp.json()["detail"]
