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

def test_get_invoices_with_status_filter():
    """Test retrieving invoices filtered by status"""
    response = client.get("/api/invoices?statusFilter=FLAGGED")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Ensure all returned invoices have the FLAGGED status
    for invoice in data:
        assert invoice["status"] == "FLAGGED"

def test_perform_action_invalid_invoice():
    """Test performing an action on a non-existent invoice"""
    payload = {
        "action": "REJECT",
        "notes": "Testing invalid invoice"
    }
    response = client.post("/api/invoices/INV-9999-999/action", json=payload)
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Invoice not found"
