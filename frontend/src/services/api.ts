import axios from 'axios';
import { Product, Business, Order, User } from '../types';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Products API
export const productsApi = {
  getAll: async (_params?: { 
    category?: string; 
    brand?: string; 
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number; pages: number }> => {
    // For now, return mock data
    return {
      products: mockProducts,
      total: mockProducts.length,
      pages: 1
    };
    // In a real app:
    // const response = await api.get('/products', { params });
    // return response.data;
  },
  
  getById: async (id: string): Promise<Product> => {
    // For now, return mock data
    return mockProducts.find(p => p.id === id) || mockProducts[0];
    // In a real app:
    // const response = await api.get(`/products/${id}`);
    // return response.data;
  },
  
  getByCategory: async (category: string): Promise<Product[]> => {
    // For now, return mock data
    return mockProducts.filter(p => p.category === category);
    // In a real app:
    // const response = await api.get(`/products/category/${category}`);
    // return response.data;
  },
  
  getBySeller: async (sellerId: string): Promise<Product[]> => {
    // For now, return mock data
    return mockProducts.filter(p => p.seller.id === sellerId);
    // In a real app:
    // const response = await api.get(`/products/seller/${sellerId}`);
    // return response.data;
  },
  
  search: async (query: string): Promise<Product[]> => {
    // For now, return mock data
    return mockProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.description.toLowerCase().includes(query.toLowerCase())
    );
    // In a real app:
    // const response = await api.get(`/products/search`, { params: { query } });
    // return response.data;
  }
};

// Businesses/Sellers API
export const businessesApi = {
  getAll: async (): Promise<Business[]> => {
    // For now, return mock data
    return mockBusinesses;
    // In a real app:
    // const response = await api.get('/businesses');
    // return response.data;
  },
  
  getById: async (id: string): Promise<Business> => {
    // For now, return mock data
    return mockBusinesses.find(b => b.id === id) || mockBusinesses[0];
    // In a real app:
    // const response = await api.get(`/businesses/${id}`);
    // return response.data;
  },
  
  getVerified: async (): Promise<Business[]> => {
    // For now, return mock data
    return mockBusinesses.filter(b => b.isVerified);
    // In a real app:
    // const response = await api.get('/businesses/verified');
    // return response.data;
  }
};

// Orders API
export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    // For now, return mock data
    return mockOrders;
    // In a real app:
    // const response = await api.get('/orders');
    // return response.data;
  },
  
  getById: async (id: string): Promise<Order> => {
    // For now, return mock data
    return mockOrders.find(o => o.id === id) || mockOrders[0];
    // In a real app:
    // const response = await api.get(`/orders/${id}`);
    // return response.data;
  },
  
  create: async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    // For now, return mock data
    return {
      ...order,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    // In a real app:
    // const response = await api.post('/orders', order);
    // return response.data;
  },
  
  update: async (id: string, status: Order['status']): Promise<Order> => {
    // For now, return mock data
    const order = mockOrders.find(o => o.id === id) || mockOrders[0];
    return {
      ...order,
      status,
      updatedAt: new Date().toISOString()
    };
    // In a real app:
    // const response = await api.patch(`/orders/${id}`, { status });
    // return response.data;
  }
};

// Users API
export const usersApi = {
  login: async (email: string, _password: string): Promise<{ user: User; token: string }> => {
    // For now, return mock data
    return {
      user: {
        id: '1',
        name: 'John Doe',
        email,
        role: 'registered',
      },
      token: 'mock-token-xyz'
    };
    // In a real app:
    // const response = await api.post('/auth/login', { email, password });
    // return response.data;
  },
  
  register: async (name: string, email: string, _password: string): Promise<{ user: User; token: string }> => {
    // For now, return mock data
    return {
      user: {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        role: 'registered',
      },
      token: 'mock-token-xyz'
    };
    // In a real app:
    // const response = await api.post('/auth/register', { name, email, password });
    // return response.data;
  },
  
  getProfile: async (): Promise<User> => {
    // For now, return mock data
    return {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'registered',
    };
    // In a real app:
    // const response = await api.get('/users/profile');
    // return response.data;
  },
  
  updateProfile: async (data: Partial<User>): Promise<User> => {
    // For now, return mock data
    return {
      id: '1',
      name: data.name || 'John Doe',
      email: data.email || 'john@example.com',
      role: 'registered',
    };
    // In a real app:
    // const response = await api.patch('/users/profile', data);
    // return response.data;
  }
};

// Mock data for development
const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'AutoParts Pro',
    description: 'Quality auto parts for all makes and models',
    logo: 'https://placehold.co/200x200?text=AutoParts',
    address: '123 Main St, Anytown, USA',
    phone: '555-123-4567',
    email: 'info@autopartspro.com',
    website: 'https://autopartspro.com',
    isVerified: true,
    rating: 4.8,
    reviews: []
  },
  {
    id: '2',
    name: 'Moto Gear Shop',
    description: 'Specialized in motorcycle parts and accessories',
    logo: 'https://placehold.co/200x200?text=MotoGear',
    address: '456 Bike Ave, Riderville, USA',
    phone: '555-987-6543',
    email: 'sales@motogearshop.com',
    isVerified: true,
    rating: 4.6,
    reviews: []
  },
  {
    id: '3',
    name: 'Premium Auto Accessories',
    description: 'Luxury and performance auto accessories',
    logo: 'https://placehold.co/200x200?text=Premium',
    address: '789 Luxury Blvd, Highend, USA',
    phone: '555-456-7890',
    email: 'contact@premiumauto.com',
    website: 'https://premiumauto.com',
    isVerified: true,
    rating: 4.9,
    reviews: []
  }
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Performance Brake Pads',
    description: 'High-performance ceramic brake pads for improved stopping power and reduced brake dust.',
    price: 89.99,
    discountPrice: 79.99,
    images: ['https://placehold.co/600x400?text=Brake+Pads'],
    category: 'Brakes',
    subcategory: 'Brake Pads',
    brand: 'StopTech',
    stock: 45,
    rating: 4.7,
    reviews: [],
    seller: mockBusinesses[0],
    compatibleVehicles: [
      { make: 'Toyota', model: 'Camry', year: 2020, type: 'car' },
      { make: 'Honda', model: 'Accord', year: 2019, type: 'car' },
      { make: 'Ford', model: 'Fusion', year: 2018, type: 'car' }
    ],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2023-01-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'Motorcycle Chain Kit',
    description: 'Complete chain and sprocket kit for improved performance and durability.',
    price: 149.99,
    images: ['https://placehold.co/600x400?text=Chain+Kit'],
    category: 'Drivetrain',
    subcategory: 'Chains',
    brand: 'DID',
    stock: 20,
    rating: 4.9,
    reviews: [],
    seller: mockBusinesses[1],
    compatibleVehicles: [
      { make: 'Honda', model: 'CBR600RR', year: 2021, type: 'motorcycle' },
      { make: 'Yamaha', model: 'YZF-R6', year: 2020, type: 'motorcycle' },
      { make: 'Kawasaki', model: 'Ninja ZX-6R', year: 2019, type: 'motorcycle' }
    ],
    createdAt: '2023-02-10T10:30:00Z',
    updatedAt: '2023-02-10T10:30:00Z'
  },
  {
    id: '3',
    name: 'LED Headlight Conversion Kit',
    description: 'Upgrade your vehicle with bright, energy-efficient LED headlights.',
    price: 129.99,
    discountPrice: 99.99,
    images: ['https://placehold.co/600x400?text=LED+Headlights'],
    category: 'Lighting',
    subcategory: 'Headlights',
    brand: 'Lumens',
    stock: 35,
    rating: 4.5,
    reviews: [],
    seller: mockBusinesses[2],
    compatibleVehicles: [
      { make: 'Chevrolet', model: 'Silverado', year: 2021, type: 'car' },
      { make: 'Ford', model: 'F-150', year: 2020, type: 'car' },
      { make: 'Toyota', model: 'Tundra', year: 2019, type: 'car' }
    ],
    createdAt: '2023-03-05T14:15:00Z',
    updatedAt: '2023-03-05T14:15:00Z'
  },
  {
    id: '4',
    name: 'Performance Air Filter',
    description: 'High-flow air filter for improved engine performance and fuel efficiency.',
    price: 49.99,
    images: ['https://placehold.co/600x400?text=Air+Filter'],
    category: 'Engine',
    subcategory: 'Air Intake',
    brand: 'K&N',
    stock: 60,
    rating: 4.8,
    reviews: [],
    seller: mockBusinesses[0],
    compatibleVehicles: [
      { make: 'Subaru', model: 'WRX', year: 2022, type: 'car' },
      { make: 'Mitsubishi', model: 'Lancer Evolution', year: 2015, type: 'car' },
      { make: 'Volkswagen', model: 'Golf GTI', year: 2021, type: 'car' }
    ],
    createdAt: '2023-04-20T09:45:00Z',
    updatedAt: '2023-04-20T09:45:00Z'
  },
  {
    id: '5',
    name: 'Motorcycle Exhaust System',
    description: 'Full exhaust system for improved performance, sound, and weight reduction.',
    price: 599.99,
    discountPrice: 549.99,
    images: ['https://placehold.co/600x400?text=Exhaust'],
    category: 'Exhaust',
    subcategory: 'Full Systems',
    brand: 'Akrapovic',
    stock: 15,
    rating: 4.9,
    reviews: [],
    seller: mockBusinesses[1],
    compatibleVehicles: [
      { make: 'Ducati', model: 'Panigale V4', year: 2022, type: 'motorcycle' },
      { make: 'BMW', model: 'S1000RR', year: 2021, type: 'motorcycle' },
      { make: 'Aprilia', model: 'RSV4', year: 2020, type: 'motorcycle' }
    ],
    createdAt: '2023-05-12T11:30:00Z',
    updatedAt: '2023-05-12T11:30:00Z'
  },
  {
    id: '6',
    name: 'Premium Car Wax',
    description: 'Long-lasting carnauba wax for superior shine and protection.',
    price: 39.99,
    images: ['https://placehold.co/600x400?text=Car+Wax'],
    category: 'Detailing',
    subcategory: 'Wax',
    brand: 'Meguiar\'s',
    stock: 100,
    rating: 4.7,
    reviews: [],
    seller: mockBusinesses[2],
    createdAt: '2023-06-08T16:20:00Z',
    updatedAt: '2023-06-08T16:20:00Z'
  }
];

const mockOrders: Order[] = [
  {
    id: '1',
    userId: '1',
    items: [
      {
        productId: '1',
        productName: 'Performance Brake Pads',
        quantity: 1,
        price: 79.99,
        totalPrice: 79.99
      },
      {
        productId: '4',
        productName: 'Performance Air Filter',
        quantity: 1,
        price: 49.99,
        totalPrice: 49.99
      }
    ],
    totalAmount: 129.98,
    status: 'delivered',
    shippingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    createdAt: '2023-07-10T10:00:00Z',
    updatedAt: '2023-07-15T14:30:00Z'
  },
  {
    id: '2',
    userId: '1',
    items: [
      {
        productId: '2',
        productName: 'Motorcycle Chain Kit',
        quantity: 1,
        price: 149.99,
        totalPrice: 149.99
      }
    ],
    totalAmount: 149.99,
    status: 'shipped',
    shippingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    paymentMethod: 'PayPal',
    createdAt: '2023-08-05T15:45:00Z',
    updatedAt: '2023-08-07T09:20:00Z'
  }
];

export default api; 
