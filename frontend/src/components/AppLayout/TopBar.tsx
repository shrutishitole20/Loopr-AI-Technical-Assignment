import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  LogOut,
  Radio,
  ChevronRight,
  LayoutDashboard,
  ReceiptText,
  FileSpreadsheet,
  Settings
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const TopBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Route context titles and icons
  const getRouteInfo = () => {
    switch (location.pathname) {
      case '/dashboard':
        return {
          title: 'Executive Dashboard',
          section: 'Analytics',
          icon: LayoutDashboard
        };
      case '/transactions':
        return {
          title: 'Transaction Ledger',
          section: 'Records',
          icon: ReceiptText
        };
      case '/reports':
        return {
          title: 'Reports & Export Studio',
          section: 'Intelligence',
          icon: FileSpreadsheet
        };
      case '/settings':
        return {
          title: 'Settings & Security',
          section: 'System',
          icon: Settings
        };
      default:
        return {
          title: 'Loopr Financial Platform',
          section: 'Overview',
          icon: LayoutDashboard
        };
    }
  };

  const routeInfo = getRouteInfo();
  const RouteIcon = routeInfo.icon;

  return (
    <header
      style={{
        height: '68px',
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
      }}
    >
      {/* Left: Breadcrumbs & Page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(60, 79, 201, 0.12)',
            border: '1px solid rgba(122, 199, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7ac7ff'
          }}
        >
          <RouteIcon size={17} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>Loopr AI</span>
            <ChevronRight size={12} />
            <span>{routeInfo.section}</span>
          </div>
          <h1
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.01em',
              lineHeight: 1.2
            }}
          >
            {routeInfo.title}
          </h1>
        </div>
      </div>

      {/* Right: Controls (Single Row, Never Wraps) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Live Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(5, 150, 105, 0.1)',
            border: '1px solid rgba(5, 150, 105, 0.25)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#059669'
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
              display: 'inline-block'
            }}
          />
          <span>Live Synced</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#3c4fc9';
            e.currentTarget.style.borderColor = 'rgba(60, 79, 201, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* User Chip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0.25rem 0.65rem 0.25rem 0.35rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt={user?.name || 'User'}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {user?.name || 'Analyst'}
          </span>
        </div>

        {/* Quick Logout Button */}
        <button
          onClick={handleLogout}
          title="Sign out of platform"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.4rem 0.75rem',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#e11d48';
            e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.3)';
            e.currentTarget.style.backgroundColor = 'rgba(225, 29, 72, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut size={14} />
          <span>Exit</span>
        </button>
      </div>
    </header>
  );
};
