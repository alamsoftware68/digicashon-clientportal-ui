'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '@/services/api';

// Cart item interface based on your API response
interface CartItem {
  id: number;
  cartId: number;
  serviceItemId: number;
  serviceTitle: string;
  serviceDescription: string;
  categoryName: string;
  serviceIcon: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  serviceDetails: {
    id: number;
    serviceTitle: string;
    serviceDescription: string;
    bulletPoints: string[];
    serviceIcon: string;
    price: number;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  version: number;
}

interface CartSummary {
  itemCount: number;
  totalAmount: number;
  isEmpty: boolean;
}

interface CartContextType {
  // State
  cartItems: CartItem[];
  cartSummary: CartSummary;
  isLoading: boolean;
  error: string | null;

  // Actions
  addItemToCart: (serviceItemId: number, quantity?: number, notes?: string) => Promise<void>;
  removeItemFromCart: (cartItemId: number) => Promise<void>;
  updateItemQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  isServiceInCart: (serviceId: number) => boolean;
  
  // Helper methods
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    itemCount: 0,
    totalAmount: 0,
    isEmpty: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize cart on component mount
  useEffect(() => {
    refreshCart();
  }, []);

  const refreshCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch cart items and summary in parallel
      const [itemsResponse, summaryResponse] = await Promise.all([
        apiService.getCartItems(),
        apiService.getCartSummary()
      ]);
      
      if (itemsResponse.success && itemsResponse.data) {
        setCartItems(itemsResponse.data);
      } else {
        setCartItems([]);
      }
      
      if (summaryResponse.success && summaryResponse.data) {
        setCartSummary(summaryResponse.data);
      } else {
        setCartSummary({ itemCount: 0, totalAmount: 0, isEmpty: true });
      }
      
      console.log('[Cart] Refreshed cart items:', itemsResponse.data);
      console.log('[Cart] Refreshed cart summary:', summaryResponse.data);
      
    } catch (error: any) {
      console.error('[Cart] Error refreshing cart:', error);
      setError(error.message || 'Failed to load cart');
      
      // Fallback to empty cart on error
      setCartItems([]);
      setCartSummary({ itemCount: 0, totalAmount: 0, isEmpty: true });
    } finally {
      setIsLoading(false);
    }
  };

  const addItemToCart = async (serviceItemId: number, quantity: number = 1, notes?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[Cart] Adding item to cart:', { serviceItemId, quantity, notes });
      
      const response = await apiService.addItemToCart(serviceItemId, quantity, notes);
      
      if (response.success) {
        console.log('[Cart] Item added successfully:', response.data);
        
        // Refresh cart to get latest data
        await refreshCart();
        
        // Show success notification
        console.log('[Cart] ✅ Item added to cart successfully!');
      } else {
        throw new Error(response.message || 'Failed to add item to cart');
      }
      
    } catch (error: any) {
      console.error('[Cart] Error adding item to cart:', error);
      setError(error.message || 'Failed to add item to cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItemFromCart = async (cartItemId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[Cart] Removing item from cart:', cartItemId);
      
      const response = await apiService.removeItemFromCart(cartItemId);
      
      if (response.success) {
        console.log('[Cart] Item removed successfully');
        
        // Refresh cart to get latest data
        await refreshCart();
        
        // Show success notification
        console.log('[Cart] ✅ Item removed from cart successfully!');
      } else {
        throw new Error(response.message || 'Failed to remove item from cart');
      }
      
    } catch (error: any) {
      console.error('[Cart] Error removing item from cart:', error);
      setError(error.message || 'Failed to remove item from cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) {
      await removeItemFromCart(cartItemId);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[Cart] Updating item quantity:', { cartItemId, quantity });
      
      const response = await apiService.updateCartItemQuantity(cartItemId, quantity);
      
      if (response.success) {
        console.log('[Cart] Item quantity updated successfully');
        
        // Refresh cart to get latest data
        await refreshCart();
        
        // Show success notification
        console.log('[Cart] ✅ Item quantity updated successfully!');
      } else {
        throw new Error(response.message || 'Failed to update item quantity');
      }
      
    } catch (error: any) {
      console.error('[Cart] Error updating item quantity:', error);
      setError(error.message || 'Failed to update item quantity');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[Cart] Clearing cart');
      
      const response = await apiService.clearCart();
      
      if (response.success) {
        console.log('[Cart] Cart cleared successfully');
        
        // Clear local state immediately
        setCartItems([]);
        setCartSummary({ itemCount: 0, totalAmount: 0, isEmpty: true });
        
        // Show success notification
        console.log('[Cart] ✅ Cart cleared successfully!');
      } else {
        throw new Error(response.message || 'Failed to clear cart');
      }
      
    } catch (error: any) {
      console.error('[Cart] Error clearing cart:', error);
      setError(error.message || 'Failed to clear cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isServiceInCart = (serviceId: number): boolean => {
    return cartItems.some(item => item.serviceItemId === serviceId);
  };

  const getCartTotal = (): number => {
    return cartSummary.totalAmount;
  };

  const getCartItemCount = (): number => {
    return cartSummary.itemCount;
  };

  const value: CartContextType = {
    // State
    cartItems,
    cartSummary,
    isLoading,
    error,

    // Actions
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearCart,
    refreshCart,
    isServiceInCart,
    
    // Helper methods
    getCartTotal,
    getCartItemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export type { CartItem, CartSummary };