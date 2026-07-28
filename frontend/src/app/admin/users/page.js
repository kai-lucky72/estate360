'use client';
import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '@/lib/admin-api';
import { Search, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [toggling, setToggling] = useState(null);
  const pageSize = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, page_size: pageSize };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const res = await adminAPI.getUsers(params);
      const data = res.data;
      setUsers(data.results || data || []);
      setTotal(data.count || (Array.isArray(data) ? data.length : 0));
    } catch {
      setError('Failed to load users');
    }
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleToggleActive = async (id) => {
    setToggling(id);
    try {
      await adminAPI.toggleUserActive(id);
      await fetchUsers();
    } catch {}
    setToggling(null);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Users</h1>
        <form className="admin-filters" onSubmit={handleSearch}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="admin-search-input" style={{ paddingLeft: '2rem' }} placeholder="Search email or username..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="admin-select-filter" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="owner">Owner</option>
            <option value="tenant">Tenant</option>
            <option value="investor">Investor</option>
          </select>
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Username</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Active</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: '2rem' }}><div className="loading-spinner" /></td></tr>
            ) : error ? (
              <tr><td colSpan={8}><div className="admin-error-state">{error}</div></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={8}><div className="admin-empty-state"><h3>No users found</h3></div></td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>#{u.id}</td>
                  <td>{u.email}</td>
                  <td>{u.username}</td>
                  <td><span className={`admin-badge ${u.role === 'admin' ? 'admin-badge-warning' : u.role === 'agent' ? 'admin-badge-info' : 'admin-badge-secondary'}`}>{u.role}</span></td>
                  <td><span className={`admin-badge ${u.is_verified ? 'admin-badge-success' : 'admin-badge-danger'}`}>{u.is_verified ? 'Yes' : 'No'}</span></td>
                  <td><span className={`admin-badge ${u.is_active ? 'admin-badge-success' : 'admin-badge-danger'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.date_joined ? new Date(u.date_joined).toLocaleDateString() : '-'}</td>
                  <td>
                    <button className={`admin-action-btn ${u.is_active ? 'admin-action-btn-danger' : 'admin-action-btn-success'}`} onClick={() => handleToggleActive(u.id)} disabled={toggling === u.id}>
                      {toggling === u.id ? <span className="loading-spinner" style={{ width: 14, height: 14, margin: 0 }} /> : u.is_active ? <><ToggleRight size={14} /> Deactivate</> : <><ToggleLeft size={14} /> Activate</>}
                    </button>
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
