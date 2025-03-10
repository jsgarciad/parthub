import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Part } from '../types/models';

// Interface for cart item
interface CartItem {
  part: Part;
  quantity: number;
}

// Interface for cart context
interface CartContextType {
  cart: {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
  };
  addToCart: (part: Part, quantity?: number) => void;
  removeFromCart: (partId: string) => void;
  updateQuantity: (partId: string, quantity: number) => void;
  clearCart: () => void;
}

// Create the cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Props for the cart provider
interface CartProviderProps {
  children: ReactNode;
}

// Cart provider component
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<{
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
  }>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (part: Part, quantity = 1) => {
    setCart((prevCart) => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.items.findIndex(
        (item) => item.part.id === part.id
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        newItems = [...prevCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Add new item if it doesn't exist
        newItems = [...prevCart.items, { part, quantity }];
      }

      // Calculate new totals
      const totalItems = newItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      const totalPrice = newItems.reduce(
        (total, item) => total + item.part.price * item.quantity,
        0
      );

      return {
        items: newItems,
        totalItems,
        totalPrice,
      };
    });
  };

  // Remove item from cart
  const removeFromCart = (partId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.part.id !== partId);

      // Calculate new totals
      const totalItems = newItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      const totalPrice = newItems.reduce(
        (total, item) => total + item.part.price * item.quantity,
        0
      );

      return {
        items: newItems,
        totalItems,
        totalPrice,
      };
    });
  };

  // Update item quantity
  const updateQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(partId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item.part.id === partId ? { ...item, quantity } : item
      );

      // Calculate new totals
      const totalItems = newItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      const totalPrice = newItems.reduce(
        (total, item) => total + item.part.price * item.quantity,
        0
      );

      return {
        items: newItems,
        totalItems,
        totalPrice,
      };
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    });
  };

  // Context value
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 