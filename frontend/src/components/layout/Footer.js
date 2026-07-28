'use client';
import Link from 'next/link';
import { Building2, Mail, Phone, MapPin, Globe, MessageCircle, Camera, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            <Building2 size={28} />
            <span>Estate360</span>
          </Link>
          <p className="footer-desc">
            Premium real estate platform connecting buyers, sellers, agents, and investors. Find your dream property with confidence.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook"><Globe size={18} /></a>
            <a href="#" aria-label="Twitter"><MessageCircle size={18} /></a>
            <a href="#" aria-label="Instagram"><Camera size={18} /></a>
            <a href="#" aria-label="LinkedIn"><ExternalLink size={18} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link href="/properties">Browse Properties</Link>
          <Link href="/agents">Our Agents</Link>
          <Link href="/about">About Us</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Sign Up</Link>
        </div>

        <div className="footer-links">
          <h4>Property Types</h4>
          <Link href="/properties?category=apartment">Apartments</Link>
          <Link href="/properties?category=house">Houses</Link>
          <Link href="/properties?category=villa">Villas</Link>
          <Link href="/properties?category=office">Offices</Link>
          <Link href="/properties?category=land">Land</Link>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <div className="footer-contact-item">
            <MapPin size={16} />
            <span>123 Business Ave, Suite 100, New York, NY 10001</span>
          </div>
          <div className="footer-contact-item">
            <Phone size={16} />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="footer-contact-item">
            <Mail size={16} />
            <span>hello@estate360.com</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Estate360. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
