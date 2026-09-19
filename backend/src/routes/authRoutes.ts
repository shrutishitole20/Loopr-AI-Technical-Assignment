import { Router } from 'express';
import { login, getMe, register } from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticateJWT, getMe);

export default router;
