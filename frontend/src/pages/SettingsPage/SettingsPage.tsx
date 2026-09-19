import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useAlert } from '../../context/AlertContext';
import { UserCheck, Shield, KeyRound, Activity, Server, Clock, Sun, Moon, ExternalLink, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showSuccess } = useAlert();
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(true);

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        setIsCheckingHealth(true);
        const start = performance.now();
        const res = await fetch('/api/health');
        const end = performance.now();
        const data = await res.json();
        setLatency(Math.round(end - start));
        setHealthStatus(data);
      } catch (e) {
        setHealthStatus({ status: 'offline', service: 'Unavailable' });
      } finally {
        setIsCheckingHealth(false);
      }
    };
    checkApiHealth();
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    if (theme !== newTheme) {
      toggleTheme();
      showSuccess(`Switched to ${newTheme === 'dark' ? 'Dark Cyber' : 'Clean Light'} theme`);
    }
  };

  const apiEndpoints = [
    { method: 'GET', url: '/api', desc: 'API Discovery Directory' },
    { method: 'GET', url: '/api/health', desc: 'Health & System Uptime' },
    { method: 'GET', url: '/api/transactions', desc: 'Transactions List & Filters' },
    { method: 'GET', url: '/api/analytics', desc: 'Consolidated Financial Analytics' },
    { method: 'GET', url: '/api/analytics/trends', desc: 'Monthly Trajectory Dataset' }
  ];

  return (
    <div style={{ padding: '1.75rem 2rem', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(60, 79, 201, 0.15)', border: '1px solid rgba(122, 199, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7ac7ff' }}>
              <Shield size={20} />
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
              Platform Settings & Preferences
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', marginBottom: 0 }}>
            Manage analyst profile credentials, theme customization, security tokens, and backend telemetry.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* User Profile Card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#3c4fc9', marginBottom: '1.25rem' }}>
              <UserCheck size={20} />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Analyst Identity
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.name || 'User'}
                style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #3c4fc9', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  {user?.name || 'Financial Analyst'}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#3c4fc9', fontWeight: 600 }}>
                  {user?.role || 'Senior Financial Analyst'}
                </span>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                  {user?.email || 'admin@crackit.com'}
                </p>
              </div>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Account ID</span>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                {user?.id || 'usr_financial_analyst_001'}
              </div>
            </div>
          </div>

          {/* Theme Switcher Card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f59e0b', marginBottom: '1.25rem' }}>
              <Sun size={20} />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Interface Appearance
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                onClick={() => handleThemeChange('light')}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  border: theme === 'light' ? '2px solid #3c4fc9' : '1px solid var(--border-subtle)',
                  background: theme === 'light' ? 'rgba(60, 79, 201, 0.08)' : 'var(--bg-surface-elevated)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  position: 'relative'
                }}
              >
                {theme === 'light' && <span style={{ position: 'absolute', top: 8, right: 8, color: '#3c4fc9' }}><Check size={16} /></span>}
                <Sun size={24} color="#f59e0b" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Clean Light</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>High Contrast</span>
              </div>

              <div
                onClick={() => handleThemeChange('dark')}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  border: theme === 'dark' ? '2px solid #7ac7ff' : '1px solid var(--border-subtle)',
                  background: theme === 'dark' ? 'rgba(122, 199, 255, 0.12)' : 'var(--bg-surface-elevated)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  position: 'relative'
                }}
              >
                {theme === 'dark' && <span style={{ position: 'absolute', top: 8, right: 8, color: '#7ac7ff' }}><Check size={16} /></span>}
                <Moon size={24} color="#6366f1" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Dark Cyber</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Low Glare</span>
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textAlign: 'center' }}>
              Preference is saved and synchronized across all views.
            </p>
          </div>

          {/* Session Security Card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#059669', marginBottom: '1.25rem' }}>
              <KeyRound size={20} />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Security & Session
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>JWT Token Protocol</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>HS256 Cryptographic Signature</div>
                </div>
                <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(5, 150, 105, 0.15)', color: '#059669', fontWeight: 700 }}>
                  ACTIVE
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>Session Validity</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>7-day auto renewal period</div>
                </div>
                <Clock size={16} color="var(--text-muted)" />
              </div>
            </div>
          </div>
        </div>

        {/* Backend Infrastructure Telemetry Card */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#3c4fc9', marginBottom: '1.25rem' }}>
            <Server size={20} />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Live Infrastructure Telemetry
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Backend Service Status</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: healthStatus?.status === 'online' ? '#059669' : '#e11d48', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                <Activity size={16} />
                <span>{isCheckingHealth ? 'Pinging...' : (healthStatus?.status?.toUpperCase() || 'ONLINE')}</span>
              </div>
            </div>

            <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>API Roundtrip Latency</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3c4fc9', marginTop: '0.2rem' }}>
                {latency ? `${latency} ms` : '< 15 ms'}
              </div>
            </div>

            <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>API Engine Version</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                v{healthStatus?.version || '1.0.0'}
              </div>
            </div>

            <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Database Instance</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669', marginTop: '0.2rem' }}>
                MongoDB 8.0+
              </div>
            </div>
          </div>
        </div>

        {/* API Routes Explorer */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            REST API Endpoints Reference
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
            {apiEndpoints.map((ep, i) => (
              <a
                key={i}
                href={ep.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669' }}>{ep.method}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{ep.url}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ep.desc}</span>
                </div>
                <ExternalLink size={14} color="var(--text-muted)" />
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };
