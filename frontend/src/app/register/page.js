'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import '../login/auth.css';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState('client');
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', first_name: '', last_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = { ...formData, role: role === 'client' ? 'tenant' : 'agent' };
      await authAPI.register(payload);
      router.push('/login?registered=true');
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const messages = Object.entries(data)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join('. ');
        setError(messages || 'Registration failed. Please check your information.');
      } else {
        setError('Registration failed. Ensure email and username are unique.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <h1 className="auth-title">Join Estate360</h1>
        <p className="auth-subtitle">Create an account to start your real estate journey.</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="role-selector">
          <button
            className={`role-btn ${role === 'client' ? 'active' : ''}`}
            onClick={() => setRole('client')}
            type="button"
          >
            Looking to Buy/Rent
          </button>
          <button
            className={`role-btn ${role === 'agent' ? 'active' : ''}`}
            onClick={() => setRole('agent')}
            type="button"
          >
            I&apos;m an Agent/Owner
          </button>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-group">
            <label className="input-label" htmlFor="username">Username</label>
            <input id="username" type="text" className="input-field" placeholder="Choose a username" required onChange={handleChange} />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="email">Email Address</label>
            <input id="email" type="email" className="input-field" placeholder="you@example.com" required onChange={handleChange} />
          </div>

          <div className="auth-name-row">
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label" htmlFor="first_name">First Name</label>
              <input id="first_name" type="text" className="input-field" placeholder="John" required onChange={handleChange} />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label" htmlFor="last_name">Last Name</label>
              <input id="last_name" type="text" className="input-field" placeholder="Doe" required onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="input-field" placeholder="Min. 6 characters" required minLength={6} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary full-width" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link href="/login" className="auth-link">Log in</Link>
        </div>
      </div>
    </div>
  );
}
