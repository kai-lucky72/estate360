'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { authAPI, getTokenPayload } from '@/lib/api';
import {
  LayoutDashboard, Users, Building, CalendarCheck, DollarSign,
  FileText, UserCheck, FileSpreadsheet, BarChart3, LogOut, Menu, X, Shield
} from 'lucide-react';
import './admin.css';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      router.push('/login');
      return;
    }
    const payload = getTokenPayload();
    if (!payload || (payload.role !== 'admin' && !payload.is_superuser)) {
      router.push('/dashboard');
      return;
    }
    setIsAdmin(true);
    setUserName(payload.first_name || payload.username || 'Admin');
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    authAPI.logout();
    router.push('/');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Properties', href: '/admin/properties', icon: Building },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
    { name: 'Payments', href: '/admin/payments', icon: DollarSign },
    { name: 'Contracts', href: '/admin/contracts', icon: FileText },
    { name: 'Agents', href: '/admin/agents', icon: UserCheck },
    { name: 'Logs', href: '/admin/logs', icon: FileSpreadsheet },
    { name: 'System Stats', href: '/admin/stats', icon: BarChart3 },
  ];

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="loading-spinner" style={{ margin: 'auto' }}></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="admin-layout">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link href="/admin" className="admin-sidebar-logo">
            <Shield size={24} />
            <span>Admin Panel</span>
          </Link>
          <button className="admin-sidebar-close mobile-only" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="admin-sidebar-user">
          <div className="admin-sidebar-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="admin-sidebar-user-info">
            <span className="admin-sidebar-user-name">{userName}</span>
            <span className="admin-sidebar-user-role">Administrator</span>
          </div>
        </div>
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar-link ${isActive(item.href) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link href="/dashboard" className="admin-sidebar-link">
            <LayoutDashboard size={20} />
            <span>User Dashboard</span>
          </Link>
          <Link href="/" className="admin-sidebar-link">
            <Building size={20} />
            <span>Back to Site</span>
          </Link>
          <button className="admin-sidebar-link admin-logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar mobile-only">
          <button className="admin-topbar-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="admin-topbar-title">Admin Panel</div>
          <Link href="/" className="topbar-home">
            <Building size={20} />
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}
