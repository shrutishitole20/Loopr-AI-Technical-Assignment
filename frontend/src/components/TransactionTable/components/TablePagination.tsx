import React from 'react';
import { PaginationMeta } from '../../../types';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

interface TablePaginationProps {
  pagination: PaginationMeta;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  pagination,
  onPageChange,
  onLimitChange
}) => {
  const { page, limit, total, totalPages } = pagination;
  const startRecord = total === 0 ? 0 : (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  return (
    <div
      className="table-pagination-container"
      style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface-elevated)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}
    >
      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        Showing <strong>{startRecord}</strong> to <strong>{endRecord}</strong> of{' '}
        <strong>{total}</strong> transactions
      </div>

      {/* Page navigation buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <button
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.4rem 0.55rem' }}
          title="First Page"
        >
          <ChevronsLeft size={15} />
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.4rem 0.55rem' }}
          title="Previous Page"
        >
          <ChevronLeft size={15} />
        </button>

        <span style={{ padding: '0 0.5rem', fontSize: '0.82rem', fontWeight: 600 }}>
          Page {page} of {Math.max(1, totalPages)}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.4rem 0.55rem' }}
          title="Next Page"
        >
          <ChevronRight size={15} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.4rem 0.55rem' }}
          title="Last Page"
        >
          <ChevronsRight size={15} />
        </button>

        {/* Rows per page selector */}
        <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Show:</span>
          <select
            className="input-control"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
};
