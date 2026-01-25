'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import LoginModal from './LoginModal';

const Header = () => {
  // Simple state management - no complex auth logic
  const [isRepairDropdownOpen, setIsRepairDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  // City detection state
  const [city, setCity] = useState<string | null>(null);
  const [isDetectingCity, setIsDetectingCity] = useState(false);
  
  // Cart functionality
  const { getCartItemCount } = useCart();
  
  // Minimal auth state - only what's needed for rendering
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration and auth state
  useEffect(() => {
    // Mark as hydrated first
    setIsHydrated(true);

    // Try to restore saved city first
    try {
      const savedCity = localStorage.getItem('repairapp_user_city');
      if (savedCity) {
        setCity(savedCity);
      }
    } catch (e) {
      console.log('City restore failed:', e);
    }
    
    // Then check auth state
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('repairapp_user');
        const isAuth = localStorage.getItem('repairapp_authenticated') === 'true';
        
        if (savedUser && isAuth) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log('Auth check failed:', error);
      }
    };

    checkAuth();
    
    // Listen for auth changes
    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.type === 'login' && customEvent.detail?.user) {
        setUser(customEvent.detail.user);
        setIsLoggedIn(true);
      } else if (customEvent.detail?.type === 'logout') {
        setUser(null);
        setIsLoggedIn(false);
      }
    };
    
    window.addEventListener('authChanged', handleAuthChange as EventListener);
    
    return () => {
      window.removeEventListener('authChanged', handleAuthChange as EventListener);
    };
  }, []);

  // Event handlers - all immediately responsive
  const handleRepairClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRepairDropdownOpen(!isRepairDropdownOpen);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMoreDropdownOpen(!isMoreDropdownOpen);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    // Update auth state immediately
    setUser(null);
    setIsLoggedIn(false);
    
    // Clear ALL auth-related localStorage items
    localStorage.removeItem('auth_token');
    localStorage.removeItem('repairapp_user');
    localStorage.removeItem('repairapp_authenticated');
    localStorage.removeItem('repairapp_login_time');
    
    // Close modals
    setIsLogoutConfirmOpen(false);
    setIsProfileDropdownOpen(false);
    
    // Dispatch auth change event
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { type: 'logout' } }));
    
    // Redirect to home
    window.location.href = '/';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Don't close if clicking inside any dropdown or their trigger buttons
      if (target?.closest('.dropdown-container') || target?.closest('.profile-button')) {
        return;
      }
      
      setIsRepairDropdownOpen(false);
      setIsProfileDropdownOpen(false);
      setIsMoreDropdownOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Auto-detect city using browser GPS + reverse geocoding (client-side only)
  useEffect(() => {
    if (!isHydrated) return;
    if (city) return; // already have a city from localStorage or user input

    if (!('geolocation' in navigator)) {
      return; // browser does not support geolocation, fallback is manual entry
    }

    setIsDetectingCity(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use OpenStreetMap Nominatim for reverse geocoding
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
          const res = await fetch(url, {
            headers: {
              'Accept': 'application/json',
            },
          });
          if (!res.ok) throw new Error('Failed to reverse geocode city');
          const data = await res.json();
          const detectedCity = data.address?.city || data.address?.town || data.address?.village || data.address?.state;
          if (detectedCity) {
            setCity(detectedCity);
            try {
              localStorage.setItem('repairapp_user_city', detectedCity);
            } catch (e) {
              console.log('City persist failed:', e);
            }
          }
        } catch (err) {
          console.log('City detection failed:', err);
        } finally {
          setIsDetectingCity(false);
        }
      },
      (error) => {
        console.log('Geolocation error:', error);
        setIsDetectingCity(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, [isHydrated, city]);
  
  const handleCityClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const current = city || '';
    const manual = window.prompt('Enter your city name', current);
    if (manual && manual.trim()) {
      const trimmed = manual.trim();
      setCity(trimmed);
      try {
        localStorage.setItem('repairapp_user_city', trimmed);
      } catch (err) {
        console.log('City persist failed:', err);
      }
    }
  };
  
  // Show skeleton only during initial hydration
  if (!isHydrated) {
    return (
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Simplified header skeleton during hydration */}
            <div className="flex-shrink-0 animate-pulse bg-gray-200 rounded-xl h-10 w-40"></div>
            <div className="hidden md:flex items-center space-x-8">
              <div className="animate-pulse bg-gray-200 rounded h-4 w-20"></div>
              <div className="animate-pulse bg-gray-200 rounded h-4 w-20"></div>
              <div className="animate-pulse bg-gray-200 rounded h-4 w-20"></div>
            </div>
            <div className="animate-pulse bg-gray-200 rounded h-8 w-20"></div>
          </div>
        </div>
      </header>
    );
  }
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                {/* Main Logo Container */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                  <div className="flex items-center space-x-1">
                    {/* Icon/Symbol */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5 mr-2">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5L7 13l1.41-1.41L10.5 13.67l5.09-5.09L17 10l-6.5 6.5z"/>
                      </svg>
                    </div>
                    
                    {/* Brand Text */}
                    <div className="flex flex-col">
                      <span className="text-xl font-black tracking-tight leading-none">
                        <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                          Digi
                        </span>
                        <span className="text-white">Cash</span>
                        <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                          On
                        </span>
                      </span>
                      <span className="text-xs text-white/80 font-medium tracking-wide uppercase -mt-0.5">
                        Repair Services
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
                
                {/* Floating Particles */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              className="flex items-center text-gray-700 hover:text-gray-900 text-sm"
              onClick={handleCityClick}
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {city ? city : isDetectingCity ? 'Detecting city...' : 'Select City'}
            </button>
            
            <Link href="/quick-call" className="text-gray-700 hover:text-gray-900 text-sm">
              Quick Call
            </Link>
            
            <div className="relative">
              <button 
                className="flex items-center text-gray-700 hover:text-gray-900 text-sm"
                onMouseEnter={() => setIsRepairDropdownOpen(true)}
                onClick={handleRepairClick}
              >
                Repair Product
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isRepairDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                  onMouseEnter={() => setIsRepairDropdownOpen(true)}
                  onMouseLeave={() => setIsRepairDropdownOpen(false)}
                >
                  <div className="py-1">
                    <Link 
                      href="/repair/laptop" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => setIsRepairDropdownOpen(false)}
                    >
                      Repair Laptop
                    </Link>
                    <Link 
                      href="/sell-product" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => setIsRepairDropdownOpen(false)}
                    >
                      Sell Product
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <Link href="/partner" className="text-gray-700 hover:text-gray-900 text-sm">
              Be Partner
            </Link>
            
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-gray-900 text-sm">
                More
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </nav>

          {/* Cart Icon and User Profile / Sign In Button */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon with Badge */}
            <Link href="/repair/laptop" className="relative group">
              <div className="relative p-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105">
                <svg className="w-6 h-6 text-blue-600 group-hover:text-blue-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h7a2 2 0 002-2v-8m-9 0V9a2 2 0 012-2h7a2 2 0 012 2v4m-9 0h9" />
                </svg>
                
                {/* Cart Badge */}
                {getCartItemCount() > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full min-w-[20px] h-5 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white animate-bounce">
                    {getCartItemCount() > 99 ? '99+' : getCartItemCount()}
                  </div>
                )}
                
                {/* Hover tooltip */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {getCartItemCount() === 0 ? 'Cart is empty' : `${getCartItemCount()} item${getCartItemCount() > 1 ? 's' : ''} in cart`}
                </div>
              </div>
            </Link>
            {isLoggedIn && user ? (
              <div className="relative dropdown-container">
                <button 
                  onClick={handleProfileClick}
                  className="profile-button flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 border border-blue-100 hover:border-blue-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                >
                  <div className="relative">
                    {/* Main profile avatar with gradient background */}
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg relative overflow-hidden">
                      {/* Animated background shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer transform -skew-x-12"></div>
                      
                      {/* User initial */}
                      <span className="relative z-10">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                      
                      {/* Status indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                    </div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur opacity-20 animate-pulse"></div>
                  </div>
                  
                  {/* User greeting with first name */}
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-gray-700 font-medium text-sm leading-tight">
                      Hi, {user.name.split(' ')[0]}!
                    </span>
                    <span className="text-gray-500 text-xs leading-tight">
                      Welcome back
                    </span>
                  </div>
                  
                  {/* Dropdown arrow with smooth rotation */}
                  <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isProfileDropdownOpen ? 'rotate-180' : ''
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Enhanced Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="dropdown-container absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                    {/* Header section with gradient background */}
                    <div className="relative p-4 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white">
                      {/* Background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-2 right-4 w-12 h-12 bg-white rounded-full"></div>
                        <div className="absolute bottom-2 left-4 w-8 h-8 bg-white rounded-full"></div>
                      </div>
                      
                      {/* User info */}
                      <div className="relative flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-white text-lg leading-tight">{user.name}</p>
                          <p className="text-blue-100 text-sm leading-tight">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <Link 
                        href="/profile"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      <Link 
                        href="/profile?tab=orders"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        My Orders
                      </Link>
                      <Link 
                        href="/profile?tab=addresses"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Addresses
                      </Link>
                      <Link 
                        href="/profile?tab=billing"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Billing
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button 
                        onClick={() => {
                          setIsLogoutConfirmOpen(true);
                          setIsProfileDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={handleLoginClick}
                className="bg-blue-900 text-white px-4 py-2 rounded text-sm hover:bg-blue-800 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      
      {/* Logout Confirmation Modal */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-gray-900/50 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
            {/* Header with gradient background */}
            <div className="relative bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 rounded-t-2xl px-6 py-4 text-white overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 bg-white/10">
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-2 right-4 w-16 h-16 bg-white/5 rounded-full"></div>
                  <div className="absolute bottom-2 left-4 w-12 h-12 bg-white/5 rounded-full"></div>
                  <div className="absolute top-4 left-1/2 w-8 h-8 bg-white/5 rounded-full"></div>
                </div>
              </div>
              
              {/* Icon and Title */}
              <div className="relative flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white drop-shadow-sm">
                    Sign Out
                  </h3>
                  <p className="text-white/80 text-sm mt-0.5">
                    Logout Confirmation
                  </p>
                </div>
              </div>
            </div>
            
            {/* Body */}
            <div className="px-6 py-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Are you sure you want to log out?
                </h4>
                
                <p className="text-gray-500 text-sm leading-relaxed">
                  You will be signed out of your account and redirected to the homepage. Any unsaved changes may be lost.
                </p>
              </div>
            </div>
            
            {/* Footer with action buttons */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-100">
              <div className="flex gap-3">
                <button
                  onClick={() => setIsLogoutConfirmOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </span>
                </button>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsLogoutConfirmOpen(false);
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 border-2 border-transparent rounded-xl hover:from-red-600 hover:to-rose-700 focus:outline-none focus:ring-4 focus:ring-red-100 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Yes, Log Out
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
