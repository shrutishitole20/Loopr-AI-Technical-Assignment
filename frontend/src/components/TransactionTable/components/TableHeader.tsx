import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { TransactionFilters } from '../../../types';

interface TableHeaderProps {
  filters: TransactionFilters;
  onSort: (column: 'id' | 'date' | 'amount' | 'category' | 'status' | 'user_id') => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ filters, onSort }) => {
  const renderSortHeader = (
    label: string,
    column: 'id' | 'date' | 'amount' | 'category' | 'status' | 'user_id',
    align: 'left' | 'right' | 'center' = 'left'
  ) => {
    const isSorted = filters.sortBy === column;
    const isAsc = isSorted && filters.sortOrder === 'asc';

    return (
      <th
        onClick={() => onSort(column)}
        style={{
          padding: '0.9rem 1.15rem',
          textAlign: align,
          fontSize: '0.78rem',
          fontWeight: 700,
          color: isSorted ? 'var(--color-primary)' : 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          cursor: 'pointer',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          transition: 'color 0.15s ease'
        }}
        title={`Sort by ${label} (${isSorted ? (isAsc ? 'Ascending' : 'Descending') : 'Click to sort'})`}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start'
          }}
        >
          <span>{label}</span>
          {isSorted ? (
            isAsc ? (
              <ArrowUp size={14} color="#7ac7ff" />
            ) : (
              <ArrowDown size={14} color="#7ac7ff" />
            )
          ) : (
            <ArrowUpDown size={13} color="#64748b" style={{ opacity: 0.5 }} />
          )}
        </div>
      </th>
    );
  };

  return (
    <thead>
      <tr
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface-elevated)'
        }}
      >
        {renderSortHeader('Tx ID', 'id', 'left')}
        {renderSortHeader('Date & Time', 'date', 'left')}
        {renderSortHeader('Team Member', 'user_id', 'left')}
        {renderSortHeader('Category', 'category', 'center')}
        {renderSortHeader('Status', 'status', 'center')}
        {renderSortHeader('Amount ($)', 'amount', 'right')}
      </tr>
    </thead>
  );
};
