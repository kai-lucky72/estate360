'use client';
import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '@/lib/admin-api';
import { ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';

export default function AdminStatsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, page_size: pageSize };
      const res = await adminAPI.getStats(params);
      const data = res.data;
      setStats(data.results || data || []);
      setTotal(data.count || (Array.isArray(data) ? data.length : 0));
    } catch {
      setError('Failed to load stats');
    }
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">System Stats</h1>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Users</th>
              <th>Total Properties</th>
              <th>Total Contracts</th>
              <th>Total Payments</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5}><div className="loading-spinner" /></td></tr>
            ) : error ? (
              <tr><td colSpan={5}><div className="admin-error-state">{error}</div></td></tr>
            ) : stats.length === 0 ? (
              <tr><td colSpan={5}>
                <div className="admin-empty-state">
                  <BarChart3 size={36} />
                  <h3>No stats available</h3>
                  <p>Dashboard stats will appear here once collected.</p>
                </div>
              </td></tr>
            ) : (
              stats.map((s, i) => (
                <tr key={s.id || i}>
                  <td style={{ fontWeight: 600 }}>{s.date ? new Date(s.date).toLocaleDateString() : '-'}</td>
                  <td style={{ fontWeight: 500 }}>{s.total_users}</td>
                  <td style={{ fontWeight: 500 }}>{s.total_properties}</td>
                  <td style={{ fontWeight: 500 }}>{s.total_contracts}</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>${Number(s.total_payments).toLocaleString()}</td>
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
