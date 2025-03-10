import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import { partService } from '../services/partService';
import { Part, PartRequest } from '../types/models';

// Interface for the part context
interface PartContextType {
  parts: Part[];
  storeParts: Part[];
  selectedPart: Part | null;
  loading: boolean;
  error: string | null;
  fetchPublicParts: (filters?: Record<string, string>) => Promise<void>;
  fetchStoreParts: () => Promise<void>;
  fetchPart: (id: string) => Promise<void>;
  createPart: (data: PartRequest) => Promise<void>;
  updatePart: (id: string, data: Partial<PartRequest>) => Promise<void>;
  deletePart: (id: string) => Promise<void>;
  clearError: () => void;
  setSelectedPart: (part: Part | null) => void;
  retryFetch: () => void;
}

// Create the part context
const PartContext = createContext<PartContextType | undefined>(undefined);

// Props for the part provider
interface PartProviderProps {
  children: ReactNode;
}

// Maximum number of retry attempts
const MAX_RETRY_ATTEMPTS = 3;

// Mock data for when the API fails
const mockParts: Part[] = [
  {
    id: 'mock-1',
    name: 'Sample Part 1',
    description: 'This is a sample part for display when API fails',
    price: 99.99,
    imageUrl: '/public/no-image.svg',
    isAvailable: true,
    category: 'Sample',
    brand: 'Sample Brand',
    model: 'Sample Model',
    year: '2023',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mock-2',
    name: 'Sample Part 2',
    description: 'Another sample part for display when API fails',
    price: 149.99,
    imageUrl: '/public/no-image.svg',
    isAvailable: true,
    category: 'Sample',
    brand: 'Sample Brand',
    model: 'Sample Model',
    year: '2023',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Part provider component
export const PartProvider: React.FC<PartProviderProps> = ({ children }) => {
  const [parts, setParts] = useState<Part[]>([]);
  const [storeParts, setStoreParts] = useState<Part[]>([]);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const retryCountRef = useRef<Record<string, number>>({
    publicParts: 0,
    storeParts: 0,
    partDetail: 0
  });
  
  // Flag to track if component is mounted
  const isMountedRef = useRef(true);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Function to retry fetching data
  const retryFetch = useCallback(() => {
    // Reset all retry counters
    retryCountRef.current = {
      publicParts: 0,
      storeParts: 0,
      partDetail: 0
    };
    setError(null);
    fetchPublicParts();
  }, []);

  // Fetch public parts with retry logic
  const fetchPublicParts = useCallback(async (filters?: Record<string, string>): Promise<void> => {
    const retryKey = 'publicParts';
    
    if (retryCountRef.current[retryKey] >= MAX_RETRY_ATTEMPTS) {
      setError(`Failed to fetch parts after ${MAX_RETRY_ATTEMPTS} attempts. Please try again later.`);
      setLoading(false);
      
      // Use mock data when API fails
      console.log('Using mock data for parts');
      setParts(mockParts);
      return;
    }

    if (!isMountedRef.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await partService.getPublicParts(filters);
      
      if (!isMountedRef.current) return;
      
      // Handle empty array case
      if (Array.isArray(data) && data.length === 0) {
        console.log('No parts found, but request was successful');
      }
      
      setParts(data);
      // Reset retry count on success
      retryCountRef.current[retryKey] = 0;
      setLoading(false);
    } catch (error) {
      if (!isMountedRef.current) return;
      
      console.error(`Error fetching parts (attempt ${retryCountRef.current[retryKey] + 1}/${MAX_RETRY_ATTEMPTS}):`, error);
      
      // Increment retry count
      retryCountRef.current[retryKey] += 1;
      
      if (retryCountRef.current[retryKey] >= MAX_RETRY_ATTEMPTS) {
        setError(error instanceof Error ? error.message : 'Failed to fetch parts after multiple attempts');
        setLoading(false);
        
        // Use mock data when API fails
        console.log('Using mock data for parts after all retries failed');
        setParts(mockParts);
        return;
      }
      
      // Retry after a delay (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, retryCountRef.current[retryKey]), 10000);
      setTimeout(() => {
        if (isMountedRef.current) {
          fetchPublicParts(filters);
        }
      }, delay);
    }
  }, []);

  // Fetch store parts with retry logic
  const fetchStoreParts = useCallback(async (): Promise<void> => {
    const retryKey = 'storeParts';
    
    if (retryCountRef.current[retryKey] >= MAX_RETRY_ATTEMPTS) {
      setError(`Failed to fetch store parts after ${MAX_RETRY_ATTEMPTS} attempts. Please try again later.`);
      setLoading(false);
      return;
    }

    if (!isMountedRef.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await partService.getStoreParts();
      
      if (!isMountedRef.current) return;
      
      setStoreParts(data);
      // Reset retry count on success
      retryCountRef.current[retryKey] = 0;
      setLoading(false);
    } catch (error) {
      if (!isMountedRef.current) return;
      
      console.error(`Error fetching store parts (attempt ${retryCountRef.current[retryKey] + 1}/${MAX_RETRY_ATTEMPTS}):`, error);
      
      // Increment retry count
      retryCountRef.current[retryKey] += 1;
      
      if (retryCountRef.current[retryKey] >= MAX_RETRY_ATTEMPTS) {
        setError(error instanceof Error ? error.message : 'Failed to fetch store parts after multiple attempts');
        setLoading(false);
        return;
      }
      
      // Retry after a delay (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, retryCountRef.current[retryKey]), 10000);
      setTimeout(() => {
        if (isMountedRef.current) {
          fetchStoreParts();
        }
      }, delay);
    }
  }, []);

  // Fetch a specific part with retry logic
  const fetchPart = useCallback(async (id: string): Promise<void> => {
    const retryKey = 'partDetail';
    
    if (retryCountRef.current[retryKey] >= MAX_RETRY_ATTEMPTS) {
      setError(`Failed to fetch part details after ${MAX_RETRY_ATTEMPTS} attempts. Please try again later.`);
      setLoading(false);
      return;
    }

    if (!isMountedRef.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await partService.getPart(id);
      
      if (!isMountedRef.current) return;
      
      setSelectedPart(data);
      // Reset retry count on success
      retryCountRef.current[retryKey] = 0;
      setLoading(false);
    } catch (error) {
      if (!isMountedRef.current) return;
      
      console.error(`Error fetching part (attempt ${retryCountRef.current[retryKey] + 1}/${MAX_RETRY_ATTEMPTS}):`, error);
      
      // Increment retry count
      retryCountRef.current[retryKey] += 1;
      
      if (retryCountRef.current[retryKey] >= MAX_RETRY_ATTEMPTS) {
        setError(error instanceof Error ? error.message : 'Failed to fetch part details after multiple attempts');
        setLoading(false);
        return;
      }
      
      // Retry after a delay (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, retryCountRef.current[retryKey]), 10000);
      setTimeout(() => {
        if (isMountedRef.current) {
          fetchPart(id);
        }
      }, delay);
    }
  }, []);

  // Create a new part
  const createPart = async (data: PartRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newPart = await partService.createPart(data);
      setStoreParts([newPart, ...storeParts]);
    } catch (error) {
      console.error('Error creating part:', error);
      setError(error instanceof Error ? error.message : 'Failed to create part');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update a part
  const updatePart = async (id: string, data: Partial<PartRequest>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPart = await partService.updatePart(id, data);
      
      // Update in storeParts
      setStoreParts(storeParts.map(part => 
        part.id === id ? updatedPart : part
      ));
      
      // Update in parts if exists
      setParts(parts.map(part => 
        part.id === id ? updatedPart : part
      ));
      
      // Update selectedPart if it's the same
      if (selectedPart && selectedPart.id === id) {
        setSelectedPart(updatedPart);
      }
    } catch (error) {
      console.error('Error updating part:', error);
      setError(error instanceof Error ? error.message : 'Failed to update part');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a part
  const deletePart = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await partService.deletePart(id);
      
      // Remove from storeParts
      setStoreParts(storeParts.filter(part => part.id !== id));
      
      // Remove from parts if exists
      setParts(parts.filter(part => part.id !== id));
      
      // Clear selectedPart if it's the same
      if (selectedPart && selectedPart.id === id) {
        setSelectedPart(null);
      }
    } catch (error) {
      console.error('Error deleting part:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete part');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
    // Reset all retry counters
    retryCountRef.current = {
      publicParts: 0,
      storeParts: 0,
      partDetail: 0
    };
  };

  // Load public parts on mount
  useEffect(() => {
    fetchPublicParts();
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchPublicParts]);

  // Context value
  const value: PartContextType = {
    parts,
    storeParts,
    selectedPart,
    loading,
    error,
    fetchPublicParts,
    fetchStoreParts,
    fetchPart,
    createPart,
    updatePart,
    deletePart,
    clearError,
    setSelectedPart,
    retryFetch
  };

  return <PartContext.Provider value={value}>{children}</PartContext.Provider>;
};

// Custom hook to use the part context
export const useParts = (): PartContextType => {
  const context = useContext(PartContext);
  if (context === undefined) {
    throw new Error('useParts must be used within a PartProvider');
  }
  return context;
}; 