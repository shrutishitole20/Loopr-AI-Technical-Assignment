import React from 'react';
import { Transaction, PaginationMeta, TransactionFilters } from '../../types';
import { TableHeader } from './components/TableHeader';
import { TableRow } from './components/TableRow';
import { TablePagination } from './components/TablePagination';
import { Inbox } from 'lucide-react';

export interface TransactionTableProps {
  transactions: Transaction[];
  pagination: PaginationMeta;
  filters: TransactionFilters;
  onSort: (column: 'id' | 'date' | 'amount' | 'category' | 'status' | 'user_id') => void;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  isLoading?: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  pagination,
  filters,
  onSort,
  onPageChange,
  onLimitChange,
  isLoading = false
}) => {
  return (
    <div className="glass-panel" style={{ overflow: 'hidden' }}>
      {/* Table Title & Summary Header */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Transaction Ledger</span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.15rem 0.55rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc'
              }}
            >
              {pagination.total} total records
            </span>
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Real-time paginated entries loaded from MongoDB database
          </p>
        </div>
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <TableHeader filters={filters} onSort={onSort} />
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '28px', height: '28px', border: '3px solid #3c4fc9', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <span>Loading transactions...</span>
                  </div>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <Inbox size={36} color="#64748b" />
                    <strong style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>No transactions found</strong>
                    <span style={{ fontSize: '0.82rem' }}>Try adjusting your search query, status, or date range filters.</span>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((tx) => <TableRow key={tx.id} tx={tx} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <TablePagination
        pagination={pagination}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
};
