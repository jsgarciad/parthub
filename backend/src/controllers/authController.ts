import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Store } from '../entities/Store';

// User repository
const userRepository = AppDataSource.getRepository(User);
const storeRepository = AppDataSource.getRepository(Store);

// Register a new user (buyer or store)
export const register = async (req: Request, res: Response) => {
  try {
    console.log('Register request received:', { ...req.body, password: '***' });
    const { username, password, email, userType, storeName, address, phone, description } = req.body;

    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { username } });
    if (existingUser) {
      console.log(`Registration failed: Username ${username} already exists`);
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User();
    user.username = username;
    user.password = hashedPassword;
    user.email = email || null;
    
    // Save user
    await userRepository.save(user);
    console.log(`User ${username} created successfully`);

    // If user type is store, create a store
    if (userType === 'store' && storeName) {
      // Create store for the user
      const store = new Store();
      store.name = storeName;
      store.address = address || null;
      store.phone = phone || null;
      store.description = description || null;
      store.user = user;

      // Save store
      await storeRepository.save(store);
      console.log(`Store ${storeName} created for user ${username}`);
      
      // Generate JWT token for store owner
      const token = jwt.sign(
        { 
          userId: user.id,
          storeId: store.id,
          isAdmin: user.isAdmin 
        },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as jwt.SignOptions
      );
      
      return res.status(201).json({ 
        message: 'Store registered successfully',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          store: {
            id: store.id,
            name: store.name
          }
        }
      });
    }
    
    // For buyer users, just return the user info
    const token = jwt.sign(
      { 
        userId: user.id,
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as jwt.SignOptions
    );
    
    return res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        store: null
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    console.log('Login request received:', { ...req.body, password: '***' });
    const { username, password } = req.body;

    // Find user
    const user = await userRepository.findOne({ 
      where: { username },
      relations: ['store']
    });

    if (!user) {
      console.log(`Login failed: User ${username} not found`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`Login failed: Invalid password for user ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`User ${username} logged in successfully`);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        storeId: user.store?.id,
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as jwt.SignOptions
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        store: user.store ? {
          id: user.store.id,
          name: user.store.name
        } : null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    console.log(`Profile request received for user ID: ${userId}`);
    
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['store']
    });

    if (!user) {
      console.log(`Profile request failed: User ID ${userId} not found`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`Profile request successful for user ${user.username}`);
    return res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      store: user.store ? {
        id: user.store.id,
        name: user.store.name,
        address: user.store.address,
        phone: user.store.phone,
        description: user.store.description
      } : null
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};