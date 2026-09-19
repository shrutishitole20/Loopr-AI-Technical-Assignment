import React, { useState, useEffect } from 'react';
import { ExportModal } from '../../components/ExportModal/ExportModal';
import { transactionService } from '../../services/transactionService';
import { useAlert } from '../../context/AlertContext';
import { AnalyticsSummary, Transaction, TransactionFilters } from '../../types';
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  ShieldCheck,
  Database,
  Calendar,
  FileDown,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { showSuccess, showError } = useAlert();
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [previewData, setPreviewData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExportingPreset, setIsExportingPreset] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  const defaultFilters: TransactionFilters = {
    category: 'all',
    status: 'all',
    user_id: 'all',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    search: '',
    sortBy: 'date',
    sortOrder: 'desc'
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [analyticsRes, transRes] = await Promise.all([
          transactionService.getAnalytics({}),
          transactionService.getTransactions({ limit: 5 })
        ]);
        setSummary(analyticsRes.summary);
        setTotalCount(transRes.pagination.total);
        setPreviewData(transRes.data);
      } catch (err: any) {
        showError('Failed to load report analytics.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [showError]);

  // Direct 1-click Preset Export Handler
  const handleDownloadPreset = async (
    name: string,
    presetFilters: TransactionFilters,
    presetCols: string[],
    filePrefix: string
  ) => {
    try {
      setIsExportingPreset(name);
      const res = await transactionService.exportCSV(presetCols, presetFilters, true, filePrefix);
      showSuccess(`Exported "${res.filename}" successfully!`);
    } catch (err: any) {
      showError(`Failed to export ${name}. Please try again.`);
    } finally {
      setIsExportingPreset(null);
    }
  };

  const reportPresets = [
    {
      id: 'full',
      title: 'Full General Ledger Audit',
      desc: 'Complete 300-record financial audit export with all metadata columns.',
      icon: Database,
      iconColor: '#3c4fc9',
      badge: 'All 300 Records',
      columns: ['id', 'date', 'amount', 'category', 'status', 'user_id', 'user_profile'],
      filters: { ...defaultFilters },
      filePrefix: 'general_ledger_audit'
    },
    {
      id: 'revenue',
      title: 'Gross Revenue Pipeline Report',
      desc: 'All recorded revenue transactions, customer accounts & collection status.',
      icon: TrendingUp,
      iconColor: '#059669',
      badge: `$${summary?.totalRevenue?.toLocaleString() || '0.00'} Volume`,
      columns: ['id', 'date', 'amount', 'status', 'user_id'],
      filters: { ...defaultFilters, category: 'Revenue' },
      filePrefix: 'revenue_pipeline_report'
    },
    {
      id: 'expense',
      title: 'Operating Expenses Breakdown',
      desc: 'Itemized operational expenditures categorized across team personnel.',
      icon: TrendingDown,
      iconColor: '#e11d48',
      badge: `$${summary?.totalExpense?.toLocaleString() || '0.00'} Outflow`,
      columns: ['id', 'date', 'amount', 'status', 'user_id'],
      filters: { ...defaultFilters, category: 'Expense' },
      filePrefix: 'operating_expenses_report'
    },
    {
      id: 'pending',
      title: 'Outstanding Payables & Receivables',
      desc: 'Audit trail of all pending settlement records awaiting processing.',
      icon: Clock,
      iconColor: '#d97706',
      badge: `${summary?.pendingCount || 0} Pending Actions`,
      columns: ['id', 'date', 'amount', 'category', 'user_id'],
      filters: { ...defaultFilters, status: 'Pending' },
      filePrefix: 'pending_settlements_report'
    }
  ];

  return (
    <div style={{ padding: '1.75rem 2rem', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <FileSpreadsheet size={20} />
              </div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
                Financial Reporting & Export Studio
              </h1>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', marginBottom: 0 }}>
              Download pre-configured financial audit statements or configure custom CSV reports directly to your browser.
            </p>
          </div>

          <button
            onClick={() => setIsExportOpen(true)}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem', gap: '0.5rem' }}
          >
            <Sparkles size={16} />
            <span>Custom Export Builder</span>
          </button>
        </div>

        {/* 1-Click Ready Reports Grid */}
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Ready-to-Download Audit Reports</span>
          <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(60, 79, 201, 0.15)', color: '#3c4fc9', fontWeight: 700 }}>1-Click CSV</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {reportPresets.map((r) => {
            const IconComponent = r.icon;
            const isExportingThis = isExportingPreset === r.title;
            return (
              <div key={r.id} className="card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${r.iconColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: r.iconColor }}>
                      <IconComponent size={20} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px', background: 'var(--bg-surface-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                      {r.badge}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.35rem' }}>
                    {r.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {r.desc}
                  </p>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {r.columns.length} columns included
                  </span>
                  <button
                    onClick={() => handleDownloadPreset(r.title, r.filters, r.columns, r.filePrefix)}
                    disabled={isExportingThis}
                    className="btn btn-outline btn-sm"
                    style={{ gap: '0.4rem', padding: '0.4rem 0.85rem' }}
                  >
                    <FileDown size={14} />
                    <span>{isExportingThis ? 'Generating...' : 'Download CSV'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Data Schema Preview */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Live Dataset Schema Preview
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Sample preview of fields mapped directly to MongoDB documents
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', fontWeight: 700 }}>
              RFC 4180 Formatted
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="transaction-table" style={{ width: '100%', fontSize: '0.84rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.65rem 0.85rem' }}>ID</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Timestamp</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Amount ($)</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Category</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Status</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>User ID</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>Loading live schema preview...</td>
                  </tr>
                ) : (
                  previewData.map((row) => (
                    <tr key={row.id}>
                      <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>#{row.id}</td>
                      <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-secondary)' }}>{new Date(row.date).toLocaleDateString()}</td>
                      <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: row.category === 'Revenue' ? '#059669' : 'var(--text-primary)' }}>${row.amount.toFixed(2)}</td>
                      <td style={{ padding: '0.65rem 0.85rem' }}>
                        <span className={`badge ${row.category === 'Revenue' ? 'badge-revenue' : 'badge-expense'}`}>{row.category}</span>
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem' }}>
                        <span className={`badge ${row.status === 'Paid' ? 'badge-paid' : 'badge-pending'}`}>{row.status}</span>
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>{row.user_id}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          currentFilters={defaultFilters}
          totalFilteredCount={totalCount}
          totalDbCount={totalCount}
        />
      </div>
    );
  };
