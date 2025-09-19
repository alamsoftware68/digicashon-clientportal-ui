'use client';

import React, { useState } from 'react';
import { Address } from '../contexts/AuthContext';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: { problemDescription: string; customerNotes: string }) => void;
  selectedAddress: Address;
  totalAmount: number;
  itemCount: number;
  isPlacingOrder: boolean;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  selectedAddress,
  totalAmount,
  itemCount,
  isPlacingOrder
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Order Details</h2>
              <p className="text-green-100 text-sm">Provide details about your service request</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isPlacingOrder}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Order Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-medium text-gray-800">{itemCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ₹{totalAmount}
                </span>
              </div>
              <div className="border-t border-blue-200 pt-2 mt-3">
                <div className="text-gray-600">
                  <strong>Delivery Address:</strong>
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedAddress.type}
                    </span>
                    {selectedAddress.isDefault && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-1">{selectedAddress.address}</p>
                  <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Problem Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem Description *
              </label>
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                disabled={isPlacingOrder}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={4}
                placeholder="Describe the issue with your device in detail (e.g., 'Laptop screen is cracked and displaying weird colors', 'Battery drains quickly', etc.)"
                maxLength={1000}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {problemDescription.length}/1000 characters
              </div>
            </div>

            {/* Customer Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                disabled={isPlacingOrder}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={3}
                placeholder="Any special instructions for the technician (e.g., 'Please call before arriving', 'Available after 2 PM', 'Ring the doorbell twice', etc.)"
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {customerNotes.length}/500 characters
              </div>
            </div>

            {/* Service Features */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">What's Included:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Doorstep Service
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Expert Technicians
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Warranty Included
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Same Day Service
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 border-t">
          <div className="flex space-x-4">
            <button
              onClick={handleClose}
              disabled={isPlacingOrder}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isPlacingOrder || !problemDescription.trim()}
              className="flex-1 relative overflow-hidden px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlacingOrder ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin w-5 h-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Placing Order...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Place Order - ₹{totalAmount}
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
