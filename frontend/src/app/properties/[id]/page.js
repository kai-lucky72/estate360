'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { propertyAPI, bookingAPI, reviewAPI, authAPI, agentAPI } from '@/lib/api';
import { useToast } from '@/components/layout/Toast';
import { MapPin, Bed, Bath, ArrowLeft, Calendar, User, Star, Phone, Mail, Heart, X, CheckCircle, Clock, DollarSign, Maximize2, MessageSquare, Send } from 'lucide-react';
import './property-detail.css';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { addToast } = useToast();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agent, setAgent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Booking form
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  // Contact form
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const isAuth = authAPI.isAuthenticated();

  useEffect(() => {
    async function fetchProperty() {
      try {
        const data = await propertyAPI.getProperty(id);
        setProperty(data);
        if (data.agent || data.owner) {
          try {
            const agentId = data.agent || data.owner;
            if (typeof agentId === 'number') {
              const agentData = await agentAPI.getAgent(agentId);
              setAgent(agentData);
            } else if (typeof agentId === 'object') {
              setAgent(agentId);
            }
          } catch {}
        }
      } catch (err) {
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    }
    async function fetchReviews() {
      try {
        const res = await reviewAPI.getPropertyReviews(id);
        const data = res.data || res;
        setReviews(Array.isArray(data) ? data : (data.results || []));
      } catch {}
    }
    if (id) {
      fetchProperty();
      fetchReviews();
    }
  }, [id]);

  const images = property?.images || (property?.main_image ? [property.main_image] : []);

  const handleBookTour = () => {
    if (!isAuth) {
      router.push('/login?redirect=/properties/' + id);
      return;
    }
    setShowBookingModal(true);
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime) {
      setBookingError('Please select both date and time');
      return;
    }
    setBookingLoading(true);
    setBookingError('');
    try {
      await bookingAPI.createBooking({
        property: parseInt(id),
        scheduled_date: bookingDate,
        scheduled_time: bookingTime,
        notes: bookingNotes,
      });
      setBookingSuccess(true);
      addToast('Tour booked successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Failed to create booking. Please try again.';
      setBookingError(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setReviewLoading(true);
    try {
      await reviewAPI.createReview({
        property: parseInt(id),
        rating: reviewRating,
        comment: reviewText,
      });
      addToast('Review submitted successfully!', 'success');
      setShowReviewModal(false);
      setReviewText('');
      setReviewRating(5);
      const res = await reviewAPI.getPropertyReviews(id);
      const data = res.data || res;
      setReviews(Array.isArray(data) ? data : (data.results || []));
    } catch (err) {
      addToast('Failed to submit review', 'error');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleContactAgent = () => {
    if (!isAuth) {
      router.push('/login?redirect=/properties/' + id);
      return;
    }
    setShowContactModal(true);
  };

  const submitContact = (e) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setContactSent(true);
    addToast('Message sent to agent!', 'success');
    setTimeout(() => {
      setShowContactModal(false);
      setContactSent(false);
      setContactMessage('');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="container detail-loading">
        <div className="skeleton skeleton-text-lg" style={{ width: '200px', margin: '2rem 0' }} />
        <div className="skeleton skeleton-image" style={{ height: '400px' }} />
        <div className="skeleton skeleton-text" style={{ width: '60%' }} />
        <div className="skeleton skeleton-text-sm" />
        <div className="skeleton skeleton-text-sm" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>{error || 'Property not found'}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The property you are looking for does not exist or has been removed.</p>
        <button className="btn btn-primary" onClick={() => router.push('/properties')}>
          <ArrowLeft size={16} /> Back to Properties
        </button>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="property-detail-page fade-in">
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/properties">Properties</Link>
          <span>/</span>
          <span className="current">{property.title}</span>
        </div>

        <div className="property-header">
          <div className="title-section">
            <div className="title-tags">
              <span className="category-tag">{property.category}</span>
              <span className={`status-tag status-${property.status}`}>{property.status}</span>
            </div>
            <h1 className="property-title">{property.title}</h1>
            <div className="property-location-detail">
              <MapPin size={18} /> {property.location}
            </div>
            {reviews.length > 0 && (
              <div className="property-rating-summary">
                <div className="stars">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={16} fill={s <= Math.round(avgRating) ? '#f6ad55' : 'none'} stroke={s <= Math.round(avgRating) ? '#f6ad55' : '#e2e8f0'} />
                  ))}
                </div>
                <span className="rating-text">{avgRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
              </div>
            )}
          </div>
          <div className="price-section">
            <div className="property-price-display">${parseFloat(property.price).toLocaleString()}</div>
            <button
              className={`favorite-btn ${favorited ? 'favorited' : ''}`}
              onClick={() => setFavorited(!favorited)}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={22} fill={favorited ? '#e53e3e' : 'none'} />
            </button>
          </div>
        </div>

        <div className="content-grid">
          <div className="main-content">
            {/* Gallery */}
            <div className="gallery">
              {images.length > 0 ? (
                <div className="gallery-main" style={{ backgroundImage: `url(${images[currentImageIndex]})` }} />
              ) : (
                <div className="gallery-main gallery-empty">
                  <HomeIcon size={64} />
                  <p>No images available</p>
                </div>
              )}
              {images.length > 1 && (
                <div className="gallery-thumbs">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      className={`gallery-thumb ${i === currentImageIndex ? 'active' : ''}`}
                      style={{ backgroundImage: `url(${img})` }}
                      onClick={() => setCurrentImageIndex(i)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Key Features */}
            <div className="detail-section features-grid">
              <div className="feature-item">
                <Maximize2 size={20} />
                <div>
                  <span className="feature-value">{property.size_sqft?.toLocaleString() || 'N/A'}</span>
                  <span className="feature-label">Sq Ft</span>
                </div>
              </div>
              <div className="feature-item">
                <Bed size={20} />
                <div>
                  <span className="feature-value">{property.bedrooms || 'N/A'}</span>
                  <span className="feature-label">Bedrooms</span>
                </div>
              </div>
              <div className="feature-item">
                <Bath size={20} />
                <div>
                  <span className="feature-value">{property.bathrooms || 'N/A'}</span>
                  <span className="feature-label">Bathrooms</span>
                </div>
              </div>
              <div className="feature-item">
                <DollarSign size={20} />
                <div>
                  <span className="feature-value">{property.price_type || 'Sale'}</span>
                  <span className="feature-label">Price Type</span>
                </div>
              </div>
              <div className="feature-item">
                <Calendar size={20} />
                <div>
                  <span className="feature-value">{property.year_built || 'N/A'}</span>
                  <span className="feature-label">Year Built</span>
                </div>
              </div>
              <div className="feature-item">
                <HomeIcon size={20} />
                <div>
                  <span className="feature-value">{property.category}</span>
                  <span className="feature-label">Category</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="detail-section">
              <h2>About This Property</h2>
              <p className="description-text">{property.description || 'No description available for this property.'}</p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="detail-section">
                <h2>Amenities & Features</h2>
                <div className="amenities-grid">
                  {property.amenities.map((amenity, i) => (
                    <div key={i} className="amenity-item">
                      <CheckCircle size={16} color="var(--accent)" />
                      <span>{amenity.name || amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="detail-section">
              <div className="reviews-header">
                <h2>Reviews ({reviews.length})</h2>
                {isAuth && (
                  <button className="btn btn-outline btn-sm" onClick={() => setShowReviewModal(true)}>
                    <Star size={16} /> Write a Review
                  </button>
                )}
              </div>
              {reviews.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <MessageSquare size={36} />
                  <h3>No reviews yet</h3>
                  <p>Be the first to review this property.</p>
                </div>
              ) : (
                <div className="reviews-list">
                  {reviews.map((review, i) => (
                    <div key={review.id || i} className="review-card">
                      <div className="review-header">
                        <div className="review-avatar">
                          {review.user_name?.charAt(0) || review.user?.toString().charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="review-user">{review.user_name || review.user || 'Anonymous'}</div>
                          <div className="review-date">{review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}</div>
                        </div>
                        <div className="review-stars">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={14} fill={s <= (review.rating || 0) ? '#f6ad55' : 'none'} stroke={s <= (review.rating || 0) ? '#f6ad55' : '#e2e8f0'} />
                          ))}
                        </div>
                      </div>
                      <p className="review-text">{review.comment || review.text || ''}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            <div className="action-card sticky-card">
              <h3 className="sidebar-card-title">Interested in this property?</h3>
              <p className="sidebar-card-desc">Schedule a tour or contact the listing agent.</p>

              {agent && (
                <div className="agent-info-card">
                  <div className="agent-avatar-circle">
                    {agent.profile_image ? (
                      <img src={agent.profile_image} alt={agent.user?.first_name || 'Agent'} />
                    ) : (
                      <User size={28} />
                    )}
                  </div>
                  <div className="agent-details">
                    <div className="agent-name-text">
                      {[agent.user?.first_name, agent.user?.last_name].filter(Boolean).join(' ') || agent.user?.username || 'Agent'}
                    </div>
                    <div className="agent-role-text">Listing Agent</div>
                    {agent.phone && <div className="agent-phone"><Phone size={14} /> {agent.phone}</div>}
                    {agent.user?.email && <div className="agent-email"><Mail size={14} /> {agent.user.email}</div>}
                  </div>
                </div>
              )}

              <div className="action-buttons">
                <button className="btn btn-primary full-width" onClick={handleBookTour}>
                  <Calendar size={18} /> Book a Tour
                </button>
                <button className="btn btn-outline full-width" onClick={handleContactAgent}>
                  <MessageSquare size={18} /> Contact Agent
                </button>
              </div>

              <div className="sidebar-meta">
                <div className="sidebar-meta-item">
                  <span>Property ID</span>
                  <span>#{property.id}</span>
                </div>
                {property.created_at && (
                  <div className="sidebar-meta-item">
                    <span>Listed</span>
                    <span>{new Date(property.created_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => { if (!bookingSuccess) setShowBookingModal(false); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{bookingSuccess ? 'Tour Booked!' : 'Book a Tour'}</h2>
              {!bookingSuccess && (
                <button className="modal-close" onClick={() => setShowBookingModal(false)}><X size={20} /></button>
              )}
            </div>
            {bookingSuccess ? (
              <div className="booking-success">
                <CheckCircle size={48} color="var(--accent)" />
                <h3>Your tour has been scheduled!</h3>
                <p>We have sent a confirmation to your email. The agent will contact you to confirm the details.</p>
                <button className="btn btn-primary" onClick={() => setShowBookingModal(false)}>Done</button>
              </div>
            ) : (
              <form onSubmit={submitBooking}>
                {bookingError && <div className="error-message" style={{ marginBottom: '1rem' }}>{bookingError}</div>}
                <div className="input-group">
                  <label className="input-label">Date</label>
                  <input type="date" className="input-field" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Time</label>
                  <input type="time" className="input-field" value={bookingTime} onChange={e => setBookingTime(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Notes (optional)</label>
                  <textarea className="input-field" placeholder="Any special requests or questions..." value={bookingNotes} onChange={e => setBookingNotes(e.target.value)} rows={3} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowBookingModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={bookingLoading}>
                    {bookingLoading ? 'Scheduling...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Write a Review</h2>
              <button className="modal-close" onClick={() => setShowReviewModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={submitReview}>
              <div className="input-group">
                <label className="input-label">Rating</label>
                <div className="review-rating-input">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" className={`rating-star ${s <= reviewRating ? 'active' : ''}`} onClick={() => setReviewRating(s)}>
                      <Star size={28} fill={s <= reviewRating ? '#f6ad55' : 'none'} stroke={s <= reviewRating ? '#f6ad55' : '#e2e8f0'} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Your Review</label>
                <textarea className="input-field" placeholder="Share your experience with this property..." value={reviewText} onChange={e => setReviewText(e.target.value)} rows={4} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowReviewModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={reviewLoading}>
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="modal-overlay" onClick={() => { if (!contactSent) setShowContactModal(false); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{contactSent ? 'Message Sent!' : 'Contact Agent'}</h2>
              {!contactSent && (
                <button className="modal-close" onClick={() => setShowContactModal(false)}><X size={20} /></button>
              )}
            </div>
            {contactSent ? (
              <div className="booking-success">
                <CheckCircle size={48} color="var(--accent)" />
                <h3>Message sent successfully!</h3>
                <p>The agent will get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={submitContact}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Send a message to {agent ? [agent.user?.first_name, agent.user?.last_name].filter(Boolean).join(' ') || 'the agent' : 'the listing agent'} about this property.
                </p>
                <div className="input-group">
                  <label className="input-label">Your Message</label>
                  <textarea className="input-field" placeholder="Hi, I am interested in this property and would like to know more..." value={contactMessage} onChange={e => setContactMessage(e.target.value)} rows={4} required />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowContactModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    <Send size={16} /> Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function HomeIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
