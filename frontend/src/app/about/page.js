'use client';
import Link from 'next/link';
import { Building2, Users, Shield, Trophy, Target, Eye, Heart, Handshake, Globe, Star, Zap, TrendingUp, Clock, CheckCircle, ArrowRight, Mail, Phone, MapPin, Quote, Award, Lightbulb, Compass } from 'lucide-react';
import { useState } from 'react';
import './about.css';

export default function AboutPage() {
  const [activeTimeline, setActiveTimeline] = useState(null);

  const values = [
    { icon: Shield, title: 'Trust & Transparency', desc: 'We believe in complete transparency in every transaction. Every property listing is verified, every process is clear, and every fee is disclosed upfront.' },
    { icon: Star, title: 'Excellence', desc: 'We hold ourselves to the highest standards of quality and service. From property selection to customer support, excellence is our baseline.' },
    { icon: Users, title: 'People First', desc: 'Our clients, agents, and partners are at the heart of everything we do. We build lasting relationships based on respect, empathy, and mutual success.' },
    { icon: Lightbulb, title: 'Innovation', desc: 'Technology is our differentiator. We continuously invest in cutting-edge tools to make real estate transactions faster, simpler, and more secure.' },
    { icon: Heart, title: 'Community', desc: 'We are committed to building stronger communities, not just selling properties. A portion of every transaction goes toward local community development.' },
    { icon: Handshake, title: 'Integrity', desc: 'We do what is right, even when no one is watching. Ethical practices and honest advice are non-negotiable in every interaction.' },
  ];

  const teamMembers = [
    { name: 'Alexandra Mitchell', role: 'CEO & Co-Founder', bio: 'Former real estate executive with 15+ years of experience in property technology and market strategy.', avatar: 'AM', color: '#1a73e8' },
    { name: 'David Park', role: 'CTO & Co-Founder', bio: 'Tech entrepreneur who previously built and sold two SaaS companies. Passionate about transforming real estate through technology.', avatar: 'DP', color: '#7c3aed' },
    { name: 'Sarah Williams', role: 'VP of Operations', bio: 'Operations expert who scaled multiple real estate firms. Ensures every client interaction meets our premium standards.', avatar: 'SW', color: '#38a169' },
    { name: 'James Rodriguez', role: 'Head of Sales', bio: 'Top-performing real estate agent turned sales leader. Has personally closed over $200M in property transactions.', avatar: 'JR', color: '#dd6b20' },
    { name: 'Emily Chen', role: 'Head of Marketing', bio: 'Digital marketing strategist who has launched multiple award-winning campaigns in the proptech space.', avatar: 'EC', color: '#e53e3e' },
    { name: 'Michael Thompson', role: 'Head of Client Relations', bio: 'Customer experience veteran from luxury hospitality. Brings white-glove service to every client interaction.', avatar: 'MT', color: '#3182ce' },
  ];

  const timeline = [
    { year: '2019', title: 'The Idea is Born', desc: 'Our founders identified a gap in the real estate market — the lack of a truly integrated digital platform connecting all stakeholders in one seamless ecosystem.' },
    { year: '2020', title: 'Building the Foundation', desc: 'Despite global challenges, our team came together remotely to build the first version of Estate360. We onboarded our first 50 agents and 200 properties.' },
    { year: '2021', title: 'Public Launch', desc: 'Estate360 officially launched to the public. Within six months, we reached 1,000 listed properties and 500 registered users. Our innovative booking system gained industry attention.' },
    { year: '2022', title: 'Expansion & Growth', desc: 'We expanded to three new cities, launched our mobile app, and introduced the digital contract signing feature. User base grew to 5,000 active clients.' },
    { year: '2023', title: 'Industry Recognition', desc: 'Estate360 won the Proptech Innovation Award and was featured in Forbes as one of the top real estate startups to watch. We surpassed 10,000 properties listed.' },
    { year: '2024', title: 'Global Reach', desc: 'International expansion began with operations in Dubai, London, and Singapore. Our platform now supports 15 languages and 20 currencies.' },
    { year: '2025', title: 'AI-Powered Platform', desc: 'Launched AI-driven property recommendations, smart pricing analytics, and virtual staging technology. Enhanced our commitment to innovation.' },
    { year: '2026', title: 'The Future is Now', desc: 'Today, Estate360 serves over 50,000 clients globally with 500+ agents and 20,000+ properties. We continue to push the boundaries of what is possible in digital real estate.' },
  ];

  const testimonials = [
    { name: 'Robert Kim', role: 'Property Developer', quote: 'Estate360 transformed how we market and sell our developments. The platform analytics alone have increased our conversion rate by 40%. Truly a game-changer for the industry.', rating: 5 },
    { name: 'Lisa Martinez', role: 'Real Estate Agent', quote: 'As an agent, Estate360 gives me the tools to provide exceptional service to my clients. The dashboard, scheduling, and document management are best-in-class. I have seen my business grow 3x since joining.', rating: 5 },
    { name: 'James Wilson', role: 'Homeowner', quote: 'We listed our home with an Estate360 agent and were amazed by the entire process. From the professional photography to the digital open house, everything was handled perfectly. Our home sold in 11 days.', rating: 5 },
    { name: 'Priya Sharma', role: 'First-time Buyer', quote: 'I was intimidated by the home-buying process, but my Estate360 agent walked me through every step. The platform made it so easy to compare properties, schedule tours, and submit offers. I am now a proud homeowner thanks to them.', rating: 5 },
  ];

  const differentiators = [
    { icon: Zap, title: 'Speed', desc: 'Average time from search to closing is 45% faster than traditional real estate methods.' },
    { icon: Globe, title: 'Global Reach', desc: 'Access to premium properties in 15+ countries with local expert support in every market.' },
    { icon: TrendingUp, title: 'Data-Driven', desc: 'Real-time market analytics, price predictions, and investment insights powered by AI.' },
    { icon: Shield, title: '100% Secure', desc: 'Bank-grade encryption for all transactions, digital contracts, and personal data protection.' },
  ];

  const stats = [
    { number: '20,000+', label: 'Properties Listed', icon: Building2 },
    { number: '500+', label: 'Expert Agents', icon: Users },
    { number: '50,000+', label: 'Happy Clients', icon: Heart },
    { number: '15+', label: 'Countries', icon: Globe },
    { number: '99%', label: 'Satisfaction Rate', icon: Star },
    { number: '8+', label: 'Years Experience', icon: Trophy },
  ];

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-bg" />
        <div className="container about-hero-content">
          <h1 className="about-hero-title slide-up">Reimagining Real <span className="text-gradient">Estate</span></h1>
          <p className="about-hero-subtitle slide-up">
            We are on a mission to transform the way people buy, sell, rent, and invest in property. 
            Estate360 brings together technology, transparency, and human expertise to create a real 
            estate experience that is seamless, secure, and fundamentally better.
          </p>
          <div className="about-hero-actions slide-up">
            <Link href="/properties" className="btn btn-primary btn-lg">Explore Properties <ArrowRight size={18} /></Link>
            <Link href="/register" className="btn btn-outline btn-lg about-hero-outline">Join Estate360</Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="about-story container">
        <div className="about-story-grid">
          <div className="about-story-text">
            <span className="about-section-tag">Our Story</span>
            <h2 className="about-section-title">From a Bold Idea to a Global Platform</h2>
            <p className="about-paragraph">
              Estate360 was founded in 2019 by Alexandra Mitchell and David Park, two visionaries who 
              experienced firsthand the frustrations of the traditional real estate market. Alexandra, a 
              seasoned real estate executive, had spent years watching clients struggle with opaque pricing, 
              endless paperwork, and fragmented communication between buyers, sellers, agents, and lenders.
            </p>
            <p className="about-paragraph">
              David, a serial tech entrepreneur, saw an opportunity to apply the same technological 
              innovation that had transformed industries like transportation and hospitality to the 
              world of real estate. Together, they envisioned a platform where every aspect of the 
              property journey — from discovery to closing — could be managed in one beautiful, 
              intuitive digital space.
            </p>
            <p className="about-paragraph">
              What started as a small team of 5 people working out of a shared workspace in New York 
              has grown into a global company with offices in 8 countries and a team of over 200 
              dedicated professionals. Today, Estate360 handles thousands of property transactions 
              every month, leveraging cutting-edge artificial intelligence, blockchain-verified 
              contracts, and a network of vetted agents who share our commitment to excellence.
            </p>
            <p className="about-paragraph">
              But our mission remains the same as it was on day one: to make real estate transactions 
              transparent, efficient, and accessible to everyone. Whether you are a first-time renter 
              searching for your perfect apartment, a family looking for a forever home, an investor 
              building a portfolio, or an agent growing your business, Estate360 is built for you.
            </p>
          </div>
          <div className="about-story-image">
            <div className="about-story-image-placeholder">
              <Building2 size={64} />
            </div>
            <div className="about-story-stats">
              <div className="about-story-stat">
                <span className="about-story-stat-num">8+</span>
                <span className="about-story-stat-label">Years</span>
              </div>
              <div className="about-story-stat">
                <span className="about-story-stat-num">200+</span>
                <span className="about-story-stat-label">Team Members</span>
              </div>
              <div className="about-story-stat">
                <span className="about-story-stat-num">50K+</span>
                <span className="about-story-stat-label">Clients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-mission">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon"><Target size={32} /></div>
              <h3>Our Mission</h3>
              <p>
                To democratize the real estate market by providing transparent data, 
                secure digital infrastructure, and expert guidance that empowers every 
                client to make confident property decisions. We believe that finding 
                the right property should be exciting, not exhausting.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon"><Eye size={32} /></div>
              <h3>Our Vision</h3>
              <p>
                To become the world&apos;s most trusted digital real estate ecosystem — 
                where every transaction is seamless, every interaction is meaningful, 
                and every client achieves their property goals with confidence and 
                clarity. A world where technology and human expertise work in harmony.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon"><Compass size={32} /></div>
              <h3>Our Promise</h3>
              <p>
                We promise to always put our clients first, leverage the best technology 
                available, maintain complete transparency in all our dealings, and 
                continuously innovate to make the real estate journey better for everyone 
                involved, every single day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="about-timeline container">
        <div className="section-header">
          <span className="about-section-tag">Our Journey</span>
          <h2 className="about-section-title">Company Timeline</h2>
          <p className="about-section-subtitle">From a bold vision to a global real estate platform — our story of growth and innovation.</p>
        </div>
        <div className="timeline">
          {timeline.map((item, i) => (
            <div key={i} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'} fade-in`}>
              <div className="timeline-marker">
                <span>{item.year}</span>
              </div>
              <div className="timeline-content">
                <span className="timeline-year">{item.year}</span>
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="about-values">
        <div className="container">
          <div className="section-header">
            <span className="about-section-tag">What We Stand For</span>
            <h2 className="about-section-title">Our Core Values</h2>
            <p className="about-section-subtitle">The principles that guide every decision we make and every relationship we build.</p>
          </div>
          <div className="values-grid">
            {values.map((value, i) => (
              <div key={i} className="value-card fade-in">
                <div className="value-card-icon">
                  <value.icon size={28} />
                </div>
                <h3 className="value-card-title">{value.title}</h3>
                <p className="value-card-desc">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team container">
        <div className="section-header">
          <span className="about-section-tag">Leadership</span>
          <h2 className="about-section-title">Meet Our Team</h2>
          <p className="about-section-subtitle">The passionate people behind Estate360 who work tirelessly to transform real estate.</p>
        </div>
        <div className="team-grid">
          {teamMembers.map((member, i) => (
            <div key={i} className="team-card fade-in">
              <div className="team-avatar" style={{ background: member.color }}>
                {member.avatar}
              </div>
              <h3 className="team-name">{member.name}</h3>
              <div className="team-role">{member.role}</div>
              <p className="team-bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="about-stats">
        <div className="container">
          <div className="about-stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="about-stat-item fade-in">
                <stat.icon size={32} className="about-stat-icon" />
                <span className="about-stat-number">{stat.number}</span>
                <span className="about-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="about-differentiators container">
        <div className="section-header">
          <span className="about-section-tag">Why Choose Us</span>
          <h2 className="about-section-title">What Sets Estate360 Apart</h2>
          <p className="about-section-subtitle">We are not just another real estate platform. Here is what makes us different.</p>
        </div>
        <div className="differentiators-grid">
          {differentiators.map((item, i) => (
            <div key={i} className="differentiator-card fade-in">
              <div className="differentiator-icon">
                <item.icon size={28} />
              </div>
              <h3 className="differentiator-title">{item.title}</h3>
              <p className="differentiator-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="about-testimonials">
        <div className="container">
          <div className="section-header">
            <span className="about-section-tag">Testimonials</span>
            <h2 className="about-section-title">What Our Clients Say</h2>
            <p className="about-section-subtitle">Hear from the thousands of clients, agents, and partners who trust Estate360.</p>
          </div>
          <div className="about-testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="about-testimonial-card fade-in">
                <Quote size={24} className="about-testimonial-quote-icon" />
                <p className="about-testimonial-text">&ldquo;{t.quote}&rdquo;</p>
                <div className="about-testimonial-rating">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={16} fill={s <= t.rating ? '#f6ad55' : 'none'} stroke={s <= t.rating ? '#f6ad55' : 'var(--surface-border)'} />
                  ))}
                </div>
                <div className="about-testimonial-author">
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="about-contact container">
        <div className="section-header">
          <span className="about-section-tag">Get In Touch</span>
          <h2 className="about-section-title">We&apos;d Love to Hear From You</h2>
          <p className="about-section-subtitle">Whether you have a question, feedback, or want to partner with us, our team is ready to help.</p>
        </div>
        <div className="contact-info-grid">
          <div className="contact-info-card">
            <div className="contact-info-icon"><MapPin size={24} /></div>
            <h3>Visit Us</h3>
            <p>123 Business Avenue, Suite 100<br />New York, NY 10001<br />United States</p>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-icon"><Phone size={24} /></div>
            <h3>Call Us</h3>
            <p>+1 (555) 123-4567<br />Mon-Fri 9am-8pm EST<br />Sat 10am-4pm EST</p>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-icon"><Mail size={24} /></div>
            <h3>Email Us</h3>
            <p>hello@estate360.com<br />support@estate360.com<br />We respond within 24 hours</p>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-icon"><Globe size={24} /></div>
            <h3>Global Offices</h3>
            <p>New York • London • Dubai<br />Singapore • Sydney • Toronto<br />Berlin • Tokyo</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container about-cta-content">
          <h2 className="about-cta-title">Ready to Be Part of Something Bigger?</h2>
          <p className="about-cta-subtitle">Join thousands of clients, agents, and partners who have made Estate360 their real estate platform of choice.</p>
          <div className="about-cta-actions">
            <Link href="/register" className="btn btn-primary btn-lg">Get Started Free <ArrowRight size={18} /></Link>
            <Link href="/properties" className="btn btn-outline btn-lg about-cta-outline">Browse Properties</Link>
          </div>
        </div>
      </section>

      {/* Back to top */}
      <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <ArrowRight size={20} style={{ transform: 'rotate(-90deg)' }} />
      </button>
    </div>
  );
}
