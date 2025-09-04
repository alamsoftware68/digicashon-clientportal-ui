'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { redirect, useSearchParams, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import UserDetails from '../../components/profile/UserDetails';
import OrdersHistory from '../../components/profile/OrdersHistory';
import AddressManagement from '../../components/profile/AddressManagement';
import ChangePassword from '../../components/profile/ChangePassword';
import PaymentBilling from '../../components/profile/PaymentBilling';

const ProfilePage = () => {
  const { user, isLoggedIn } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!isLoggedIn) {
      redirect('/');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'orders', 'addresses', 'password', 'billing'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (!isLoggedIn || !user) {
    return null; // Will redirect in useEffect
  }

  const menuItems = [
    {
      id: 'profile',
      label: 'User Details',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'orders',
      label: 'Orders & Services',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'addresses',
      label: 'Address Management',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 'password',
      label: 'Change Password',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      id: 'billing',
      label: 'Payment & Billing',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserDetails />;
      case 'orders':
        return <OrdersHistory />;
      case 'addresses':
        return <AddressManagement />;
      case 'password':
        return <ChangePassword />;
      case 'billing':
        return <PaymentBilling />;
      default:
        return <UserDetails />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Sticky Header */}
        <div className="sticky top-20 z-30 bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Enhanced Avatar */}
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-3 border-white rounded-full animate-pulse"></div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full blur opacity-20 animate-pulse"></div>
              </div>
              
              {/* Enhanced User Info */}
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Welcome back,
                  </span>
                  <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent ml-2">
                    {user.name}!
                  </span>
                </h1>
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="p-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{user.orders?.length || 0}</div>
                <div className="text-sm text-gray-500">Total Orders</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{user.addresses?.length || 0}</div>
                <div className="text-sm text-gray-500">Addresses</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              {/* Enhanced New Order Button - Smaller and Bluish design */}
              <button 
                onClick={() => router.push('/repair/laptop')}
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white rounded-lg font-bold text-base shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 overflow-hidden"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Shimmering effect */}
                <div className="absolute inset-0 -top-1 -left-1 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-800 ease-out" />
                
                {/* Main button content */}
                <div className="relative flex items-center justify-center">
                  {/* Animated icon */}
                  <div className="mr-2 transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  
                  {/* Button text with gradient */}
                  <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent font-black tracking-wide">
                    New Order
                  </span>
                  
                  {/* Pulsing dot */}
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-300 rounded-full animate-ping" />
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-200 rounded-full" />
                </div>
                
                {/* Floating particles */}
                <div className="absolute top-1 left-2 w-0.5 h-0.5 bg-white/60 rounded-full animate-ping" style={{animationDelay: '0s'}} />
                <div className="absolute bottom-1.5 right-3 w-1 h-1 bg-blue-200/80 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
                <div className="absolute top-2 right-1.5 w-0.5 h-0.5 bg-indigo-200/70 rounded-full animate-bounce" style={{animationDelay: '1s'}} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Clean Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your profile and preferences</p>
              </div>
              
              <nav className="p-3">
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-4 text-left rounded-lg transition-all duration-200 group ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className={`flex-shrink-0 ${
                        activeTab === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.label}</span>
                      {activeTab === item.id && (
                        <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
