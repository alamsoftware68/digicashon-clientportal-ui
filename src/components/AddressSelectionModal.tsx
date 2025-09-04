'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, Address } from '../contexts/AuthContext';

interface AddressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: Address) => void;
}

const AddressSelectionModal: React.FC<AddressSelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectAddress 
}) => {
  const { user, addAddress } = useAuth();
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });

  // Set default address as selected when modal opens
  useEffect(() => {
    if (isOpen && user && user.addresses.length > 0) {
      const defaultAddress = user.addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else {
        setSelectedAddressId(user.addresses[0].id);
      }
    }
  }, [user, isOpen]);

  // Early return after all hooks are called
  if (!isOpen || !user) return null;

  const handleConfirmSelection = () => {
    const selectedAddress = user.addresses.find(addr => addr.id === selectedAddressId);
    if (selectedAddress) {
      onSelectAddress(selectedAddress);
      onClose();
    }
  };

  const handleAddAddress = async () => {
    // Validate form
    if (!newAddress.address || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      alert('Please fill in all address fields');
      return;
    }
    
    // Validate ZIP code format (6 numeric digits only)
    if (!/^\d{6}$/.test(newAddress.zipCode)) {
      alert('ZIP code must be exactly 6 numeric digits only');
      return;
    }

    try {
      setIsAddingAddress(true);
      await addAddress(newAddress);
      
      // Reset form and hide it
      setNewAddress({
        type: 'Home',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: false
      });
      setShowAddForm(false);
      
      // Select the newly added address (it will be the last one)
      const newId = (user.addresses.length + 1).toString();
      setSelectedAddressId(newId);
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Failed to add address. Please try again.');
    } finally {
      setIsAddingAddress(false);
    }
  };

  const resetAndClose = () => {
    setShowAddForm(false);
    setNewAddress({
      type: 'Home',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Select Delivery Address</h2>
              <p className="text-blue-100 text-sm">Choose where you want the service to be delivered</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {user.addresses.length === 0 && !showAddForm ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
              <p className="text-gray-500 mb-4">You need to add an address before placing an order.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Address
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {!showAddForm ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Choose an address:</h3>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                    >
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New Address
                    </button>
                  </div>
                  
                  {user.addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        selectedAddressId === address.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            <input
                              type="radio"
                              name="selectedAddress"
                              value={address.id}
                              checked={selectedAddressId === address.id}
                              onChange={() => setSelectedAddressId(address.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{address.type}</h4>
                              {address.isDefault && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-gray-600 text-sm">
                              <p>{address.address}</p>
                              <p>{address.city}, {address.state} {address.zipCode}</p>
                            </div>
                          </div>
                        </div>
                        
                        {selectedAddressId === address.id && (
                          <div className="text-blue-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Add New Address</h3>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Address Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                      <select
                        value={newAddress.type}
                        onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    {/* Street Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="123 Main Street, Apt 4B"
                      />
                    </div>
                    
                    {/* City, State, Zip */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="NY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                        <input
                          type="text"
                          value={newAddress.zipCode}
                          onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="123456"
                          maxLength={6}
                          inputMode="numeric"
                          pattern="[0-9]{6}"
                        />
                      </div>
                    </div>
                    
                    {/* Make Default */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                        Make this my default address
                      </label>
                    </div>
                    
                    {/* Form Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={() => setShowAddForm(false)}
                        disabled={isAddingAddress}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddAddress}
                        disabled={isAddingAddress}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAddingAddress ? (
                          <>
                            <svg className="animate-spin w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Adding...
                          </>
                        ) : (
                          'Add Address'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {user.addresses.length > 0 && !showAddForm && (
          <div className="bg-gray-50 p-6 border-t">
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSelection}
                disabled={!selectedAddressId}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Address
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressSelectionModal;
