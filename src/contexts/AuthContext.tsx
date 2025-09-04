'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '@/services/api';

// Demo credentials for testing
const DEMO_CREDENTIALS = {
  admin: { mobile: '9876500000', password: 'admin123' },
  user: { mobile: '9876543210', password: 'user123' }
};

const MOCK_USER_DATA = {
  id: '1',
  username: 'admin',
  name: 'Alam Khan',
  email: 'alam@example.com',
  phone: '+91 9876500000',
  addresses: [
    {
      id: '1',
      type: 'Home',
      address: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      isDefault: true
    },
    {
      id: '2',
      type: 'Work',
      address: '456 Business Ave, Suite 200',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      isDefault: false
    }
  ],
  orders: [
    {
      id: 'ORD-2024-001',
      service: 'Laptop Screen Repair',
      services: [{ name: 'Laptop Screen Repair', price: 299.99 }],
      status: 'Completed' as const,
      date: '2024-01-15',
      price: 299.99,
      technician: 'Mike Johnson',
      address: '123 Main Street, Apt 4B'
    },
    {
      id: 'ORD-2024-002',
      service: 'Phone Battery Replacement',
      services: [{ name: 'Phone Battery Replacement', price: 89.99 }],
      status: 'In Progress' as const,
      date: '2024-01-20',
      price: 89.99,
      technician: 'Sarah Wilson',
      address: '123 Main Street, Apt 4B'
    },
    {
      id: 'ORD-2024-003',
      service: 'Tablet Screen Repair',
      services: [{ name: 'Tablet Screen Repair', price: 199.99 }],
      status: 'Pending' as const,
      date: '2024-01-25',
      price: 199.99,
      technician: 'Not Assigned',
      address: '456 Business Ave, Suite 200'
    }
  ],
  paymentMethods: [
    {
      id: '1',
      type: 'Credit Card',
      last4: '4532',
      brand: 'Visa',
      expiryMonth: '12',
      expiryYear: '2025',
      isDefault: true
    },
    {
      id: '2',
      type: 'Credit Card',
      last4: '8765',
      brand: 'MasterCard',
      expiryMonth: '06',
      expiryYear: '2026',
      isDefault: false
    }
  ],
  invoices: [
    {
      id: 'INV-2024-001',
      orderId: 'ORD-2024-001',
      date: '2024-01-15',
      amount: 299.99,
      status: 'Paid' as const,
      service: 'Laptop Screen Repair'
    },
    {
      id: 'INV-2024-002',
      orderId: 'ORD-2024-002',
      date: '2024-01-20',
      amount: 89.99,
      status: 'Pending' as const,
      service: 'Phone Battery Replacement'
    }
  ]
};

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  orders: Order[];
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
}

interface Address {
  id: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface OrderService {
  name: string;
  price: number;
}

interface Order {
  id: string;
  service: string; // Keep this for backward compatibility (main title)
  services: OrderService[]; // New field for multiple services
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  date: string;
  price: number;
  technician: string;
  address: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  brand: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  orderId: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  service: string;
}

interface SignupData {
  name: string;
  email: string;
  mobile: string;
  city: string;
  password: string;
  confirmPassword: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (mobileOrEmail: string, password: string) => Promise<boolean>;
  signup: (signupData: SignupData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  addOrder: (orderData: { services: { name: string; price: number }[], totalAmount: number, selectedAddress?: Address }) => Promise<string>;
  addAddress: (addressData: Omit<Address, 'id'>) => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Ultra-minimal state initialization - no complex logic
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Always false to prevent blocking

  // Simple initialization - hydration safe
  useEffect(() => {
    // Only run on client-side after hydration
    const initializeAuth = async () => {
      try {
        // First, check if we have user data stored in localStorage (Header component compatibility)
        const savedUser = localStorage.getItem('repairapp_user');
        const isAuthenticated = localStorage.getItem('repairapp_authenticated') === 'true';
        
        if (savedUser && isAuthenticated) {
          try {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            setIsLoggedIn(true);
            console.log('Restored user session from localStorage:', userData.name);
            return; // Successfully restored from localStorage
          } catch (parseError) {
            console.log('Failed to parse saved user data:', parseError);
            // Clear invalid data
            localStorage.removeItem('repairapp_user');
            localStorage.removeItem('repairapp_authenticated');
          }
        }
        
        // If no localStorage session, check if we have a backend token
        const token = localStorage.getItem('auth_token');
        if (token) {
          try {
            // Verify token with backend
            const result = await apiService.getCurrentUser();
            if (result.success && result.data) {
              const userData = result.data as User;
              setUser(userData);
              setIsLoggedIn(true);
              // Also save to localStorage for Header component compatibility
              localStorage.setItem('repairapp_user', JSON.stringify(userData));
              localStorage.setItem('repairapp_authenticated', 'true');
              console.log('Restored user session from backend token');
            } else {
              // Token invalid, clear it
              apiService.setToken(null);
            }
          } catch (tokenError) {
            console.log('Backend token verification failed:', tokenError);
            apiService.setToken(null);
          }
        }
        
      } catch (error) {
        console.log('Auth initialization failed:', error);
        // Clear any invalid tokens or data
        apiService.setToken(null);
        localStorage.removeItem('repairapp_user');
        localStorage.removeItem('repairapp_authenticated');
      }
    };
    
    // Initialize after component mounts (client-side only)
    initializeAuth();
  }, []);

  const login = async (mobileOrEmail: string, password: string): Promise<boolean> => {
    try {
      // Check if it's demo credentials first (for development)
      const isDemoAdmin = mobileOrEmail === DEMO_CREDENTIALS.admin.mobile && password === DEMO_CREDENTIALS.admin.password;
      const isDemoUser = mobileOrEmail === DEMO_CREDENTIALS.user.mobile && password === DEMO_CREDENTIALS.user.password;
      
      if (isDemoAdmin || isDemoUser) {
        // Use mock data for demo
        const mockUserData = isDemoAdmin ? { ...MOCK_USER_DATA } : {
          id: 'user-1',
          username: 'demo_user', 
          name: 'Demo User',
          email: 'user@example.com',
          phone: '+91 9876543210',
          addresses: [],
          orders: [],
          paymentMethods: [],
          invoices: []
        };
        
        setUser(mockUserData);
        setIsLoggedIn(true);
        
        // Persist user data for page refresh compatibility
        localStorage.setItem('repairapp_user', JSON.stringify(mockUserData));
        localStorage.setItem('repairapp_authenticated', 'true');
        localStorage.setItem('repairapp_login_time', Date.now().toString());
        
        // Dispatch auth change event
        window.dispatchEvent(new CustomEvent('authChanged', { 
          detail: { type: 'login', user: mockUserData } 
        }));
        
        return true;
      }
      
      // Check if user exists in localStorage (for registered users)
      const registeredUsers = JSON.parse(localStorage.getItem('repairapp_registered_users') || '[]');
      const localUser = registeredUsers.find((u: any) => 
        (u.mobile === mobileOrEmail || u.email === mobileOrEmail) && 
        (u.password === password || password === 'otp_login') // Allow OTP login
      );
      
      if (localUser) {
        // Create user data in expected format
        const userData = {
          id: localUser.id,
          username: localUser.mobile,
          name: localUser.name,
          email: localUser.email,
          phone: `+91 ${localUser.mobile}`,
          addresses: [],
          orders: [],
          paymentMethods: [],
          invoices: []
        };
        
        setUser(userData);
        setIsLoggedIn(true);
        
        // Persist user data for page refresh compatibility
        localStorage.setItem('repairapp_user', JSON.stringify(userData));
        localStorage.setItem('repairapp_authenticated', 'true');
        localStorage.setItem('repairapp_login_time', Date.now().toString());
        
        // Dispatch auth change event
        window.dispatchEvent(new CustomEvent('authChanged', { 
          detail: { type: 'login', user: userData } 
        }));
        
        return true;
      }
      
      // Try real backend login
      try {
        const result = await apiService.login(mobileOrEmail, password);
        
        if (result.success && result.data) {
          // Get user details
          const userResult = await apiService.getCurrentUser();
          
          if (userResult.success && userResult.data) {
            const userData = userResult.data as User;
            setUser(userData);
            setIsLoggedIn(true);
            
            // Persist user data for page refresh compatibility
            localStorage.setItem('repairapp_user', JSON.stringify(userData));
            localStorage.setItem('repairapp_authenticated', 'true');
            localStorage.setItem('repairapp_login_time', Date.now().toString());
            
            // Dispatch auth change event
            window.dispatchEvent(new CustomEvent('authChanged', { 
              detail: { type: 'login', user: userData } 
            }));
            
            return true;
          }
        }
      } catch (backendError) {
        console.log('Backend login failed:', backendError);
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const signup = async (signupData: SignupData): Promise<boolean> => {
    try {
      // Try real backend registration first
      try {
        const result = await apiService.register({
          username: signupData.mobile, // Use mobile as username
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          phone: signupData.mobile,
          otpCode: '666666' // Demo OTP code
        });
        
        if (result.success) {
          console.log('User registered successfully via backend');
          return true;
        }
      } catch (backendError) {
        console.log('Backend registration failed, using localStorage fallback:', backendError);
      }
      
      // If backend fails, fall back to localStorage for demo/development
      const existingUsers = JSON.parse(localStorage.getItem('repairapp_registered_users') || '[]');
      
      // Check if user already exists (by email or mobile)
      const userExists = existingUsers.some((user: any) => 
        user.email === signupData.email || user.mobile === signupData.mobile
      );
      if (userExists) {
        throw new Error('User with this email or mobile number already exists');
      }
      
      // Create new user in localStorage
      const newUser = {
        id: Date.now().toString(),
        name: signupData.name,
        email: signupData.email,
        mobile: signupData.mobile,
        city: signupData.city,
        password: signupData.password, // In real app, this would be hashed
        createdAt: new Date().toISOString()
      };
      
      // Add to registered users
      existingUsers.push(newUser);
      localStorage.setItem('repairapp_registered_users', JSON.stringify(existingUsers));
      
      console.log('User registered successfully via localStorage');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    
    // Clear token from API service
    apiService.logout();
    
    // Clear any remaining localStorage items
    localStorage.removeItem('repairapp_user');
    localStorage.removeItem('repairapp_authenticated');
    localStorage.removeItem('repairapp_login_time');
    
    // Dispatch auth change event for Header component
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { type: 'logout' } }));
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    
    // Save to localStorage
    localStorage.setItem('repairapp_user', JSON.stringify(updatedUser));
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // Try real backend change password
      const result = await apiService.changePassword(oldPassword, newPassword);
      return result.success;
    } catch (error) {
      console.error('Change password failed:', error);
      return false;
    }
  };

  const addOrder = async (orderData: { services: { name: string; price: number }[], totalAmount: number, selectedAddress?: Address }): Promise<string> => {
    if (!user) throw new Error('User not logged in');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate order ID
    const orderCount = user.orders.length + 1;
    const orderId = `ORD-2024-${orderCount.toString().padStart(3, '0')}`;
    
    // Determine address to use (selected address takes priority)
    let orderAddress = 'No address available';
    if (orderData.selectedAddress) {
      orderAddress = `${orderData.selectedAddress.address}, ${orderData.selectedAddress.city}, ${orderData.selectedAddress.state} ${orderData.selectedAddress.zipCode}`;
    } else if (user.addresses.length > 0) {
      const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
      orderAddress = `${defaultAddress.address}, ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.zipCode}`;
    }
    
    // Create new order
    const newOrder: Order = {
      id: orderId,
      service: orderData.services.length === 1 
        ? orderData.services[0].name 
        : `Multiple Services (${orderData.services.length} items)`,
      services: orderData.services, // Store all services
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      price: orderData.totalAmount,
      technician: 'Not Assigned',
      address: orderAddress
    };
    
    // Update user with new order
    const updatedUser = {
      ...user,
      orders: [newOrder, ...user.orders] // Add to beginning of array
    };
    
    setUser(updatedUser);
    localStorage.setItem('repairapp_user', JSON.stringify(updatedUser));
    
    return orderId;
  };

  const addAddress = async (addressData: Omit<Address, 'id'>): Promise<boolean> => {
    if (!user) throw new Error('User not logged in');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate address ID
    const addressCount = user.addresses.length + 1;
    const addressId = addressCount.toString();
    
    // Create new address
    const newAddress: Address = {
      id: addressId,
      ...addressData
    };
    
    // If this is the first address or marked as default, make it default
    let updatedAddresses = [...user.addresses];
    
    if (addressData.isDefault || user.addresses.length === 0) {
      // Remove default from other addresses
      updatedAddresses = updatedAddresses.map(addr => ({ ...addr, isDefault: false }));
      newAddress.isDefault = true;
    }
    
    // Add new address
    updatedAddresses.push(newAddress);
    
    // Update user with new address
    const updatedUser = {
      ...user,
      addresses: updatedAddresses
    };
    
    setUser(updatedUser);
    localStorage.setItem('repairapp_user', JSON.stringify(updatedUser));
    
    return true;
  };

  const cancelOrder = async (orderId: string): Promise<boolean> => {
    if (!user) throw new Error('User not logged in');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find the order to cancel
    const orderIndex = user.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    const orderToCancel = user.orders[orderIndex];
    
    // Check if order can be cancelled (only pending orders can be cancelled)
    if (orderToCancel.status !== 'Pending') {
      throw new Error('Only pending orders can be cancelled');
    }
    
    // Update the order status to cancelled
    const updatedOrders = [...user.orders];
    updatedOrders[orderIndex] = {
      ...orderToCancel,
      status: 'Cancelled'
    };
    
    // Update user with cancelled order
    const updatedUser = {
      ...user,
      orders: updatedOrders
    };
    
    setUser(updatedUser);
    localStorage.setItem('repairapp_user', JSON.stringify(updatedUser));
    
    return true;
  };

  const value: AuthContextType = {
    user,
    isLoggedIn,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    changePassword,
    addOrder,
    addAddress,
    cancelOrder
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export type { User, Address, Order, PaymentMethod, Invoice, SignupData };
