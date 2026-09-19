import React from 'react';

export interface MetricCardItemProps {
  title: string;
  value: string;
  badge?: React.ReactNode;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  trendText?: string;
  trendPositive?: boolean;
}

export const MetricCardItem: React.FC<MetricCardItemProps> = ({
  title,
  value,
  badge,
  subtitle,
  icon,
  accentColor,
  trendText,
  trendPositive
}) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.35rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-25px',
          right: '-25px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: `${accentColor}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '0.45rem' }}>
        <span className="metric-number" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {value}
        </span>
        {badge}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
        {trendText && (
          <span style={{ color: trendPositive ? '#059669' : '#e11d48', fontWeight: 700 }}>
            {trendText}
          </span>
        )}
        <span>{subtitle}</span>
      </div>
    </div>
  );
};
