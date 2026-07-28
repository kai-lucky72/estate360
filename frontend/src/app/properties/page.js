'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { propertyAPI } from '@/lib/api';
import { MapPin, Search, Maximize2, Home, Bed, Bath, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import './properties.css';

const ITEMS_PER_PAGE = 9;

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const categories = ['all', 'apartment', 'house', 'villa', 'office', 'land'];

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) setSearchTerm(search);
    const cat = searchParams.get('category');
    if (cat && categories.includes(cat)) setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      setError(null);
      try {
        const data = await propertyAPI.getProperties({ limit: 100 });
        setProperties(Array.isArray(data) ? data : (data.results || []));
      } catch (error) {
        console.error("Failed to fetch properties", error);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(prop => {
    const matchesSearch =
      !searchTerm ||
      prop.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || prop.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="properties-page fade-in">
      <section className="properties-hero">
        <div className="container">
          <h1 className="properties-hero-title">Explore Properties</h1>
          <p className="properties-hero-subtitle">
            Discover {properties.length > 0 ? properties.length : ''} premium listings. Find your perfect place to live, work, or invest.
          </p>
          <div className="search-bar">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search by title or location..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pill ${activeCategory === cat ? 'pill-active' : ''}`}
              onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
            >
              {cat === 'all' ? 'All Properties' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <section className="container properties-results">
        <div className="results-count">
          <span>{filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found</span>
        </div>

        {loading ? (
          <div className="properties-skeletons">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton skeleton-card" />)}
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="property-grid">
              {paginatedProperties.length > 0 ? (
                paginatedProperties.map(property => (
                  <Link href={`/properties/${property.id}`} key={property.id} className="property-card fade-in">
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
                          {property.bedrooms && <span><Bed size={13} /> {property.bedrooms}</span>}
                          {property.bathrooms && <span><Bath size={13} /> {property.bathrooms}</span>}
                        </div>
                      )}
                      <div className="property-card-footer">
                        <span className="property-card-link">
                          View Details <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="no-results">
                  <Home size={48} />
                  <h3>No properties found</h3>
                  <p>Try adjusting your search or category filter.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={currentPage === page ? 'active' : ''}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="properties-page"><div className="loading-spinner" /></div>}>
      <PropertiesContent />
    </Suspense>
  );
}
