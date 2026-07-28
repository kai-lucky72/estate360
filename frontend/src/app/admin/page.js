'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/admin-api';
import { Users, Building, CalendarCheck, DollarSign, FileSpreadsheet, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [summaryRes, logsRes] = await Promise.all([
        adminAPI.getSummary(),
        adminAPI.getLogs({ page: 1, page_size: 10 }),
      ]);
      setSummary(summaryRes.data);
      setLogs(logsRes.data?.results || logsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="fade-in">
        <div className="admin-page-header"><h1 className="admin-page-title">Dashboard</h1></div>
        <div className="admin-summary-grid">{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '100px' }} />)}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fade-in">
        <div className="admin-page-header"><h1 className="admin-page-title">Dashboard</h1></div>
        <div className="admin-error-state">{error}</div>
      </div>
    );
  }

  const metrics = [
    { icon: Users, label: 'Total Users', value: summary?.total_users ?? 0, color: '#1a73e8', bg: '#e8f0fe' },
    { icon: Building, label: 'Properties', value: summary?.total_properties ?? 0, color: '#38a169', bg: '#f0fff4' },
    { icon: CalendarCheck, label: 'Bookings', value: summary?.total_bookings ?? 0, color: '#dd6b20', bg: '#fffaf0' },
    { icon: DollarSign, label: 'Revenue', value: `$${Number(summary?.total_revenue ?? 0).toLocaleString()}`, color: '#7c3aed', bg: '#f5f3ff' },
  ];

  return (
    <div className="fade-in">
      <div className="admin-page-header"><h1 className="admin-page-title">Admin Dashboard</h1></div>

      <div className="admin-summary-grid">
        {metrics.map((m, i) => (
          <div key={i} className="admin-summary-card">
            <div className="admin-summary-icon" style={{ background: m.bg, color: m.color }}><m.icon size={24} /></div>
            <div className="admin-summary-content"><h3>{m.label}</h3><p>{m.value}</p></div>
          </div>
        ))}
      </div>

      <div className="admin-two-col">
        <div className="admin-panel">
          <div className="admin-panel-header"><h3>Recent Activity</h3><FileSpreadsheet size={18} style={{ color: 'var(--text-muted)' }} /></div>
          <div className="admin-panel-body">
            {logs.length === 0 ? (
              <div className="admin-empty-state"><FileSpreadsheet size={36} /><h3>No recent activity</h3><p>System logs will appear here.</p></div>
            ) : (
              logs.map((log, i) => (
                <div key={log.id || i} className="admin-activity-item">
                  <div className="admin-activity-dot info" />
                  <div className="admin-activity-content">
                    <p className="admin-activity-action">{log.action}</p>
                    <span className="admin-activity-meta">{log.actor_name || 'System'} &middot; {log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header"><h3>Quick Links</h3></div>
          <div className="admin-panel-body">
            <div className="quick-actions">
              <Link href="/admin/users" className="quick-action-card"><Users size={24} /><span>Manage Users</span><ArrowRight size={16} /></Link>
              <Link href="/admin/properties" className="quick-action-card"><Building size={24} /><span>Manage Properties</span><ArrowRight size={16} /></Link>
              <Link href="/admin/bookings" className="quick-action-card"><CalendarCheck size={24} /><span>Manage Bookings</span><ArrowRight size={16} /></Link>
              <Link href="/admin/agents" className="quick-action-card"><Users size={24} /><span>Manage Agents</span><ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
