'use client';
import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '@/lib/admin-api';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [verifying, setVerifying] = useState(null);
  const pageSize = 10;

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, page_size: pageSize };
      const res = await adminAPI.getAgents(params);
      const data = res.data;
      setAgents(data.results || data || []);
      setTotal(data.count || (Array.isArray(data) ? data.length : 0));
    } catch {
      setError('Failed to load agents');
    }
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  const handleVerify = async (id) => {
    setVerifying(id);
    try {
      await adminAPI.verifyAgent(id);
      await fetchAgents();
    } catch {}
    setVerifying(null);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Agents</h1>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>License</th>
              <th>Rating</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7}><div className="loading-spinner" /></td></tr>
            ) : error ? (
              <tr><td colSpan={7}><div className="admin-error-state">{error}</div></td></tr>
            ) : agents.length === 0 ? (
              <tr><td colSpan={7}><div className="admin-empty-state"><h3>No agents found</h3></div></td></tr>
            ) : (
              agents.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>#{a.id}</td>
                  <td style={{ fontWeight: 500 }}>{a.user ? `${a.user.first_name || ''} ${a.user.last_name || ''}`.trim() || `Agent #${a.user}` : '-'}</td>
                  <td>{a.user_email || '-'}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{a.license_number || '-'}</td>
                  <td><span className="admin-badge admin-badge-info">{Number(a.rating).toFixed(2)}</span></td>
                  <td><span className={`admin-badge ${a.verified ? 'admin-badge-success' : 'admin-badge-warning'}`}>{a.verified ? 'Verified' : 'Pending'}</span></td>
                  <td>
                    {!a.verified && (
                      <button className="admin-action-btn admin-action-btn-success" onClick={() => handleVerify(a.id)} disabled={verifying === a.id}>
                        {verifying === a.id ? <span className="loading-spinner" style={{ width: 14, height: 14, margin: 0 }} /> : <><CheckCircle size={14} /> Verify</>}
                      </button>
                    )}
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
