import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { MonthlyTrend } from '../../../types';
import { CustomTrendTooltip } from './CustomTrendTooltip';

interface TrendChartProps {
  monthlyTrends: MonthlyTrend[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ monthlyTrends }) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        gridColumn: '1 / -1'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="#3c4fc9" />
            <span>Monthly Cashflow & Performance Trajectory</span>
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Comparing cumulative revenue generated against operating expenses over the calendar year
          </p>
        </div>
      </div>

      <div style={{ width: '100%', height: '320px', minHeight: '320px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyTrends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTrendTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '0.8rem' }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue ($)"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRev)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expense ($)"
              stroke="#f43f5e"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorExp)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
