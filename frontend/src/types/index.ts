export interface Transaction {
  _id?: string;
  id: number;
  date: string;
  amount: number;
  category: 'Revenue' | 'Expense' | string;
  status: 'Paid' | 'Pending' | string;
  user_id: string;
  user_profile: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionFilters {
  search?: string;
  category?: string;
  status?: string;
  user_id?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: string | number;
  maxAmount?: string | number;
  page?: number;
  limit?: number;
  sortBy?: 'id' | 'date' | 'amount' | 'category' | 'status' | 'user_id';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilteredSummary {
  totalRevenue: number;
  totalExpense: number;
  netBalance: number;
  paidCount: number;
  pendingCount: number;
}

export interface TransactionsResponse {
  success: boolean;
  data: Transaction[];
  pagination: PaginationMeta;
  availableUsers: string[];
  summary: FilteredSummary;
}

export interface MonthlyTrend {
  key: string;
  label: string;
  revenue: number;
  expense: number;
  net: number;
  paidCount: number;
  pendingCount: number;
  totalTransactions: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  count: number;
  avgAmount: number;
}

export interface StatusBreakdown {
  status: string;
  amount: number;
  count: number;
}

export interface UserBreakdown {
  userId: string;
  revenue: number;
  expense: number;
  net: number;
  count: number;
  user_profile: string;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalExpense: number;
  netBalance: number;
  profitMarginPercent: number;
  totalTransactions: number;
  paidAmount: number;
  pendingAmount: number;
  paidCount: number;
  pendingCount: number;
  paidRatioPercent: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  monthlyTrends: MonthlyTrend[];
  categoryBreakdown: CategoryBreakdown[];
  statusBreakdown: StatusBreakdown[];
  userBreakdown: UserBreakdown[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface AlertItem {
  id: string;
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  duration?: number;
}
