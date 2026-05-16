export interface Invoice {
  id: string;
  clientName: string;
  vendorName: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
  dateSubmitted: string;
  anomalyScore: number;
  projectCode: string;
}

export interface Insight {
  id: string;
  invoiceId: string;
  category: string;
  description: string;
  confidenceScore: number;
  recommendedAction: string;
}

export interface ActionResponse {
  success: boolean;
  updatedStatus: string;
  message: string;
}

// FAKE DATA STORAGE

export const invoicesData: Invoice[] = [
  {
    id: "INV-2023-001",
    clientName: "Acme Corporation",
    vendorName: "Tech Solutions Inc",
    amount: 14500.00,
    status: "FLAGGED",
    dateSubmitted: "2023-10-15T08:30:00Z",
    anomalyScore: 0.85,
    projectCode: "PRJ-90"
  },
  {
    id: "INV-2023-002",
    clientName: "Globex Industries",
    vendorName: "Cloud Services LLC",
    amount: 3200.50,
    status: "PENDING",
    dateSubmitted: "2023-10-16T14:15:00Z",
    anomalyScore: 0.12,
    projectCode: "PRJ-54"
  },
  {
    id: "INV-2023-003",
    clientName: "Soylent Corp",
    vendorName: "Marketing Pros",
    amount: 28400.75,
    status: "FLAGGED",
    dateSubmitted: "2023-10-17T09:45:00Z",
    anomalyScore: 0.92,
    projectCode: "PRJ-21"
  },
  {
    id: "INV-2023-004",
    clientName: "Initech",
    vendorName: "Office Supplies Co",
    amount: 150.00,
    status: "APPROVED",
    dateSubmitted: "2023-10-18T11:20:00Z",
    anomalyScore: 0.05,
    projectCode: "PRJ-06"
  },
  {
    id: "INV-2023-005",
    clientName: "Umbrella Corp",
    vendorName: "Security Systems",
    amount: 9800.00,
    status: "PENDING",
    dateSubmitted: "2023-10-19T16:00:00Z",
    anomalyScore: 0.45,
    projectCode: "PRJ-43"
  }
];

export const insightsData: Record<string, Insight[]> = {
  "INV-2023-001": [
    {
      id: "INS-001",
      invoiceId: "INV-2023-001",
      category: "Overbilling",
      description: "Billed for senior engineering hours, but project logs indicate junior staff allocation.",
      confidenceScore: 0.88,
      recommendedAction: "Review timesheets for role verification."
    },
    {
      id: "INS-002",
      invoiceId: "INV-2023-001",
      category: "Duplicate Charges",
      description: "Separate software license fees billed that should be part of the standard retainer.",
      confidenceScore: 0.95,
      recommendedAction: "Deny separate software lines; request bundled invoice."
    }
  ],
  "INV-2023-003": [
    {
      id: "INS-003",
      invoiceId: "INV-2023-003",
      category: "Unapproved Expenses",
      description: "High-cost travel expenses billed without prior travel authorization documented.",
      confidenceScore: 0.76,
      recommendedAction: "Request prior authorization and expense receipts."
    }
  ]
};

// SAMPLE API DEFINITIONS (Mocked using Promises to simulate network delay)

/**
 * 1. GET /api/invoices
 * Retrieves a list of invoices, optionally filtered by status.
 */
export const fetchInvoices = async (statusFilter?: string): Promise<Invoice[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (statusFilter && statusFilter !== 'ALL') {
        resolve(invoicesData.filter(i => i.status === statusFilter));
      } else {
        resolve(invoicesData);
      }
    }, 600);
  });
};

/**
 * 2. GET /api/insights/{invoiceId}
 * Retrieves AI-generated insights for a specific invoice.
 */
export const fetchInsights = async (invoiceId: string): Promise<Insight[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(insightsData[invoiceId] || []);
    }, 500);
  });
};

/**
 * 3. POST /api/invoices/{invoiceId}/action
 * Takes an action on an invoice (approve, reject, flag).
 */
export const performActionOnInvoice = async (
  invoiceId: string, 
  action: 'APPROVE' | 'REJECT' | 'FLAG_FOR_REVIEW',
  notes: string
): Promise<ActionResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const invoice = invoicesData.find(i => i.id === invoiceId);
      if (!invoice) {
        reject(new Error("Invoice not found"));
        return;
      }
      
      let updatedStatus = invoice.status;
      if (action === 'APPROVE') updatedStatus = 'APPROVED';
      else if (action === 'REJECT') updatedStatus = 'REJECTED';
      else if (action === 'FLAG_FOR_REVIEW') updatedStatus = 'FLAGGED';

      invoice.status = updatedStatus as any;

      resolve({
        success: true,
        updatedStatus,
        message: `Invoice ${invoiceId} successfully updated to ${updatedStatus}. Notes: ${notes}`
      });
    }, 800);
  });
};
