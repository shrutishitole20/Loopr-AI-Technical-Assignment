import React from 'react';

export const CustomTrendTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const rev = payload.find((p: any) => p.dataKey === 'revenue')?.value || 0;
    const exp = payload.find((p: any) => p.dataKey === 'expense')?.value || 0;
    const net = rev - exp;
    const isNetPos = net >= 0;

    return (
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '0.85rem 1rem',
          boxShadow: 'var(--shadow-card)',
          fontSize: '0.8rem',
          minWidth: '180px'
        }}
      >
        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.35rem' }}>
          {label}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', color: '#10b981' }}>
          <span>Revenue:</span>
          <strong>${rev.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: '#f43f5e' }}>
          <span>Expense:</span>
          <strong>${exp.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.35rem', color: isNetPos ? '#10b981' : '#f43f5e', fontWeight: 700 }}>
          <span>Net Cashflow:</span>
          <span>{isNetPos ? '+' : ''}${net.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    );
  }
  return null;
};
