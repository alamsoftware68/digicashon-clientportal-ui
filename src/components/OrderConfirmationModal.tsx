'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    deviceName: string;
    orderDate: string;
    address: string;
    scheduleDateTime: string;
    totalAmount: number;
    processor?: string;
    ram?: string;
    storage?: string;
  };
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  orderDetails,
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleViewOrderDetails = () => {
    onClose();
    router.push('/profile?tab=orders');
  };

  const handleBackToHome = () => {
    onClose();
    router.push('/');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 transform transition-all duration-300 scale-100 animate-zoom-in overflow-hidden">
        {/* Success Header */}
        <div className="relative bg-gradient-to-br from-emerald-500 via-cyan-500 to-sky-500 px-8 py-10 text-white overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Decorative background circles */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-8 w-32 h-32 bg-white/30 rounded-full blur-2xl animate-float-slow"></div>
            <div className="absolute bottom-4 left-8 w-24 h-24 bg-white/30 rounded-full blur-2xl animate-float"></div>
            <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white/20 rounded-full blur-xl animate-float-fast"></div>
          </div>

          {/* Success Icon */}
          <div className="relative text-center mb-4">
            <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-lg animate-scale-in">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2">Thank You!</h2>
            <p className="text-emerald-100 text-base">Your order has been confirmed</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {/* Order Details Section */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-white">
              <h3 className="text-base font-semibold text-gray-900">Order Details</h3>
            </div>
            
            <div className="divide-y divide-slate-200">
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">Device</span>
                <span className="text-sm font-semibold text-gray-900">{orderDetails.deviceName}</span>
              </div>
              
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">Order Date</span>
                <span className="text-sm font-semibold text-gray-900">{orderDetails.orderDate}</span>
              </div>
              
              <div className="px-5 py-3 flex items-start justify-between">
                <span className="text-sm text-gray-600">Address</span>
                <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%]">{orderDetails.address}</span>
              </div>
              
              <div className="px-5 py-3 flex items-start justify-between">
                <span className="text-sm text-gray-600">Schedule Date & Time</span>
                <span className="text-sm font-semibold text-gray-900 text-right">{orderDetails.scheduleDateTime}</span>
              </div>
            </div>
          </div>

          {/* Service Details Collapsible */}
          <details className="mt-4 group">
            <summary className="flex items-center justify-between cursor-pointer px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
              <span className="text-sm font-semibold text-gray-900">Service Details</span>
              <svg className="w-5 h-5 text-gray-600 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-2 px-5 py-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="space-y-2 text-sm">
                {orderDetails.processor && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processor:</span>
                    <span className="font-medium text-gray-900">{orderDetails.processor}</span>
                  </div>
                )}
                {orderDetails.ram && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">RAM:</span>
                    <span className="font-medium text-gray-900">{orderDetails.ram}</span>
                  </div>
                )}
                {orderDetails.storage && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storage:</span>
                    <span className="font-medium text-gray-900">{orderDetails.storage}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-300 flex justify-between">
                  <span className="text-gray-900 font-semibold">Total Amount:</span>
                  <span className="text-lg font-bold text-emerald-600">₹{orderDetails.totalAmount}</span>
                </div>
              </div>
            </div>
          </details>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex gap-3">
          <button
            onClick={handleBackToHome}
            className="flex-1 px-5 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>BACK TO HOME</span>
          </button>
          
          <button
            onClick={handleViewOrderDetails}
            className="flex-1 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            ORDER DETAILS
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;
