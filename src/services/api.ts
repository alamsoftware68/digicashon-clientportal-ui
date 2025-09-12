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
