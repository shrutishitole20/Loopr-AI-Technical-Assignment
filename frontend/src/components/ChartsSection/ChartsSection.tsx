import React from 'react';
import { AnalyticsData } from '../../types';
import { TrendChart } from './components/TrendChart';
import { CategoryPieChart } from './components/CategoryPieChart';
import { UserActivityChart } from './components/UserActivityChart';

export interface ChartsSectionProps {
  analytics?: AnalyticsData;
  isLoading?: boolean;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ analytics, isLoading = false }) => {
  if (isLoading) {
    return (
      <div
        className="charts-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}
      >
        <div className="glass-panel" style={{ height: '350px', padding: '1.5rem', gridColumn: '1 / -1' }} />
        <div className="glass-panel" style={{ height: '300px', padding: '1.5rem' }} />
        <div className="glass-panel" style={{ height: '300px', padding: '1.5rem' }} />
      </div>
    );
  }

  const monthlyTrends = analytics?.monthlyTrends || [];
  const categoryBreakdown = analytics?.categoryBreakdown || [];
  const userBreakdown = analytics?.userBreakdown || [];

  return (
    <div
      className="charts-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem'
      }}
    >
      {/* 1. Monthly Revenue vs Expense Trend (Spans Full Width) */}
      <TrendChart monthlyTrends={monthlyTrends} />

      {/* 2. Category Share Breakdown (Donut Chart) */}
      <CategoryPieChart data={categoryBreakdown} />

      {/* 3. Team Member Financial Activity (Grouped Bar Chart) */}
      <UserActivityChart data={userBreakdown} />
    </div>
  );
};
