import React from 'react';
import { AnalyticsSummary } from '../../types';
import { MetricCardItem } from './components/MetricCardItem';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export interface MetricCardsProps {
  summary?: AnalyticsSummary;
  isLoading?: boolean;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ summary, isLoading = false }) => {
  const formatCurrency = (val?: number) => {
    if (val === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(val);
  };

  const netBalance = summary?.netBalance ?? 0;
  const isPositiveNet = netBalance >= 0;

  if (isLoading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-panel" style={{ padding: '1.5rem', minHeight: '140px' }}>
            <div style={{ width: '40%', height: '16px', background: 'var(--border-subtle)', borderRadius: '4px', marginBottom: '1rem' }} />
            <div style={{ width: '70%', height: '32px', background: 'var(--border-subtle)', borderRadius: '6px' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem'
      }}
    >
      {/* 1. Net Balance */}
      <MetricCardItem
        title="Net Operating Balance"
        value={formatCurrency(netBalance)}
        accentColor="#3c4fc9"
        icon={<Wallet size={20} color="#3c4fc9" />}
        badge={
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              backgroundColor: isPositiveNet ? 'rgba(5, 150, 105, 0.15)' : 'rgba(225, 29, 72, 0.15)',
              color: isPositiveNet ? '#10b981' : '#f43f5e',
              border: `1px solid ${isPositiveNet ? 'rgba(5, 150, 105, 0.25)' : 'rgba(225, 29, 72, 0.25)'}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}
          >
            {isPositiveNet ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {summary?.profitMarginPercent !== undefined ? `${summary.profitMarginPercent}%` : '0%'} Margin
          </span>
        }
        subtitle="Gross revenue minus all incurred operating expenditures"
      />

      {/* 2. Total Revenue */}
      <MetricCardItem
        title="Gross Inflow (Revenue)"
        value={formatCurrency(summary?.totalRevenue)}
        accentColor="#10b981"
        icon={<TrendingUp size={20} color="#059669" />}
        trendText={`${summary?.paidCount ?? 0} Settled`}
        trendPositive={true}
        subtitle="Incoming receipts & sales transactions"
      />

      {/* 3. Total Expense */}
      <MetricCardItem
        title="Operating Expenses"
        value={formatCurrency(summary?.totalExpense)}
        accentColor="#f43f5e"
        icon={<TrendingDown size={20} color="#e11d48" />}
        trendText={`${summary?.pendingCount ?? 0} Pending`}
        trendPositive={false}
        subtitle="Total outbound company expenditures"
      />

      {/* 4. Settlement Ratio */}
      <MetricCardItem
        title="Settlement Performance"
        value={`${summary?.paidCount ?? 0} / ${summary?.totalTransactions ?? 0}`}
        accentColor="#38bdf8"
        icon={<CheckCircle size={20} color="#0284c7" />}
        badge={
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(2, 132, 199, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(2, 132, 199, 0.25)'
            }}
          >
            {summary?.totalTransactions
              ? `${Math.round(((summary.paidCount ?? 0) / summary.totalTransactions) * 100)}%`
              : '0%'} Paid
          </span>
        }
        subtitle={`${summary?.pendingCount ?? 0} pending transactions awaiting clearance`}
      />
    </div>
  );
};
