'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import AddressSelectionModal from '@/components/AddressSelectionModal';
import OrderConfirmationModal from '@/components/OrderConfirmationModal';
import { useAuth, Address } from '@/contexts/AuthContext';

export default function PriceSummaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, user } = useAuth();
  
  const [basePrice] = useState(200);
  const [pickupCharges] = useState(100);
  const [processingFee] = useState(49);
  const [discount] = useState(100);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  
  // Calculate total
  const totalAmount = basePrice - processingFee;
  
  // Generate next 7 days for pickup slots
  const generateNext7Days = () => {
    const days = [];
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.getDate(),
        dayName: dayNames[date.getDay()],
        monthYear: `${monthNames[date.getMonth()]}`,
        fullDate: date.toISOString().split('T')[0]
      });
    }
    return days;
  };
  
  const pickupDays = generateNext7Days();
  const timeSlots = [
    { id: '10-2', label: '10:00 AM - 02:00 PM' },
    { id: '3-8', label: '03:00 PM - 08:00 PM' }
  ];
  
  // Get all device details from URL params
  const processor = searchParams.get('processor');
  const ram = searchParams.get('ram');
  const storage = searchParams.get('storage');
  const screenSize = searchParams.get('screenSize');
  const graphics = searchParams.get('graphics');

  // No redirect needed - allow viewing price summary without login
  // User will be prompted to login when trying to schedule pickup
  
  // Set default address and first date/time slot when component loads
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0 && !selectedAddress) {
      const defaultAddr = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
      setSelectedAddress(defaultAddr);
    }
    if (pickupDays.length > 0 && !selectedDate) {
      setSelectedDate(pickupDays[0].fullDate);
    }
    if (timeSlots.length > 0 && !selectedTimeSlot) {
      setSelectedTimeSlot(timeSlots[0].id);
    }
  }, [user, selectedAddress, selectedDate, selectedTimeSlot, pickupDays, timeSlots]);

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
  };
  
  const handleContinue = () => {
    if (!selectedAddress) {
      alert('Please select a pickup address');
      return;
    }
    if (!selectedDate) {
      alert('Please select a pickup date');
      return;
    }
    if (!selectedTimeSlot) {
      alert('Please select a time slot');
      return;
    }
    
    // Create the order object
    const selectedTimeSlotLabel = timeSlots.find(t => t.id === selectedTimeSlot)?.label || '';
    const orderDate = new Date();
    const scheduleDate = new Date(selectedDate);
    
    const newOrder = {
      id: Date.now(),
      orderNumber: `SL-${Date.now().toString().slice(-8)}`,
      type: 'LAPTOP_SELL',
      deviceName: 'Galaxy Book Go Series',
      deviceType: 'LAPTOP',
      brand: 'Samsung',
      processor: processor || 'Not specified',
      ram: ram || 'Not specified',
      storage: storage || 'Not specified',
      screenSize: screenSize || 'Not specified',
      graphics: graphics || 'Not specified',
      orderDate: orderDate.toISOString(),
      pickupDate: selectedDate,
      pickupTimeSlot: selectedTimeSlotLabel,
      address: `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.zipCode}`,
      totalAmount: totalAmount,
      status: 'PICKUP_REQUESTED',
      paymentStatus: 'PENDING',
      createdAt: orderDate.toISOString()
    };
    
    // Save to localStorage
    try {
      const existingOrders = JSON.parse(localStorage.getItem('laptop_sell_orders') || '[]');
      existingOrders.unshift(newOrder); // Add to beginning of array
      localStorage.setItem('laptop_sell_orders', JSON.stringify(existingOrders));
      console.log('Order saved successfully:', newOrder);
    } catch (error) {
      console.error('Error saving order:', error);
    }
    
    // Show confirmation modal
    setShowOrderConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Estimated Selling Price</h1>
          
          {/* Main Layout - 2 Column: LEFT=Device & Price, RIGHT=Address & Pickup */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
            
            {/* LEFT COLUMN - Device Details & Pricing */}
            <div className="space-y-6">
              {/* Device Card */}
              <div className="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-[0_18px_60px_rgba(15,23,42,0.9)] p-6 relative overflow-hidden">
                <div className="absolute inset-y-0 -right-40 w-80 bg-gradient-to-bl from-emerald-500/10 via-sky-500/0 to-transparent blur-3xl pointer-events-none" />
                
                <div className="relative flex items-center gap-4 mb-6">
                  <div className="relative h-20 w-28 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/images/Samsung.png"
                      alt="Galaxy Book Go Series"
                      width={96}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Galaxy Book Go Series</h2>
                    <p className="text-slate-400 text-sm">Windows • Samsung Laptop</p>
                  </div>
                </div>
                
                {/* Device Specifications */}
                <div className="relative space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">System Configuration</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/40 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Processor</p>
                        <p className="text-sm font-semibold text-white">{processor || 'Not specified'}</p>
                      </div>
                      <div className="bg-slate-800/40 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">RAM</p>
                        <p className="text-sm font-semibold text-white">{ram || 'Not specified'}</p>
                      </div>
                      <div className="bg-slate-800/40 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Storage</p>
                        <p className="text-sm font-semibold text-white">{storage || 'Not specified'}</p>
                      </div>
                      <div className="bg-slate-800/40 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Screen Size</p>
                        <p className="text-sm font-semibold text-white">{screenSize || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/40 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Graphics</p>
                    <p className="text-sm font-semibold text-white">{graphics || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              
              {/* Price Summary Card */}
              <div className="bg-gradient-to-br from-emerald-900/40 via-slate-900/60 to-slate-900/40 rounded-3xl border border-emerald-700/30 shadow-[0_18px_60px_rgba(15,23,42,0.9)] p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl" />
                
                <div className="relative">
                  <h3 className="text-lg font-semibold mb-4">Price Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Base Price</span>
                      <span className="font-medium text-white">₹{basePrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Pickup Charges</span>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 text-xs font-semibold">FREE</span>
                        <span className="line-through text-slate-600 text-xs">₹{pickupCharges}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Processing Fee</span>
                      <span className="text-red-400 font-medium">-₹{processingFee}</span>
                    </div>
                    
                    <div className="border-t border-slate-700/50 pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-white">Total Amount</span>
                        <span className="text-3xl font-bold text-emerald-400">₹{totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* RIGHT COLUMN - Address & Pickup Slot */}
            <div className="space-y-6">
              {/* Address Section */}
              <div className="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-[0_18px_60px_rgba(15,23,42,0.9)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
                      <svg className="h-5 w-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243 a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Address</h3>
                  </div>
                  <span className="flex items-center gap-1 px-2 py-1 bg-cyan-500/10 rounded-full text-cyan-300 text-xs font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    Step 1
                  </span>
                </div>
                
                {selectedAddress ? (
                  <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-4 mb-3">
                    <div className="flex items-start justify-between mb-2">
                      <span className="inline-block px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-300 text-xs font-medium">
                        {selectedAddress.type}
                      </span>
                    </div>
                    <p className="text-sm text-white font-medium mb-1">{selectedAddress.address}</p>
                    <p className="text-xs text-slate-400">{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zipCode}</p>
                  </div>
                ) : (
                  <div className="bg-slate-800/40 rounded-xl border border-dashed border-slate-700/50 p-6 text-center mb-3">
                    <svg className="h-12 w-12 text-slate-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9 a1.998 1.998 0 01-2.827 0l-4.244-4.243 a8 8 0 1111.314 0z" />
                    </svg>
                    <p className="text-sm text-slate-400">No address selected</p>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => setShowAddressModal(true)}
                  className="w-full py-2.5 px-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium hover:bg-cyan-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {selectedAddress ? 'Change Address' : 'Add Address'}
                </button>
              </div>
              
              {/* Pickup Slot Section */}
              <div className="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-[0_18px_60px_rgba(15,23,42,0.9)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                      <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8 h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12 a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Pickup Slot</h3>
                  </div>
                  <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/10 rounded-full text-purple-300 text-xs font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    Step 2
                  </span>
                </div>
                
                <p className="text-sm text-slate-400 mb-4">Please select your preferable pickup date</p>
                
                {/* Date Selection */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {pickupDays.slice(0, 4).map((day) => (
                    <button
                      key={day.fullDate}
                      type="button"
                      onClick={() => setSelectedDate(day.fullDate)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        selectedDate === day.fullDate
                          ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300'
                          : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-2xl font-bold mb-0.5">{day.date}</span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400">{day.dayName}</span>
                    </button>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {pickupDays.slice(4, 7).map((day) => (
                    <button
                      key={day.fullDate}
                      type="button"
                      onClick={() => setSelectedDate(day.fullDate)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        selectedDate === day.fullDate
                          ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300'
                          : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-2xl font-bold mb-0.5">{day.date}</span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400">{day.dayName}</span>
                    </button>
                  ))}
                </div>
                
                <p className="text-sm text-slate-400 mb-3 mt-6">Your availability on that day</p>
                
                {/* Time Slot Selection */}
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot.id)}
                      className={`w-full p-3 rounded-xl border text-sm font-medium transition-all ${
                        selectedTimeSlot === slot.id
                          ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300'
                          : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Continue Button */}
              <button
                type="button"
                onClick={handleContinue}
                disabled={!selectedAddress || !selectedDate || !selectedTimeSlot}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 text-white text-base font-semibold shadow-lg shadow-emerald-500/40 hover:shadow-emerald-400/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-emerald-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
      
      {/* Address Selection Modal */}
      {showAddressModal && (
        <AddressSelectionModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          onSelectAddress={handleAddressSelect}
        />
      )}
      
      {/* Order Confirmation Modal */}
      {showOrderConfirmation && selectedAddress && (
        <OrderConfirmationModal
          isOpen={showOrderConfirmation}
          onClose={() => setShowOrderConfirmation(false)}
          orderDetails={{
            deviceName: 'Galaxy Book Go Series',
            orderDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            address: `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.zipCode}`,
            scheduleDateTime: `${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} (${timeSlots.find(t => t.id === selectedTimeSlot)?.label})`,
            totalAmount: totalAmount,
            processor: processor || undefined,
            ram: ram || undefined,
            storage: storage || undefined
          }}
        />
      )}
    </div>
  );
}
