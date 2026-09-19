import React, { useState } from 'react';
import { AVAILABLE_COLUMNS } from '../constants';
import { Eye, Code2, Table, FileText, CheckCircle2 } from 'lucide-react';

interface LiveCSVPreviewProps {
  selectedColumns: string[];
  totalRows: number;
}

export const LiveCSVPreview: React.FC<LiveCSVPreviewProps> = ({
  selectedColumns,
  totalRows
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'raw'>('table');

  const activeCols = AVAILABLE_COLUMNS.filter((c) => selectedColumns.includes(c.id));

  // Sample data records
  const sampleRows = [
    {
      id: '101',
      date: '2024-01-15T08:34:12Z',
      amount: '$1,500.00',
      category: 'Revenue',
      status: 'Paid',
      user_id: 'user_001',
      user_profile: 'https://images.unsplash.com/photo-1...'
    },
    {
      id: '102',
      date: '2024-01-15T10:12:45Z',
      amount: '$850.00',
      category: 'Expense',
      status: 'Paid',
      user_id: 'user_002',
      user_profile: 'https://images.unsplash.com/photo-2...'
    },
    {
      id: '103',
      date: '2024-01-16T09:20:00Z',
      amount: '$2,300.00',
      category: 'Revenue',
      status: 'Pending',
      user_id: 'user_001',
      user_profile: 'https://images.unsplash.com/photo-3...'
    }
  ];

  if (activeCols.length === 0) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-surface-elevated)',
          borderRadius: '12px',
          border: '1px dashed var(--border-subtle)',
          color: 'var(--text-muted)'
        }}
      >
        <FileText size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.6 }} />
        <p style={{ fontSize: '0.85rem', margin: 0 }}>
          No columns selected. Select at least one column above to preview data.
        </p>
      </div>
    );
  }

  // Generate simulated raw CSV content
  const headerLine = activeCols.map((c) => `"${c.label}"`).join(',');
  const rawCsvLines = sampleRows.map((row) =>
    activeCols
      .map((c) => {
        const val = (row as any)[c.id] || '';
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      })
      .join(',')
  );
  const rawCsvString = [headerLine, ...rawCsvLines].join('\n');

  // Estimated file size calculation: ~60 bytes per row for average selection
  const estimatedBytes = totalRows * (activeCols.length * 15 + 20);
  const estimatedKb = (estimatedBytes / 1024).toFixed(1);

  return (
    <div
      style={{
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface-elevated)',
        overflow: 'hidden'
      }}
    >
      {/* Header bar */}
      <div
        style={{
          padding: '0.65rem 1rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Eye size={15} color="#3c4fc9" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Live Export Preview (First 3 rows)
          </span>
          <span
            style={{
              fontSize: '0.68rem',
              padding: '0.1rem 0.45rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              color: '#059669',
              fontWeight: 600
            }}
          >
            ~{estimatedKb} KB ({totalRows} rows)
          </span>
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.25rem 0.55rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: viewMode === 'table' ? 'var(--color-primary)' : 'transparent',
              color: viewMode === 'table' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <Table size={13} />
            <span>Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('raw')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.25rem 0.55rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: viewMode === 'raw' ? 'var(--color-primary)' : 'transparent',
              color: viewMode === 'raw' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <Code2 size={13} />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      {viewMode === 'table' ? (
        <div style={{ overflowX: 'auto', maxHeight: '180px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface)' }}>
                {activeCols.map((c) => (
                  <th
                    key={c.id}
                    style={{
                      padding: '0.5rem 0.75rem',
                      textAlign: 'left',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                      borderBottom: '1px solid var(--border-subtle)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleRows.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: idx < sampleRows.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                  }}
                >
                  {activeCols.map((c) => (
                    <td
                      key={c.id}
                      style={{
                        padding: '0.5rem 0.75rem',
                        color: 'var(--text-primary)',
                        fontFamily: c.id === 'amount' || c.id === 'id' ? 'var(--font-mono)' : 'inherit',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {(row as any)[c.id]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <pre
          style={{
            margin: 0,
            padding: '0.75rem 1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            lineHeight: 1.6,
            color: '#7ac7ff',
            backgroundColor: '#070e28',
            overflowX: 'auto',
            maxHeight: '150px'
          }}
        >
          {rawCsvString}
        </pre>
      )}
    </div>
  );
};
