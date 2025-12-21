'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SignupData {
  name: string;
  email: string;
  mobile: string;
  city: string;
  password: string;
  confirmPassword: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [signupStep, setSignupStep] = useState<'mobile' | 'otp' | 'details'>('mobile');
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [loginOtpStep, setLoginOtpStep] = useState<'mobile' | 'otp'>('mobile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loginError, setLoginError] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [verifiedMobile, setVerifiedMobile] = useState('');
  
  // New signup flow state
  const [otpExpiresAt, setOtpExpiresAt] = useState<string>('');
  const [maskedMobile, setMaskedMobile] = useState<string>('');
  const [signupMessage, setSignupMessage] = useState<string>('');

  const { login, signup, sendLoginOTP, verifyLoginOTP, completeSignup } = useAuth();

  // Close modal on escape key and reset state when opened
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      // Reset modal to default state when opened
      resetForm();
      setActiveTab('signin');
      setLoginMode('password');
      setLoginOtpStep('mobile');
      setSignupStep('mobile');
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // Special handling for mobile to only allow numeric input
    if (name === 'mobile') {
      const numericValue = value.replace(/[^0-9]/g, '');
      const limitedValue = numericValue.slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: limitedValue }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: ''}));
    }
  };

  const validateMobileStep = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDetailsStep = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (activeTab === 'signin') {
      if (loginMode === 'password') {
        if (!formData.mobile.trim()) {
          newErrors.mobile = 'Mobile number is required';
        } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
          newErrors.mobile = 'Mobile number must be exactly 10 digits';
        }
        if (!formData.password.trim()) {
          newErrors.password = 'Password is required';
        }
      }
    }

    if (activeTab === 'forgot') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMobileStep()) return;

    setIsLoading(true);
    setLoginError('');
    setSignupMessage('');
    
    try {
      // Call the Spring Boot API to send OTP
      const result = await apiService.sendSignupMobileOTP(formData.mobile);
      
      if (result.success && result.data) {
        setVerifiedMobile(formData.mobile);
        setMaskedMobile(result.data.maskedMobile);
        setOtpExpiresAt(result.data.expiresAt);
        setSignupMessage(result.data.message);
        setSignupStep('otp');
        console.log('OTP sent successfully:', result.data.message);
      } else {
        setLoginError(result.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Send OTP error:', error);
      setLoginError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateDetailsStep()) return;

    setIsLoading(true);
    setLoginError('');
    
    try {
      // Use AuthContext's completeSignup method which properly updates state
      const signupData = {
        mobile: verifiedMobile,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        city: formData.city
      };
      
      const result = await completeSignup(signupData);
      
      if (result.success && result.data) {
        // AuthContext has already updated the user state and localStorage
        const { user } = result.data;
        
        setModalMessage(`Welcome, ${user.name}! Your account has been created successfully and you have been automatically signed in.`);
        setShowSuccessModal(true);
      } else {
        setModalMessage(result.message || 'Registration failed. Please try again.');
        setShowErrorModal(true);
      }
    } catch (error: any) {
      console.error('Complete signup error:', error);
      // Show error modal for signup failures
      setModalMessage(error.message || 'Registration failed. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'signup') {
      if (signupStep === 'mobile') {
        await handleMobileSubmit(e);
        return;
      } else if (signupStep === 'details') {
        await handleDetailsSubmit(e);
        return;
      }
    }
    
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError('');
    
    try {
      if (activeTab === 'signin') {
        const success = await login(formData.mobile, formData.password);
        if (success) {
          onClose();
          resetForm();
          
          // Check if user came from sell flow and redirect accordingly
          const sellFlowData = sessionStorage.getItem('sellFlowData');
          if (sellFlowData) {
            try {
              const data = JSON.parse(sellFlowData);
              if (data.flow === 'sell-laptop' && data.redirectUrl) {
                // IMMEDIATELY clear ALL related storage items
                sessionStorage.removeItem('sellFlowData');
                sessionStorage.removeItem('sellFlowProcessed');
                // Navigate to price summary with stored params
                const params = new URLSearchParams(data.params);
                router.push(`${data.redirectUrl}?${params.toString()}`);
                return; // Exit early to prevent further execution
              }
            } catch (error) {
              console.error('Error parsing sell flow data:', error);
              sessionStorage.removeItem('sellFlowData');
              sessionStorage.removeItem('sellFlowProcessed');
            }
          }
        } else {
          setLoginError('Invalid mobile number or password. Try demo credentials from above.');
        }
      } else if (activeTab === 'forgot') {
        alert('Password reset link sent to your email!');
        setActiveTab('signin');
      }
    } catch (error) {
      // Show inline error for login failures
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      city: '',
      password: '',
      confirmPassword: '',
      rememberMe: false
    });
    setErrors({});
    setLoginError('');
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setModalMessage('');
    setOtpCode(['', '', '', '', '', '']);
    setOtpError('');
    setVerifiedMobile('');
    setSignupStep('mobile');
    // Clear new signup flow state
    setOtpExpiresAt('');
    setMaskedMobile('');
    setSignupMessage('');
  };

  const handleSuccessModalClose = () => {
    // Check if user came from sell flow
    const sellFlowData = sessionStorage.getItem('sellFlowData');
    let shouldRedirect = false;
    let redirectData: any = null;
    
    if (sellFlowData) {
      try {
        redirectData = JSON.parse(sellFlowData);
        if (redirectData.flow === 'sell-laptop' && redirectData.params) {
          shouldRedirect = true;
          // DO NOT clear sellFlowData yet - we need it for the physical-condition page
          // Only remove the processed flag
          sessionStorage.removeItem('sellFlowProcessed');
        }
      } catch (error) {
        console.error('Error parsing sell flow data:', error);
        sessionStorage.removeItem('sellFlowData');
        sessionStorage.removeItem('sellFlowProcessed');
      }
    }
    
    // Close modals and reset form
    setShowSuccessModal(false);
    setActiveTab('signin');
    resetForm();
    onClose(); // Close the login modal
    
    // Redirect back to physical-condition page with data preserved
    if (shouldRedirect && redirectData) {
      const params = new URLSearchParams(redirectData.params);
      // Navigate back to physical-condition page (NOT price-summary)
      setTimeout(() => {
        router.push(`/sell/windows/laptop/samsung/galaxy-book-go-series/physical-condition?${params.toString()}`);
      }, 100);
    }
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setModalMessage('');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    setOtpError('');

    // Auto-focus next input (6 digits total)
    if (value && index < 5) {
      const nextInputId = activeTab === 'signin' && loginMode === 'otp' && loginOtpStep === 'otp' 
        ? `login-otp-${index + 1}` 
        : `otp-${index + 1}`;
      const nextInput = document.getElementById(nextInputId);
      nextInput?.focus();
    }
    
    // If this is the last field and all fields are filled, trigger OTP verification
    if (index === 5 && value) {
      const updatedOtp = [...newOtp];
      updatedOtp[index] = value;
      if (updatedOtp.every(digit => digit !== '')) {
        // Use the updated OTP array directly instead of relying on state
        setTimeout(() => {
          if (activeTab === 'signin' && loginMode === 'otp' && loginOtpStep === 'otp') {
            handleLoginOtpVerificationWithOtp(updatedOtp);
          } else if (activeTab === 'signup' && signupStep === 'otp') {
            handleOtpVerificationWithOtp(updatedOtp);
          }
        }, 100);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInputId = activeTab === 'signin' && loginMode === 'otp' && loginOtpStep === 'otp' 
        ? `login-otp-${index - 1}` 
        : `otp-${index - 1}`;
      const prevInput = document.getElementById(prevInputId);
      prevInput?.focus();
    }
    
    // Handle Enter key to trigger OTP verification
    if (e.key === 'Enter' && otpCode.join('').length === 6) {
      e.preventDefault();
      if (activeTab === 'signin' && loginMode === 'otp' && loginOtpStep === 'otp') {
        handleLoginOtpVerification();
      } else if (activeTab === 'signup' && signupStep === 'otp') {
        handleOtpVerification();
      }
    }
  };

  const handleOtpVerification = async () => {
    const enteredOtp = otpCode.join('');
    
    if (enteredOtp.length !== 6) {
      setOtpError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsOtpLoading(true);
    setOtpError('');
    
    try {
      // Call the Spring Boot API to verify OTP
      const result = await apiService.verifySignupOTP(verifiedMobile, enteredOtp);
      
      if (result.success && result.data) {
        setSignupMessage(result.data.message);
        setSignupStep('details');
        setOtpError('');
        setOtpCode(['', '', '', '', '', '']);
        console.log('OTP verified successfully:', result.data.message);
      } else {
        setOtpError(result.message || 'Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setOtpError(error.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtpCode(['', '', '', '', '', '']);
    setOtpError('');
    // Simulate resending OTP
    console.log(`OTP 666666 resent to mobile ${verifiedMobile}`);
    alert('OTP resent to your mobile!');
  };

  const handleBackToMobile = () => {
    setSignupStep('mobile');
    setVerifiedMobile('');
    setOtpCode(['', '', '', '', '', '']);
    setOtpError('');
    // Clear new signup flow state
    setOtpExpiresAt('');
    setMaskedMobile('');
    setSignupMessage('');
  };

  const handleLoginMobileSubmit = async () => {
    if (!validateMobileStep()) return;

    setIsLoading(true);
    setLoginError('');
    setSignupMessage('');
    
    try {
      // Call the Spring Boot API to send login OTP
      const result = await sendLoginOTP(formData.mobile);
      
      if (result.success && result.data) {
        setVerifiedMobile(formData.mobile);
        setMaskedMobile(result.data.maskedMobile);
        setOtpExpiresAt(result.data.expiresAt);
        setSignupMessage(result.data.message);
        setLoginOtpStep('otp');
        console.log('Login OTP sent successfully:', result.data.message);
      } else {
        setLoginError(result.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Send login OTP error:', error);
      setLoginError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginOtpVerification = async () => {
    const enteredOtp = otpCode.join('');
    
    if (enteredOtp.length !== 6) {
      setOtpError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsOtpLoading(true);
    setOtpError('');
    
    try {
      // Call the Spring Boot API to verify login OTP
      const result = await verifyLoginOTP(verifiedMobile, enteredOtp);
      
      if (result.success) {
        // Login successful - AuthContext has already updated the user state
        onClose();
        resetForm();
        console.log('Login OTP verification successful:', result.message);
        
        // Check if user came from sell flow and redirect accordingly
        const sellFlowData = sessionStorage.getItem('sellFlowData');
        if (sellFlowData) {
          try {
            const data = JSON.parse(sellFlowData);
            if (data.flow === 'sell-laptop' && data.redirectUrl) {
              // IMMEDIATELY clear ALL related storage items
              sessionStorage.removeItem('sellFlowData');
              sessionStorage.removeItem('sellFlowProcessed');
              // Navigate to price summary with stored params
              const params = new URLSearchParams(data.params);
              router.push(`${data.redirectUrl}?${params.toString()}`);
              return; // Exit early to prevent further execution
            }
          } catch (error) {
            console.error('Error parsing sell flow data:', error);
            sessionStorage.removeItem('sellFlowData');
            sessionStorage.removeItem('sellFlowProcessed');
          }
        }
      } else {
        setOtpError(result.message || 'Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Login OTP verification error:', error);
      setOtpError(error.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleBackToLoginMobile = () => {
    setLoginOtpStep('mobile');
    setVerifiedMobile('');
    setOtpCode(['', '', '', '', '', '']);
    setOtpError('');
  };

  const handleLoginResendOtp = async () => {
    setOtpCode(['', '', '', '', '', '']);
    setOtpError('');
    setIsLoading(true);
    
    try {
      // Call the Spring Boot API to resend login OTP
      const result = await sendLoginOTP(verifiedMobile);
      
      if (result.success && result.data) {
        setMaskedMobile(result.data.maskedMobile);
        setOtpExpiresAt(result.data.expiresAt);
        setSignupMessage(result.data.message);
        console.log('Login OTP resent successfully:', result.data.message);
      } else {
        setOtpError(result.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Resend login OTP error:', error);
      setOtpError(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP verification functions that accept OTP array directly to avoid timing issues
  const handleOtpVerificationWithOtp = async (otpArray: string[]) => {
    const enteredOtp = otpArray.join('');
    
    if (enteredOtp.length !== 6) {
      setOtpError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsOtpLoading(true);
    setOtpError('');
    
    try {
      // Call the Spring Boot API to verify OTP
      const result = await apiService.verifySignupOTP(verifiedMobile, enteredOtp);
      
      if (result.success && result.data) {
        setSignupMessage(result.data.message);
        setSignupStep('details');
        setOtpError('');
        setOtpCode(['', '', '', '', '', '']);
        console.log('OTP verified successfully (auto):', result.data.message);
      } else {
        setOtpError(result.message || 'Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('OTP verification error (auto):', error);
      setOtpError(error.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleLoginOtpVerificationWithOtp = async (otpArray: string[]) => {
    const enteredOtp = otpArray.join('');
    
    if (enteredOtp.length !== 6) {
      setOtpError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsOtpLoading(true);
    setOtpError('');
    
    try {
      // Call the Spring Boot API to verify login OTP
      const result = await verifyLoginOTP(verifiedMobile, enteredOtp);
      
      if (result.success) {
        // Login successful - AuthContext has already updated the user state
        onClose();
        resetForm();
        console.log('Login OTP verification successful (auto):', result.message);
        
        // Check if user came from sell flow and redirect accordingly
        const sellFlowData = sessionStorage.getItem('sellFlowData');
        if (sellFlowData) {
          try {
            const data = JSON.parse(sellFlowData);
            if (data.flow === 'sell-laptop' && data.redirectUrl) {
              // IMMEDIATELY clear ALL related storage items
              sessionStorage.removeItem('sellFlowData');
              sessionStorage.removeItem('sellFlowProcessed');
              // Navigate to price summary with stored params
              const params = new URLSearchParams(data.params);
              router.push(`${data.redirectUrl}?${params.toString()}`);
              return; // Exit early to prevent further execution
            }
          } catch (error) {
            console.error('Error parsing sell flow data:', error);
            sessionStorage.removeItem('sellFlowData');
            sessionStorage.removeItem('sellFlowProcessed');
          }
        }
      } else {
        setOtpError(result.message || 'Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Login OTP verification error (auto):', error);
      setOtpError(error.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const switchTab = (tab: 'signin' | 'signup' | 'forgot') => {
    setActiveTab(tab);
    resetForm();
    setLoginError('');
    setLoginMode('password');
    setLoginOtpStep('mobile');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 animate-zoom-in">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 rounded-t-2xl p-6 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              {activeTab === 'signin' && 'Welcome Back!'}
              {activeTab === 'signup' && 'Create Account'}
              {activeTab === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-blue-100 text-sm">
              {activeTab === 'signin' && 'Sign in to your account to continue'}
              {activeTab === 'signup' && 'Join us and get started today'}
              {activeTab === 'forgot' && 'Enter your email to reset password'}
            </p>
            {activeTab === 'signin' && (
              <div className="mt-3 p-3 bg-blue-200/20 rounded-lg space-y-1">
                <p className="text-xs text-blue-100 font-medium">Demo Credentials:</p>
                <p className="text-xs text-blue-100">
                  Admin: <strong>9876500000</strong> / <strong>admin123</strong>
                </p>
                <p className="text-xs text-blue-100">
                  User: <strong>9876543210</strong> / <strong>user123</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{loginError}</p>
            </div>
          )}
          
          {/* Step Progress Indicator for Signup */}
          {activeTab === 'signup' && (
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-2">
                {/* Step 1: Mobile */}
                <div className={`flex items-center ${
                  signupStep === 'mobile' ? 'text-blue-600' : 
                  (signupStep === 'otp' || signupStep === 'details') ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    signupStep === 'mobile' ? 'bg-blue-100 border-2 border-blue-600' : 
                    (signupStep === 'otp' || signupStep === 'details') ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'
                  }`}>
                    {(signupStep === 'otp' || signupStep === 'details') ? '✓' : '1'}
                  </div>
                  <span className="ml-2 text-xs font-medium">Mobile</span>
                </div>
                
                <div className={`w-8 h-1 ${
                  (signupStep === 'otp' || signupStep === 'details') ? 'bg-green-300' : 'bg-gray-200'
                }`}></div>
                
                {/* Step 2: OTP */}
                <div className={`flex items-center ${
                  signupStep === 'otp' ? 'text-blue-600' : 
                  signupStep === 'details' ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    signupStep === 'otp' ? 'bg-blue-100 border-2 border-blue-600' : 
                    signupStep === 'details' ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'
                  }`}>
                    {signupStep === 'details' ? '✓' : '2'}
                  </div>
                  <span className="ml-2 text-xs font-medium">Verify</span>
                </div>
                
                <div className={`w-8 h-1 ${
                  signupStep === 'details' ? 'bg-green-300' : 'bg-gray-200'
                }`}></div>
                
                {/* Step 3: Details */}
                <div className={`flex items-center ${
                  signupStep === 'details' ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    signupStep === 'details' ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100 border-2 border-gray-300'
                  }`}>
                    3
                  </div>
                  <span className="ml-2 text-xs font-medium">Details</span>
                </div>
              </div>
            </div>
          )}

          {/* Login Mode Toggle (Sign In only) */}
          {activeTab === 'signin' && (
            <div className="mb-6">
              <div className="bg-gray-50 rounded-xl p-1 flex">
                <button
                  type="button"
                  onClick={() => setLoginMode('password')}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                    loginMode === 'password'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Password Login
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMode('otp')}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                    loginMode === 'otp'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  OTP Login
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* STEP 1: Mobile Number (Sign Up only) */}
            {activeTab === 'signup' && signupStep === 'mobile' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pl-11 border rounded-xl focus:outline-none focus:ring-2 transition-colors text-gray-900 bg-white ${
                      errors.mobile 
                        ? 'border-red-300 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                    }`}
                    placeholder="Enter your 10-digit mobile number"
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                <p className="text-gray-500 text-xs mt-2">We'll send you a 6-digit verification code</p>
              </div>
            )}

            {/* STEP 2: OTP Verification (Sign Up only) */}
            {activeTab === 'signup' && signupStep === 'otp' && (
              <div className="text-center py-4">
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Verify Your Mobile</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Enter the 6-digit verification code sent to:
                  </p>
                  <p className="text-indigo-600 font-semibold text-sm mb-2">
                    +91 {maskedMobile || verifiedMobile}
                  </p>
                  {signupMessage && (
                    <p className="text-green-600 text-xs mb-4">
                      {signupMessage}
                    </p>
                  )}
                  {otpExpiresAt && (
                    <p className="text-gray-500 text-xs mb-6">
                      OTP expires at: {new Date(otpExpiresAt).toLocaleTimeString()}
                    </p>
                  )}
                  
                  {/* OTP Input Fields */}
                  <div className="flex justify-center space-x-2 mb-6">
                    {otpCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200"
                        maxLength={1}
                        pattern="[0-9]"
                        inputMode="numeric"
                      />
                    ))}
                  </div>
                  
                  {/* Error Message */}
                  {otpError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{otpError}</p>
                    </div>
                  )}
                  
                  {/* Demo OTP Hint - Only show if no actual message from API */}
                  {!signupMessage && (
                    <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-700 text-center">
                        <strong>Development:</strong> Use OTP <strong>666666</strong> for testing
                      </p>
                    </div>
                  )}
                  
                  {/* Resend OTP and Back buttons */}
                  <div className="flex flex-col space-y-3">
                    <button
                      type="button"
                      onClick={handleOtpVerification}
                      disabled={isOtpLoading || otpCode.join('').length !== 6}
                      className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                        isOtpLoading || otpCode.join('').length !== 6
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      {isOtpLoading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </div>
                      ) : (
                        'Verify OTP'
                      )}
                    </button>
                    
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="flex-1 py-2 px-4 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        Resend OTP
                      </button>
                      <button
                        type="button"
                        onClick={handleBackToMobile}
                        className="flex-1 py-2 px-4 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Change Mobile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Full Registration Details (Sign Up only) */}
            {activeTab === 'signup' && signupStep === 'details' && (
              <>
                {/* Verified Mobile Display */}
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-700 text-sm font-medium">
                      Mobile {verifiedMobile} verified successfully
                    </p>
                  </div>
                </div>

                {/* Full Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-11 border rounded-xl focus:outline-none focus:ring-2 transition-colors text-gray-900 bg-white ${
                        errors.name 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                      }`}
                      placeholder="Enter your full name"
                    />
                    <div className="absolute left-3 top-3.5 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-11 border rounded-xl focus:outline-none focus:ring-2 transition-colors text-gray-900 bg-white ${
                        errors.email 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                      }`}
                      placeholder="Enter your email address"
                    />
                    <div className="absolute left-3 top-3.5 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-11 border rounded-xl focus:outline-none focus:ring-2 transition-colors text-gray-900 bg-white ${
                        errors.password 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                      }`}
                      placeholder="Enter your password"
                    />
                    <div className="absolute left-3 top-3.5 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-11 border rounded-xl focus:outline-none focus:ring-2 transition-colors text-gray-900 bg-white ${
                        errors.confirmPassword 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <div className="absolute left-3 top-3.5 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* City Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-11 border rounded-xl focus:outline-none focus:ring-2 transition-colors text-gray-900 bg-white ${
                        errors.city 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                      }`}
                      placeholder="Enter your city"
                    />
                    <div className="absolute left-3 top-3.5 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
              </>
            )}

            {/* Mobile Number (Sign In with OTP mode) */}
            {activeTab === 'signin' && loginMode === 'otp' && loginOtpStep === 'mobile' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pl-11 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                      errors.mobile 
                        ? 'border-red-300 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                    }`}
                    placeholder="Enter your 10-digit mobile number"
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                <p className="text-gray-500 text-xs mt-2">We'll send you a 6-digit verification code</p>
              </div>
            )}

            {/* Login OTP Verification */}
            {activeTab === 'signin' && loginMode === 'otp' && loginOtpStep === 'otp' && (
              <div className="text-center py-4">
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Login with OTP</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Enter the 6-digit verification code sent to:
                  </p>
                  <p className="text-indigo-600 font-semibold text-sm mb-2">
                    +91 {maskedMobile || verifiedMobile}
                  </p>
                  {signupMessage && (
                    <p className="text-green-600 text-xs mb-4">
                      {signupMessage}
                    </p>
                  )}
                  {otpExpiresAt && (
                    <p className="text-gray-500 text-xs mb-6">
                      OTP expires at: {new Date(otpExpiresAt).toLocaleTimeString()}
                    </p>
                  )}
                  
                  {/* OTP Input Fields */}
                  <div className="flex justify-center space-x-2 mb-6">
                    {otpCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`login-otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200"
                        maxLength={1}
                        pattern="[0-9]"
                        inputMode="numeric"
                      />
                    ))}
                  </div>
                  
                  {/* Error Message */}
                  {otpError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{otpError}</p>
                    </div>
                  )}
                  
                  {/* Demo OTP Hint - Only show if no actual message from API */}
                  {!signupMessage && (
                    <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-700 text-center">
                        <strong>Demo:</strong> Use OTP <strong>666666</strong> for testing
                      </p>
                    </div>
                  )}
                  
                  {/* Login with OTP button and Back buttons */}
                  <div className="flex flex-col space-y-3">
                    <button
                      type="button"
                      onClick={handleLoginOtpVerification}
                      disabled={isOtpLoading || otpCode.join('').length !== 6}
                      className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                        isOtpLoading || otpCode.join('').length !== 6
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      {isOtpLoading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Logging in...
                        </div>
                      ) : (
                        'Login with OTP'
                      )}
                    </button>
                    
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleLoginResendOtp}
                        className="flex-1 py-2 px-4 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        Resend OTP
                      </button>
                      <button
                        type="button"
                        onClick={handleBackToLoginMobile}
                        className="flex-1 py-2 px-4 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Change Mobile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Number (Sign In with Password mode) */}
            {activeTab === 'signin' && loginMode === 'password' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pl-11 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                      errors.mobile 
                        ? 'border-red-300 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                    }`}
                    placeholder="Enter your mobile number"
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>
            )}

            {/* Email Field (Forgot Password only) */}
            {activeTab === 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pl-11 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                      errors.email 
                        ? 'border-red-300 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                    }`}
                    placeholder="Enter your email"
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            )}

            {/* Password Field (Sign In with Password mode only) */}
            {activeTab === 'signin' && loginMode === 'password' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pl-11 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                      errors.password 
                        ? 'border-red-300 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                    }`}
                    placeholder="Enter your password"
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            )}

            {/* Remember Me (Sign In only) */}
            {activeTab === 'signin' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => switchTab('forgot')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            {(activeTab !== 'signup' || signupStep !== 'otp') && 
             (activeTab !== 'signin' || loginMode !== 'otp' || loginOtpStep !== 'otp') && (
              <button
                type={activeTab === 'signin' && loginMode === 'otp' && loginOtpStep === 'mobile' ? 'button' : 'submit'}
                onClick={activeTab === 'signin' && loginMode === 'otp' && loginOtpStep === 'mobile' 
                  ? handleLoginMobileSubmit 
                  : undefined}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <>
                    {activeTab === 'signin' && loginMode === 'password' && 'Sign In'}
                    {activeTab === 'signin' && loginMode === 'otp' && loginOtpStep === 'mobile' && 'Send OTP'}
                    {activeTab === 'signup' && signupStep === 'mobile' && 'Send OTP'}
                    {activeTab === 'signup' && signupStep === 'details' && 'Register Now'}
                    {activeTab === 'forgot' && 'Send Reset Link'}
                  </>
                )}
              </button>
            )}
          </form>

          {/* Tab Switching */}
          <div className="mt-6 text-center border-t pt-6">
            {activeTab === 'signin' && (
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => switchTab('signup')}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Sign Up
                </button>
              </p>
            )}
            
            {activeTab === 'signup' && (
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => switchTab('signin')}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Sign In
                </button>
              </p>
            )}
            
            {activeTab === 'forgot' && (
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <button
                  onClick={() => switchTab('signin')}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
            {/* Header with gradient background */}
            <div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-t-3xl px-6 py-6 text-white overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 bg-white/10">
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-3 right-6 w-20 h-20 bg-white/5 rounded-full animate-float-slow"></div>
                  <div className="absolute bottom-3 left-6 w-16 h-16 bg-white/5 rounded-full animate-float"></div>
                  <div className="absolute top-6 left-1/2 w-12 h-12 bg-white/5 rounded-full animate-float-fast"></div>
                </div>
              </div>
              
              {/* Success Icon and Title */}
              <div className="relative text-center">
                <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white drop-shadow-sm mb-2">
                  Registration Successful!
                </h3>
                <p className="text-green-100 text-sm">
                  Welcome to DigiCashOn
                </p>
              </div>
            </div>
            
            {/* Body */}
            <div className="px-6 py-8">
              <div className="text-center mb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {modalMessage}
                </p>
              </div>
            </div>
            
            {/* Footer with action button */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-3xl border-t border-gray-100">
              <button
                onClick={handleSuccessModalClose}
                className="w-full px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-transparent rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-100 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  OK, Sign Me In
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
            {/* Header with gradient background */}
            <div className="relative bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 rounded-t-3xl px-6 py-6 text-white overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 bg-white/10">
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-3 right-6 w-20 h-20 bg-white/5 rounded-full animate-float-reverse"></div>
                  <div className="absolute bottom-3 left-6 w-16 h-16 bg-white/5 rounded-full animate-float"></div>
                  <div className="absolute top-6 left-1/2 w-12 h-12 bg-white/5 rounded-full animate-float-slow"></div>
                </div>
              </div>
              
              {/* Error Icon and Title */}
              <div className="relative text-center">
                <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-lg animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white drop-shadow-sm mb-2">
                  Registration Failed
                </h3>
                <p className="text-red-100 text-sm">
                  Something went wrong
                </p>
              </div>
            </div>
            
            {/* Body */}
            <div className="px-6 py-8">
              <div className="text-center mb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {modalMessage}
                </p>
                
                <p className="text-gray-500 text-xs">
                  Please check your information and try again.
                </p>
              </div>
            </div>
            
            {/* Footer with action button */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-3xl border-t border-gray-100">
              <button
                onClick={handleErrorModalClose}
                className="w-full px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 border-2 border-transparent rounded-xl hover:from-red-600 hover:to-rose-700 focus:outline-none focus:ring-4 focus:ring-red-100 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default LoginModal;
