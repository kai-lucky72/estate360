'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { bookingAPI } from '@/lib/api';
import { useToast } from '@/components/layout/Toast';
import { CalendarCheck, X, MapPin, Calendar, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function BookingsPage() {
  const { addToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getMyBookings();
      const data = res.data || res;
      const list = Array.isArray(data) ? data : (data.results || []);
      setBookings(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    setCancelling(true);
    try {
      await bookingAPI.cancelBooking(id);
      addToast('Booking cancelled successfully', 'success');
      setCancelConfirm(null);
      fetchBookings();
    } catch (err) {
      addToast('Failed to cancel booking', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: 'badge-warning',
      confirmed: 'badge-primary',
      completed: 'badge-success',
      cancelled: 'badge-error',
    };
    return map[status] || 'badge-warning';
  };

  return (
    <div className="fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Bookings</h1>
          <p className="dashboard-subtitle">Manage your property tour bookings and appointments.</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : bookings.length === 0 ? (
        <div className="dashboard-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <CalendarCheck size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No bookings yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Browse properties and book a tour to get started.</p>
          <Link href="/properties" className="btn btn-primary">Browse Properties</Link>
        </div>
      ) : (
        <div className="dashboard-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="dashboard-list-item">
              <div className="dashboard-list-icon">
                <CalendarCheck size={24} />
              </div>
              <div className="dashboard-list-info">
                <div className="dashboard-list-title">
                  Property #{booking.property}
                  {typeof booking.property === 'object' && booking.property.title && (
                    <span> - {booking.property.title}</span>
                  )}
                </div>
                <div className="dashboard-list-meta">
                  {booking.scheduled_date && (
                    <span><Calendar size={14} /> {new Date(booking.scheduled_date).toLocaleDateString()}</span>
                  )}
                  {booking.scheduled_time && (
                    <span><Clock size={14} /> {booking.scheduled_time}</span>
                  )}
                  <span className={`badge ${getStatusBadge(booking.status)}`}>
                    {booking.status || 'pending'}
                  </span>
                </div>
                {booking.notes && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {booking.notes}
                  </p>
                )}
              </div>
              <div className="dashboard-list-actions">
                {booking.status === 'pending' || booking.status === 'confirmed' ? (
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--error)' }}
                    onClick={() => setCancelConfirm(booking.id)}
                  >
                    <XCircle size={16} /> Cancel
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation */}
      {cancelConfirm && (
        <div className="modal-overlay" onClick={() => setCancelConfirm(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>Cancel Booking</h2>
              <button className="modal-close" onClick={() => setCancelConfirm(null)}><X size={20} /></button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Are you sure you want to cancel this booking? You can always book another tour later.
            </p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setCancelConfirm(null)}>Keep Booking</button>
              <button className="btn btn-danger" onClick={() => handleCancel(cancelConfirm)} disabled={cancelling}>
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
