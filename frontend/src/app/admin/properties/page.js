'use client';
import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '@/lib/admin-api';
import { Search, Edit3, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, page_size: pageSize };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      const res = await adminAPI.getProperties(params);
      const data = res.data;
      setProperties(data.results || data || []);
      setTotal(data.count || (Array.isArray(data) ? data.length : 0));
    } catch {
      setError('Failed to load properties');
    }
    setLoading(false);
  }, [page, search, statusFilter, categoryFilter]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this property?')) return;
    try {
      await adminAPI.deleteProperty(id);
      await fetchProperties();
    } catch {}
  };

  const totalPages = Math.ceil(total / pageSize);

  const getStatusBadge = (status) => {
    const cls = status === 'available' ? 'admin-badge-success' : status === 'booked' ? 'admin-badge-warning' : status === 'sold' ? 'admin-badge-danger' : 'admin-badge-info';
    return <span className={`admin-badge ${cls}`}>{status}</span>;
  };

  return (
    <div className="fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Properties</h1>
        <form className="admin-filters" onSubmit={handleSearch}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="admin-search-input" style={{ paddingLeft: '2rem' }} placeholder="Search title or location..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="admin-select-filter" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="rented">Rented</option>
            <option value="sold">Sold</option>
          </select>
          <select className="admin-select-filter" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="land">Land</option>
            <option value="office">Office</option>
          </select>
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8}><div className="loading-spinner" /></td></tr>
            ) : error ? (
              <tr><td colSpan={8}><div className="admin-error-state">{error}</div></td></tr>
            ) : properties.length === 0 ? (
              <tr><td colSpan={8}><div className="admin-empty-state"><h3>No properties found</h3></div></td></tr>
            ) : (
              properties.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>#{p.id}</td>
                  <td style={{ fontWeight: 500 }}>{p.title}</td>
                  <td><span className="admin-badge admin-badge-secondary">{p.category}</span></td>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>${Number(p.price).toLocaleString()}</td>
                  <td>{getStatusBadge(p.status)}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.owner_email || `User #${p.owner}`}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.date_added ? new Date(p.date_added).toLocaleDateString() : '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button className="admin-action-btn admin-action-btn-primary" title="Edit"><Edit3 size={14} /></button>
                      <button className="admin-action-btn admin-action-btn-danger" title="Delete" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
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
