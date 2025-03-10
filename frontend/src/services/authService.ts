import { httpService } from './httpService';
import { ENDPOINTS } from '../config/api';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/models';

/**
 * Authentication service
 */
class AuthService {
  /**
   * Register a new user (buyer or store)
   */
  public async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('Registering user with data:', { ...data, password: '***' });
      const response = await httpService.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data);
      
      // Save token to localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
        console.log('Token saved after registration');
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  public async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('Logging in user:', data.username);
      const response = await httpService.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, data);
      
      // Save token to localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
        console.log('Token saved after login');
      } else {
        console.warn('No token received from login response');
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  public async getProfile(): Promise<User> {
    try {
      return await httpService.get<User>(ENDPOINTS.AUTH.PROFILE, true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      this.logout();
      throw error;
    }
  }

  /**
   * Logout user
   */
  public logout(): void {
    localStorage.removeItem('token');
    console.log('User logged out, token removed');
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    
    // Basic validation - check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      
      if (Date.now() >= expirationTime) {
        console.warn('Token expired, removing from localStorage');
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      this.logout();
      return false;
    }
  }
}

// Export a singleton instance
export const authService = new AuthService(); 