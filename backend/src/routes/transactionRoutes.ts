import { Router } from 'express';
import {
  getTransactions,
  getTransactionById,
  exportTransactionsCSV
} from '../controllers/transactionController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Protect all transaction routes with JWT authentication
router.use(authenticateJWT);

router.get('/', getTransactions);
router.post('/export', exportTransactionsCSV);
router.get('/:id', getTransactionById);

export default router;
