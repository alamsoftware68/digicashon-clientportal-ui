'use client';

import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import { Order, ORDER_STATUS_DISPLAY, ORDER_STATUS_COLORS } from '../../types/orders';
import { useAuth } from '../../contexts/AuthContext';
import OrderDetailsViewModal from '../OrderDetailsViewModal';

const OrdersHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First, load laptop sell orders from localStorage
      const sellOrders = JSON.parse(localStorage.getItem('laptop_sell_orders') || '[]');
      const transformedSellOrders = sellOrders.map((sellOrder: any) => ({
        id: sellOrder.id,
        orderNumber: sellOrder.orderNumber,
        status: sellOrder.status,
        totalPrice: sellOrder.totalAmount,
        createdAt: sellOrder.orderDate,
        address: { address: sellOrder.address },
        service: {
          name: `${sellOrder.deviceName} - Laptop Sell`,
          deviceType: 'LAPTOP_SELL'
        },
        isLaptopSell: true,
        deviceDetails: {
          name: sellOrder.deviceName,
          processor: sellOrder.processor,
          ram: sellOrder.ram,
          storage: sellOrder.storage,
          brand: sellOrder.brand
        },
        pickupDate: sellOrder.pickupDate,
        pickupTimeSlot: sellOrder.pickupTimeSlot,
        technician: null
      }));
      
      // Try to fetch API orders
      try {
        const result = await apiService.getMyOrders();
        
        if (result.success && result.data) {
          // Merge API orders with localStorage sell orders
          const apiOrders = result.data as Order[];
          const allOrders = [...transformedSellOrders, ...apiOrders];
          const sortedOrders = allOrders.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(sortedOrders);
          console.log('Orders fetched successfully:', sortedOrders);
        } else {
          // If API fails, still show localStorage orders
          setOrders(transformedSellOrders);
          console.log('Using only localStorage orders:', transformedSellOrders);
        }
      } catch (apiError: any) {
        console.warn('API call failed, using localStorage orders only:', apiError);
        // If API call fails, still show localStorage orders
        setOrders(transformedSellOrders);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to fetch orders');
      // Even on error, try to show localStorage orders
      try {
        const sellOrders = JSON.parse(localStorage.getItem('laptop_sell_orders') || '[]');
        if (sellOrders.length > 0) {
          const transformedOrders = sellOrders.map((sellOrder: any) => ({
            id: sellOrder.id,
            orderNumber: sellOrder.orderNumber,
            status: sellOrder.status,
            totalPrice: sellOrder.totalAmount,
            createdAt: sellOrder.orderDate,
            address: { address: sellOrder.address },
            service: {
              name: `${sellOrder.deviceName} - Laptop Sell`,
              deviceType: 'LAPTOP_SELL'
            },
            isLaptopSell: true,
            technician: null
          }));
          setOrders(transformedOrders);
        }
      } catch {}
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = filterStatus === 'All' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  // Service name mapping for better display when original cart data is unavailable
  const getImprovedServiceName = (serviceName: string, deviceType: string) => {
    // Map generic service names to more user-friendly names
    const serviceMapping: { [key: string]: string } = {
      'Display Issue': 'Screen Repair',
      'Battery Issue': 'Battery Replacement',
      'Charging Issue': 'Charging Port Repair',
      'Keyboard Issue': 'Keyboard Replacement',
      'Motherboard Issue': 'Motherboard Repair',
      'Software Issue': 'Software Troubleshooting'
    };
    
    return serviceMapping[serviceName] || serviceName;
  };

  const getImprovedCategoryName = (deviceType: string) => {
    // Map device types to more user-friendly categories
    const categoryMapping: { [key: string]: string } = {
      'LAPTOP': 'Laptop Service',
      'DESKTOP': 'Desktop Service', 
      'MOBILE': 'Mobile Service',
      'TABLET': 'Tablet Service'
    };
    
    return categoryMapping[deviceType] || deviceType || 'Home Visit';
  };

  // Helper function to get actual service information from order
  const getOrderServiceInfo = (order: Order) => {
    // If services array is available (from order placement), use it
    if (order.services && order.services.length > 0) {
      console.log(`✅ [Order ${order.orderNumber}] Using original cart data:`, order.services);
      return {
        isMultipleServices: order.services.length > 1,
        serviceCount: order.services.length,
        primaryServiceName: order.services[0].name,
        primaryServiceCategory: order.services[0].category,
        allServiceNames: order.services.map(s => s.name).join(', '),
        services: order.services
      };
    }
    
    // Fallback to single service (from getMyOrders API)
    console.warn(`⚠️ [Order ${order.orderNumber}] Using template data instead of original order:`, {
      templateService: order.service,
      note: 'This may not match the original order placed by user'
    });
    
    const improvedServiceName = getImprovedServiceName(order.service.name, order.service.deviceType);
    const improvedCategoryName = getImprovedCategoryName(order.service.deviceType);
    
    return {
      isMultipleServices: false,
      serviceCount: 1,
      primaryServiceName: improvedServiceName,
      primaryServiceCategory: improvedCategoryName,
      allServiceNames: improvedServiceName,
      services: null
    };
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      setCancellingOrderId(orderId);
      const result = await apiService.cancelOrder(orderId, 'Customer requested cancellation');
      
      if (result.success) {
        setShowCancelConfirmation(null);
        // Refresh orders to show updated status
        await fetchOrders();
        alert('Order cancelled successfully!');
      } else {
        throw new Error(result.message || 'Failed to cancel order');
      }
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      alert(error.message || 'Failed to cancel order. Please try again.');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PICKUP_REQUESTED':
        return (
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'PENDING':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'CONFIRMED':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'IN_PROGRESS':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'COMPLETED':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'CANCELLED':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Orders & Service History</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchOrders}
            className="px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Refresh
          </button>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Orders</option>
            <option value="PICKUP_REQUESTED">Pickup Requested</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">
            {filterStatus === 'All' 
              ? "You haven't placed any orders yet." 
              : `No orders found with status "${filterStatus}".`}
          </p>
        </div>
      ) : (
        <div className={`space-y-4 ${
          filteredOrders.length > 3 
            ? 'max-h-96 overflow-y-auto pr-2 custom-scrollbar'
            : ''
        }`}>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex-1">
                        {(() => {
                          const serviceInfo = getOrderServiceInfo(order);
                          return (
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {serviceInfo.isMultipleServices ? (
                                  <>Multiple Services ({serviceInfo.serviceCount} items)</>
                                ) : (
                                  serviceInfo.primaryServiceName
                                )}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {serviceInfo.isMultipleServices ? (
                                  serviceInfo.allServiceNames
                                ) : (
                                  serviceInfo.primaryServiceCategory
                                )}
                              </p>
                              {/* Add a small indicator showing data source */}
                              {serviceInfo.services && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                                  ✓ Cart Data Available
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{ORDER_STATUS_DISPLAY[order.status] || order.status}</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Order Number:</span>
                    <p className="text-gray-900">{order.orderNumber}</p>
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>
                    <p className="text-gray-900">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Price:</span>
                    <p className="text-gray-900 font-semibold">{formatPrice(order.totalPrice)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Technician:</span>
                    <p className="text-gray-900">{order.technician ? order.technician.name || 'Assigned' : 'Not Assigned'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <button
                    onClick={() => setSelectedOrderNumber(order.orderNumber)}
                    className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                  >
                    View Details
                  </button>
                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => setShowCancelConfirmation(order.id)}
                      className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium"
                      disabled={cancellingOrderId === order.id}
                    >
                      {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Order Details Modal using API */}
      <OrderDetailsViewModal
        isOpen={!!selectedOrderNumber}
        onClose={() => setSelectedOrderNumber('')}
        orderNumber={selectedOrderNumber}
      />
      
      {/* Cancel Order Confirmation Modal */}
      {showCancelConfirmation && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-gray-900/50 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
            {/* Header with warning background */}
            <div className="relative bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-t-2xl px-6 py-4 text-white overflow-hidden">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white drop-shadow-sm">
                    Cancel Order
                  </h3>
                  <p className="text-white/80 text-sm mt-0.5">
                    Order Cancellation Confirmation
                  </p>
                </div>
              </div>
            </div>
            
            {/* Body */}
            <div className="px-6 py-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Are you sure you want to cancel this order?
                </h4>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-gray-700">
                    Order ID: {showCancelConfirmation}
                  </p>
                </div>
                
                <p className="text-gray-500 text-sm leading-relaxed">
                  This action cannot be undone. The order will be marked as cancelled and you will need to place a new order if you change your mind.
                </p>
              </div>
            </div>
            
            {/* Footer with action buttons */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-100">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirmation(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  disabled={cancellingOrderId === showCancelConfirmation}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Keep Order
                  </span>
                </button>
                
                <button
                  onClick={() => handleCancelOrder(showCancelConfirmation)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-orange-600 border-2 border-transparent rounded-xl hover:from-red-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-red-100 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  disabled={cancellingOrderId === showCancelConfirmation}
                >
                  <span className="flex items-center justify-center">
                    {cancellingOrderId === showCancelConfirmation ? (
                      <>
                        <svg className="animate-spin w-4 h-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Yes, Cancel Order
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersHistory;
