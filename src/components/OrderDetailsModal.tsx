'use client';

import React, { useState } from 'react';
import { Address } from '../contexts/AuthContext';

// Cart item interface
interface CartItem {
  id: number;
  serviceTitle: string;
  serviceDescription: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  serviceDetails?: {
    serviceTitle: string;
    serviceDescription: string;
  };
}

// User interface
interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: { problemDescription: string; customerNotes: string }) => void;
  selectedAddress: Address;
  cartItems: CartItem[];
  totalAmount: number;
  itemCount: number;
  isPlacingOrder: boolean;
  user: User;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  selectedAddress,
  cartItems,
  totalAmount,
  itemCount,
  isPlacingOrder,
  user
}) => {
  const [problemDescription, setProblemDescription] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!problemDescription.trim()) {
      alert('Please provide a problem description');
      return;
    }
    
    onConfirm({
      problemDescription: problemDescription.trim(),
      customerNotes: customerNotes.trim()
    });
  };

  const resetForm = () => {
    setProblemDescription('');
    setCustomerNotes('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg transform transition-all duration-300 scale-100 overflow-hidden my-8">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-1">Order Details</h2>
              <p className="text-green-100 text-xs sm:text-sm">Hello {user.name}! Complete your service request</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isPlacingOrder}
              className="text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-50"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-3 sm:p-4 max-h-[calc(95vh-200px)] sm:max-h-[calc(90vh-180px)] overflow-y-auto">
          {/* Detailed Service Breakdown */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4 border border-blue-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Service Details</h3>
            
            {/* Service Items */}
            <div className="space-y-2 mb-3">
              {cartItems.map((item, index) => (
                <div key={item.id} className="bg-white rounded-lg p-2 border border-blue-100">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-xs font-medium text-gray-900 mb-1">{item.serviceTitle}</h4>
                      <p className="text-xs text-gray-600 mb-1">{item.categoryName}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>Qty: {item.quantity}</span>
                        <span className="mx-2">×</span>
                        <span>₹{item.unitPrice}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-blue-600">₹{item.totalPrice}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total */}
            <div className="border-t border-blue-200 pt-2 mb-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-800">Total ({itemCount} item{itemCount > 1 ? 's' : ''})</span>
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ₹{totalAmount}
                </span>
              </div>
            </div>
            
            {/* Delivery Address */}
            <div className="border-t border-blue-200 pt-2">
              <div className="text-xs text-gray-600 mb-1">
                <strong>Delivery Address:</strong>
              </div>
              <div className="text-xs text-gray-700">
                <div className="flex items-center space-x-1 mb-1">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedAddress.type}
                  </span>
                  {selectedAddress.isDefault && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Default
                    </span>
                  )}
                </div>
                <p>{selectedAddress.address}</p>
                <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Problem Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Problem Description *
              </label>
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                disabled={isPlacingOrder}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                rows={3}
                placeholder="Describe the device issue (e.g., 'Screen cracked', 'Battery issues', 'Won't turn on')"
                maxLength={1000}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {problemDescription.length}/1000
              </div>
            </div>

            {/* Customer Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Instructions (Optional)
              </label>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                disabled={isPlacingOrder}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                rows={2}
                placeholder="Special instructions (e.g., 'Call before arriving', 'Available after 2 PM')"
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {customerNotes.length}/500
              </div>
            </div>

            {/* Compact Service Features */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-800 mb-2">Service Includes:</h4>
              <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-600">
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="truncate">Doorstep Service</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="truncate">Expert Technicians</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="truncate">Warranty Included</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="truncate">Same Day Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="bg-gray-50 p-3 sm:p-4 border-t">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleClose}
              disabled={isPlacingOrder}
              className="flex-1 px-3 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isPlacingOrder || !problemDescription.trim()}
              className="flex-1 relative overflow-hidden px-3 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isPlacingOrder ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin w-4 h-4 mr-1.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="hidden sm:inline">Placing Order...</span>
                  <span className="sm:hidden">Placing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="hidden sm:inline">Place Order - ₹{totalAmount}</span>
                  <span className="sm:hidden">Pay ₹{totalAmount}</span>
                </div>
              )}
              
              {/* Button shine effect */}
              {!isPlacingOrder && (
                <div className="absolute inset-0 -top-1 -left-1 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 hover:translate-x-full transition-transform duration-700 ease-in-out" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
