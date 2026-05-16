import React, { useState, useEffect } from 'react';
import { fetchInvoices, fetchInsights, performActionOnInvoice } from './data/mockData';
import type { Invoice, Insight } from './data/mockData';
import { ShieldAlert, CheckCircle, XCircle, FileSearch, Activity, BrainCircuit } from 'lucide-react';
import './index.css';

function App() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState<boolean>(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    const data = await fetchInvoices();
    setInvoices(data);
    setLoading(false);
  };

  const handleSelectInvoice = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setLoadingInsights(true);
    const data = await fetchInsights(invoice.id);
    setInsights(data);
    setLoadingInsights(false);
  };

  const handleAction = async (action: 'APPROVE' | 'REJECT') => {
    if (!selectedInvoice) return;
    
    setLoadingInsights(true);
    await performActionOnInvoice(selectedInvoice.id, action, `Action ${action} taken by AI Manager.`);
    
    // Refresh invoices
    await loadInvoices();
    setSelectedInvoice(null);
    setInsights([]);
    setLoadingInsights(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div>
          <h1>Financial Analytics Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Administrative Operations Partner</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(79, 70, 229, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(79, 70, 229, 0.3)' }}>
          <BrainCircuit size={20} color="#818cf8" />
          <span style={{ fontWeight: 600, color: '#818cf8' }}>Risk Models Active</span>
        </div>
      </header>

      <main className="dashboard-grid">
        {/* Left Panel: Invoice List */}
        <section className="glass-panel">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={24} />
            Recent Invoices
          </h2>
          
          {loading ? (
            <div className="loader"></div>
          ) : (
            <div className="invoice-list">
              {invoices.map(invoice => (
                <div 
                  key={invoice.id} 
                  className={`invoice-card ${selectedInvoice?.id === invoice.id ? 'active' : ''}`}
                  onClick={() => handleSelectInvoice(invoice)}
                >
                  <div className="invoice-header">
                    <span className="invoice-id">{invoice.id}</span>
                    <span className="invoice-meta">{invoice.vendorName} • {new Date(invoice.dateSubmitted).toLocaleDateString()}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="invoice-amount">{formatCurrency(invoice.amount)}</div>
                    <span className={`badge ${invoice.status.toLowerCase()}`}>{invoice.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right Panel: Invoice Details & Insights */}
        <section className="glass-panel" style={{ minHeight: '600px' }}>
          {!selectedInvoice ? (
            <div className="empty-state">
              <FileSearch size={48} />
              <h3>Select an invoice</h3>
              <p>Choose an invoice from the list to view risk insights and details.</p>
            </div>
          ) : (
            <div className="detail-view">
              <div className="detail-header">
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{selectedInvoice.id}</h2>
                  <span className={`badge ${selectedInvoice.status.toLowerCase()}`}>{selectedInvoice.status}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>
                    {formatCurrency(selectedInvoice.amount)}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Billed</div>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Client</span>
                  <span className="info-value">{selectedInvoice.clientName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Vendor</span>
                  <span className="info-value">{selectedInvoice.vendorName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Project Code</span>
                  <span className="info-value">{selectedInvoice.projectCode}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Anomaly Score</span>
                  <span className="info-value" style={{ color: selectedInvoice.anomalyScore > 0.7 ? 'var(--danger)' : 'var(--success)' }}>
                    {(selectedInvoice.anomalyScore * 100).toFixed(0)} / 100
                  </span>
                </div>
              </div>

              <div className="insights-container">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <ShieldAlert size={20} color="#FCA5A5" />
                  Risk Insights
                </h3>
                
                {loadingInsights ? (
                  <div className="loader"></div>
                ) : insights.length > 0 ? (
                  insights.map(insight => (
                    <div key={insight.id} className="insight-card">
                      <div className="insight-header">
                        <span className="insight-category">{insight.category}</span>
                        <span className="insight-confidence">Confidence: {(insight.confidenceScore * 100).toFixed(0)}%</span>
                      </div>
                      <p className="insight-description">{insight.description}</p>
                      <p className="insight-action">Recommendation: {insight.recommendedAction}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No anomalies detected by risk models.</p>
                )}
              </div>

              <div className="action-buttons">
                <button 
                  className="btn btn-reject"
                  onClick={() => handleAction('REJECT')}
                  disabled={loadingInsights}
                >
                  <XCircle size={18} />
                  Reject Invoice
                </button>
                <button 
                  className="btn btn-approve"
                  onClick={() => handleAction('APPROVE')}
                  disabled={loadingInsights}
                >
                  <CheckCircle size={18} />
                  Approve Invoice
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
