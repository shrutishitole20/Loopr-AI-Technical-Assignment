import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  LogOut,
  ShieldCheck,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LooprIcon } from './LooprLogo';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: 'rgba(5, 150, 105, 0.15)',
      badgeTextColor: '#10b981'
    },
    {
      to: '/transactions',
      label: 'Ledger',
      icon: ReceiptText,
      badge: '300',
      badgeColor: 'rgba(60, 79, 201, 0.15)',
      badgeTextColor: '#7ac7ff'
    },
    {
      to: '/reports',
      label: 'Reports',
      icon: FileSpreadsheet,
      badge: 'Export',
      badgeColor: 'rgba(217, 119, 6, 0.15)',
      badgeTextColor: '#f59e0b'
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
      badgeColor: '',
      badgeTextColor: ''
    }
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? '76px' : '260px',
        minWidth: isCollapsed ? '76px' : '260px',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: 'var(--bg-card)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        userSelect: 'none',
        overflowX: 'hidden'
      }}
    >
      {/* Brand & Collapse Header */}
      <div
        style={{
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: isCollapsed ? '0 0.5rem' : '0 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative'
        }}
      >
        <div
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Click to expand sidebar' : 'Click to collapse sidebar'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              background: 'linear-gradient(135deg, #3c4fc9 0%, #1d4ed8 50%, #0284c7 100%)',
              boxShadow: '0 4px 14px rgba(60, 79, 201, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              border: '1px solid rgba(147, 197, 253, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(60, 79, 201, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(60, 79, 201, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            }}
          >
            <LooprIcon size={21} />
          </div>

          {!isCollapsed && (
            <div style={{ whiteSpace: 'nowrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  Loopr<span style={{ color: '#0284c7' }}>AI</span>
                </span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
                Financial Intelligence
              </p>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            title="Collapse Sidebar"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface-elevated)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div style={{ flex: 1, padding: isCollapsed ? '0.75rem 0.5rem' : '1rem 0.75rem', overflowY: 'auto' }}>
        {!isCollapsed && (
          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              padding: '0 0.6rem 0.6rem'
            }}
          >
            Platform
          </div>
        )}

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={isCollapsed ? item.label : undefined}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  padding: isCollapsed ? '0.65rem' : '0.65rem 0.85rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--loopr-blue)' : 'transparent',
                  boxShadow: isActive ? '0 4px 14px rgba(60, 79, 201, 0.35)' : 'none',
                  transition: 'all 0.15s ease'
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={19} />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '6px',
                      backgroundColor: item.badgeColor,
                      color: item.badgeTextColor
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Card & Logout Footer */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: isCollapsed ? '0.75rem 0.5rem' : '0.85rem 1rem',
          backgroundColor: 'var(--bg-surface-elevated)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            gap: '0.75rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              overflow: 'hidden'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt={user?.name || 'User'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(60, 79, 201, 0.4)',
                flexShrink: 0
              }}
            />
            {!isCollapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}
                >
                  {user?.name || 'Financial Analyst'}
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <ShieldCheck size={12} color="#059669" />
                  <span>{user?.role || 'Senior Analyst'}</span>
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={handleLogout}
              title="Logout session"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#e11d48';
                e.currentTarget.style.backgroundColor = 'rgba(225, 29, 72, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <LogOut size={17} />
            </button>
          )}
        </div>

        {/* If collapsed, show logout below avatar */}
        {isCollapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
            <button
              onClick={handleLogout}
              title="Logout session"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#e11d48';
                e.currentTarget.style.backgroundColor = 'rgba(225, 29, 72, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
