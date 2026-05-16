from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_invoices():
    """Test retrieving all invoices"""
    response = client.get("/api/invoices")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["id"] == "INV-2023-001"

def test_get_insights():
    """Test retrieving insights for a specific invoice"""
    response = client.get("/api/insights/INV-2023-001")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["category"] == "Overbilling"

def test_perform_action():
    """Test performing an action on an invoice"""
    payload = {
        "action": "APPROVE",
        "notes": "Looks good to me."
    }
    response = client.post("/api/invoices/INV-2023-001/action", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["updatedStatus"] == "APPROVED"
    assert "successfully updated to APPROVED" in data["message"]
