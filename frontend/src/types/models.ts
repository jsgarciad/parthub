/**
 * User model
 */
export interface User {
  id: string;
  username: string;
  email?: string;
  isAdmin: boolean;
  store?: Store;
  createdAt: string;
  updatedAt: string;
}

/**
 * Store model
 */
export interface Store {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  description?: string;
  user?: User;
  parts?: Part[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Part model
 */
export interface Part {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  category?: string;
  brand?: string;
  model?: string;
  year?: string;
  store?: Store;
  createdAt: string;
  updatedAt: string;
}

/**
 * Auth response
 */
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

/**
 * Register request
 */
export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
  userType?: 'buyer' | 'store';
  storeName?: string;
  address?: string;
  phone?: string;
  description?: string;
}

/**
 * Login request
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Part creation/update request
 */
export interface PartRequest {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
  category?: string;
  brand?: string;
  model?: string;
  year?: string;
} 