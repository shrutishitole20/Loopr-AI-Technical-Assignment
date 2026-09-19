import React from 'react';
import { Sparkles } from 'lucide-react';

interface DemoCredentialsBannerProps {
  onAutoFill: () => void;
  email: string;
  role: string;
}

export const DemoCredentialsBanner: React.FC<DemoCredentialsBannerProps> = ({
  onAutoFill,
  email,
  role
}) => {
  return (
    <div
      id="demo-auto-fill-card"
      onClick={onAutoFill}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onAutoFill()}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        backgroundColor: 'rgba(60, 79, 201, 0.05)',
        border: '1px solid #d4e0ff',
        marginBottom: '1.35rem',
        cursor: 'pointer',
        transition: 'all 0.15s ease'
      }}
      title="Click to automatically fill demo enterprise analyst credentials"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <Sparkles size={16} color="#3c4fc9" />
        <div style={{ fontSize: '0.78rem' }}>
          <strong style={{ color: '#0a0d1d', display: 'block' }}>Quick Demo Account ({role})</strong>
          <span style={{ color: '#64748b' }}>{email} / password123</span>
        </div>
      </div>
      <span
        style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '0.25rem 0.6rem',
          borderRadius: '6px',
          backgroundColor: 'rgba(60, 79, 201, 0.12)',
          color: '#3c4fc9',
          border: '1px solid rgba(60, 79, 201, 0.2)'
        }}
      >
        Auto-Fill
      </span>
    </div>
  );
};
