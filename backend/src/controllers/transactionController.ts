import { Request, Response } from 'express';
import { Transaction, ITransaction } from '../models/Transaction';
import { Parser } from 'json2csv';

const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const ALLOWED_SORT_FIELDS = ['id', 'date', 'amount', 'category', 'status', 'user_id'];

// Helper to construct Mongoose query filter from request query/body
export const buildTransactionFilter = (params: any) => {
  const filter: any = {};

  // Category filter (support comma-separated or single)
  if (params.category && params.category !== 'all') {
    const categories = Array.isArray(params.category)
      ? params.category
      : params.category.split(',').map((c: string) => c.trim());
    filter.category = { $in: categories };
  }

  // Status filter (support comma-separated or single)
  if (params.status && params.status !== 'all') {
    const statuses = Array.isArray(params.status)
      ? params.status
      : params.status.split(',').map((s: string) => s.trim());
    filter.status = { $in: statuses };
  }

  // User ID filter
  if (params.user_id && params.user_id !== 'all') {
    const userIds = Array.isArray(params.user_id)
      ? params.user_id
      : params.user_id.split(',').map((u: string) => u.trim());
    filter.user_id = { $in: userIds };
  }

  // Date range filter (with safe date validation)
  if (params.startDate || params.endDate) {
    const dateQuery: any = {};
    if (params.startDate) {
      const start = new Date(params.startDate);
      if (!isNaN(start.getTime())) {
        dateQuery.$gte = start;
      }
    }
    if (params.endDate) {
      const end = new Date(params.endDate);
      if (!isNaN(end.getTime())) {
        end.setHours(23, 59, 59, 999);
        dateQuery.$lte = end;
      }
    }
    if (Object.keys(dateQuery).length > 0) {
      filter.date = dateQuery;
    }
  }

  // Amount range filter (with safe number validation)
  if (params.minAmount !== undefined && params.minAmount !== '') {
    const min = Number(params.minAmount);
    if (!isNaN(min)) {
      filter.amount = filter.amount || {};
      filter.amount.$gte = min;
    }
  }
  if (params.maxAmount !== undefined && params.maxAmount !== '') {
    const max = Number(params.maxAmount);
    if (!isNaN(max)) {
      filter.amount = filter.amount || {};
      filter.amount.$lte = max;
    }
  }

  // Search filter across text & numeric fields (with safe regex escaping)
  if (params.search && typeof params.search === 'string' && params.search.trim()) {
    const rawSearch = params.search.trim();
    const safeRegex = escapeRegex(rawSearch);
    const isNum = !isNaN(Number(rawSearch));

    const orConditions: any[] = [
      { user_id: { $regex: safeRegex, $options: 'i' } },
      { category: { $regex: safeRegex, $options: 'i' } },
      { status: { $regex: safeRegex, $options: 'i' } }
    ];

    if (isNum) {
      orConditions.push({ id: Number(rawSearch) });
      orConditions.push({ amount: Number(rawSearch) });
    }

    filter.$or = orConditions;
  }

  return filter;
};

// GET /api/transactions
export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 10));
    const skip = (page - 1) * limit;

    const requestedSort = req.query.sortBy as string;
    const sortBy = ALLOWED_SORT_FIELDS.includes(requestedSort) ? requestedSort : 'date';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sortOptions: any = { [sortBy]: sortOrder };

    const filter = buildTransactionFilter(req.query);

    const [transactions, total, distinctUsers, summaryAgg] = await Promise.all([
      Transaction.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(filter),
      Transaction.distinct('user_id'),
      Transaction.aggregate([
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
            paidCount: {
              $sum: { $cond: [{ $eq: ['$status', 'Paid'] }, 1, 0] }
            },
            pendingCount: {
              $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
            }
          }
        }
      ])
    ]);

    const summary = summaryAgg[0] || {
      totalRevenue: 0,
      totalExpense: 0,
      paidCount: 0,
      pendingCount: 0
    };

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      availableUsers: distinctUsers.sort(),
      summary: {
        totalRevenue: Math.round(summary.totalRevenue * 100) / 100,
        totalExpense: Math.round(summary.totalExpense * 100) / 100,
        netBalance: Math.round((summary.totalRevenue - summary.totalExpense) * 100) / 100,
        paidCount: summary.paidCount,
        pendingCount: summary.pendingCount
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve transactions'
    });
  }
};

// GET /api/transactions/:id
export const getTransactionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid transaction ID format' });
      return;
    }

    const transaction = await Transaction.findOne({ id }).lean();

    if (!transaction) {
      res.status(404).json({ success: false, message: 'Transaction not found' });
      return;
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching transaction' });
  }
};

// POST /api/transactions/export
export const exportTransactionsCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const { columns, filters = {}, exportAll = true, fileName } = req.body;

    const availableFieldMap: Record<string, { label: string; value: string | ((row: any) => any) }> = {
      id: { label: 'Transaction ID', value: 'id' },
      date: {
        label: 'Date',
        value: (row: any) => (row.date ? new Date(row.date).toISOString() : '')
      },
      amount: {
        label: 'Amount ($)',
        value: (row: any) => (row.amount !== undefined ? Number(row.amount).toFixed(2) : '')
      },
      category: { label: 'Category', value: 'category' },
      status: { label: 'Status', value: 'status' },
      user_id: { label: 'User ID', value: 'user_id' },
      user_profile: { label: 'User Profile URL', value: 'user_profile' }
    };

    // Filter fields to only requested columns or default to all
    const requestedColumns: string[] =
      Array.isArray(columns) && columns.length > 0
        ? columns
        : Object.keys(availableFieldMap);

    const fields = requestedColumns
      .filter((col) => availableFieldMap[col])
      .map((col) => availableFieldMap[col]);

    if (fields.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No valid columns selected for export'
      });
      return;
    }

    const queryFilter = buildTransactionFilter(filters);
    const sortBy = ALLOWED_SORT_FIELDS.includes(filters.sortBy) ? filters.sortBy : 'date';
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;

    let query = Transaction.find(queryFilter).sort({ [sortBy]: sortOrder }).lean();

    // If not exporting all, apply pagination limits if provided
    if (!exportAll && filters.page && filters.limit) {
      const page = parseInt(filters.page, 10) || 1;
      const limit = parseInt(filters.limit, 10) || 10;
      query = query.skip((page - 1) * limit).limit(limit);
    }

    const records = await query;

    const parser = new Parser({ fields });
    const csv = parser.parse(records);

    const timestamp = new Date().toISOString().split('T')[0];
    const outputFilename = fileName
      ? `${fileName.replace(/[^a-zA-Z0-9-_]/g, '_')}.csv`
      : `financial_transactions_${timestamp}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
    res.status(200).send(csv);
  } catch (error: any) {
    console.error('[Export CSV Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate CSV export'
    });
  }
};
