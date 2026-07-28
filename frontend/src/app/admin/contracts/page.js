'use client';
import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '@/lib/admin-api';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const pageSize = 10;

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, page_size: pageSize };
      if (statusFilter) params.status = statusFilter;
      const res = await adminAPI.getContracts(params);
      const data = res.data;
      setContracts(data.results || data || []);
      setTotal(data.count || (Array.isArray(data) ? data.length : 0));
    } catch {
      setError('Failed to load contracts');
    }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => { fetchContracts(); }, [fetchContracts]);

  const totalPages = Math.ceil(total / pageSize);

  const getStatusBadge = (status) => {
    const cls = status === 'active' ? 'admin-badge-success' : status === 'draft' ? 'admin-badge-warning' : status === 'completed' ? 'admin-badge-info' : 'admin-badge-danger';
    return <span className={`admin-badge ${cls}`}>{status}</span>;
  };

  return (
    <div className="fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Contracts</h1>
        <div className="admin-filters">
          <select className="admin-select-filter" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="terminated">Terminated</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Property</th>
              <th>Client</th>
              <th>Start</th>
              <th>End</th>
              <th>Rent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8}><div className="loading-spinner" /></td></tr>
            ) : error ? (
              <tr><td colSpan={8}><div className="admin-error-state">{error}</div></td></tr>
            ) : contracts.length === 0 ? (
              <tr><td colSpan={8}><div className="admin-empty-state"><h3>No contracts found</h3></div></td></tr>
            ) : (
              contracts.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>#{c.id}</td>
                  <td style={{ fontWeight: 500 }}>{c.property_title || `Property #${c.property}`}</td>
                  <td>{c.client_name || `User #${c.client}`}</td>
                  <td style={{ fontSize: '0.8rem' }}>{c.start_date ? new Date(c.start_date).toLocaleDateString() : '-'}</td>
                  <td style={{ fontSize: '0.8rem' }}>{c.end_date ? new Date(c.end_date).toLocaleDateString() : '-'}</td>
                  <td style={{ fontWeight: 600 }}>${Number(c.rent_amount).toLocaleString()}</td>
                  <td>{getStatusBadge(c.status)}</td>
                  <td>
                    <button className="admin-action-btn admin-action-btn-primary" onClick={() => setSelected(c)}><Eye size={14} /> View</button>
                  </td>
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

      {selected && (
        <div className="admin-detail-modal" onClick={() => setSelected(null)}>
          <div className="admin-detail-content" onClick={e => e.stopPropagation()}>
            <div className="admin-detail-header">
              <h2>Contract #{selected.id}</h2>
              <button className="admin-detail-close" onClick={() => setSelected(null)}><Eye size={20} /></button>
            </div>
            <div className="admin-detail-field"><div className="admin-detail-label">Property</div><div className="admin-detail-value">{selected.property_title || `#${selected.property}`}</div></div>
            <div className="admin-detail-field"><div className="admin-detail-label">Client</div><div className="admin-detail-value">{selected.client_name || `#${selected.client}`}</div></div>
            <div className="admin-detail-field"><div className="admin-detail-label">Period</div><div className="admin-detail-value">{selected.start_date ? new Date(selected.start_date).toLocaleDateString() : '-'} &rarr; {selected.end_date ? new Date(selected.end_date).toLocaleDateString() : '-'}</div></div>
            <div className="admin-detail-field"><div className="admin-detail-label">Rent Amount</div><div className="admin-detail-value" style={{ fontWeight: 700, color: 'var(--primary)' }}>${Number(selected.rent_amount).toLocaleString()}</div></div>
            <div className="admin-detail-field"><div className="admin-detail-label">Status</div><div className="admin-detail-value">{getStatusBadge(selected.status)}</div></div>
            <div className="admin-detail-field"><div className="admin-detail-label">Signed</div><div className="admin-detail-value">Client: {selected.client_signed ? 'Yes' : 'No'} | Agent: {selected.agent_signed ? 'Yes' : 'No'}</div></div>
            {selected.terms && <div className="admin-detail-field"><div className="admin-detail-label">Terms</div><div className="admin-detail-value" style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>{selected.terms}</div></div>}
          </div>
        </div>
      )}
    </div>
  );
}
