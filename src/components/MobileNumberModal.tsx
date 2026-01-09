'use client';

import React, { useState } from 'react';

interface MobileNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mobileNumber: string) => void;
}

export default function MobileNumberModal({ isOpen, onClose, onSubmit }: MobileNumberModalProps) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) {
      setMobileNumber(value);
      setError('');
    }
  };

  const handleSubmit = () => {
    if (mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    onSubmit(mobileNumber);
  };

  const handleCancel = () => {
    setMobileNumber('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative bg-slate-900 rounded-3xl border border-slate-800 shadow-[0_20px_80px_rgba(15,23,42,0.95)] max-w-md w-full overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute inset-y-0 -right-40 w-80 bg-gradient-to-bl from-cyan-500/20 via-blue-500/0 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -top-32 -left-24 h-56 w-56 bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mx-auto mb-4">
              <svg className="h-8 w-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-200 bg-clip-text text-transparent">
                Get Your Price
              </span>
            </h2>
            <p className="text-sm text-slate-400">
              Enter your mobile number to view the estimated selling price for your device
            </p>
          </div>

          {/* Mobile Number Input */}
          <div className="mb-6">
            <label htmlFor="mobile" className="block text-sm font-medium text-slate-300 mb-2">
              Mobile Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="text-slate-400 text-sm font-medium">+91</span>
              </div>
              <input
                id="mobile"
                type="tel"
                value={mobileNumber}
                onChange={handleMobileNumberChange}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                className={`w-full pl-14 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  error
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-slate-700 focus:ring-cyan-500/50 focus:border-cyan-500'
                }`}
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              We'll use this number to send you updates about your device evaluation
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-5 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-300 font-medium hover:bg-slate-800 hover:border-slate-600 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={mobileNumber.length !== 10}
              className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/40 hover:shadow-cyan-400/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-cyan-500/40 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Get Price</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
