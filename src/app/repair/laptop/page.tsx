'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import DigiCashOnPromise from '@/components/DigiCashOnPromise';
import ViewDetailsButton from '@/components/ViewDetailsButton';
import LoginModal from '@/components/LoginModal';
import AddressSelectionModal from '@/components/AddressSelectionModal';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import { useAuth, Address } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import apiService from '@/services/api';
import { UIServiceCategory, UIServiceItem, transformServiceCategories } from '@/types/service-categories';
import { CreateOrderRequest, PlaceOrderRequest } from '@/types/orders';

// Legacy interfaces for backward compatibility
interface ServiceItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  features: string[];
  badge?: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  services: ServiceItem[];
  bulletPoints: string[];
  description: string;
}

const LaptopRepairPage = () => {
  const { isLoggedIn, addOrder, user } = useAuth();
  const { 
    cartItems, 
    cartSummary, 
    isLoading: isCartLoading, 
    addItemToCart, 
    removeItemFromCart, 
    updateItemQuantity,
    clearCart,
    isServiceInCart,
    getCartTotal,
    getCartItemCount
  } = useCart();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('home-visit');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Load service categories from API
  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setCategoriesError(null);
        console.log('[Categories] Fetching service categories from API...');
        
        const response = await apiService.getServiceCategories();
        
        if (response.success && response.data) {
          const transformedCategories = transformServiceCategories(response.data);
          setServiceCategories(transformedCategories);
          
          // Set first category as active by default
          if (transformedCategories.length > 0) {
            setActiveTab(transformedCategories[0].id);
          }
          
          console.log('[Categories] Successfully loaded', transformedCategories.length, 'categories');
        } else {
          throw new Error(response.message || 'Failed to fetch service categories');
        }
      } catch (error) {
        console.error('[Categories] Error fetching service categories:', error);
        setCategoriesError(error instanceof Error ? error.message : 'Failed to load service categories');
        
        // Fallback to empty array to prevent app crash
        setServiceCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    fetchServiceCategories();
  }, []);

  // Cart is now managed by CartContext - no localStorage management needed
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isBookingInProgress, setIsBookingInProgress] = useState<boolean>(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState<boolean>(false);
  const [lastOrderId, setLastOrderId] = useState<string>('');
  const [lastOrderAmount, setLastOrderAmount] = useState<number>(0);
  const [isAddressSelectionOpen, setIsAddressSelectionOpen] = useState<boolean>(false);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const handleCategoryClick = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedCategory(null), 300);
  };

  const handleAddToCart = async (service: ServiceItem) => {
    try {
      await addItemToCart(service.id, 1);
      console.log(`[Cart] ✅ Added ${service.name} to cart`);
    } catch (error) {
      console.error(`[Cart] ❌ Failed to add ${service.name} to cart:`, error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const handleRemoveFromCart = async (cartItemId: number) => {
    try {
      await removeItemFromCart(cartItemId);
      console.log('[Cart] ✅ Item removed from cart');
    } catch (error) {
      console.error('[Cart] ❌ Failed to remove item from cart:', error);
      alert('Failed to remove item from cart. Please try again.');
    }
  };

  const removeServiceFromCart = async (serviceName: string) => {
    const cartItem = cartItems.find(item => item.serviceTitle === serviceName);
    if (cartItem) {
      await handleRemoveFromCart(cartItem.id);
    }
  };

  const isServiceInCartByName = (serviceName: string) => {
    return cartItems.some(item => item.serviceTitle === serviceName);
  };

  const handleBookNow = async () => {
    if (getCartItemCount() === 0) return;

    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    // Show address selection modal
    setIsAddressSelectionOpen(true);
  };

  const handleAddressSelected = (address: Address) => {
    setSelectedAddress(address);
    setIsAddressSelectionOpen(false);
    // Now open the order details modal
    setIsOrderDetailsOpen(true);
  };

  const handleOrderDetailsConfirm = async (details: { problemDescription: string; customerNotes: string }) => {
    if (!selectedAddress) {
      alert('Please select an address first');
      return;
    }

    try {
      setIsBookingInProgress(true);
      const totalAmount = getCartTotal();
      
      // Transform cart items to the new API format
      const services = cartItems.map(item => ({
        serviceId: item.serviceItemId, // Use the actual service item ID from backend
        name: item.serviceTitle, // Service item name (e.g., "MacBook")
        categoryName: item.categoryName, // Category name (e.g., "Home Visit")
        serviceTitle: item.serviceTitle, // Service title (e.g., "MacBook")
        price: item.unitPrice, // Unit price from cart
        quantity: item.quantity,
        notes: item.notes || undefined
      }));
      
      console.log('[Order] Cart items transformation:', {
        originalCartItems: cartItems.map(item => ({
          id: item.id,
          serviceItemId: item.serviceItemId,
          serviceTitle: item.serviceTitle,
          categoryName: item.categoryName,
          unitPrice: item.unitPrice,
          quantity: item.quantity
        })),
        transformedServices: services
      });
      
      // Prepare order request for the new API
      const orderRequest: CreateOrderRequest = {
        services: services,
        addressId: parseInt(selectedAddress.id), // Convert string ID to number for API
        totalAmount: totalAmount,
        problemDescription: details.problemDescription,
        customerNotes: details.customerNotes
      };
      
      console.log('Creating order with new API:', {
        endpoint: '/orders/create',
        cartItems: cartItems,
        transformedServices: services,
        orderRequest: orderRequest
      });
      
      // Call the new create order API
      const result = await apiService.createOrder(orderRequest);
      
      if (result.success && result.data) {
        // Extract order details from the new API response
        const orderAmount = result.data.totalPrice;
        const orderNumber = result.data.orderNumber;
        const orderItems = result.data.orderItems || [];
        
        setLastOrderAmount(orderAmount);
        setLastOrderId(orderNumber);
        await clearCart(); // Clear cart using CartContext
        setShowOrderSuccess(true);
        setIsOrderDetailsOpen(false);
        
        console.log('✅ Order created successfully with enhanced order items:', {
          orderNumber: orderNumber,
          totalAmount: orderAmount,
          orderItems: orderItems,
          itemCount: orderItems.length,
          enhancedFields: {
            serviceName: orderItems.map(item => item.serviceName),
            serviceCategory: orderItems.map(item => item.serviceCategory),
            serviceTitle: orderItems.map(item => item.serviceTitle),
            serviceItemId: orderItems.map(item => item.serviceItemId)
          }
        });
      } else {
        throw new Error(result.message || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert('Failed to create order: ' + (error.message || 'Please try again.'));
    } finally {
      setIsBookingInProgress(false);
    }
  };

  const closeOrderSuccessModal = () => {
    setShowOrderSuccess(false);
    setLastOrderId('');
  };

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isDrawerOpen]);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Header />
      
      {/* Simple Page Header - Fixed */}
      <div className="bg-white sticky top-16 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 relative">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Laptop Repair Services
              </span>
              {/* Subtle underline accent */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60"></div>
            </h1>
            <p className="text-lg text-gray-600">
              Expert technicians at your doorstep for all laptop repairs
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Service Categories - Main Content */}
          <div className="lg:col-span-3">
            
            {/* Loading State */}
            {isLoadingCategories && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="text-center">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Services...</h3>
                  <p className="text-gray-500">Please wait while we fetch the latest service categories</p>
                  
                  {/* Loading skeleton */}
                  <div className="mt-8 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gray-100 rounded-lg h-20 animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {categoriesError && !isLoadingCategories && (
              <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-red-800 mb-2">Failed to Load Services</h3>
                  <p className="text-red-600 mb-6">{categoriesError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
            
            {/* Service Categories Content - Only show when loaded and no error */}
            {!isLoadingCategories && !categoriesError && serviceCategories.length > 0 && (
            <>
            {/* Enhanced Tab Navigation with Modern Design */}
            <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Tab Header with Gradient */}
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1">
                <div className="bg-white rounded-xl p-4">
                  <div className="text-center mb-4">
                    <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ✨ Choose Your Service Category
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">Select from our professional service offerings</p>
                  </div>
                  
                  {/* Enhanced Tab Buttons */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    {serviceCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveTab(category.id)}
                        className={`group relative flex items-center px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                          activeTab === category.id
                            ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-2xl'
                            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-indigo-100 hover:to-purple-100 hover:text-indigo-700 shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {/* Tab Icon Container */}
                        <div className={`relative mr-3 p-2 rounded-xl transition-all duration-300 ${
                          activeTab === category.id
                            ? 'bg-white/20 backdrop-blur-sm'
                            : 'bg-white/80 group-hover:bg-white'
                        }`}>
                          <span className={`text-xl block transition-transform duration-300 group-hover:scale-110 ${
                            activeTab === category.id ? 'animate-bounce' : ''
                          }`}>
                            {category.icon}
                          </span>
                          
                          {/* Icon glow effect for active tab */}
                          {activeTab === category.id && (
                            <div className="absolute inset-0 bg-white/30 rounded-xl blur-md"></div>
                          )}
                        </div>
                        
                        {/* Tab Content */}
                        <div className="text-left">
                          <div className={`font-bold text-sm transition-colors duration-300 ${
                            activeTab === category.id ? 'text-white' : 'text-gray-800 group-hover:text-indigo-700'
                          }`}>
                            {category.name}
                          </div>
                          <div className={`text-xs mt-1 transition-colors duration-300 ${
                            activeTab === category.id ? 'text-white/80' : 'text-gray-500 group-hover:text-indigo-600'
                          }`}>
                            {category.services.length} services
                          </div>
                        </div>
                        
                        {/* Active Tab Indicator */}
                        {activeTab === category.id && (
                          <>
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shine"></div>
                            
                            {/* Floating particles */}
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                          </>
                        )}
                        
                        {/* Hover glow effect */}
                        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                          activeTab === category.id
                            ? 'bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-pink-400/20'
                            : 'bg-gradient-to-r from-indigo-200/30 to-purple-200/30'
                        }`}></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Service Categories Grid with DigiCashOn Promise - Horizontal Layout */}
            <div className="bg-white rounded-b-xl shadow-sm p-6">
              <div className="space-y-4">
                {/* Service Category Cards - Enlarged to match DigiCashOn Promise */}
                <div className="grid grid-cols-1 gap-4">
                  {serviceCategories
                    .filter(category => activeTab === 'all' || category.id === activeTab)
                    .map((category) => (
                      <div
                        key={category.id}
                        className="group bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 transition-all duration-300 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-200 hover:shadow-md w-full max-w-md"
                      >
                        {/* Enhanced Layout with more space */}
                        <div className="space-y-4">
                          {/* Top Section: Icon and Info */}
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-white/80 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors duration-300 shadow-sm">
                              <span className="text-2xl">{category.icon}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 mb-2">
                                {category.name}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {category.services.length} services available
                              </p>
                            </div>
                          </div>
                          
                          {/* Middle Section: Bullet Points */}
                          <div className="space-y-2">
                            {category.bulletPoints.map((point, index) => (
                              <div key={index} className="flex items-center text-sm text-gray-700">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                                <span>{point}</span>
                              </div>
                            ))}
                          </div>
                          
                          {/* Bottom Section: Price and Buttons */}
                          <div className="space-y-3 pt-2">
                            {/* Price and Buttons Row */}
                            <div className="flex items-end justify-between">
                              {/* Left side - Price and View Details button */}
                              <div className="flex-1 space-y-2">
                                <div className="text-left">
                                  <p className="text-xs text-gray-500 mb-1">Starting from</p>
                                  <p className="text-xl font-bold text-gray-800">
                                    ₹{Math.min(...category.services.map(s => s.price))}
                                  </p>
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                  <ViewDetailsButton position="center" className="w-full" />
                                </div>
                              </div>
                              
                              {/* Right side - Add Services button */}
                              <div className="flex-1 ml-3">
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleCategoryClick(category);
                                  }}
                                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2.5 px-3 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 text-center text-sm"
                                >
                                  Add Services
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                
                {/* DigiCashOn Promise Component - Reduced Width */}
                <div className="mt-3 max-w-md">
                  <DigiCashOnPromise />
                </div>
              </div>
            </div>
            </>
            )}
          </div>

          {/* Right Sidebar - Enhanced Cart */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-20 overflow-hidden">
              {/* Cart Header with Gradient */}
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 -mx-6 -mt-6 p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h7a2 2 0 002-2v-8m-9 0V9a2 2 0 012-2h7a2 2 0 012 2v4m-9 0h9" />
                      </svg>
                      Your Cart
                    </h3>
                    <p className="text-blue-100 text-sm">Selected services</p>
                  </div>
                  {getCartItemCount() > 0 && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white font-bold text-sm">
                        {getCartItemCount()} item{getCartItemCount() > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
                <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full" />
              </div>
              
              {/* Container sized to show exactly 2 items at a time */}
              <div className="h-[500px] flex flex-col">
                {getCartItemCount() === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-300 rounded-full animate-pulse" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Your cart awaits!</h4>
                      <p className="text-gray-500 mb-4">Add services to see them here</p>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">🏠 Home service available</p>
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-lg font-bold text-gray-800">Total Amount: <span className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">₹0</span></p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Scrollable cart items - height adjusted to show 2 items */}
                    <div className="h-[240px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50">
                      {cartItems.map((item) => (
                        <div key={item.id} className="group bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl p-3 border border-gray-100 hover:shadow-md transition-all duration-200">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 pr-3">
                              <div className="flex items-center mb-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-2">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 text-sm leading-tight">{item.serviceTitle}</h4>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                  ₹{item.totalPrice}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">
                                    Qty: {item.quantity}
                                  </span>
                                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                    ✓ Added
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleRemoveFromCart(item.id)}
                              disabled={isCartLoading}
                              className={`flex-shrink-0 w-6 h-6 bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
                                isCartLoading ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Fixed footer section with total and checkout */}
                    <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-200">
                      {/* Enhanced Total Section */}
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                          <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ₹{getCartTotal()}
                          </span>
                        </div>
                        
                        {/* Redesigned Book Now Button - Smaller Size */}
                        <button 
                          onClick={handleBookNow}
                          disabled={isBookingInProgress || getCartItemCount() === 0}
                          className={`w-full relative overflow-hidden text-white py-3 px-4 rounded-lg font-semibold text-base shadow-lg transition-all duration-300 transform group ${
                            isBookingInProgress || getCartItemCount() === 0
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:shadow-xl hover:scale-[1.02]'
                          }`}
                        >
                          {!isBookingInProgress && (
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          )}
                          <div className="relative flex items-center justify-center">
                            {isBookingInProgress ? (
                              <>
                                <svg className="animate-spin w-5 h-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Placing Order...
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Book Now - ₹{getCartTotal()}
                              </>
                            )}
                          </div>
                          {/* Button shine effect */}
                          {!isBookingInProgress && (
                            <div className="absolute inset-0 -top-1 -left-1 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                          )}
                        </button>
                        
                        {/* Service Features */}
                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div className="flex items-center">
                            <svg className="w-3 h-3 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Same Day Service
                          </div>
                          <div className="flex items-center">
                            <svg className="w-3 h-3 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Warranty Included
                          </div>
                          <div className="flex items-center">
                            <svg className="w-3 h-3 text-purple-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            Best Price
                          </div>
                          <div className="flex items-center">
                            <svg className="w-3 h-3 text-orange-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Expert Service
                          </div>
                        </div>
                      </div>
                    </div>
                </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Slide-in Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={closeDrawer}
        />
      )}

      {/* Slide-in Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
        isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {selectedCategory && (
          <div className="h-full flex flex-col">
            {/* Enhanced Drawer Header with Modern Design */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-6 flex items-center justify-between overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-4 right-8 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-8 w-12 h-12 bg-yellow-400/20 rounded-full animate-bounce"></div>
                <div className="absolute top-1/2 right-16 w-8 h-8 bg-pink-400/30 rounded-full animate-ping"></div>
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/95 via-purple-600/95 to-pink-600/95"></div>
              
              <div className="relative flex items-center z-10">
                {/* Enhanced Icon Container */}
                <div className="relative mr-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/30">
                    <span className="text-3xl block transform hover:scale-110 transition-transform duration-300">{selectedCategory.icon}</span>
                  </div>
                  {/* Icon glow effect */}
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md opacity-50"></div>
                  {/* Floating particles around icon */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
                
                <div>
                  {/* Enhanced Title with Multiple Effects */}
                  <div className="relative">
                    {/* 3D Shadow Effect */}
                    <h2 className="absolute top-0.5 left-0.5 text-2xl font-black text-black/20 blur-sm">
                      {selectedCategory.name}
                    </h2>
                    
                    {/* Main Title */}
                    <h2 className="relative text-2xl font-black bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent filter drop-shadow-lg">
                      {selectedCategory.name}
                    </h2>
                  </div>
                  
                  {/* Enhanced Subtitle with Cart Count */}
                  <div className="flex items-center mt-2 space-x-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <p className="text-white text-sm font-semibold">
                        {selectedCategory.services.length} services
                      </p>
                    </div>
                    
                    {/* Cart Count Badge */}
                    {getCartItemCount() > 0 && (
                      <div className="bg-gradient-to-r from-green-400 to-emerald-400 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30 shadow-lg">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h7a2 2 0 002-2v-8m-9 0V9a2 2 0 012-2h7a2 2 0 012 2v4m-9 0h9" />
                          </svg>
                          <span className="text-white text-sm font-bold">
                            {getCartItemCount()} in cart
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center text-yellow-300">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span className="text-sm font-medium">Professional</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Close Button */}
              <button 
                onClick={closeDrawer}
                className="relative z-10 group bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 rounded-xl p-3 transition-all duration-300 transform hover:scale-110 hover:rotate-90"
              >
                <svg className="w-6 h-6 text-white group-hover:text-yellow-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400"></div>
            </div>

            {/* Drawer Content - Redesigned */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
              <div className="p-6 space-y-6">
                {selectedCategory.services.map((service, index) => (
                  <div key={index} className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    {/* Service Image */}
                    {service.image && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Badge */}
                        {service.badge && (
                          <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg">
                              {service.badge}
                            </span>
                          </div>
                        )}
                        
                        {/* Price Badge */}
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                            <span className="text-2xl font-black text-blue-600">₹{service.price}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Service Content */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {service.name}
                        </h3>
                        {service.description && (
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {service.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Features List */}
                      {service.features && service.features.length > 0 && (
                        <div className="mb-6">
                          <div className="grid grid-cols-2 gap-2">
                            {service.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="truncate">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Enhanced Cart Control Buttons with Visual Feedback */}
                      {isServiceInCartByName(service.name) ? (
                        <div className="space-y-3">
                          {/* Buttons on same row with reduced width */}
                          <div className="flex gap-3">
                            <button 
                              className="flex-1 relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-3 px-4 rounded-lg font-semibold text-sm shadow-lg transform transition-all duration-300 cursor-default"
                              disabled
                            >
                              <div className="relative flex items-center justify-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Added
                              </div>
                              {/* Success pulse effect */}
                              <div className="absolute inset-0 bg-green-400 opacity-30 animate-pulse rounded-lg" />
                            </button>
                            
                            {/* Remove from Cart Button */}
                            <button 
                              onClick={() => {
                                removeServiceFromCart(service.name);
                                // Show removal animation
                                const button = document.activeElement as HTMLButtonElement;
                                if (button) {
                                  button.style.transform = 'scale(0.95)';
                                  setTimeout(() => {
                                    button.style.transform = 'scale(1)';
                                  }, 150);
                                }
                              }}
                              className="flex-1 relative overflow-hidden bg-gradient-to-r from-red-400 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 group"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative flex items-center justify-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove
                              </div>
                            </button>
                          </div>
                          
                          {/* Book Now Button - Only visible when service is in cart */}
                          <button 
                            onClick={() => {
                              closeDrawer();
                              handleBookNow();
                            }}
                            disabled={isBookingInProgress}
                            className={`w-full relative overflow-hidden text-white py-3 px-6 rounded-xl font-bold text-base shadow-xl transition-all duration-300 transform group ${
                              isBookingInProgress
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:shadow-2xl hover:scale-[1.02]'
                            }`}
                          >
                            {!isBookingInProgress && (
                              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            )}
                            <div className="relative flex items-center justify-center">
                              {isBookingInProgress ? (
                                <>
                                  <svg className="animate-spin w-5 h-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Booking...
                                </>
                              ) : (
                                <>
                                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  Book Now
                                </>
                              )}
                            </div>
                            {/* Button shine effect */}
                            {!isBookingInProgress && (
                              <div className="absolute inset-0 -top-1 -left-1 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            handleAddToCart(service);
                            // Show success animation
                            const button = document.activeElement as HTMLButtonElement;
                            if (button) {
                              button.style.transform = 'scale(0.95)';
                              setTimeout(() => {
                                button.style.transform = 'scale(1)';
                              }, 150);
                            }
                          }}
                          disabled={isCartLoading}
                          className={`w-full relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 group ${
                            isCartLoading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h7a2 2 0 002-2v-8m-9 0V9a2 2 0 012-2h7a2 2 0 012 2v4m-9 0h9" />
                            </svg>
                            Add to Cart
                          </div>
                          
                          {/* Button shine effect */}
                          <div className="absolute inset-0 -top-2 -left-2 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                        </button>
                      )}
                      
                      {/* Additional Info */}
                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Verified Service
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Same Day Service
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  🛡️ All services come with warranty
                </p>
                <p className="text-sm text-gray-600">
                  ⭐ Rated 4.8/5 by 10k+ customers
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      
      {/* Address Selection Modal */}
      <AddressSelectionModal
        isOpen={isAddressSelectionOpen}
        onClose={() => setIsAddressSelectionOpen(false)}
        onSelectAddress={handleAddressSelected}
      />
      
      {/* Order Details Modal */}
      {selectedAddress && user && (
        <OrderDetailsModal
          isOpen={isOrderDetailsOpen}
          onClose={() => {
            setIsOrderDetailsOpen(false);
            setSelectedAddress(null);
          }}
          onConfirm={handleOrderDetailsConfirm}
          selectedAddress={selectedAddress}
          cartItems={cartItems}
          totalAmount={getCartTotal()}
          itemCount={getCartItemCount()}
          isPlacingOrder={isBookingInProgress}
          user={user}
        />
      )}
      
      {/* Order Success Modal */}
      {showOrderSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
              <p className="text-green-100">Your repair service has been booked</p>
            </div>
            
            {/* Success Body */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-semibold">Order ID: {lastOrderId}</p>
                  <p className="text-green-600 text-sm mt-1">Amount: ₹{lastOrderAmount}</p>
                </div>
                <p className="text-gray-600 mb-4">
                  Thank you for choosing DigiCashOn! Your order has been successfully placed and will appear in your order history.
                </p>
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <p className="text-blue-800 text-sm">
                    📱 You will receive SMS/Email updates about your order status
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    closeOrderSuccessModal();
                    // Navigate to home page for continue shopping
                    router.push('/');
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => {
                    closeOrderSuccessModal();
                    // Navigate to profile orders tab for order history
                    router.push('/profile?tab=orders');
                  }}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300"
                >
                  View Order History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaptopRepairPage;
