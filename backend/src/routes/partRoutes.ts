import { Router } from 'express';
import { 
  createPart, 
  getStoreParts, 
  getPart, 
  updatePart, 
  deletePart,
  getAllParts
} from '../controllers/partController';
import { authenticateToken, hasStore } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/public', getAllParts as any);

// Protected routes - require authentication and store ownership
router.post('/', authenticateToken as any, hasStore as any, createPart as any);
router.get('/store', authenticateToken as any, hasStore as any, getStoreParts as any);
router.get('/:id', authenticateToken as any, hasStore as any, getPart as any);
router.put('/:id', authenticateToken as any, hasStore as any, updatePart as any);
router.delete('/:id', authenticateToken as any, hasStore as any, deletePart as any);

export default router; 