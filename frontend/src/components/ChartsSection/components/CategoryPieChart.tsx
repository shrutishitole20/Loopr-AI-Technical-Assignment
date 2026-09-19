import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { CategoryBreakdown } from '../../../types';
import { CATEGORY_COLORS } from '../constants';

interface CategoryPieChartProps {
  data: CategoryBreakdown[];
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
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
          <PieIcon size={18} color="#3c4fc9" />
          <span>Category Share Breakdown</span>
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Proportional volume comparison between Revenue and Expenses
        </p>
      </div>

      <div style={{ width: '100%', height: '260px', minHeight: '260px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell
                  key={`cell-${entry.category}`}
                  fill={CATEGORY_COLORS[entry.category] || '#94a3b8'}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [
                `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                'Total Volume'
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
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
