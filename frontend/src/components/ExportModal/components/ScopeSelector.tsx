import React from 'react';

interface ScopeSelectorProps {
  exportScope: 'filtered' | 'all';
  setExportScope: (scope: 'filtered' | 'all') => void;
  totalFilteredCount: number;
  totalDbCount?: number;
}

export const ScopeSelector: React.FC<ScopeSelectorProps> = ({
  exportScope,
  setExportScope,
  totalFilteredCount,
  totalDbCount = 300
}) => {
  return (
    <div>
      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        1. Dataset Scope
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div
          onClick={() => setExportScope('filtered')}
          style={{
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            cursor: 'pointer',
            border: `2px solid ${exportScope === 'filtered' ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
            backgroundColor: exportScope === 'filtered' ? 'var(--color-primary-subtle)' : 'var(--bg-surface-elevated)',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: exportScope === 'filtered' ? 'var(--color-primary)' : 'var(--text-primary)' }}>
              Filtered Results
            </span>
            <span className="badge badge-user">{totalFilteredCount} rows</span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
            Only transactions matching your active table filters
          </p>
        </div>

        <div
          onClick={() => setExportScope('all')}
          style={{
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            cursor: 'pointer',
            border: `2px solid ${exportScope === 'all' ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
            backgroundColor: exportScope === 'all' ? 'var(--color-primary-subtle)' : 'var(--bg-surface-elevated)',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: exportScope === 'all' ? 'var(--color-primary)' : 'var(--text-primary)' }}>
              Entire Database
            </span>
            <span className="badge badge-paid">{totalDbCount} records</span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
            Export all historical transactions regardless of filter
          </p>
        </div>
      </div>
    </div>
  );
};
