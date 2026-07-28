'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { agentAPI, propertyAPI } from '@/lib/api';
import { Phone, Mail, Star, Building2, Users, ShieldCheck, Award, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import './agents.css';

const ITEMS_PER_PAGE = 5;

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const [agentData, propData] = await Promise.all([
          agentAPI.getAgents(),
          propertyAPI.getProperties(),
        ]);
        setAgents(Array.isArray(agentData) ? agentData : (agentData.results || []));
        setProperties(Array.isArray(propData) ? propData : (propData.results || []));
      } catch (err) {
        console.error(err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalAgents = agents.length;
  const totalProperties = properties.length;
  const verifiedAgents = agents.filter(a => a.verified).length;
  const avgRating = agents.length > 0
    ? (agents.reduce((sum, a) => sum + parseFloat(a.rating || 0), 0) / agents.length).toFixed(1)
    : '0.0';

  const totalPages = Math.ceil(agents.length / ITEMS_PER_PAGE);
  const paginatedAgents = agents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="agents-page fade-in">
      <section className="agents-hero">
        <div className="container">
          <h1 className="agents-title">Meet Our Expert Agents</h1>
          <p className="agents-subtitle">
            Our team of certified real estate professionals is dedicated to finding you the perfect property.
            With decades of combined experience, we handle everything from luxury villas to commercial investments.
          </p>
        </div>
      </section>

      <section className="agents-stats">
        <div className="container agents-stats-grid">
          <div className="stat-item">
            <span className="stat-number">{loading ? '—' : totalAgents}</span>
            <span className="stat-label">Expert Agents</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{loading ? '—' : totalProperties}</span>
            <span className="stat-label">Listed Properties</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{loading ? '—' : verifiedAgents}</span>
            <span className="stat-label">Verified Agents</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{loading ? '—' : `${avgRating} ★`}</span>
            <span className="stat-label">Avg. Rating</span>
          </div>
        </div>
      </section>

      <section className="agents-grid-section container">
        <h2 className="section-label">Our Team</h2>

        {loading && (
          <div className="agents-skeletons">
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-xl)' }} />)}
          </div>
        )}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && agents.length === 0 && (
          <div className="empty-state">
            <Users size={48} />
            <h3>No agents found</h3>
            <p>Our team is being assembled. Check back soon!</p>
          </div>
        )}

        {!loading && agents.length > 0 && (
          <>
            <div className="agents-grid">
              {paginatedAgents.map((agent) => {
                const user = agent.user || {};
                const profileImage = agent.profile_image || user.profile_image;
                const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || 'Agent';
                const ratingNum = parseFloat(agent.rating || 0);

                return (
                  <div key={agent.id} className="agent-card">
                    <div className="agent-card-left">
                      <div className="agent-avatar" style={profileImage ? {
                        backgroundImage: `url(${profileImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      } : {}}>
                        {!profileImage && <span className="avatar-initials">{name.charAt(0).toUpperCase()}</span>}
                      </div>
                      <div className="agent-rating">
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} size={14} fill={i <= Math.round(ratingNum) ? 'currentColor' : 'none'} />
                          ))}
                        </div>
                        <span className="rating-num">{ratingNum.toFixed(1)} Rating</span>
                      </div>
                    </div>

                    <div className="agent-card-right">
                      <div className="agent-header-row">
                        <h3 className="agent-name">
                          {name}
                          {agent.verified && <ShieldCheck size={18} className="verified-badge" />}
                        </h3>
                        {agent.license_number && (
                          <div className="agent-license">
                            <Award size={14} /> {agent.license_number}
                          </div>
                        )}
                      </div>

                      <p className="agent-specialization">
                        {agent.bio || 'Professional Real Estate Agent ready to help you find your dream property.'}
                      </p>

                      <div className="agent-contact">
                        {user.email && (
                          <a href={`mailto:${user.email}`} className="contact-btn">
                            <Mail size={16} /> Email Agent
                          </a>
                        )}
                        {(agent.phone || user.phone) && (
                          <a href={`tel:${agent.phone || user.phone}`} className="contact-btn outline-btn">
                            <Phone size={16} /> {agent.phone || user.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} className={currentPage === page ? 'active' : ''} onClick={() => setCurrentPage(page)}>
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="agents-cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Are you a real estate professional?</h2>
          <p>Join our growing network of top-tier agents and get access to premium listings and clients.</p>
          <Link href="/register" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: '2rem' }}>
            Join as an Agent <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
