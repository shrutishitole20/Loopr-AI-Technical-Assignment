import api from './api';
import {
  TransactionsResponse,
  TransactionFilters,
  AnalyticsData
} from '../types';

export const transactionService = {
  async getTransactions(filters: TransactionFilters = {}): Promise<TransactionsResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 'all') {
        params.append(key, String(value));
      }
    });

    const res = await api.get<TransactionsResponse>(`/transactions?${params.toString()}`);
    return res.data;
  },

  async getAnalytics(filters: Partial<TransactionFilters> = {}): Promise<AnalyticsData> {
    const params = new URLSearchParams();

    ['startDate', 'endDate', 'user_id', 'category', 'status'].forEach((key) => {
      const val = (filters as any)[key];
      if (val && val !== 'all') {
        params.append(key, String(val));
      }
    });

    const res = await api.get<{ success: boolean; data: AnalyticsData }>(
      `/analytics?${params.toString()}`
    );
    return res.data.data;
  },

  async exportCSV(
    columns: string[],
    filters: TransactionFilters = {},
    exportAll: boolean = true,
    fileName?: string
  ): Promise<{ success: boolean; filename: string }> {
    const response = await api.post(
      '/transactions/export',
      {
        columns,
        filters,
        exportAll,
        fileName
      },
      {
        responseType: 'blob'
      }
    );

    // Extract filename from header or provide fallback
    let suggestedFileName = fileName ? `${fileName}.csv` : 'financial_transactions_export.csv';
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename="?([^";]+)"?/);
      if (match && match[1]) {
        suggestedFileName = match[1];
      }
    }

    // Trigger browser download via Blob
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', suggestedFileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true, filename: suggestedFileName };
  }
};
