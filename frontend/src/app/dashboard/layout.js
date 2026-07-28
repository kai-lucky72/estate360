'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { authAPI, getTokenPayload } from '@/lib/api';
import { LayoutDashboard, Building, CalendarCheck, Settings, LogOut, Menu, X, Bell, User } from 'lucide-react';
import './dashboard.css';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      router.push('/login');
    } else {
      const payload = getTokenPayload();
      if (payload) {
        setUserName(payload.first_name || payload.username || 'User');
      }
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    authAPI.logout();
    router.push('/');
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Properties', href: '/dashboard/properties', icon: Building },
    { name: 'Bookings', href: '/dashboard/bookings', icon: CalendarCheck },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="dashboard-layout">
        <div className="loading-spinner" style={{ margin: 'auto' }}></div>
      </div>
    );
  }

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link href="/" className="sidebar-logo">
            <Building size={24} />
            <span>Estate360</span>
          </Link>
          <button className="sidebar-close mobile-only" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="sidebar-user">
          <div className="sidebar-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{userName}</span>
            <span className="sidebar-user-role">Dashboard</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Link href="/" className="sidebar-link">
            <Building size={20} />
            <span>Back to Site</span>
          </Link>
          <button className="sidebar-link logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar mobile-only">
          <button className="topbar-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="topbar-title">Dashboard</div>
          <Link href="/" className="topbar-home">
            <Building size={20} />
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}
