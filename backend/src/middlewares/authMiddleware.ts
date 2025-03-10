import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

// User repository
const userRepository = AppDataSource.getRepository(User);

// Interface for decoded token
interface DecodedToken {
  userId: string;
  storeId?: string;
  isAdmin: boolean;
}

// Middleware to verify JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback_secret'
    ) as DecodedToken;
    
    // Add user info to request object
    (req as any).user = decoded;
    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as any).user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
};

// Middleware to check if user has a store
export const hasStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    
    // Check if user exists and has a store
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['store']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.store) {
      return res.status(403).json({ message: 'Store access required' });
    }
    
    // Add store ID to request
    (req as any).user.storeId = user.store.id;
    
    next();
  } catch (error) {
    console.error('Error in hasStore middleware:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 