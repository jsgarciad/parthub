import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.post('/register', register as any);
router.post('/login', login as any);

// Protected routes
router.get('/profile', authenticateToken as any, getProfile as any);

export default router; 