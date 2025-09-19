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
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
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
      credentials: 'include', // This ensures cookies/session data is sent
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
    const response = await fetch(`${this.baseUrl}/service-categories`, {
      method: 'GET',
      ...this.getFetchOptions(false), // No auth required for service categories
    });

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
    console.log('[API] Adding address - URL:', `${this.baseUrl}/profile/addresses`);
    console.log('[API] Adding address - Request body:', JSON.stringify(addressData, null, 2));
    const response = await fetch(`${this.baseUrl}/profile/addresses`, {
      method: 'POST',
      ...this.getFetchOptions(true),
      body: JSON.stringify(addressData),
    });
    console.log('[API] Add address response status:', response.status);
    console.log('[API] Add address response headers:', Object.fromEntries(response.headers.entries()));

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
}

// Create singleton instance
const apiService = new ApiService();
export default apiService;
