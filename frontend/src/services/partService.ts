import { httpService } from './httpService';
import { ENDPOINTS } from '../config/api';
import { Part, PartRequest } from '../types/models';

/**
 * Part service
 */
class PartService {
  /**
   * Get all public parts
   */
  public async getPublicParts(filters?: Record<string, string>): Promise<Part[]> {
    let endpoint = ENDPOINTS.PARTS.PUBLIC;
    
    // Add query parameters if filters are provided
    if (filters && Object.keys(filters).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
      endpoint = `${endpoint}?${queryParams.toString()}`;
    }
    
    return httpService.get<Part[]>(endpoint);
  }

  /**
   * Get all parts for the authenticated store
   */
  public async getStoreParts(): Promise<Part[]> {
    return httpService.get<Part[]>(ENDPOINTS.PARTS.STORE, true);
  }

  /**
   * Get a specific part
   */
  public async getPart(id: string): Promise<Part> {
    return httpService.get<Part>(ENDPOINTS.PARTS.DETAIL(id), true);
  }

  /**
   * Create a new part
   */
  public async createPart(data: PartRequest): Promise<Part> {
    return httpService.post<Part>(ENDPOINTS.PARTS.BASE, data, true);
  }

  /**
   * Update a part
   */
  public async updatePart(id: string, data: Partial<PartRequest>): Promise<Part> {
    return httpService.put<Part>(ENDPOINTS.PARTS.DETAIL(id), data, true);
  }

  /**
   * Delete a part
   */
  public async deletePart(id: string): Promise<void> {
    return httpService.delete<void>(ENDPOINTS.PARTS.DETAIL(id), true);
  }
}

// Export a singleton instance
export const partService = new PartService(); 