import React, { useState, useEffect, useCallback } from 'react';
import { FilterBar } from '../../components/FilterBar/FilterBar';
import { TransactionTable } from '../../components/TransactionTable/TransactionTable';
import { ExportModal } from '../../components/ExportModal/ExportModal';
import { transactionService } from '../../services/transactionService';
import { useAlert } from '../../context/AlertContext';
import { Transaction, TransactionFilters, PaginationMeta, FilteredSummary } from '../../types';
import { ReceiptText, DollarSign, TrendingUp, TrendingDown, CheckCircle2, Clock, Download } from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  const { showError, showWarning } = useAlert();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [availableUsers, setAvailableUsers] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [summary, setSummary] = useState<FilteredSummary | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<TransactionFilters>({
    category: 'all',
    status: 'all',
    user_id: 'all',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    search: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await transactionService.getTransactions(filters);
      setTransactions(res.data);
      setPagination(res.pagination);
      setSummary(res.summary);
      if (res.availableUsers && res.availableUsers.length > 0) {
        setAvailableUsers(res.availableUsers);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to load transaction ledger.';
      showError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [filters, showError]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterChange = (newFilters: Partial<TransactionFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleSort = (column: 'id' | 'date' | 'amount' | 'category' | 'status' | 'user_id') => {
    setFilters((prev) => {
      const isSameCol = prev.sortBy === column;
      const nextOrder = isSameCol && prev.sortOrder === 'asc' ? 'desc' : 'asc';
      return {
        ...prev,
        sortBy: column,
        sortOrder: nextOrder,
        page: 1
      };
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      status: 'all',
      user_id: 'all',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      search: '',
      sortBy: 'date',
      sortOrder: 'desc',
      page: 1,
      limit: 10
    });
    showWarning('Filters have been reset to default values.');
  };

  // Quick preset pills
  const presets = [
    { label: 'All Records', action: () => handleFilterChange({ category: 'all', status: 'all', minAmount: '', maxAmount: '' }) },
    { label: 'Revenue Only', action: () => handleFilterChange({ category: 'Revenue', status: 'all' }) },
    { label: 'Expenses Only', action: () => handleFilterChange({ category: 'Expense', status: 'all' }) },
    { label: 'Settled (Paid)', action: () => handleFilterChange({ status: 'Paid' }) },
    { label: 'Pending Action', action: () => handleFilterChange({ status: 'Pending' }) },
    { label: 'High Value (>$1,000)', action: () => handleFilterChange({ minAmount: '1000' }) }
  ];

  return (
    <div style={{ padding: '1.75rem 2rem', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(60, 79, 201, 0.15)', border: '1px solid rgba(122, 199, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7ac7ff' }}>
              <ReceiptText size={19} />
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
              Transaction Ledger & Records
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', marginBottom: 0 }}>
            Full financial ledger view with instant search, multi-column sorting, and configurable range filters.
          </p>
        </div>

        {/* Header Actions: Quick Presets & Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Quick Presets Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={p.action}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', borderRadius: '8px' }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button
            onClick={() => setIsExportOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3c4fc9 0%, #0284c7 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(60, 79, 201, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <Download size={15} />
            <span>Export CSV</span>
            <span
              style={{
                padding: '0.1rem 0.4rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                fontSize: '0.7rem',
                fontWeight: 700
              }}
            >
              {pagination.total}
            </span>
          </button>
        </div>
      </div>

        {/* Top KPI Metrics Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="card" style={{ padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(60, 79, 201, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3c4fc9' }}>
              <DollarSign size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Net Cashflow</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: (summary?.netBalance || 0) >= 0 ? 'var(--text-primary)' : '#e11d48' }}>
                {isLoading ? '...' : `$${(summary?.netBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(5, 150, 105, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Revenue Volume</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
                {isLoading ? '...' : `$${(summary?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(225, 29, 72, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}>
              <TrendingDown size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Expense Outflow</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e11d48' }}>
                {isLoading ? '...' : `$${(summary?.totalExpense || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Settlement Ratio</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {isLoading ? '...' : `${summary?.paidCount || 0} Paid / ${summary?.pendingCount || 0} Pending`}
              </div>
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <FilterBar
          filters={filters}
          availableUsers={availableUsers}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          totalFiltered={pagination.total}
        />

        {/* Full transaction ledger table */}
        <TransactionTable
          transactions={transactions}
          pagination={pagination}
          filters={filters}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          isLoading={isLoading}
        />

        {/* Export CSV Modal */}
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          currentFilters={filters}
          totalFilteredCount={pagination.total}
        />
      </div>
    );
  };
