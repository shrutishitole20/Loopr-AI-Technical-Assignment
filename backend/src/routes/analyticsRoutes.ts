import { Router } from 'express';
import {
  getAnalytics,
  getAnalyticsSummary,
  getMonthlyTrends
} from '../controllers/analyticsController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Protect analytics routes with JWT authentication
router.use(authenticateJWT);

router.get('/', getAnalytics);
router.get('/summary', getAnalyticsSummary);
router.get('/trends', getMonthlyTrends);

export default router;
