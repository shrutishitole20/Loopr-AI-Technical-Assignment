import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Users } from 'lucide-react';
import { UserBreakdown } from '../../../types';

interface UserActivityChartProps {
  data: UserBreakdown[];
}

export const UserActivityChart: React.FC<UserActivityChartProps> = ({ data }) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}
    >
      <div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={18} color="#3c4fc9" />
          <span>Team Member Financial Activity</span>
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Side-by-side revenue generated vs expense allocated per user ID
        </p>
      </div>

      <div style={{ width: '100%', height: '260px', minHeight: '260px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="userId"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: any) => [
                `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                ''
              ]}
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                fontSize: '0.8rem',
                boxShadow: 'var(--shadow-card)',
                color: 'var(--text-primary)'
              }}
              itemStyle={{
                color: 'var(--text-primary)'
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{ fontSize: '0.8rem' }}
            />
            <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
