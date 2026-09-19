import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { buildTransactionFilter } from './transactionController';

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const filter = buildTransactionFilter(req.query);

    // 1. Overall Totals and Metrics
    const [overallSummary] = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $cond: [{ $eq: ['$category', 'Revenue'] }, '$amount', 0] }
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ['$category', 'Expense'] }, '$amount', 0] }
          },
          totalCount: { $sum: 1 },
          paidAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'Paid'] }, '$amount', 0] }
          },
          pendingAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, '$amount', 0] }
          },
          paidCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Paid'] }, 1, 0] }
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          }
        }
      }
    ]);

    const rev = overallSummary?.totalRevenue || 0;
    const exp = overallSummary?.totalExpense || 0;
    const net = rev - exp;
    const margin = rev > 0 ? ((net / rev) * 100).toFixed(1) : '0.0';

    // 2. Timeline Aggregation (Monthly Revenue vs Expense Trend)
    const monthlyTrends = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          revenue: {
            $sum: { $cond: [{ $eq: ['$category', 'Revenue'] }, '$amount', 0] }
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$category', 'Expense'] }, '$amount', 0] }
          },
          paidCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Paid'] }, 1, 0] }
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          totalTransactions: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const formattedMonthly = monthlyTrends.map((item) => {
      const monthIndex = item._id.month - 1;
      const monthLabel = `${monthNames[monthIndex]} ${item._id.year}`;
      const netMonth = item.revenue - item.expense;
      return {
        key: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        label: monthLabel,
        revenue: Math.round(item.revenue * 100) / 100,
        expense: Math.round(item.expense * 100) / 100,
        net: Math.round(netMonth * 100) / 100,
        paidCount: item.paidCount,
        pendingCount: item.pendingCount,
        totalTransactions: item.totalTransactions
      };
    });

    // 3. Category Breakdown (Pie/Donut data)
    const categoryBreakdown = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);

    const formattedCategories = categoryBreakdown.map((item) => ({
      category: item._id,
      amount: Math.round(item.totalAmount * 100) / 100,
      count: item.count,
      avgAmount: Math.round(item.avgAmount * 100) / 100
    }));

    // 4. Status Breakdown
    const statusBreakdown = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStatuses = statusBreakdown.map((item) => ({
      status: item._id,
      amount: Math.round(item.totalAmount * 100) / 100,
      count: item.count
    }));

    // 5. User Activity Breakdown
    const userBreakdown = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$user_id',
          revenue: {
            $sum: { $cond: [{ $eq: ['$category', 'Revenue'] }, '$amount', 0] }
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$category', 'Expense'] }, '$amount', 0] }
          },
          count: { $sum: 1 },
          user_profile: { $first: '$user_profile' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const formattedUsers = userBreakdown.map((item) => ({
      userId: item._id,
      revenue: Math.round(item.revenue * 100) / 100,
      expense: Math.round(item.expense * 100) / 100,
      net: Math.round((item.revenue - item.expense) * 100) / 100,
      count: item.count,
      user_profile: item.user_profile
    }));

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalRevenue: Math.round(rev * 100) / 100,
          totalExpense: Math.round(exp * 100) / 100,
          netBalance: Math.round(net * 100) / 100,
          profitMarginPercent: Number(margin),
          totalTransactions: overallSummary?.totalCount || 0,
          paidAmount: Math.round((overallSummary?.paidAmount || 0) * 100) / 100,
          pendingAmount: Math.round((overallSummary?.pendingAmount || 0) * 100) / 100,
          paidCount: overallSummary?.paidCount || 0,
          pendingCount: overallSummary?.pendingCount || 0,
          paidRatioPercent:
            overallSummary?.totalCount > 0
              ? Math.round(
                  ((overallSummary.paidCount || 0) / overallSummary.totalCount) * 100
                )
              : 0
        },
        monthlyTrends: formattedMonthly,
        categoryBreakdown: formattedCategories,
        statusBreakdown: formattedStatuses,
        userBreakdown: formattedUsers
      }
    });
  } catch (error: any) {
    console.error('[Analytics Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to aggregate financial analytics'
    });
  }
};

// GET /api/analytics/summary
export const getAnalyticsSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const filter = buildTransactionFilter(req.query);
    const [overallSummary] = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $cond: [{ $eq: ['$category', 'Revenue'] }, '$amount', 0] }
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ['$category', 'Expense'] }, '$amount', 0] }
          },
          totalCount: { $sum: 1 },
          paidAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'Paid'] }, '$amount', 0] }
          },
          pendingAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, '$amount', 0] }
          },
          paidCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Paid'] }, 1, 0] }
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          }
        }
      }
    ]);

    const rev = overallSummary?.totalRevenue || 0;
    const exp = overallSummary?.totalExpense || 0;
    const net = rev - exp;
    const margin = rev > 0 ? ((net / rev) * 100).toFixed(1) : '0.0';

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: Math.round(rev * 100) / 100,
        totalExpense: Math.round(exp * 100) / 100,
        netBalance: Math.round(net * 100) / 100,
        profitMarginPercent: Number(margin),
        totalTransactions: overallSummary?.totalCount || 0,
        paidAmount: Math.round((overallSummary?.paidAmount || 0) * 100) / 100,
        pendingAmount: Math.round((overallSummary?.pendingAmount || 0) * 100) / 100,
        paidCount: overallSummary?.paidCount || 0,
        pendingCount: overallSummary?.pendingCount || 0,
        paidRatioPercent:
          overallSummary?.totalCount > 0
            ? Math.round(((overallSummary.paidCount || 0) / overallSummary.totalCount) * 100)
            : 0
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch summary' });
  }
};

// GET /api/analytics/trends
export const getMonthlyTrends = async (req: Request, res: Response): Promise<void> => {
  try {
    const filter = buildTransactionFilter(req.query);
    const monthlyTrends = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          revenue: { $sum: { $cond: [{ $eq: ['$category', 'Revenue'] }, '$amount', 0] } },
          expense: { $sum: { $cond: [{ $eq: ['$category', 'Expense'] }, '$amount', 0] } },
          paidCount: { $sum: { $cond: [{ $eq: ['$status', 'Paid'] }, 1, 0] } },
          pendingCount: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          totalTransactions: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formatted = monthlyTrends.map((item) => ({
      key: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      label: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: Math.round(item.revenue * 100) / 100,
      expense: Math.round(item.expense * 100) / 100,
      net: Math.round((item.revenue - item.expense) * 100) / 100,
      paidCount: item.paidCount,
      pendingCount: item.pendingCount,
      totalTransactions: item.totalTransactions
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch trends' });
  }
};

