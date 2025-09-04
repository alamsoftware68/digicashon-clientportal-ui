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

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
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
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ mobile, password, rememberMe }),
    });

    const result = await this.handleResponse<{
      token: string;
      type: string;
      refreshToken: string;
      id: number;
      username: string;
      email: string;
      role: string;
    }>(response);

    // Store token
    if (result.success && result.data?.token) {
      this.setToken(result.data.token);
    }

    return result;
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

  // OTP API calls
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
