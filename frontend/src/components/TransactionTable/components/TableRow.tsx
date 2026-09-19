import React, { useState } from 'react';
import { Transaction } from '../../../types';
import { TrendingUp, TrendingDown, CheckCircle2, Clock, User } from 'lucide-react';

interface TableRowProps {
  tx: Transaction;
}

export const TableRow: React.FC<TableRowProps> = ({ tx }) => {
  const [imgError, setImgError] = useState<boolean>(false);
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      };
    } catch {
      return { date: dateStr, time: '' };
    }
  };

  const formatCurrency = (amount: number, category: string) => {
    const isRev = category === 'Revenue';
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(amount);

    return (
      <span
        className="metric-number"
        style={{
          fontWeight: 700,
          color: isRev ? '#10b981' : '#f43f5e',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}
      >
        {isRev ? '+' : '-'}{formatted}
      </span>
    );
  };

  const { date, time } = formatDate(tx.date);
  const isPaid = tx.status === 'Paid';
  const isRev = tx.category === 'Revenue';

  return (
    <tr
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'background-color 0.15s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {/* ID */}
      <td style={{ padding: '0.9rem 1.15rem', fontSize: '0.82rem' }}>
        <span
          className="metric-number"
          style={{
            fontWeight: 700,
            color: '#a5b4fc',
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            padding: '0.2rem 0.45rem',
            borderRadius: '6px'
          }}
        >
          #{tx.id}
        </span>
      </td>

      {/* Date & Time */}
      <td style={{ padding: '0.9rem 1.15rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{date}</div>
        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{time}</div>
      </td>

      {/* User Profile */}
      <td style={{ padding: '0.9rem 1.15rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#334155',
              border: '1.5px solid #475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {!imgError && tx.user_profile ? (
              <img
                src={tx.user_profile}
                alt={tx.user_id}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setImgError(true)}
              />
            ) : (
              <User size={15} color="#94a3b8" />
            )}
          </div>
          <span className="badge badge-user">{tx.user_id}</span>
        </div>
      </td>

      {/* Category */}
      <td style={{ padding: '0.9rem 1.15rem', textAlign: 'center' }}>
        <span className={`badge ${isRev ? 'badge-revenue' : 'badge-expense'}`}>
          {isRev ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {tx.category}
        </span>
      </td>

      {/* Status */}
      <td style={{ padding: '0.9rem 1.15rem', textAlign: 'center' }}>
        <span className={`badge ${isPaid ? 'badge-paid' : 'badge-pending'}`}>
          {isPaid ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          {tx.status}
        </span>
      </td>

      {/* Amount */}
      <td style={{ padding: '0.9rem 1.15rem', textAlign: 'right', fontSize: '0.95rem' }}>
        {formatCurrency(tx.amount, tx.category)}
      </td>
    </tr>
  );
};
