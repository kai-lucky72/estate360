'use client';
import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '@/lib/admin-api';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState(null);
  const pageSize = 10;

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, page_size: pageSize };
      if (statusFilter) params.status = statusFilter;
      const res = await adminAPI.getBookings(params);
      const data = res.data;
      setBookings(data.results || data || []);
      setTotal(data.count || (Array.isArray(data) ? data.length : 0));
    } catch {
      setError('Failed to load bookings');
    }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await adminAPI.approveBooking(id);
      await fetchBookings();
    } catch {}
    setActionLoading(null);
  };

  const handleCancel = async (id) => {
    setActionLoading(id);
    try {
      await adminAPI.updateUser(id, { status: 'cancelled' });
      await fetchBookings();
    } catch {}
    setActionLoading(null);
  };

  const totalPages = Math.ceil(total / pageSize);

  const getStatusBadge = (status) => {
    const cls = status === 'approved' ? 'admin-badge-success' : status === 'pending' ? 'admin-badge-warning' : status === 'cancelled' || status === 'rejected' ? 'admin-badge-danger' : 'admin-badge-info';
    return <span className={`admin-badge ${cls}`}>{status}</span>;
  };

  return (
    <div className="fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Bookings</h1>
        <div className="admin-filters">
          <select className="admin-select-filter" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
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
              <th>Date</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7}><div className="loading-spinner" /></td></tr>
            ) : error ? (
              <tr><td colSpan={7}><div className="admin-error-state">{error}</div></td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={7}><div className="admin-empty-state"><h3>No bookings found</h3></div></td></tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>#{b.id}</td>
                  <td style={{ fontWeight: 500 }}>{b.property_title || `Property #${b.property}`}</td>
                  <td>{b.client_name || `User #${b.client}`}</td>
                  <td style={{ fontSize: '0.85rem' }}>{b.scheduled_date ? new Date(b.scheduled_date).toLocaleDateString() : '-'}</td>
                  <td>{getStatusBadge(b.status)}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.created_at ? new Date(b.created_at).toLocaleDateString() : '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {b.status === 'pending' && (
                        <>
                          <button className="admin-action-btn admin-action-btn-success" onClick={() => handleApprove(b.id)} disabled={actionLoading === b.id}><CheckCircle size={14} /> Approve</button>
                          <button className="admin-action-btn admin-action-btn-danger" onClick={() => handleCancel(b.id)} disabled={actionLoading === b.id}><XCircle size={14} /> Cancel</button>
                        </>
                      )}
                    </div>
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
    </div>
  );
}
