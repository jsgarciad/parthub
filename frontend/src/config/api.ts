/**
 * API configuration for the application
 */

// Base URL for API requests
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Timeout for API requests in milliseconds
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Endpoints
export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
  },
  
  // Parts endpoints
  PARTS: {
    BASE: '/parts',
    PUBLIC: '/parts/public',
    STORE: '/parts/store',
    DETAIL: (id: string) => `/parts/${id}`,
  },
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  DEFAULT: 'Something went wrong. Please try again.',
}; 