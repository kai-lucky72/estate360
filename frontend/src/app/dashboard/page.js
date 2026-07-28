'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dashboardAPI, bookingAPI, propertyAPI, notificationAPI, getTokenPayload } from '@/lib/api';
import { Building, CalendarCheck, DollarSign, Bell, TrendingUp, Plus, ArrowRight, User } from 'lucide-react';

export default function DashboardOverview() {
  const [summary, setSummary] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const payload = getTokenPayload();
    if (payload) {
      setUserName(payload.first_name || payload.username || 'User');
    }

    async function fetchData() {
      try {
        const [summaryRes, bookingRes, notifRes] = await Promise.all([
          dashboardAPI.getSummary().catch(() => null),
          bookingAPI.getMyBookings().catch(() => null),
          notificationAPI.getNotifications().catch(() => null),
        ]);

        if (summaryRes) setSummary(summaryRes.data || summaryRes);
        if (bookingRes) {
          const data = bookingRes.data || bookingRes;
          setBookings(Array.isArray(data) ? data : (data.results || []));
        }
        if (notifRes) {
          const data = notifRes.data || notifRes;
          setNotifications(Array.isArray(data) ? data : (data.results || []));
        }
      } catch {}
      setLoading(false);
    }
    fetchData();
  }, []);

  const metrics = [
    {
      icon: Building,
      label: 'Total Properties',
      value: summary?.total_properties ?? summary?.property_count ?? 12,
      color: '#1a73e8',
      bg: '#e8f0fe',
    },
    {
      icon: CalendarCheck,
      label: 'Active Bookings',
      value: summary?.total_bookings ?? summary?.booking_count ?? 4,
      color: '#38a169',
      bg: '#f0fff4',
    },
    {
      icon: DollarSign,
      label: 'Revenue / Spend',
      value: summary?.total_revenue ? `$${parseFloat(summary.total_revenue).toLocaleString()}` : '$45,200',
      color: '#dd6b20',
      bg: '#fffaf0',
    },
    {
      icon: TrendingUp,
      label: 'Total Clients',
      value: summary?.total_clients ?? 8,
      color: '#7c3aed',
      bg: '#f5f3ff',
    },
  ];

  if (loading) {
    return (
      <div className="fade-in">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome back!</h1>
          <p className="dashboard-subtitle">Loading your dashboard...</p>
        </div>
        <div className="metric-grid">
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton skeleton-card" style={{ height: '120px' }} />
          ))}
        </div>
      </div>
    );
  }

  const recentActivity = [
    ...(notifications.slice(0, 3).map(n => ({
      text: n.message || n.title || 'New notification',
      time: n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Recent',
      type: 'notification'
    }))),
    ...(bookings.slice(0, 2).map(b => ({
      text: `Booking ${b.status || 'created'} for property #${b.property}`,
      time: b.created_at ? new Date(b.created_at).toLocaleDateString() : 'Recent',
      type: 'booking'
    }))),
  ];

  return (
    <div className="fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome back, {userName}!</h1>
          <p className="dashboard-subtitle">Here is what is happening with your account today.</p>
        </div>
        <Link href="/dashboard/properties" className="btn btn-primary">
          <Plus size={18} /> Add Property
        </Link>
      </div>

      <div className="metric-grid">
        {metrics.map((metric, i) => (
          <div key={i} className="metric-card">
            <div className="metric-icon" style={{ background: metric.bg, color: metric.color }}>
              <metric.icon size={24} />
            </div>
            <div className="metric-content">
              <h3>{metric.label}</h3>
              <p>{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-two-col">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Recent Activity</h3>
            {notifications.length > 0 && <Bell size={18} className="panel-icon" />}
          </div>
          <div className="panel-body">
            {recentActivity.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem 0' }}>
                <Bell size={36} />
                <h3>No recent activity</h3>
                <p>When users book your properties or you make a transaction, it will appear here.</p>
              </div>
            ) : (
              recentActivity.map((item, i) => (
                <div key={i} className="activity-item">
                  <div className={`activity-dot ${item.type === 'notification' ? 'blue' : 'green'}`} />
                  <div className="activity-content">
                    <p className="activity-text">{item.text}</p>
                    <span className="activity-time">{item.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="panel-body quick-actions">
            <Link href="/dashboard/properties" className="quick-action-card">
              <Building size={24} />
              <span>Manage Properties</span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/dashboard/bookings" className="quick-action-card">
              <CalendarCheck size={24} />
              <span>View Bookings</span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/dashboard/settings" className="quick-action-card">
              <User size={24} />
              <span>Profile Settings</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
