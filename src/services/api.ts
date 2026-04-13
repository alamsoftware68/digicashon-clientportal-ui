/**
 * API Service for backend communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp?: string;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    // Initialize token from localStorage if available AND user is authenticated
    if (typeof window !== 'undefined') {
      const isAuthenticated = localStorage.getItem('repairapp_authenticated') === 'true';
      if (isAuthenticated) {
        this.token = localStorage.getItem('auth_token');
      } else {
        // Clear any stale tokens if not authenticated
        localStorage.removeItem('auth_token');
        this.token = null;
      }
    }
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private getFetchOptions(includeAuth: boolean = true): RequestInit {
    return {
      headers: this.getHeaders(includeAuth),
      credentials: 'include', // Always include credentials for session-based features (cart, etc.)
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        // Log the full error response for debugging
        console.error('[API] Error response:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          data: data
        });
        
        // Handle different HTTP error codes with specific messages
        let errorMessage = data.message || 'An error occurred';
        
        switch (response.status) {
          case 400:
            errorMessage = data.message || 'Invalid request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Authentication failed. Please check your credentials.';
            break;
          case 403:
            errorMessage = 'Access denied. You don\'t have permission to perform this action.';
            break;
          case 404:
            errorMessage = 'Service not found. Please try again later.';
            break;
          case 409:
            errorMessage = data.message || 'Conflict. The resource already exists.';
            break;
          case 422:
            errorMessage = data.message || 'Invalid data. Please check your input.';
            break;
          case 429:
            errorMessage = 'Too many requests. Please wait and try again.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          case 502:
          case 503:
          case 504:
            errorMessage = 'Service unavailable. Please try again later.';
            break;
        }
        
        throw new Error(errorMessage);
      }
      
      return data;
    } catch (error) {
      // Handle network errors or JSON parsing errors
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  // Auth API calls
  async login(mobile: string, password: string, rememberMe: boolean = false) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        ...this.getFetchOptions(false),
        body: JSON.stringify({ mobile, password, rememberMe }),
        signal: controller.signal,
      });

      const result = await this.handleResponse<{
        token: string;
        type: string;
        refreshToken: string;
        id: number;
        name: string;
        email: string;
        phone: string;
        role: string;
      }>(response);

      // Store token
      if (result.success && result.data?.token) {
        this.setToken(result.data.token);
      }

      return result;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async register(signupData: {
    username: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    otpCode: string;
  }) {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(signupData),
    });

    return this.handleResponse(response);
  }

  async getCurrentUser() {
    const response = await fetch(`${this.baseUrl}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse(response);
  }

  async logout() {
    try {
      await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(true),
      });
    } finally {
      this.setToken(null);
    }
  }

  async forgotPassword(email: string) {
    const response = await fetch(`${this.baseUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email }),
    });

    return this.handleResponse(response);
  }

  async resetPassword(email: string, otpCode: string, newPassword: string) {
    const response = await fetch(`${this.baseUrl}/auth/reset-password`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, otpCode, newPassword }),
    });

    return this.handleResponse(response);
  }

  async changePassword(oldPassword: string, newPassword: string) {
    const response = await fetch(`${this.baseUrl}/auth/change-password`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    return this.handleResponse(response);
  }

  // New Signup Flow API calls
  async sendSignupMobileOTP(mobile: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(`${this.baseUrl}/auth/signup/mobile`, {
        method: 'POST',
        ...this.getFetchOptions(false),
        body: JSON.stringify({ mobile }),
        signal: controller.signal,
      });

      return this.handleResponse<{
        nextStep: string;
        expiresAt: string;
        message: string;
        maskedMobile: string;
      }>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async verifySignupOTP(mobile: string, otpCode: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(`${this.baseUrl}/auth/signup/verify-otp`, {
        method: 'POST',
        ...this.getFetchOptions(false),
        body: JSON.stringify({ mobile, otpCode }),
        signal: controller.signal,
      });

      return this.handleResponse<{
        mobile: string;
        nextStep: string;
        message: string;
      }>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async completeSignup(signupData: {
    mobile: string;
    name: string;
    email: string;
    password: string;
    city: string;
  }) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(`${this.baseUrl}/auth/signup/complete`, {
        method: 'POST',
        ...this.getFetchOptions(false),
        body: JSON.stringify(signupData),
        signal: controller.signal,
      });

      const result = await this.handleResponse<{
        user: {
          id: number;
          name: string;
          email: string;
          mobile: string;
          city: string;
        };
        tokens: {
          token: string;
          type: string;
          refreshToken: string;
          id: number;
          name: string;
          email: string;
          phone: string;
          role: string;
        };
      }>(response);

      // Store token
      if (result.success && result.data?.tokens?.token) {
        this.setToken(result.data.tokens.token);
      }

      return result;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Login OTP Flow API calls
  async sendLoginOTP(mobile: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(`${this.baseUrl}/auth/login/send-otp`, {
        method: 'POST',
        ...this.getFetchOptions(false),
        body: JSON.stringify({ mobile }),
        signal: controller.signal,
      });

      return this.handleResponse<{
        maskedMobile: string;
        message: string;
        expiresAt: string;
        nextStep: string;
      }>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async verifyLoginOTP(mobile: string, otpCode: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(`${this.baseUrl}/auth/login/verify-otp`, {
        method: 'POST',
        ...this.getFetchOptions(false),
        body: JSON.stringify({ mobile, otpCode }),
        signal: controller.signal,
      });

      const result = await this.handleResponse<{
        token: string;
        type: string;
        refreshToken: string;
        id: number;
        name: string;
        email: string;
        phone: string;
        role: string;
      }>(response);

      // Store token
      if (result.success && result.data?.token) {
        this.setToken(result.data.token);
      }

      return result;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // OTP API calls (Legacy - keeping for backward compatibility)
  async generateSignupOTP(email: string) {
    const response = await fetch(`${this.baseUrl}/otp/generate/signup`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email }),
    });

    return this.handleResponse(response);
  }

  async verifyOTP(identifier: string, otpCode: string, otpType: string) {
    const response = await fetch(`${this.baseUrl}/otp/verify`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ identifier, otpCode, otpType }),
    });

    return this.handleResponse(response);
  }

  async resendOTP(identifier: string, otpType: string) {
    const response = await fetch(`${this.baseUrl}/otp/resend`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ identifier, otpType }),
    });

    return this.handleResponse(response);
  }

  // Service Categories API calls
  async getServiceCategories() {
    try {
      console.log('[API] Fetching service categories (no auth required)');
      const response = await fetch(`${this.baseUrl}/service-categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Explicitly omit credentials for public endpoints
      });

      console.log('[API] Service categories response status:', response.status);
      return this.handleResponse<{
        totalCategories: number;
        totalServices: number;
        availableCategories: string[];
        categoryGroups: {
          categoryId: number;
          categoryName: string;
          categoryDescription: string;
          categoryIcon: string;
          displayOrder: number;
          serviceCount: number;
          bulletPoint1: string;
          bulletPoint2: string;
          services: {
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
          }[];
        }[];
      }>(response);
    } catch (error: any) {
      console.error('[API] Get service categories error:', error);
      // Return empty result on error to prevent UI crashes
      return {
        success: false,
        message: error.message || 'Failed to fetch service categories',
        data: undefined
      };
    }
  }

  // Address Management API calls
  async getUserAddresses() {
    const response = await fetch(`${this.baseUrl}/profile/addresses`, {
      method: 'GET',
      ...this.getFetchOptions(true),
    });

    return this.handleResponse<{
      id: number;
      type: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      isDefault: boolean;
      createdAt: string;
      updatedAt: string;
      fullAddress: string;
    }[]>(response);
  }

  async addUserAddress(addressData: {
    type: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault?: boolean;
  }) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      console.log('[API] Adding address - URL:', `${this.baseUrl}/profile/addresses`);
      console.log('[API] Adding address - Request body:', JSON.stringify(addressData, null, 2));
      console.log('[API] Auth token available:', !!this.token);
      
      const response = await fetch(`${this.baseUrl}/profile/addresses`, {
        method: 'POST',
        ...this.getFetchOptions(true),
        body: JSON.stringify(addressData),
        signal: controller.signal,
      });
      
      console.log('[API] Add address response status:', response.status);
      console.log('[API] Add address response headers:', Object.fromEntries(response.headers.entries()));
      
      // Log response text for debugging
      if (!response.ok) {
        const responseText = await response.text();
        console.log('[API] Add address error response:', responseText);
        // Re-create response for handleResponse
        const newResponse = new Response(responseText, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
        return this.handleResponse(newResponse);
      }

      return this.handleResponse<{
        id: number;
        type: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        isDefault: boolean;
        createdAt: string;
        updatedAt: string;
        fullAddress: string;
      }>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      console.error('[API] Add address error:', error);
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async updateUserAddress(addressId: number, addressData: {
    type: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault?: boolean;
  }) {
    console.log('[API] Updating address - URL:', `${this.baseUrl}/profile/addresses/${addressId}`);
    console.log('[API] Updating address - Request body:', JSON.stringify(addressData, null, 2));
    const response = await fetch(`${this.baseUrl}/profile/addresses/${addressId}`, {
      method: 'PUT',
      ...this.getFetchOptions(true),
      body: JSON.stringify(addressData),
    });
    console.log('[API] Update address response status:', response.status);
    console.log('[API] Update address response headers:', Object.fromEntries(response.headers.entries()));

    return this.handleResponse<{
      id: number;
      type: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      isDefault: boolean;
      createdAt: string;
      updatedAt: string;
      fullAddress: string;
    }>(response);
  }

  async deleteUserAddress(addressId: number) {
    const response = await fetch(`${this.baseUrl}/profile/addresses/${addressId}`, {
      method: 'DELETE',
      ...this.getFetchOptions(true),
    });

    return this.handleResponse<string>(response);
  }

  async setDefaultAddress(addressId: number) {
    console.log('[API] Setting default address - URL:', `${this.baseUrl}/profile/addresses/${addressId}/default`);
    const response = await fetch(`${this.baseUrl}/profile/addresses/${addressId}/default`, {
      method: 'PUT',
      ...this.getFetchOptions(true),
    });
    console.log('[API] Set default address response status:', response.status);
    console.log('[API] Set default address response headers:', Object.fromEntries(response.headers.entries()));

    return this.handleResponse<{
      id: number;
      type: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      isDefault: boolean;
      createdAt: string;
      updatedAt: string;
      fullAddress: string;
    }>(response);
  }

  // User Profile API calls
  async getUserProfileDetails() {
    const response = await fetch(`${this.baseUrl}/users/profile/details`, {
      method: 'GET',
      ...this.getFetchOptions(true),
    });

    return this.handleResponse<{
      id: number;
      name: string;
      email: string;
      city: string;
      phone: string;
      role: string;
      isActive: boolean;
      phoneVerified: boolean;
    }>(response);
  }

  async updateUserProfile(profileData: {
    name: string;
    email: string;
    city: string;
  }) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      // Try PUT method first
      let response = await fetch(`${this.baseUrl}/users/profile/details`, {
        method: 'PUT',
        ...this.getFetchOptions(true), // Include authentication
        body: JSON.stringify(profileData),
        signal: controller.signal,
      });

      // If PUT method is not supported, try PATCH
      if (!response.ok && response.status === 405) {
        console.log('PUT method not supported, trying PATCH...');
        response = await fetch(`${this.baseUrl}/users/profile/details`, {
          method: 'PATCH',
          ...this.getFetchOptions(true), // Include authentication
          body: JSON.stringify(profileData),
          signal: controller.signal,
        });
      }

      return this.handleResponse<{
        id: number;
        name: string;
        email: string;
        city: string;
        phone: string;
        role: string;
        isActive: boolean;
        phoneVerified: boolean;
      }>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      
      // Enhanced error logging for debugging
      console.error('Profile update error:', {
        error: error.message,
        endpoint: `${this.baseUrl}/users/profile/details`,
        data: profileData
      });
      
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Cart API calls
  async addItemToCart(serviceItemId: number, quantity: number = 1, notes?: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      const requestBody: any = { serviceItemId, quantity };
      if (notes) {
        requestBody.notes = notes;
      }

      const response = await fetch(`${this.baseUrl}/service-carts/items`, {
        method: 'POST',
        ...this.getFetchOptions(false), // Try without auth first, then with auth if needed
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      return this.handleResponse<{
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
      }>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async getCartItems() {
    try {
      const response = await fetch(`${this.baseUrl}/service-carts/items`, {
        method: 'GET',
        ...this.getFetchOptions(false),
      });

      return this.handleResponse<any[]>(response);
    } catch (error) {
      console.error('Get cart items error:', error);
      throw error;
    }
  }

  async getCartSummary() {
    try {
      const response = await fetch(`${this.baseUrl}/service-carts/summary`, {
        method: 'GET',
        ...this.getFetchOptions(false),
      });

      return this.handleResponse<{
        itemCount: number;
        totalAmount: number;
        isEmpty: boolean;
      }>(response);
    } catch (error) {
      console.error('Get cart summary error:', error);
      throw error;
    }
  }

  async updateCartItemQuantity(cartItemId: number, quantity: number) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      const response = await fetch(`${this.baseUrl}/service-carts/items/${cartItemId}`, {
        method: 'PUT',
        ...this.getFetchOptions(false),
        body: JSON.stringify({ quantity }),
        signal: controller.signal,
      });

      return this.handleResponse(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async removeItemFromCart(cartItemId: number) {
    try {
      const response = await fetch(`${this.baseUrl}/service-carts/items/${cartItemId}`, {
        method: 'DELETE',
        ...this.getFetchOptions(false),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Remove cart item error:', error);
      throw error;
    }
  }

  async clearCart() {
    try {
      const response = await fetch(`${this.baseUrl}/service-carts/clear`, {
        method: 'DELETE',
        ...this.getFetchOptions(false),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    }
  }

  async isServiceInCart(serviceId: number) {
    try {
      const response = await fetch(`${this.baseUrl}/service-carts/check-service/${serviceId}`, {
        method: 'GET',
        ...this.getFetchOptions(false),
      });

      return this.handleResponse<{
        serviceId: number;
        isInCart: boolean;
      }>(response);
    } catch (error) {
      console.error('Check service in cart error:', error);
      throw error;
    }
  }

  // Order API calls
  async createOrder(orderData: {
    services: {
      serviceId: number;
      name: string;
      categoryName: string;
      serviceTitle: string;
      price: number;
      quantity: number;
      notes?: string;
    }[];
    addressId: number;
    totalAmount: number;
    problemDescription: string;
    customerNotes?: string;
  }) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      console.log('[API] Creating order with new endpoint:', orderData);
      
      const response = await fetch(`${this.baseUrl}/orders/create`, {
        method: 'POST',
        ...this.getFetchOptions(true),
        body: JSON.stringify(orderData),
        signal: controller.signal,
      });

      return this.handleResponse<{
        id: number;
        createdAt: string;
        updatedAt: string;
        version: number;
        orderNumber: string;
        status: string;
        totalPrice: number;
        problemDescription: string;
        solutionDescription?: string;
        scheduledDate?: string;
        completedDate?: string;
        pickupAddress: string;
        customerNotes?: string;
        technicianNotes?: string;
        service: {
          id: number;
          createdAt: string;
          updatedAt: string;
          version: number;
          name: string;
          description: string;
          deviceType: string;
          basePrice: number;
          estimatedDurationHours: number;
          isActive: boolean;
          isFeatured: boolean;
          imageUrl?: string;
          badge?: string;
        };
        orderItems: {
          id: number;
          createdAt: string;
          updatedAt: string;
          version: number;
          quantity: number;
          unitPrice: number;
          totalPrice: number;
          notes?: string;
          service: {
            id: number;
            createdAt: string;
            updatedAt: string;
            version: number;
            name: string;
            description: string;
            deviceType: string;
            basePrice: number;
            estimatedDurationHours: number;
            isActive: boolean;
            isFeatured: boolean;
            imageUrl?: string;
            badge?: string;
          };
          serviceName: string;
          serviceCategory: string;
          serviceTitle: string;
          serviceItemId: number;
        }[];
        technician?: any;
        address: {
          id: number;
          createdAt: string;
          updatedAt: string;
          version: number;
          type: string;
          address: string;
          city: string;
          state: string;
          zipCode: string;
          isDefault: boolean;
          fullAddress: string;
        };
      }>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async createOrderFromCart(orderData: {
    deliveryAddress: any;
    contactIdentifier: string;
    otpCode: string;
    notes?: string;
  }) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      const response = await fetch(`${this.baseUrl}/orders/create-from-cart`, {
        method: 'POST',
        ...this.getFetchOptions(true),
        body: JSON.stringify(orderData),
        signal: controller.signal,
      });

      return this.handleResponse(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // New Service Cart Order Placement API
  async placeOrderFromCart(orderData: {
    addressId: number;
    problemDescription: string;
    customerNotes?: string;
  }) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      const response = await fetch(`${this.baseUrl}/service-carts/place-order`, {
        method: 'POST',
        ...this.getFetchOptions(true),
        body: JSON.stringify(orderData),
        signal: controller.signal,
      });

      return this.handleResponse<{
        id: number;
        orderNumber: string;
        status: string;
        totalPrice: number;
        createdAt: string;
        problemDescription?: string;
        customerNotes?: string;
        // FIXED: Actual cart items are now stored and returned
        services: {
          name: string;        // "MacBook" (actual cart item name)
          category: string;    // "Home Visit" (actual cart category) 
          quantity: number;
          price: number;
          totalPrice: number;
        }[];
        // Backward compatibility fields
        totalAmount?: number;
        address?: string;
        orderId?: number;
        success?: boolean;
        message?: string;
        orderDate?: string;
        itemCount?: number;
      }>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Get User's Orders
  async getMyOrders() {
    try {
      console.log('[API] Fetching user orders from /orders/my-orders');
      
      const response = await fetch(`${this.baseUrl}/orders/my-orders`, {
        method: 'GET',
        ...this.getFetchOptions(true),
      });

      const result = await this.handleResponse<{
        id: number;
        createdAt: string;
        updatedAt: string;
        version: number;
        orderNumber: string;
        status: string;
        totalPrice: number;
        problemDescription: string;
        solutionDescription?: string;
        scheduledDate?: string;
        completedDate?: string;
        pickupAddress: string;
        customerNotes?: string;
        technicianNotes?: string;
        // *** ENHANCED: Now includes orderItems with new fields ***
        orderItems: {
          id: number;
          quantity: number;
          unitPrice: number;
          totalPrice: number;
          notes?: string;
          serviceName?: string;      // "MacBook" - from new column
          serviceCategory?: string;  // "Home Visit" - from new column  
          serviceTitle?: string;     // "MacBook Pro" - from new column
          serviceItemId?: number;    // ID from service_items table
          service: {
            id: number;
            name: string;
            description: string;
            deviceType: string;
            basePrice: number;
            estimatedDurationHours: number;
            isActive: boolean;
            isFeatured: boolean;
            imageUrl?: string;
            badge?: string;
          };
        }[];
        // Backward compatibility: Keep original service reference
        service?: {
          id: number;
          name: string;
          description: string;
          deviceType: string;
          basePrice: number;
          estimatedDurationHours: number;
          isActive: boolean;
          isFeatured: boolean;
          imageUrl?: string;
          badge?: string;
        };
        technician?: any;
        address: {
          id: number;
          type: string;
          address: string;
          city: string;
          state: string;
          zipCode: string;
          isDefault: boolean;
          fullAddress: string;
        };
      }[]>(response);
      
      console.log('[API] Successfully fetched user orders:', result.data?.length);
      
      // Debug log the orderItems structure
      if (result.data && result.data.length > 0) {
        result.data.forEach((order, index) => {
          console.log(`[API] Order ${index + 1} (${order.orderNumber}):`, {
            orderItemsCount: order.orderItems?.length || 0,
            orderItems: order.orderItems?.map(item => ({
              serviceName: item.serviceName,
              serviceCategory: item.serviceCategory,
              serviceTitle: item.serviceTitle,
              serviceItemId: item.serviceItemId
            }))
          });
        });
      }
      
      return result;
    } catch (error) {
      console.error('[API] Get orders error:', error);
      throw error;
    }
  }

  // Get Order Details by Order Number
  async getOrderDetails(orderNumber: string) {
    try {
      console.log('[API] Fetching order details for order:', orderNumber);
      
      const response = await fetch(`${this.baseUrl}/orders/details/${orderNumber}`, {
        method: 'GET',
        ...this.getFetchOptions(true),
      });

      const result = await this.handleResponse<{
        id: number;
        createdAt: string;
        updatedAt: string;
        version: number;
        orderNumber: string;
        status: string;
        totalPrice: number;
        problemDescription: string;
        solutionDescription?: string;
        scheduledDate?: string;
        completedDate?: string;
        pickupAddress: string;
        customerNotes?: string;
        technicianNotes?: string;
        // Complete orderItems with all new fields
        orderItems: {
          id: number;
          createdAt: string;
          updatedAt: string;
          version: number;
          quantity: number;
          unitPrice: number;
          totalPrice: number;
          notes?: string;
          serviceName?: string;      // "MacBook Pro" - from new column
          serviceCategory?: string;  // "Home Visit" - from new column  
          serviceTitle?: string;     // "Data Recovery" - from new column
          serviceItemId?: number;    // ID from service_items table
          service: {
            id: number;
            createdAt: string;
            updatedAt: string;
            version: number;
            name: string;
            description: string;
            deviceType: string;
            basePrice: number;
            estimatedDurationHours: number;
            isActive: boolean;
            isFeatured: boolean;
            imageUrl?: string;
            badge?: string;
          };
        }[];
        // Main service for backward compatibility
        service?: {
          id: number;
          createdAt: string;
          updatedAt: string;
          version: number;
          name: string;
          description: string;
          deviceType: string;
          basePrice: number;
          estimatedDurationHours: number;
          isActive: boolean;
          isFeatured: boolean;
          imageUrl?: string;
          badge?: string;
        };
        technician?: any;
        address: {
          id: number;
          createdAt: string;
          updatedAt: string;
          version: number;
          type: string;
          address: string;
          city: string;
          state: string;
          zipCode: string;
          isDefault: boolean;
          fullAddress: string;
        };
      }>(response);
      
      console.log('[API] Successfully fetched order details:', {
        orderNumber: result.data?.orderNumber,
        orderItemsCount: result.data?.orderItems?.length || 0,
        status: result.data?.status
      });
      
      // Debug log the orderItems structure
      if (result.data?.orderItems) {
        result.data.orderItems.forEach((item, index) => {
          console.log(`[API] OrderItem ${index + 1}:`, {
            serviceName: item.serviceName,
            serviceCategory: item.serviceCategory,
            serviceTitle: item.serviceTitle,
            serviceItemId: item.serviceItemId,
            unitPrice: item.unitPrice
          });
        });
      }
      
      return result;
    } catch (error) {
      console.error('[API] Get order details error:', error);
      throw error;
    }
  }

  // Cancel Order by ID
  async cancelOrder(orderId: number, reason: string = 'Customer cancelled') {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}/cancel?reason=${encodeURIComponent(reason)}`, {
        method: 'PUT',
        ...this.getFetchOptions(true),
        signal: controller.signal,
      });

      return this.handleResponse(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Utility methods
  async checkEmailAvailability(email: string) {
    const response = await fetch(`${this.baseUrl}/auth/check-email?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }

  async checkUsernameAvailability(username: string) {
    const response = await fetch(`${this.baseUrl}/auth/check-username?username=${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }

  // ========================================
  // Device Configuration APIs
  // ========================================

  /**
   * Get all enabled super categories
   */
  async getSuperCategories() {
    try {
      console.log('[API] Fetching super categories');
      const response = await fetch(`${this.baseUrl}/devices/config/super-categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<{
        id: number;
        name: string;
        description: string;
        bullet1: string;
        bullet2: string;
        bullet3: string;
        iconUrl: string | null;
        enabled: boolean;
      }[]>(response);
    } catch (error: any) {
      console.error('[API] Get super categories error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch super categories',
        data: undefined
      };
    }
  }

  /**
   * Get all enabled brands
   * Optionally filter by type (e.g., "Laptop", "Mobile")
   */
  async getBrands(type?: string) {
    try {
      console.log('[API] Fetching brands', type ? `for type: ${type}` : '');
      const url = type
        ? `${this.baseUrl}/devices/config/brands?type=${encodeURIComponent(type)}`
        : `${this.baseUrl}/devices/config/brands`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<{
        id: number;
        name: string;
        brandType: string;
        iconUrl: string | null;
        enabled: boolean;
      }[]>(response);
    } catch (error: any) {
      console.error('[API] Get brands error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch brands',
        data: undefined
      };
    }
  }

  /**
   * Get all enabled models for a specific brand
   */
  async getBrandModels(brandId: number, type?: string) {
    try {
      console.log('[API] Fetching models for brand ID:', brandId, 'type:', type);
      const url = type
        ? `${this.baseUrl}/devices/config/brands/${brandId}/models?type=${encodeURIComponent(type)}`
        : `${this.baseUrl}/devices/config/brands/${brandId}/models`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<{
        id: number;
        name: string;
        description: string;
        brandId: number;
        brandType: string;
        basePrice: number;
        iconUrl: string | null;
        enabled: boolean;
      }[]>(response);
    } catch (error: any) {
      console.error('[API] Get brand models error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch brand models',
        data: undefined
      };
    }
  }

  /**
   * Get all enabled processors
   */
  async getProcessors() {
    try {
      console.log('[API] Fetching processors');
      const response = await fetch(`${this.baseUrl}/devices/config/processors`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<{
        id: number;
        processorName: string;
        generation: string;
        priceImpact: number;
        displayOrder: number;
        enabled: boolean;
      }[]>(response);
    } catch (error: any) {
      console.error('[API] Get processors error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch processors',
        data: undefined
      };
    }
  }

  /**
   * Get all enabled graphics cards
   */
  async getGraphicsCards() {
    try {
      console.log('[API] Fetching graphics cards');
      const response = await fetch(`${this.baseUrl}/devices/config/graphics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<{
        id: number;
        graphicsName: string;
        priceImpact: number;
        displayOrder: number;
        enabled: boolean;
      }[]>(response);
    } catch (error: any) {
      console.error('[API] Get graphics cards error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch graphics cards',
        data: undefined
      };
    }
  }

  /**
   * Get all enabled RAM options
   */
  async getRamOptions() {
    try {
      console.log('[API] Fetching RAM options');
      const response = await fetch(`${this.baseUrl}/devices/config/ram-options`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<{
        id: number;
        capacityLabel: string;
        priceImpact: number;
        displayOrder: number;
        enabled: boolean;
      }[]>(response);
    } catch (error: any) {
      console.error('[API] Get RAM options error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch RAM options',
        data: undefined
      };
    }
  }

  /**
   * Get all enabled storage options
   */
  async getStorageOptions() {
    try {
      console.log('[API] Fetching storage options');
      const response = await fetch(`${this.baseUrl}/devices/config/storage-options`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<{
        id: number;
        storageLabel: string;
        priceImpact: number;
        displayOrder: number;
        enabled: boolean;
      }[]>(response);
    } catch (error: any) {
      console.error('[API] Get storage options error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch storage options',
        data: undefined
      };
    }
  }

  /**
   * Get all enabled screen sizes
   */
  async getScreenSizes() {
    try {
      console.log('[API] Fetching screen sizes');
      const response = await fetch(`${this.baseUrl}/devices/config/screen-sizes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<{
        id: number;
        sizeLabel: string;
        priceImpact: number;
        displayOrder: number;
        enabled: boolean;
      }[]>(response);
    } catch (error: any) {
      console.error('[API] Get screen sizes error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch screen sizes',
        data: undefined
      };
    }
  }

  /**
   * Get all enabled device conditions
   */
  async getConditionMultipliers() {
    try {
      console.log('[API] Fetching condition multipliers');
      const response = await fetch(`${this.baseUrl}/devices/config/conditions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<{
        id: number;
        conditionCode: string;
        conditionLabel: string;
        multiplierPercentage: number;
        requiresInvoice: boolean;
        minDeviceAgeMonths: number;
        maxDeviceAgeMonths: number;
        displayOrder: number;
        enabled: boolean;
      }[]>(response);
    } catch (error: any) {
      console.error('[API] Get condition multipliers error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch condition multipliers',
        data: undefined
      };
    }
  }

  /**
   * Get all enabled age depreciation options
   */
  async getAgeDepreciationOptions() {
    try {
      console.log('[API] Fetching age depreciation options');
      const response = await fetch(`${this.baseUrl}/devices/config/age-options`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<{
        id: number;
        ageCode: string;
        ageLabel: string;
        minMonths: number;
        maxMonths: number;
        depreciationPercentage: number;
        displayOrder: number;
        enabled: boolean;
      }[]>(response);
    } catch (error: any) {
      console.error('[API] Get age depreciation options error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch age depreciation options',
        data: undefined
      };
    }
  }

  /**
   * Get all enabled functional issues
   */
  async getFunctionalIssues() {
    try {
      console.log('[API] Fetching functional issues');
      const response = await fetch(`${this.baseUrl}/devices/config/functional-issues`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<{
        id: number;
        issueCode: string;
        issueLabel: string;
        priceDeduction: number;
        severity: string;
        displayOrder: number;
        enabled: boolean;
      }[]>(response);
    } catch (error: any) {
      console.error('[API] Get functional issues error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch functional issues',
        data: undefined
      };
    }
  }

  // ========================================
  // Device Evaluation APIs
  // ========================================

  /**
   * Calculate device price based on specifications and condition
   */
  async calculateDevicePrice(evaluationData: {
    userId: number;
    superCategory: string;
    category: string;
    brandId: number;
    brandModelId: number;
    processorId: number;
    graphicsId?: number;
    ramId: number;
    storageId: number;
    screenSizeId?: number;
    conditionCode: string;
    hasInvoice: boolean;
    hasBox: boolean;
    ageCode: string;
    ageMonths?: number;
    functionalIssueIds?: number[];
    notes?: string;
  }) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      console.log('[API] Calculating device price:', evaluationData);
      const response = await fetch(`${this.baseUrl}/devices/evaluations/calculate`, {
        method: 'POST',
        ...this.getFetchOptions(false),
        body: JSON.stringify(evaluationData),
        signal: controller.signal,
      });

      return this.handleResponse<{
        id: number;
        userId: number;
        superCategory: string;
        category: string;
        brandId: number;
        brandName: string;
        brandModelId: number;
        brandModelName: string;
        processorId: number;
        processorName: string;
        graphicsId?: number;
        graphicsName?: string;
        ramId: number;
        ramLabel: string;
        storageId: number;
        storageLabel: string;
        screenSizeId?: number;
        screenSizeLabel?: string;
        conditionCode: string;
        hasInvoice: boolean;
        hasBox: boolean;
        ageCode: string;
        ageMonths?: number;
        functionalIssues: {
          issueId: number;
          issueCode: string;
          issueLabel: string;
          priceDeduction: number;
          severity: string;
        }[];
        priceBreakdown: {
          basePrice: number;
          specImpact: number;
          conditionMultiplier: number;
          ageDepreciation: number;
          issueDeductions: number;
          invoicePremium: number;
          boxPremium: number;
          processingFee: number;
        };
        finalPrice: number;
        status: string;
        notes?: string;
        createdAt: string;
        updatedAt: string;
      }>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      console.error('[API] Calculate device price error:', error);
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Get evaluation by ID
   */
  async getDeviceEvaluation(evaluationId: number) {
    try {
      console.log('[API] Fetching device evaluation:', evaluationId);
      const response = await fetch(`${this.baseUrl}/devices/evaluations/${evaluationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse(response);
    } catch (error: any) {
      console.error('[API] Get device evaluation error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch device evaluation',
        data: undefined
      };
    }
  }

  /**
   * Get user's device evaluations
   */
  async getUserDeviceEvaluations(userId: number, status?: string) {
    try {
      console.log('[API] Fetching user device evaluations');
      const url = status
        ? `${this.baseUrl}/devices/evaluations/user/${userId}?status=${status}`
        : `${this.baseUrl}/devices/evaluations/user/${userId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      return this.handleResponse(response);
    } catch (error: any) {
      console.error('[API] Get user device evaluations error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch user device evaluations',
        data: undefined
      };
    }
  }

  /**
   * Approve a device evaluation (user accepts the price)
   */
  async approveDeviceEvaluation(evaluationId: number, pickupDetails?: {
    pickupAddress?: string;
    addressType?: string;
    pickupDate?: string;
    pickupTimeSlot?: string;
  }) {
    try {
      console.log('[API] Approving device evaluation:', evaluationId);
      const response = await fetch(`${this.baseUrl}/devices/evaluations/${evaluationId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: pickupDetails ? JSON.stringify(pickupDetails) : undefined,
      });

      return this.handleResponse(response);
    } catch (error: any) {
      console.error('[API] Approve device evaluation error:', error);
      return {
        success: false,
        message: error.message || 'Failed to approve device evaluation',
        data: undefined
      };
    }
  }

  /**
   * Reject a device evaluation (user declines the price)
   */
  async rejectDeviceEvaluation(evaluationId: number) {
    try {
      console.log('[API] Rejecting device evaluation:', evaluationId);
      const response = await fetch(`${this.baseUrl}/devices/evaluations/${evaluationId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse(response);
    } catch (error: any) {
      console.error('[API] Reject device evaluation error:', error);
      return {
        success: false,
        message: error.message || 'Failed to reject device evaluation',
        data: undefined
      };
    }
  }
}

// Create singleton instance
const apiService = new ApiService();
export default apiService;
