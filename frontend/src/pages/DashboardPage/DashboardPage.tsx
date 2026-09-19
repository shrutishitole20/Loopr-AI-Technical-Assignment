import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Download, TrendingUp } from 'lucide-react';
import { MetricCards } from '../../components/MetricCards/MetricCards';
import { ChartsSection } from '../../components/ChartsSection/ChartsSection';
import { FilterBar } from '../../components/FilterBar/FilterBar';
import { TransactionTable } from '../../components/TransactionTable/TransactionTable';
import { ExportModal } from '../../components/ExportModal/ExportModal';
import { transactionService } from '../../services/transactionService';
import { useAlert } from '../../context/AlertContext';
import {
  Transaction,
  TransactionFilters,
  PaginationMeta,
  AnalyticsData,
  FilteredSummary
} from '../../types';

export const DashboardPage: React.FC = () => {
  const { showError, showInfo } = useAlert();
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Filter state
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 10,
    search: '',
    category: 'all',
    status: 'all',
    user_id: 'all',
    startDate: '',
    endDate: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [availableUsers, setAvailableUsers] = useState<string[]>([]);
  const [filteredSummary, setFilteredSummary] = useState<FilteredSummary | undefined>(undefined);
  const [analytics, setAnalytics] = useState<AnalyticsData | undefined>(undefined);

  // Loading states
  const [isTableLoading, setIsTableLoading] = useState<boolean>(true);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState<boolean>(true);

  // Fetch Transactions list
  const fetchTransactions = useCallback(async () => {
    try {
      setIsTableLoading(true);
      const res = await transactionService.getTransactions(filters);
      setTransactions(res.data);
      setPagination(res.pagination);
      setAvailableUsers(res.availableUsers || []);
      setFilteredSummary(res.summary);
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to load transaction records');
    } finally {
      setIsTableLoading(false);
    }
  }, [filters, showError]);

  // Fetch Analytics & KPI summaries
  const fetchAnalytics = useCallback(async () => {
    try {
      setIsAnalyticsLoading(true);
      const data = await transactionService.getAnalytics({
        category: filters.category,
        status: filters.status,
        user_id: filters.user_id,
        startDate: filters.startDate,
        endDate: filters.endDate,
        minAmount: filters.minAmount,
        maxAmount: filters.maxAmount,
        search: filters.search
      });
      setAnalytics(data);
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to aggregate analytics data');
    } finally {
      setIsAnalyticsLoading(false);
    }
  }, [
    filters.category,
    filters.status,
    filters.user_id,
    filters.startDate,
    filters.endDate,
    filters.minAmount,
    filters.maxAmount,
    filters.search,
    showError
  ]);

  // Debounce search/filter updates
  const searchTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchTransactions();
      fetchAnalytics();
    }, 250);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [fetchTransactions, fetchAnalytics]);

  // Filter change handler
  const handleFilterChange = (newFilters: Partial<TransactionFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters
    }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: '',
      category: 'all',
      status: 'all',
      user_id: 'all',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
    showInfo('Filters reset to default.');
  };

  // Column sort handler
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

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  return (
    <div style={{ padding: '1.75rem 2rem', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
      {/* Executive Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'rgba(60, 79, 201, 0.15)',
                border: '1px solid rgba(122, 199, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7ac7ff'
              }}
            >
              <TrendingUp size={19} />
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
              Executive Analytics Overview
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', marginBottom: 0 }}>
            Real-time financial performance metrics, revenue trajectories, and expense breakdowns.
          </p>
        </div>

        {/* Quick Export CSV Action */}
        <button
          onClick={() => setIsExportOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0.6rem 1.15rem',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3c4fc9 0%, #0284c7 100%)',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(60, 79, 201, 0.35)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(60, 79, 201, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(60, 79, 201, 0.35)';
          }}
        >
          <Download size={16} />
          <span>Export CSV</span>
          <span
            style={{
              padding: '0.15rem 0.45rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
              fontSize: '0.72rem',
              fontWeight: 700
            }}
          >
            {pagination.total}
          </span>
        </button>
      </div>

      {/* Main Content Dashboard Container */}
      <main className="dashboard-container">
        {/* Metric Cards */}
        <MetricCards summary={analytics?.summary} isLoading={isAnalyticsLoading} />

        {/* Charts Section */}
        <ChartsSection analytics={analytics} isLoading={isAnalyticsLoading} />

        {/* Dynamic Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          availableUsers={availableUsers}
          totalFiltered={pagination.total}
        />

        {/* Transaction Table */}
        <TransactionTable
          transactions={transactions}
          pagination={pagination}
          filters={filters}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          isLoading={isTableLoading}
        />
      </main>

      {/* Configurable CSV Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        currentFilters={filters}
        totalFilteredCount={pagination.total}
        totalDbCount={analytics?.summary?.totalTransactions}
      />
    </div>
  );
};
