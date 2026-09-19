import React from 'react';
import {
  Calendar,
  DollarSign,
  Tag,
  CheckCircle2,
  User,
  Link,
  Hash
} from 'lucide-react';

export interface ColumnOption {
  id: string;
  label: string;
  desc: string;
  sample: string;
  dataType: string;
  icon: React.ReactNode;
}

export interface ExportPreset {
  id: string;
  name: string;
  desc: string;
  columns: string[];
}

export const AVAILABLE_COLUMNS: ColumnOption[] = [
  {
    id: 'id',
    label: 'Transaction ID',
    desc: 'Unique identifier',
    sample: '101',
    dataType: 'Integer',
    icon: React.createElement(Hash, { size: 15, color: '#3c4fc9' })
  },
  {
    id: 'date',
    label: 'Transaction Date',
    desc: 'Timestamp (ISO-8601)',
    sample: '2024-01-15T08:34:12Z',
    dataType: 'Timestamp',
    icon: React.createElement(Calendar, { size: 15, color: '#0284c7' })
  },
  {
    id: 'amount',
    label: 'Amount ($)',
    desc: 'Transaction currency value',
    sample: '1500.00',
    dataType: 'Decimal',
    icon: React.createElement(DollarSign, { size: 15, color: '#059669' })
  },
  {
    id: 'category',
    label: 'Category',
    desc: 'Revenue or Expense',
    sample: 'Revenue',
    dataType: 'Enum',
    icon: React.createElement(Tag, { size: 15, color: '#d97706' })
  },
  {
    id: 'status',
    label: 'Settlement Status',
    desc: 'Paid or Pending state',
    sample: 'Paid',
    dataType: 'Status',
    icon: React.createElement(CheckCircle2, { size: 15, color: '#10b981' })
  },
  {
    id: 'user_id',
    label: 'User ID',
    desc: 'Assigned personnel ID',
    sample: 'user_001',
    dataType: 'String',
    icon: React.createElement(User, { size: 15, color: '#8b5cf6' })
  },
  {
    id: 'user_profile',
    label: 'User Profile URL',
    desc: 'Avatar image link',
    sample: 'https://...',
    dataType: 'URL',
    icon: React.createElement(Link, { size: 15, color: '#ec4899' })
  }
];

export const EXPORT_PRESETS: ExportPreset[] = [
  {
    id: 'full',
    name: 'Full Audit Ledger',
    desc: 'Complete 7-field compliance export',
    columns: ['id', 'date', 'amount', 'category', 'status', 'user_id', 'user_profile']
  },
  {
    id: 'executive',
    name: 'Executive Brief',
    desc: 'Financial values, dates, and category',
    columns: ['id', 'date', 'amount', 'category', 'status']
  },
  {
    id: 'accounting',
    name: 'Team & Accounts',
    desc: 'Personnel assignments and settlement status',
    columns: ['date', 'amount', 'status', 'user_id']
  }
];
