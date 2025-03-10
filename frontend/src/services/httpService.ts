import { API_BASE_URL, DEFAULT_HEADERS, ERROR_MESSAGES } from '../config/api';

/**
 * HTTP service for making API requests
 */
class HttpService {
  // Maximum number of retry attempts
  private MAX_RETRY_ATTEMPTS = 3;
  
  /**
   * Get the authorization header with the JWT token
   */
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found in localStorage');
    }
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = {};
      }
      
      const errorMessage = errorData.message || this.getErrorMessageByStatus(response.status);
      
      // Log detailed error information
      console.error(`API Error (${response.status}):`, {
        url: response.url,
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      
      throw new Error(errorMessage);
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }

    try {
      return await response.json();
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      throw new Error('Invalid response format from server');
    }
  }

  /**
   * Get error message based on HTTP status code
   */
  private getErrorMessageByStatus(status: number): string {
    switch (status) {
      case 400:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case 401:
        // Clear token if unauthorized
        console.warn('Unauthorized request detected, clearing token');
        localStorage.removeItem('token');
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return ERROR_MESSAGES.DEFAULT;
    }
  }

  /**
   * Make a request with retry logic
   */
  private async fetchWithRetry(
    url: string, 
    options: RequestInit, 
    retryCount = 0
  ): Promise<Response> {
    try {
      // Log request details in development
      const isDevelopment = import.meta.env.MODE === 'development';
      if (isDevelopment) {
        console.log(`Making ${options.method} request to ${url}`, {
          headers: options.headers,
          body: options.body ? JSON.parse(options.body as string) : undefined
        });
      }
      
      // Remove credentials option as it's causing issues
      const { credentials, ...restOptions } = options;
      
      const response = await fetch(url, options);
      
      // If the request was successful or it's a client error (4xx), don't retry
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }
      
      // If we've reached the maximum number of retries, return the response
      if (retryCount >= this.MAX_RETRY_ATTEMPTS) {
        console.warn(`Maximum retry attempts (${this.MAX_RETRY_ATTEMPTS}) reached for ${url}`);
        return response;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
      console.log(`Retrying request to ${url} in ${delay}ms (attempt ${retryCount + 1}/${this.MAX_RETRY_ATTEMPTS})`);
      
      // Wait for the delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry the request
      return this.fetchWithRetry(url, options, retryCount + 1);
    } catch (error) {
      console.error(`Network error for ${options.method} request to ${url}:`, error);
      
      // If we've reached the maximum number of retries, throw the error
      if (retryCount >= this.MAX_RETRY_ATTEMPTS) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
      console.log(`Network error, retrying request to ${url} in ${delay}ms (attempt ${retryCount + 1}/${this.MAX_RETRY_ATTEMPTS})`);
      
      // Wait for the delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry the request
      return this.fetchWithRetry(url, options, retryCount + 1);
    }
  }

  /**
   * Make a GET request
   */
  public async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    try {
      const headers = {
        ...DEFAULT_HEADERS,
        ...(requiresAuth ? this.getAuthHeader() : {}),
      };

      const response = await this.fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`GET request failed for ${endpoint}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }

  /**
   * Make a POST request
   */
  public async post<T>(endpoint: string, data: any, requiresAuth = false): Promise<T> {
    try {
      const headers = {
        ...DEFAULT_HEADERS,
        ...(requiresAuth ? this.getAuthHeader() : {}),
      };

      const response = await this.fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`POST request failed for ${endpoint}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }

  /**
   * Make a PUT request
   */
  public async put<T>(endpoint: string, data: any, requiresAuth = false): Promise<T> {
    try {
      const headers = {
        ...DEFAULT_HEADERS,
        ...(requiresAuth ? this.getAuthHeader() : {}),
      };

      const response = await this.fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`PUT request failed for ${endpoint}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }

  /**
   * Make a DELETE request
   */
  public async delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    try {
      const headers = {
        ...DEFAULT_HEADERS,
        ...(requiresAuth ? this.getAuthHeader() : {}),
      };

      const response = await this.fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`DELETE request failed for ${endpoint}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
}

// Export a singleton instance
export const httpService = new HttpService(); 