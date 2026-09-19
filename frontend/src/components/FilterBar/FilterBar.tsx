import React from 'react';
import { TransactionFilters } from '../../types';
import {
  Search,
  Filter,
  X,
  Calendar,
  DollarSign,
  User,
  RotateCcw
} from 'lucide-react';

export interface FilterBarProps {
  filters: TransactionFilters;
  onFilterChange: (newFilters: Partial<TransactionFilters>) => void;
  onReset: () => void;
  availableUsers: string[];
  totalFiltered: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  availableUsers = [],
  totalFiltered
}) => {
  const activeFilterCount = [
    filters.search,
    filters.category && filters.category !== 'all',
    filters.status && filters.status !== 'all',
    filters.user_id && filters.user_id !== 'all',
    filters.startDate,
    filters.endDate,
    filters.minAmount,
    filters.maxAmount
  ].filter(Boolean).length;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      {/* Top row: Search input + Active Filter summary + Reset button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        {/* Search bar */}
        <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: '460px' }}>
          <Search
            size={17}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            className="input-control"
            placeholder="Search by ID, User, Category, or Status..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            style={{ paddingLeft: '2.5rem', paddingRight: filters.search ? '2.5rem' : '1rem' }}
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '', page: 1 })}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Right action area: Total matching tag & Reset button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}
          >
            <Filter size={15} color="#3c4fc9" />
            <span>
              Matches: <strong style={{ color: 'var(--text-primary)' }}>{totalFiltered}</strong>
            </span>
            {activeFilterCount > 0 && (
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  backgroundColor: '#3c4fc9',
                  color: '#ffffff',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px'
                }}
              >
                {activeFilterCount} active
              </span>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.35rem', color: '#e11d48' }}
              title="Reset all filters"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Filter Controls Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '0.75rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-subtle)'
        }}
      >
        {/* Category Dropdown */}
        <div>
          <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
            Category
          </label>
          <select
            className="input-control"
            value={filters.category || 'all'}
            onChange={(e) => onFilterChange({ category: e.target.value, page: 1 })}
          >
            <option value="all">All Categories</option>
            <option value="Revenue">Revenue Only</option>
            <option value="Expense">Expense Only</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div>
          <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
            Status
          </label>
          <select
            className="input-control"
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
          >
            <option value="all">All Statuses</option>
            <option value="Paid">Paid Only</option>
            <option value="Pending">Pending Only</option>
          </select>
        </div>

        {/* Team Member Filter */}
        <div>
          <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
            Assigned User
          </label>
          <select
            className="input-control"
            value={filters.user_id || 'all'}
            onChange={(e) => onFilterChange({ user_id: e.target.value, page: 1 })}
          >
            <option value="all">All Users</option>
            {availableUsers.map((uid) => (
              <option key={uid} value={uid}>
                {uid}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
            Start Date
          </label>
          <input
            type="date"
            className="input-control"
            value={filters.startDate || ''}
            onChange={(e) => onFilterChange({ startDate: e.target.value, page: 1 })}
          />
        </div>

        {/* End Date */}
        <div>
          <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
            End Date
          </label>
          <input
            type="date"
            className="input-control"
            value={filters.endDate || ''}
            onChange={(e) => onFilterChange({ endDate: e.target.value, page: 1 })}
          />
        </div>

        {/* Min Amount */}
        <div>
          <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
            Min Amount ($)
          </label>
          <input
            type="number"
            placeholder="Min $"
            min="0"
            className="input-control"
            value={filters.minAmount !== undefined ? filters.minAmount : ''}
            onChange={(e) => onFilterChange({ minAmount: e.target.value, page: 1 })}
          />
        </div>

        {/* Max Amount */}
        <div>
          <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
            Max Amount ($)
          </label>
          <input
            type="number"
            placeholder="Max $"
            min="0"
            className="input-control"
            value={filters.maxAmount !== undefined ? filters.maxAmount : ''}
            onChange={(e) => onFilterChange({ maxAmount: e.target.value, page: 1 })}
          />
        </div>
      </div>
    </div>
  );
};
