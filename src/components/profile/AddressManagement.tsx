'use client';

import React, { useState } from 'react';
import { useAuth, Address } from '../../contexts/AuthContext';

const AddressManagement = () => {
  const { user, updateUser, addAddress } = useAuth();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  if (!user) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for zipCode to only allow numeric input
    if (name === 'zipCode') {
      // Remove any non-numeric characters
      const numericValue = value.replace(/[^0-9]/g, '');
      // Limit to 6 digits
      const limitedValue = numericValue.slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: limitedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.type.trim()) {
      newErrors.type = 'Address type is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{6}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'ZIP code must be exactly 6 numeric digits only';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      type: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    });
    setErrors({});
    setIsAddingAddress(false);
    setEditingAddress(null);
    setShowAddModal(false);
  };

  const handleAdd = () => {
    setIsAddingAddress(true);
    setEditingAddress(null);
    setShowAddModal(true);
    setFormData({
      type: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    });
    setErrors({});
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsAddingAddress(false);
    setShowAddModal(true);
    setFormData({
      type: address.type,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (editingAddress) {
        // Update existing address - use updateUser for editing
        const updatedAddresses = user.addresses.map(addr => 
          addr.id === editingAddress.id 
            ? { ...addr, ...formData }
            : addr
        );
        updateUser({ addresses: updatedAddresses });
      } else {
        // Add new address - use addAddress function from AuthContext
        const addressData = {
          ...formData,
          isDefault: user.addresses.length === 0 // First address is default
        };
        await addAddress(addressData);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving address:', error);
      setErrors({ general: error instanceof Error ? error.message : 'Failed to save address. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
      
      // If we deleted the default address, make the first remaining address default
      if (updatedAddresses.length > 0) {
        const deletedAddress = user.addresses.find(addr => addr.id === addressId);
        if (deletedAddress?.isDefault) {
          updatedAddresses[0].isDefault = true;
        }
      }

      updateUser({ addresses: updatedAddresses });
    } catch (error) {
      console.error('Failed to delete address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedAddresses = user.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));

      updateUser({ addresses: updatedAddresses });
    } catch (error) {
      console.error('Failed to set default address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Address Management</h2>
        {!isAddingAddress && !editingAddress && (
          <button
            onClick={handleAdd}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Address</span>
          </button>
        )}
      </div>


      {/* Addresses List */}
      <div className={`space-y-4 ${
        user.addresses.length > 3 
          ? 'max-h-96 overflow-y-auto pr-2 custom-scrollbar'
          : ''
      }`}>
        {user.addresses.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
            <p className="text-gray-500 mb-4">Add your first address to get started with our services.</p>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Address
            </button>
          </div>
        ) : (
          user.addresses.map((address) => (
            <div
              key={address.id}
              className={`p-6 border rounded-lg transition-all ${
                address.isDefault
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 bg-white hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{address.type}</h3>
                    {address.isDefault && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Default
                      </span>
                    )}
                  </div>
                  
                  <div className="text-gray-600">
                    <p>{address.address}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      disabled={isLoading}
                      className="px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                    >
                      Set Default
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={isLoading || address.isDefault}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={address.isDefault ? "Cannot delete default address" : "Delete address"}
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
      
      {/* Add/Edit Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-gray-900/50 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95 max-h-[90vh] overflow-hidden">
            {/* Header with gradient background */}
            <div className="relative bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-2xl px-6 py-4 text-white overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 bg-white/10">
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-2 right-4 w-16 h-16 bg-white/5 rounded-full"></div>
                  <div className="absolute bottom-2 left-4 w-12 h-12 bg-white/5 rounded-full"></div>
                  <div className="absolute top-4 left-1/2 w-8 h-8 bg-white/5 rounded-full"></div>
                </div>
              </div>
              
              {/* Icon and Title */}
              <div className="relative flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white drop-shadow-sm">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <p className="text-white/80 text-sm mt-0.5">
                      {editingAddress ? 'Update your address details' : 'Add a new address to your account'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={resetForm}
                  className="relative z-10 group bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 rounded-xl p-3 transition-all duration-300 transform hover:scale-110"
                >
                  <svg className="w-6 h-6 text-white group-hover:text-yellow-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Body */}
            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
              {errors.general && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-red-600 text-sm font-medium">{errors.general}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Address Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.type
                        ? 'border-red-300 focus:ring-red-200 bg-red-50'
                        : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400 hover:border-gray-300'
                    }`}
                  >
                    <option value="">Select address type</option>
                    <option value="Home">🏠 Home</option>
                    <option value="Work">🏢 Work</option>
                    <option value="Other">📍 Other</option>
                  </select>
                  {errors.type && (
                    <div className="flex items-center mt-2">
                      <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-red-500 text-sm font-medium">{errors.type}</p>
                    </div>
                  )}
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.address
                        ? 'border-red-300 focus:ring-red-200 bg-red-50'
                        : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400 hover:border-gray-300'
                    }`}
                    placeholder="123 Main Street, Apt 4B"
                  />
                  {errors.address && (
                    <div className="flex items-center mt-2">
                      <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-red-500 text-sm font-medium">{errors.address}</p>
                    </div>
                  )}
                </div>

                {/* City, State, ZIP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.city
                          ? 'border-red-300 focus:ring-red-200 bg-red-50'
                          : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400 hover:border-gray-300'
                      }`}
                      placeholder="New York"
                    />
                    {errors.city && (
                      <div className="flex items-center mt-2">
                        <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-red-500 text-sm font-medium">{errors.city}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.state
                          ? 'border-red-300 focus:ring-red-200 bg-red-50'
                          : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400 hover:border-gray-300'
                      }`}
                      placeholder="NY"
                    />
                    {errors.state && (
                      <div className="flex items-center mt-2">
                        <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-red-500 text-sm font-medium">{errors.state}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.zipCode
                          ? 'border-red-300 focus:ring-red-200 bg-red-50'
                          : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400 hover:border-gray-300'
                      }`}
                      placeholder="123456"
                      maxLength={6}
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                    />
                    {errors.zipCode && (
                      <div className="flex items-center mt-2">
                        <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-red-500 text-sm font-medium">{errors.zipCode}</p>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
            
            {/* Footer with action buttons */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-100">
              <div className="flex gap-3">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </span>
                </button>
                
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 border-2 border-transparent rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading}
                >
                  <span className="flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-4 h-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editingAddress ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {editingAddress ? 'Update Address' : 'Add Address'}
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

export default AddressManagement;
