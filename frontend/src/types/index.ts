// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'guest' | 'registered' | 'business';
  isVerified?: boolean;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand: string;
  stock: number;
  rating: number;
  reviews: Review[];
  seller: Business;
  compatibleVehicles?: VehicleCompatibility[];
  createdAt: string;
  updatedAt: string;
}

export interface VehicleCompatibility {
  make: string;
  model: string;
  year: number;
  type: 'car' | 'motorcycle';
}

// Business/Seller types
export interface Business {
  id: string;
  name: string;
  description: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  isVerified: boolean;
  rating: number;
  reviews: Review[];
}

// Review types
export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

// Address type
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
} 