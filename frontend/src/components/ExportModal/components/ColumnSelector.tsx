import React from 'react';
import { AVAILABLE_COLUMNS, ColumnOption } from '../constants';
import { CheckSquare, Square } from 'lucide-react';

interface ColumnSelectorProps {
  selectedColumns: string[];
  toggleColumn: (colId: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  selectedColumns,
  toggleColumn,
  selectAll,
  deselectAll
}) => {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          2. Select Columns ({selectedColumns.length} of {AVAILABLE_COLUMNS.length} selected)
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={selectAll}
            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Select All
          </button>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>•</span>
          <button
            type="button"
            onClick={deselectAll}
            style={{ background: 'none', border: 'none', color: 'var(--color-danger)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Clear All
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.65rem'
        }}
      >
        {AVAILABLE_COLUMNS.map((col: ColumnOption) => {
          const isSelected = selectedColumns.includes(col.id);

          return (
            <div
              key={col.id}
              onClick={() => toggleColumn(col.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: isSelected ? 'var(--color-primary-subtle)' : 'var(--bg-surface-elevated)',
                border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', color: isSelected ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                {isSelected ? <CheckSquare size={17} /> : <Square size={17} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {col.icon}
                    <span>{col.label}</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      padding: '0.08rem 0.35rem',
                      borderRadius: '4px',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    {col.dataType}
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.15rem' }}>
                  Sample: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{col.sample}</code>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
