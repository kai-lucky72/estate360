'use client';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-text">
          Oops! The page you are looking for does not exist or has been moved. 
          Let us help you find your way back home.
        </p>
        <div className="not-found-actions">
          <Link href="/" className="btn btn-primary btn-lg">
            <Home size={18} /> Go Home
          </Link>
          <button className="btn btn-outline btn-lg" onClick={() => window.history.back()}>
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
        <div className="not-found-links">
          <p>Try these popular pages:</p>
          <div className="not-found-links-grid">
            <Link href="/properties">Browse Properties</Link>
            <Link href="/agents">Our Agents</Link>
            <Link href="/about">About Us</Link>
            <Link href="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
