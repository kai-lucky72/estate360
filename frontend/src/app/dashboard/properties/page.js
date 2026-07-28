'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { propertyAPI } from '@/lib/api';
import { useToast } from '@/components/layout/Toast';
import { Building2, Plus, Edit2, Trash2, X, MapPin, DollarSign, Home } from 'lucide-react';

export default function MyPropertiesPage() {
  const { addToast } = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: '', description: '', price: '', location: '', category: 'apartment',
    status: 'available', bedrooms: '', bathrooms: '', size_sqft: ''
  });

  const fetchProperties = async () => {
    try {
      const data = await propertyAPI.getProperties();
      setProperties(Array.isArray(data) ? data : (data.results || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await propertyAPI.createProperty({
        ...form,
        price: parseFloat(form.price),
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
        size_sqft: form.size_sqft ? parseFloat(form.size_sqft) : null,
      });
      addToast('Property listed successfully!', 'success');
      setShowAddModal(false);
      setForm({ title: '', description: '', price: '', location: '', category: 'apartment', status: 'available', bedrooms: '', bathrooms: '', size_sqft: '' });
      fetchProperties();
    } catch (err) {
      addToast(err.response?.data?.detail || 'Failed to create property', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await propertyAPI.deleteProperty(id);
      addToast('Property deleted successfully', 'success');
      setShowDeleteConfirm(null);
      fetchProperties();
    } catch (err) {
      addToast('Failed to delete property', 'error');
    }
  };

  return (
    <div className="fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Properties</h1>
          <p className="dashboard-subtitle">Manage your real estate portfolio.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add Property
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : properties.length === 0 ? (
        <div className="dashboard-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Building2 size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No properties found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You haven&apos;t listed any properties yet.</p>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Add Your First Property
          </button>
        </div>
      ) : (
        <div className="dashboard-list">
          {properties.map((prop) => (
            <div key={prop.id} className="dashboard-list-item">
              <div className="dashboard-list-thumb">
                {prop.main_image ? (
                  <img src={prop.main_image} alt={prop.title} />
                ) : (
                  <Home size={24} />
                )}
              </div>
              <div className="dashboard-list-info">
                <Link href={`/properties/${prop.id}`} className="dashboard-list-title">{prop.title}</Link>
                <div className="dashboard-list-meta">
                  <span><MapPin size={14} /> {prop.location}</span>
                  <span><DollarSign size={14} /> ${parseFloat(prop.price).toLocaleString()}</span>
                  <span className={`badge badge-${prop.status === 'available' ? 'success' : 'warning'}`}>{prop.status}</span>
                </div>
              </div>
              <div className="dashboard-list-actions">
                <button className="btn btn-outline btn-sm" title="Edit">
                  <Edit2 size={16} />
                </button>
                <button className="btn btn-outline btn-sm" style={{ color: 'var(--error)' }} title="Delete" onClick={() => setShowDeleteConfirm(prop.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>Add New Property</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="input-group">
                <label className="input-label" htmlFor="title">Title</label>
                <input id="title" type="text" className="input-field" placeholder="e.g. Modern Downtown Apartment" value={form.title} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="description">Description</label>
                <textarea id="description" className="input-field" placeholder="Describe the property..." value={form.description} onChange={handleChange} rows={3} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="price">Price ($)</label>
                  <input id="price" type="number" className="input-field" placeholder="e.g. 500000" value={form.price} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="location">Location</label>
                  <input id="location" type="text" className="input-field" placeholder="e.g. New York, NY" value={form.location} onChange={handleChange} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="category">Category</label>
                  <select id="category" className="input-field" value={form.category} onChange={handleChange}>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="office">Office</option>
                    <option value="land">Land</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="status">Status</label>
                  <select id="status" className="input-field" value={form.status} onChange={handleChange}>
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="bedrooms">Bedrooms</label>
                  <input id="bedrooms" type="number" className="input-field" placeholder="3" value={form.bedrooms} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="bathrooms">Bathrooms</label>
                  <input id="bathrooms" type="number" className="input-field" placeholder="2" value={form.bathrooms} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="size_sqft">Size (sqft)</label>
                  <input id="size_sqft" type="number" className="input-field" placeholder="2000" value={form.size_sqft} onChange={handleChange} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Creating...' : 'Create Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>Delete Property</h2>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(null)}><X size={20} /></button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(showDeleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
