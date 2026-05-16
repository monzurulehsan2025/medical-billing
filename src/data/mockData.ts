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

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * 1. GET /api/invoices
 * Retrieves a list of invoices, optionally filtered by status.
 */
export const fetchInvoices = async (statusFilter?: string): Promise<Invoice[]> => {
  const url = statusFilter && statusFilter !== 'ALL' 
    ? `${API_BASE_URL}/invoices?statusFilter=${statusFilter}`
    : `${API_BASE_URL}/invoices`;
    
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch invoices');
  return response.json();
};

/**
 * 2. GET /api/insights/{invoiceId}
 * Retrieves AI-generated insights for a specific invoice.
 */
export const fetchInsights = async (invoiceId: string): Promise<Insight[]> => {
  const response = await fetch(`${API_BASE_URL}/insights/${invoiceId}`);
  if (!response.ok) throw new Error('Failed to fetch insights');
  return response.json();
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
  const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, notes }),
  });
  
  if (!response.ok) throw new Error('Failed to perform action');
  return response.json();
};
