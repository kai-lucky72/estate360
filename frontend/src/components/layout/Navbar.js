'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { authAPI, getTokenPayload, notificationAPI } from '@/lib/api';
import { Building2, Menu, X, User, Bell, LogOut, ChevronDown } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const authed = authAPI.isAuthenticated();
    setIsAuth(authed);
    if (authed) {
      const payload = getTokenPayload();
      if (payload) {
        setUserName(payload.first_name || payload.username || 'User');
      }
      notificationAPI.getNotifications().then(res => {
        const data = res.data || res;
        const list = Array.isArray(data) ? data : (data.results || []);
        setNotifications(list);
      }).catch(() => {});
    }
  }, [pathname]);

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    setIsAuth(false);
    setMobileOpen(false);
    router.push('/');
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link href="/" className="navbar-logo" onClick={closeMobile}>
          <Building2 size={28} />
          <span>Estate360</span>
        </Link>

        <div className="navbar-links desktop-only">
          <Link href="/properties" className={`nav-link ${pathname.startsWith('/properties') ? 'active' : ''}`}>Properties</Link>
          <Link href="/agents" className={`nav-link ${pathname.startsWith('/agents') ? 'active' : ''}`}>Agents</Link>
          <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>About</Link>
        </div>

        <div className="navbar-right desktop-only">
          {isAuth ? (
            <>
              <div className="notif-wrapper" ref={notifRef}>
                <button className="notif-bell" onClick={() => setNotifOpen(!notifOpen)} aria-label="Notifications">
                  <Bell size={20} />
                  {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                </button>
                {notifOpen && (
                  <div className="notif-dropdown slide-down">
                    <div className="notif-dropdown-header">
                      <h4>Notifications</h4>
                    </div>
                    <div className="notif-dropdown-body">
                      {notifications.length === 0 ? (
                        <p className="notif-empty">No notifications yet</p>
                      ) : (
                        notifications.slice(0, 5).map(n => (
                          <div key={n.id} className={`notif-item ${!n.is_read ? 'unread' : ''}`}>
                            <p className="notif-text">{n.message || n.title || 'New notification'}</p>
                            <span className="notif-time">{n.created_at ? new Date(n.created_at).toLocaleDateString() : ''}</span>
                          </div>
                        ))
                      )}
                    </div>
                    <Link href="/dashboard" className="notif-view-all" onClick={() => setNotifOpen(false)}>View all</Link>
                  </div>
                )}
              </div>
              <Link href="/dashboard" className="btn btn-ghost user-btn">
                <User size={18} /> {userName}
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost">Log in</Link>
              <Link href="/register" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </div>

        <div className="mobile-actions mobile-only">
          {isAuth && (
            <button className="notif-bell mobile-notif" onClick={() => router.push('/dashboard')} aria-label="Notifications">
              <Bell size={20} />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>
          )}
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-menu slide-down">
          <div className="container mobile-menu-inner">
            <Link href="/properties" className="mobile-nav-link" onClick={closeMobile}>Properties</Link>
            <Link href="/agents" className="mobile-nav-link" onClick={closeMobile}>Agents</Link>
            <Link href="/about" className="mobile-nav-link" onClick={closeMobile}>About</Link>
            <div className="mobile-divider" />
            {isAuth ? (
              <>
                <Link href="/dashboard" className="mobile-nav-link" onClick={closeMobile}>Dashboard</Link>
                <button onClick={handleLogout} className="btn btn-outline full-width mobile-auth-btn">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline full-width mobile-auth-btn" onClick={closeMobile}>Log in</Link>
                <Link href="/register" className="btn btn-primary full-width mobile-auth-btn" onClick={closeMobile}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
