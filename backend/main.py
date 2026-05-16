from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Financial Analytics API")

# Add CORS middleware to allow the React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ActionRequest(BaseModel):
    action: str
    notes: str

# Mock Data Storage
INVOICES_DATA = [
    {
        "id": "INV-2023-001",
        "clientName": "Acme Corporation",
        "vendorName": "Tech Solutions Inc",
        "amount": 14500.00,
        "status": "FLAGGED",
        "dateSubmitted": "2023-10-15T08:30:00Z",
        "anomalyScore": 0.85,
        "projectCode": "PRJ-90"
    },
    {
        "id": "INV-2023-002",
        "clientName": "Globex Industries",
        "vendorName": "Cloud Services LLC",
        "amount": 3200.50,
        "status": "PENDING",
        "dateSubmitted": "2023-10-16T14:15:00Z",
        "anomalyScore": 0.12,
        "projectCode": "PRJ-54"
    },
    {
        "id": "INV-2023-003",
        "clientName": "Soylent Corp",
        "vendorName": "Marketing Pros",
        "amount": 28400.75,
        "status": "FLAGGED",
        "dateSubmitted": "2023-10-17T09:45:00Z",
        "anomalyScore": 0.92,
        "projectCode": "PRJ-21"
    },
    {
        "id": "INV-2023-004",
        "clientName": "Initech",
        "vendorName": "Office Supplies Co",
        "amount": 150.00,
        "status": "APPROVED",
        "dateSubmitted": "2023-10-18T11:20:00Z",
        "anomalyScore": 0.05,
        "projectCode": "PRJ-06"
    },
    {
        "id": "INV-2023-005",
        "clientName": "Umbrella Corp",
        "vendorName": "Security Systems",
        "amount": 9800.00,
        "status": "PENDING",
        "dateSubmitted": "2023-10-19T16:00:00Z",
        "anomalyScore": 0.45,
        "projectCode": "PRJ-43"
    }
]

INSIGHTS_DATA = {
    "INV-2023-001": [
        {
            "id": "INS-001",
            "invoiceId": "INV-2023-001",
            "category": "Overbilling",
            "description": "Billed for senior engineering hours, but project logs indicate junior staff allocation.",
            "confidenceScore": 0.88,
            "recommendedAction": "Review timesheets for role verification."
        },
        {
            "id": "INS-002",
            "invoiceId": "INV-2023-001",
            "category": "Duplicate Charges",
            "description": "Separate software license fees billed that should be part of the standard retainer.",
            "confidenceScore": 0.95,
            "recommendedAction": "Deny separate software lines; request bundled invoice."
        }
    ],
    "INV-2023-003": [
        {
            "id": "INS-003",
            "invoiceId": "INV-2023-003",
            "category": "Unapproved Expenses",
            "description": "High-cost travel expenses billed without prior travel authorization documented.",
            "confidenceScore": 0.76,
            "recommendedAction": "Request prior authorization and expense receipts."
        }
    ]
}

# Endpoints

@app.get("/api/invoices")
async def get_invoices(statusFilter: Optional[str] = None):
    if statusFilter and statusFilter != "ALL":
        return [inv for inv in INVOICES_DATA if inv["status"] == statusFilter]
    return INVOICES_DATA

@app.get("/api/insights/{invoice_id}")
async def get_insights(invoice_id: str):
    return INSIGHTS_DATA.get(invoice_id, [])

@app.post("/api/invoices/{invoice_id}/action")
async def perform_action(invoice_id: str, payload: ActionRequest):
    invoice = next((inv for inv in INVOICES_DATA if inv["id"] == invoice_id), None)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    updated_status = invoice["status"]
    if payload.action == 'APPROVE':
        updated_status = 'APPROVED'
    elif payload.action == 'REJECT':
        updated_status = 'REJECTED'
    elif payload.action == 'FLAG_FOR_REVIEW':
        updated_status = 'FLAGGED'
    else:
        raise HTTPException(status_code=400, detail="Invalid action")

    # In a real application, update the DB. Here we update the in-memory array.
    invoice["status"] = updated_status

    return {
        "success": True,
        "updatedStatus": updated_status,
        "message": f"Invoice {invoice_id} successfully updated to {updated_status}. Notes: {payload.notes}"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
