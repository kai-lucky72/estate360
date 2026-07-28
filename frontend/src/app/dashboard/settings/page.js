'use client';
import { useState, useEffect } from 'react';
import { authAPI, getTokenPayload } from '@/lib/api';
import { useToast } from '@/components/layout/Toast';
import { User, Lock, Save, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const { addToast } = useToast();
  const [profile, setProfile] = useState({
    username: '', email: '', first_name: '', last_name: '', phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '', new_password: '', confirm_password: ''
  });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const userData = await authAPI.getUser();
        setProfile({
          username: userData.username || '',
          email: userData.email || '',
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          phone: userData.phone || '',
        });
      } catch (err) {
        // Fallback to JWT payload
        const payload = getTokenPayload();
        if (payload) {
          setProfile({
            username: payload.username || '',
            email: payload.email || '',
            first_name: payload.first_name || '',
            last_name: payload.last_name || '',
            phone: '',
          });
        }
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await authAPI.updateProfile({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
      });
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.detail || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      addToast('Passwords do not match', 'error');
      return;
    }
    if (passwordData.new_password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    setSavingPassword(true);
    try {
      await authAPI.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      addToast('Password changed successfully!', 'success');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      addToast(err.response?.data?.detail || err.response?.data?.old_password?.[0] || 'Failed to change password', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner" />;
  }

  return (
    <div className="fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Settings</h1>
          <p className="dashboard-subtitle">Manage your account profile and security.</p>
        </div>
      </div>

      <div className="dashboard-two-col">
        {/* Profile Form */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3><User size={18} style={{ marginRight: '0.5rem' }} /> Profile Information</h3>
          </div>
          <div className="panel-body">
            <form onSubmit={saveProfile}>
              <div className="input-group">
                <label className="input-label">Username</label>
                <input type="text" className="input-field" value={profile.username} disabled style={{ opacity: 0.6 }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Username cannot be changed</span>
              </div>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input type="email" className="input-field" value={profile.email} disabled style={{ opacity: 0.6 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">First Name</label>
                  <input type="text" name="first_name" className="input-field" value={profile.first_name} onChange={handleProfileChange} />
                </div>
                <div className="input-group">
                  <label className="input-label">Last Name</label>
                  <input type="text" name="last_name" className="input-field" value={profile.last_name} onChange={handleProfileChange} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input type="tel" name="phone" className="input-field" placeholder="+1 (555) 123-4567" value={profile.phone} onChange={handleProfileChange} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                <Save size={18} /> {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Password Form */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3><Lock size={18} style={{ marginRight: '0.5rem' }} /> Change Password</h3>
          </div>
          <div className="panel-body">
            <form onSubmit={changePassword}>
              <div className="input-group">
                <label className="input-label">Current Password</label>
                <input type="password" name="old_password" className="input-field" value={passwordData.old_password} onChange={handlePasswordChange} required />
              </div>
              <div className="input-group">
                <label className="input-label">New Password</label>
                <input type="password" name="new_password" className="input-field" value={passwordData.new_password} onChange={handlePasswordChange} required minLength={6} />
              </div>
              <div className="input-group">
                <label className="input-label">Confirm New Password</label>
                <input type="password" name="confirm_password" className="input-field" value={passwordData.confirm_password} onChange={handlePasswordChange} required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={savingPassword}>
                <Lock size={18} /> {savingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
