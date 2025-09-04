'use client';

import React, { useState } from 'react';

interface DigiCashOnPromiseProps {
  className?: string;
}

const DigiCashOnPromise: React.FC<DigiCashOnPromiseProps> = ({ className = '' }) => {
  const [isWarrantyModalOpen, setIsWarrantyModalOpen] = useState(false);
  const [isRateCardModalOpen, setIsRateCardModalOpen] = useState(false);

  const openWarrantyModal = () => setIsWarrantyModalOpen(true);
  const closeWarrantyModal = () => setIsWarrantyModalOpen(false);
  const openRateCardModal = () => setIsRateCardModalOpen(true);
  const closeRateCardModal = () => setIsRateCardModalOpen(false);

  return (
    <>
      {/* DigiCashOn Promise Card - Reduced Width */}
      <div className={`group bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 rounded-xl p-4 transition-all duration-300 hover:from-rose-100 hover:to-pink-100 hover:border-rose-200 hover:shadow-md ${className}`}>
        <div className="space-y-3">
          {/* Header Section */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors duration-300 shadow-sm">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-rose-700 transition-colors duration-300">
                DigiCashOn Promise
              </h3>
              <p className="text-gray-600 text-sm">
                Trust. Transparency. Protection.
              </p>
            </div>
          </div>
          
          {/* Warranty Info Bar - Full Width */}
          <div 
            onClick={openWarrantyModal}
            className="bg-gray-100 hover:bg-gray-150 rounded-lg p-3 cursor-pointer transition-colors duration-300 group/warranty"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium text-sm">
                  Up to 180 days warranty
                </span>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover/warranty:text-gray-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* DigiCashOn Cover Promise Modal */}
      {isWarrantyModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-md w-full mx-auto shadow-xl transform transition-all duration-300 scale-100 my-4 min-h-0">
            {/* Modal Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-xl relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-white/10 rounded-t-xl">
                <div className="absolute top-2 right-4 w-16 h-16 bg-white/5 rounded-full"></div>
                <div className="absolute bottom-2 left-4 w-12 h-12 bg-white/5 rounded-full"></div>
                <div className="absolute top-4 left-1/2 w-8 h-8 bg-white/5 rounded-full"></div>
              </div>
              
              {/* Header Content */}
              <div className="relative flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white drop-shadow-sm">
                      DigiCashOn Cover Promise
                    </h2>
                    <p className="text-white/90 text-sm mt-1">
                      Comprehensive Protection for Your Peace of Mind
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={closeWarrantyModal}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-90"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Warranty Coverage */}
              <div className="group bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Up to 180 days warranty</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Free repair if the issue arises again. We stand behind our work with comprehensive warranty coverage.
                    </p>
                  </div>
                </div>
              </div>

              {/* Damage Coverage */}
              <div className="group bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-5 border border-red-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.293 4.293a1 1 0 011.414 0L12 10.586l6.293-6.293a1 1 0 111.414 1.414L13.414 12l6.293 6.293a1 1 0 01-1.414 1.414L12 13.414l-6.293 6.293a1 1 0 01-1.414-1.414L10.586 12 4.293 5.707a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Up to ₹10,000 damage cover</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      If any damage happens during service, we provide comprehensive coverage up to ₹10,000.
                    </p>
                  </div>
                </div>
              </div>

              {/* Fixed Rate Card */}
              <div className="group bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-5 border border-yellow-100 hover:shadow-lg transition-all duration-300 max-w-sm">
                <div className="flex flex-col">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Fixed rate card</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        All prices are set basis market standard. No hidden charges or surprises.
                      </p>
                    </div>
                  </div>
                  {/* View Rate Card Button - Bottom Left */}
                  <div className="flex justify-start">
                    <button 
                      type="button"
                      onClick={(e) => {
                        console.log('Rate card button clicked!'); // Debug log
                        e.preventDefault();
                        e.stopPropagation();
                        openRateCardModal();
                      }}
                      className="relative z-10 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      View Rate Card →
                    </button>
                  </div>
                </div>
              </div>

              {/* Quote Verification */}
              <div className="group bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">On call quote verification</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      We verify all the quotes, but if you're unsure you can call our senior experts for confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Trusted by 50,000+ customers</span>
                </div>
                <button
                  onClick={closeWarrantyModal}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-xl font-semibold text-sm hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Rate Card Modal */}
      {isRateCardModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] mx-4 shadow-2xl transform transition-all duration-300 scale-100 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Fixed Rate Card
                    </h2>
                    <p className="text-white/80 text-sm">
                      Transparent pricing with no hidden charges
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeRateCardModal}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(90vh-160px)] p-6">
              <RateCardAccordion />
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>All prices include labour charges</span>
                </div>
                <button
                  onClick={closeRateCardModal}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold text-sm hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Rate Card Accordion Component
const RateCardAccordion: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const rateCardData = {
    adaptor: {
      title: "Apple Adaptor",
      icon: "⚡",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      items: [
        { name: "Adaptor - safe 1", price: "₹3800", labour: "₹349" },
        { name: "Adaptor - safe 2", price: "₹5500", labour: "₹349" },
        { name: "Adaptor - Type C", price: "₹6200", labour: "₹349" }
      ]
    },
    battery: {
      title: "Apple Battery", 
      icon: "🔋",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      items: [
        { name: "MacBook Pro 13 inch (without retina) Battery", price: "₹9800", labour: "₹349" },
        { name: "Mac Air retina 13 inch - battery", price: "₹8500", labour: "₹349" },
        { name: "Macbook Pro retina 15.6 inch (without retina)Battery", price: "₹9800", labour: "₹349" },
        { name: "Mac pro 13 inch retina - Battery", price: "₹9500", labour: "₹349" },
        { name: "MacBook 13 Inch(without retina) Battery", price: "₹9500", labour: "₹349" },
        { name: "Mac pro retina 15.6 Battery", price: "₹9900", labour: "₹349" },
        { name: "Macbook Air 13 inch (non retina) Battery_2", price: "₹8800", labour: "₹349" },
        { name: "Macbook Pro 13 inch (non retina) Battery_2", price: "₹6200", labour: "₹349" },
        { name: "Macbook Pro retina 15.6 inch (non retina) Battery_2", price: "₹9200", labour: "₹349" },
        { name: "Mac pro 13 inch retina Battery_2", price: "₹9200", labour: "₹349" },
        { name: "Mac Air retina 13 inch Battery 2", price: "₹11000", labour: "₹349" }
      ]
    },
    display: {
      title: "Apple Display",
      icon: "🖥️",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      items: [
        { name: "MacBook 13inch(without retina) screen", price: "₹12500", labour: "₹349" },
        { name: "MacBook Pro 13 Inch (without retina) Screen", price: "₹8800", labour: "₹349" },
        { name: "MacBook Pro retina 15.6 inch (without retina) Screen", price: "₹14000", labour: "₹349" },
        { name: "MacBook Pro 13 Inch (without retina) Panel", price: "₹12000", labour: "₹349" },
        { name: "MacBook Pro retina 15.6 inch (without retina) Panel", price: "₹16000", labour: "₹349" },
        { name: "MacBook 13 Inch (without retina) Panel", price: "₹18500", labour: "₹349" },
        { name: "Mac Air retina 13 inch - Screen", price: "₹26000", labour: "₹349" },
        { name: "Mac Air retina 13 inch - Panel", price: "₹34000", labour: "₹349" },
        { name: "Mac pro 13 inch retina - Screen", price: "₹28000", labour: "₹349" },
        { name: "Mac Air retina 13 inch - Touch ID", price: "₹4500", labour: "₹349" },
        { name: "Mac pro 13 inch retina - Panel", price: "₹28000", labour: "₹349" }
      ]
    },
    harddisk: {
      title: "Apple Hard disk",
      icon: "💾",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      borderColor: "border-orange-200",
      items: [
        { name: "Apple SSD Card base (2012 to 2017) - 512 GB", price: "₹16500", labour: "₹349" },
        { name: "Apple SSD Card base (2012 to 2017) - 256 GB", price: "₹10500", labour: "₹349" },
        { name: "Apple SSD Card base (2012 to 2017) - 128 GB", price: "₹4500", labour: "₹349" }
      ]
    },
    keyboard: {
      title: "Apple Keyboard",
      icon: "⌨️",
      color: "from-gray-600 to-slate-600",
      bgColor: "from-gray-50 to-slate-50",
      borderColor: "border-gray-200",
      items: [
        { name: "MacBook13 Inch(without retina)Keyboard", price: "₹3200", labour: "₹349" },
        { name: "MacBookPro 13Inch(without retina)Keyboard", price: "₹3500", labour: "₹349" },
        { name: "Mac Air retina 13 inch - Keyboard", price: "₹6000", labour: "₹349" },
        { name: "MacBookPro retina15.6inch(without retina)Keyboard", price: "₹3500", labour: "₹349" },
        { name: "Mac pro 13 inch retina - Keyboard", price: "₹5800", labour: "₹349" },
        { name: "Mac pro retina 15.6 - Keyboard", price: "₹6000", labour: "₹349" },
        { name: "Macbook Pro retina 15.6 inch (non retina)Keyboard_2", price: "₹3500", labour: "₹349" },
        { name: "Macbook Air 13 inch (non retina) Keyboard_2", price: "₹3200", labour: "₹349" },
        { name: "Mac Air retina 13 inch Keyboard_2", price: "₹8000", labour: "₹349" },
        { name: "Macbook Pro 13 inch (non retina) Keyboard_2", price: "₹3500", labour: "₹349" },
        { name: "Mac pro 13 inch retina Keyboard_2", price: "₹5800", labour: "₹349" }
      ]
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(rateCardData).map(([key, section]) => {
        const isExpanded = expandedSections.has(key);
        
        return (
          <div key={key} className={`bg-gradient-to-r ${section.bgColor} rounded-xl border ${section.borderColor} overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md`}>
            {/* Section Header */}
            <button
              onClick={() => toggleSection(key)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
                  <p className="text-sm text-gray-600">{section.items.length} repair options available</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">
                  {isExpanded ? 'Collapse' : 'Expand'}
                </span>
                <svg 
                  className={`w-5 h-5 text-gray-600 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {/* Section Content */}
            <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
              <div className="px-6 pb-6">
                <div className="bg-white/70 rounded-lg p-4 backdrop-blur-sm">
                  <div className="grid gap-3">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 pb-2 border-b border-gray-200">
                      <div className="col-span-7">
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Description</span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide text-center">Service Charge</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide text-center">Labour</span>
                      </div>
                    </div>
                    
                    {/* Data Rows */}
                    {section.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 py-3 hover:bg-white/50 rounded-lg transition-colors duration-200">
                        <div className="col-span-7 flex items-center">
                          <span className="text-sm font-medium text-gray-800 leading-relaxed">{item.name}</span>
                        </div>
                        <div className="col-span-3 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">{item.price}</span>
                        </div>
                        <div className="col-span-2 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600 bg-blue-50 px-2 py-1 rounded-md">{item.labour}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DigiCashOnPromise;
