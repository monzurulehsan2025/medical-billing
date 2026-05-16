# Financial Analytics Dashboard

This repository contains the source code for a Financial Analytics Dashboard designed to act as an Administrative Operations Partner. The application verifies B2B invoices and provides AI-driven risk insights (such as overbilling or duplicate charges) to operators.

## Project Structure

- **Frontend**: A modern React application built with TypeScript and Vite. It features a sleek glassmorphism UI.
- **Backend**: A robust RESTful API built with Python and FastAPI to serve invoice data and risk insights.

## RESTful API Documentation

Below is the documentation for the core API endpoints that power the dashboard.

### 1. List Invoices
Retrieves a list of all invoices in the system. Can be optionally filtered by status.

**Endpoint:** `GET /api/invoices`

**Query Parameters:**
- `statusFilter` (optional): Filter invoices by status (e.g., `PENDING`, `APPROVED`, `REJECTED`, `FLAGGED`).

**Sample Request:**
```http
GET /api/invoices?statusFilter=FLAGGED HTTP/1.1
Host: localhost:8000
```

**Sample Response (200 OK):**
```json
[
  {
    "id": "INV-2023-001",
    "clientName": "Acme Corporation",
    "vendorName": "Tech Solutions Inc",
    "amount": 14500.00,
    "status": "FLAGGED",
    "dateSubmitted": "2023-10-15T08:30:00Z",
    "anomalyScore": 0.85,
    "projectCode": "PRJ-90"
  }
]
```

---

### 2. Get Invoice Insights
Retrieves AI-generated risk insights for a specific invoice to help operators make informed decisions.

**Endpoint:** `GET /api/insights/{invoice_id}`

**Sample Request:**
```http
GET /api/insights/INV-2023-001 HTTP/1.1
Host: localhost:8000
```

**Sample Response (200 OK):**
```json
[
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
]
```

---

### 3. Take Action on Invoice
Updates the status of an invoice based on an operator's decision.

**Endpoint:** `POST /api/invoices/{invoice_id}/action`

**Sample Request:**
```http
POST /api/invoices/INV-2023-001/action HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "action": "APPROVE",
  "notes": "Reviewed timesheets, charges are valid."
}
```

**Sample Response (200 OK):**
```json
{
  "success": true,
  "updatedStatus": "APPROVED",
  "message": "Invoice INV-2023-001 successfully updated to APPROVED. Notes: Reviewed timesheets, charges are valid."
}
```

## Running the Application Locally

### Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```bash
   python main.py
   ```
   *The API will run on `http://localhost:8000`*

### Running the Frontend
1. In a separate terminal, navigate to the project root.
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   *The application will run on `http://localhost:5173`*
