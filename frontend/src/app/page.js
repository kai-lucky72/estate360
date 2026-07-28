'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { propertyAPI } from '@/lib/api';
import './page.css';
import {
  MapPin, Bed, Bath, Maximize2, Home, Search, ArrowRight, Star, Shield,
  Zap, Users, Heart, CheckCircle, ChevronRight, Quote, Phone, Mail,
  Building2, TrendingUp, Clock, Award
} from 'lucide-react';

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchProperties() {
      try {
        const data = await propertyAPI.getProperties({ limit: 3 });
        const list = Array.isArray(data) ? data : (data.results || []);
        setProperties(list.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch properties", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const stats = [
    { number: '500+', label: 'Properties', icon: Building2 },
    { number: '50+', label: 'Expert Agents', icon: Users },
    { number: '1000+', label: 'Happy Clients', icon: Heart },
    { number: '5+', label: 'Years Experience', icon: Award },
  ];

  const steps = [
    { icon: Search, title: 'Search Properties', desc: 'Browse our extensive collection of premium real estate listings across prime locations.' },
    { icon: MapPin, title: 'Compare Locations', desc: 'Explore neighborhoods, amenities, and virtual tours to find your perfect match.' },
    { icon: CalendarCheck, title: 'Book a Tour', desc: 'Schedule in-person or virtual tours with our experienced agents at your convenience.' },
    { icon: Home, title: 'Move with Confidence', desc: 'Close the deal with secure digital contracts and move into your dream property.' },
  ];

  const reasons = [
    { icon: Shield, title: 'Trusted Platform', desc: 'Every listing is verified. We ensure all properties meet our quality standards before being listed.' },
    { icon: Zap, title: 'Fast & Efficient', desc: 'Our streamlined process means you can go from search to closing faster than traditional methods.' },
    { icon: TrendingUp, title: 'Market Insights', desc: 'Get real-time market data, price trends, and investment analytics to make informed decisions.' },
    { icon: Users, title: 'Expert Support', desc: 'Dedicated agents available 24/7 to guide you through every step of your real estate journey.' },
    { icon: Clock, title: 'Save Time', desc: 'Advanced filters, saved searches, and personalized recommendations help you find properties faster.' },
    { icon: CheckCircle, title: 'Hassle-Free Process', desc: 'From digital contracts to secure payments, everything is handled seamlessly on one platform.' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Home Buyer', quote: 'Estate360 made finding our dream home incredibly easy. The virtual tours saved us so much time, and our agent was amazing throughout the entire process.', rating: 5, avatar: 'SJ' },
    { name: 'Michael Chen', role: 'Property Investor', quote: 'The market analytics and portfolio management tools are outstanding. I\'ve been able to make data-driven investment decisions that have significantly grown my portfolio.', rating: 5, avatar: 'MC' },
    { name: 'Emily Rodriguez', role: 'First-time Renter', quote: 'As a first-time renter, I was nervous about the process. Estate360 made it simple and transparent. Found the perfect apartment in just one week!', rating: 5, avatar: 'ER' },
  ];

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-bg" />
        <div className="container home-hero-content">
          <h1 className="home-hero-title slide-up">Discover Your <span className="text-gradient">Perfect Home</span></h1>
          <p className="home-hero-subtitle slide-up">
            Explore thousands of premium properties. Buy, rent, or invest with confidence using Estate360&apos;s powerful platform.
          </p>
          <div className="home-hero-search slide-up">
            <div className="hero-search-wrapper">
              <Search size={20} className="hero-search-icon" />
              <input
                type="text"
                placeholder="Search by city, neighborhood, or property name..."
                className="hero-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') window.location.href = `/properties?search=${encodeURIComponent(searchTerm)}`; }}
              />
            </div>
            <Link href={`/properties?search=${encodeURIComponent(searchTerm)}`} className="btn btn-primary btn-lg hero-search-btn">
              Search <Search size={18} />
            </Link>
          </div>
          <div className="home-hero-actions slide-up">
            <Link href="/properties" className="btn btn-primary btn-lg">Browse Properties <ArrowRight size={18} /></Link>
            <Link href="/about" className="btn btn-outline btn-lg hero-cta-outline">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="home-stats">
        <div className="container home-stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="home-stat-item fade-in">
              <stat.icon size={28} className="home-stat-icon" />
              <span className="home-stat-number">{stat.number}</span>
              <span className="home-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="home-featured container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Properties</h2>
            <p className="section-subtitle">Hand-picked premium listings you don&apos;t want to miss</p>
          </div>
          <Link href="/properties" className="btn btn-outline">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="featured-skeletons">
            {[1,2,3].map(i => <div key={i} className="skeleton skeleton-card" />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <Home size={48} />
            <h3>No properties available</h3>
            <p>Check back soon for new listings.</p>
          </div>
        ) : (
          <div className="property-grid">
            {properties.map((property, i) => (
              <Link href={`/properties/${property.id}`} key={property.id} className="property-card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="property-card-image">
                  {property.main_image ? (
                    <img src={property.main_image} alt={property.title} loading="lazy" />
                  ) : (
                    <div className="property-card-image-placeholder">
                      <Home size={48} />
                    </div>
                  )}
                  <div className="property-card-badges">
                    <span className="property-card-badge category">{property.category}</span>
                    <span className={`property-card-badge status status-${property.status}`}>{property.status}</span>
                  </div>
                </div>
                <div className="property-card-body">
                  <div className="property-card-price">${parseFloat(property.price).toLocaleString()}</div>
                  <h3 className="property-card-title">{property.title}</h3>
                  <div className="property-card-location">
                    <MapPin size={14} /> {property.location}
                  </div>
                  {property.size_sqft && (
                    <div className="property-card-meta">
                      <span><Maximize2 size={13} /> {property.size_sqft.toLocaleString()} sqft</span>
                      {property.bedrooms && <span><Bed size={13} /> {property.bedrooms} beds</span>}
                      {property.bathrooms && <span><Bath size={13} /> {property.bathrooms} baths</span>}
                    </div>
                  )}
                  <div className="property-card-footer">
                    <span className="property-card-link">
                      View Details <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="home-how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How Estate360 Works</h2>
            <p className="section-subtitle">Four simple steps to find and secure your dream property</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={i} className="step-card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="step-number">{i + 1}</div>
                <div className="step-icon-wrapper">
                  <step.icon size={28} />
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="home-why-us container">
        <div className="section-header">
          <h2 className="section-title">Why Choose Estate360</h2>
          <p className="section-subtitle">We deliver a superior real estate experience with transparency and innovation</p>
        </div>
        <div className="reasons-grid">
          {reasons.map((reason, i) => (
            <div key={i} className="reason-card fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="reason-icon-wrapper">
                <reason.icon size={24} />
              </div>
              <h3 className="reason-title">{reason.title}</h3>
              <p className="reason-desc">{reason.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="home-testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-subtitle">Real stories from real people who found their perfect property with us</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="testimonial-quote">
                  <Quote size={24} />
                </div>
                <p className="testimonial-text">&ldquo;{t.quote}&rdquo;</p>
                <div className="testimonial-rating">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={16} fill={s <= t.rating ? '#f6ad55' : 'none'} stroke={s <= t.rating ? '#f6ad55' : 'var(--surface-border)'} />
                  ))}
                </div>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="home-cta">
        <div className="container home-cta-content">
          <h2 className="home-cta-title">Ready to Find Your Dream Property?</h2>
          <p className="home-cta-subtitle">Join thousands of happy clients. Start your real estate journey with Estate360 today.</p>
          <div className="home-cta-actions">
            <Link href="/register" className="btn btn-primary btn-lg">Get Started Free <ArrowRight size={18} /></Link>
            <Link href="/contact" className="btn btn-outline btn-lg cta-outline">Talk to an Agent <Phone size={18} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function CalendarCheck(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}
