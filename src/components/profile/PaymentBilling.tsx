'use client';

import React, { useState } from 'react';
import { useAuth, PaymentMethod, Invoice } from '../../contexts/AuthContext';

const PaymentBilling = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'invoices' | 'payment-methods'>('invoices');
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    type: 'Credit Card',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  if (!user) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
    }

    // Format CVV (numbers only)
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setPaymentForm(prev => ({ ...prev, [name]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePaymentForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!paymentForm.name.trim()) {
      newErrors.name = 'Cardholder name is required';
    }

    const cardNumber = paymentForm.cardNumber.replace(/\s/g, '');
    if (!cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumber.length < 15 || cardNumber.length > 16) {
      newErrors.cardNumber = 'Card number must be 15-16 digits';
    }

    if (!paymentForm.expiryMonth || !paymentForm.expiryYear) {
      newErrors.expiry = 'Expiry date is required';
    } else {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const expiryYear = parseInt(paymentForm.expiryYear);
      const expiryMonth = parseInt(paymentForm.expiryMonth);
      
      if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        newErrors.expiry = 'Card has expired';
      }
    }

    if (!paymentForm.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (paymentForm.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCardBrand = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    if (/^4/.test(number)) return 'Visa';
    if (/^5[1-5]/.test(number)) return 'MasterCard';
    if (/^3[47]/.test(number)) return 'American Express';
    if (/^6/.test(number)) return 'Discover';
    return 'Unknown';
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePaymentForm()) return;

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const cardNumber = paymentForm.cardNumber.replace(/\s/g, '');
      const newPaymentMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: paymentForm.type,
        last4: cardNumber.slice(-4),
        brand: getCardBrand(cardNumber),
        expiryMonth: paymentForm.expiryMonth,
        expiryYear: paymentForm.expiryYear,
        isDefault: user.paymentMethods.length === 0
      };

      const updatedPaymentMethods = [...user.paymentMethods, newPaymentMethod];
      updateUser({ paymentMethods: updatedPaymentMethods });

      setIsAddingPayment(false);
      setPaymentForm({
        type: 'Credit Card',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        name: ''
      });
      setErrors({});
    } catch (error) {
      setErrors({ general: 'Failed to add payment method. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePaymentMethod = async (paymentId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedPaymentMethods = user.paymentMethods.filter(pm => pm.id !== paymentId);
      
      // If we deleted the default payment method, make the first remaining payment method default
      if (updatedPaymentMethods.length > 0) {
        const deletedPayment = user.paymentMethods.find(pm => pm.id === paymentId);
        if (deletedPayment?.isDefault) {
          updatedPaymentMethods[0].isDefault = true;
        }
      }

      updateUser({ paymentMethods: updatedPaymentMethods });
    } catch (error) {
      console.error('Failed to delete payment method');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefaultPayment = async (paymentId: string) => {
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedPaymentMethods = user.paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === paymentId
      }));

      updateUser({ paymentMethods: updatedPaymentMethods });
    } catch (error) {
      console.error('Failed to set default payment method');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Payment & Billing</h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'invoices'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Invoices & Receipts
          </button>
          <button
            onClick={() => setActiveTab('payment-methods')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payment-methods'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payment Methods
          </button>
        </nav>
      </div>

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {user.invoices.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
              <p className="text-gray-500">You don't have any invoices yet.</p>
            </div>
          ) : (
            user.invoices.map((invoice) => (
              <div key={invoice.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Invoice #{invoice.id}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Service:</span>
                        <p className="text-gray-900">{invoice.service}</p>
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>
                        <p className="text-gray-900">{formatDate(invoice.date)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span>
                        <p className="text-gray-900 font-semibold">{formatPrice(invoice.amount)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      View Details
                    </button>
                    <button className="px-4 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === 'payment-methods' && (
        <div>
          {/* Add Payment Method Button */}
          {!isAddingPayment && (
            <div className="mb-6">
              <button
                onClick={() => setIsAddingPayment(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Payment Method</span>
              </button>
            </div>
          )}

          {/* Add Payment Form */}
          {isAddingPayment && (
            <div className="mb-8 bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Payment Method</h3>
                <button
                  onClick={() => setIsAddingPayment(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors.general}</p>
                </div>
              )}

              <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={paymentForm.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                    }`}
                    placeholder="Enter cardholder name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentForm.cardNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.cardNumber ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                    }`}
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Month
                    </label>
                    <select
                      name="expiryMonth"
                      value={paymentForm.expiryMonth}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.expiry ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                      }`}
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                          {(i + 1).toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <select
                      name="expiryYear"
                      value={paymentForm.expiryYear}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.expiry ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                      }`}
                    >
                      <option value="">YYYY</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentForm.cvv}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.cvv ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                      }`}
                      placeholder="123"
                    />
                  </div>
                </div>

                {(errors.expiry || errors.cvv) && (
                  <div className="text-red-500 text-sm">
                    {errors.expiry && <p>{errors.expiry}</p>}
                    {errors.cvv && <p>{errors.cvv}</p>}
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                      isLoading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </>
                    ) : (
                      'Add Payment Method'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setIsAddingPayment(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Payment Methods List */}
          <div className="space-y-4">
            {user.paymentMethods.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
                <p className="text-gray-500 mb-4">Add a payment method to make payments easier.</p>
                <button
                  onClick={() => setIsAddingPayment(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Payment Method
                </button>
              </div>
            ) : (
              user.paymentMethods.map((paymentMethod) => (
                <div
                  key={paymentMethod.id}
                  className={`p-6 border rounded-lg transition-all ${
                    paymentMethod.isDefault ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white border border-gray-200 rounded-lg">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {paymentMethod.brand} •••• {paymentMethod.last4}
                          </h3>
                          {paymentMethod.isDefault && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">
                          Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!paymentMethod.isDefault && (
                        <button
                          onClick={() => handleSetDefaultPayment(paymentMethod.id)}
                          disabled={isLoading}
                          className="px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                        >
                          Set Default
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeletePaymentMethod(paymentMethod.id)}
                        disabled={isLoading || paymentMethod.isDefault}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={paymentMethod.isDefault ? "Cannot delete default payment method" : "Delete payment method"}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Invoice Details</h3>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">Invoice #{selectedInvoice.id}</h4>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedInvoice.status)}`}>
                      {selectedInvoice.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Order ID: {selectedInvoice.orderId}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="text-gray-900 font-medium">{selectedInvoice.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-900">{formatDate(selectedInvoice.date)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-4">
                    <span className="text-gray-900">Total Amount:</span>
                    <span className="text-gray-900">{formatPrice(selectedInvoice.amount)}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentBilling;
