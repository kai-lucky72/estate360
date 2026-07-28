'use client';
import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '@/lib/admin-api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [methodFilter, setMethodFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, page_size: pageSize };
      if (methodFilter) params.method = methodFilter;
      if (typeFilter) params.type = typeFilter;
      const res = await adminAPI.getPayments(params);
      const data = res.data;
      setPayments(data.results || data || []);
      setTotal(data.count || (Array.isArray(data) ? data.length : 0));
    } catch {
      setError('Failed to load payments');
    }
    setLoading(false);
  }, [page, methodFilter, typeFilter]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Payments</h1>
        <div className="admin-filters">
          <select className="admin-select-filter" value={methodFilter} onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}>
            <option value="">All Methods</option>
            <option value="cash">Cash</option>
            <option value="bank">Bank Transfer</option>
            <option value="mobile">Mobile Money</option>
            <option value="card">Credit/Debit Card</option>
          </select>
          <select className="admin-select-filter" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
            <option value="">All Types</option>
            <option value="rent">Rent</option>
            <option value="investment">Investment</option>
            <option value="contract">Contract Fee</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Payer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Type</th>
              <th>Date</th>
              <th>Verified</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8}><div className="loading-spinner" /></td></tr>
            ) : error ? (
              <tr><td colSpan={8}><div className="admin-error-state">{error}</div></td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={8}><div className="admin-empty-state"><h3>No payments found</h3></div></td></tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>#{p.id}</td>
                  <td>{p.payer_name || `User #${p.payer}`}</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>${Number(p.amount).toLocaleString()}</td>
                  <td><span className="admin-badge admin-badge-secondary">{p.payment_method}</span></td>
                  <td><span className="admin-badge admin-badge-info">{p.payment_type}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.date ? new Date(p.date).toLocaleDateString() : '-'}</td>
                  <td><span className={`admin-badge ${p.verified ? 'admin-badge-success' : 'admin-badge-warning'}`}>{p.verified ? 'Yes' : 'No'}</span></td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{p.reference || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="admin-pagination">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={16} /></button>
            <span className="admin-pagination-info">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={16} /></button>
          </div>
        )}
      </div>
    </div>
  );
}
