'use client';

import React, { useState } from 'react';

interface ViewDetailsButtonProps {
  className?: string;
  position?: 'left' | 'center' | 'right';
}

const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = ({ 
  className = '',
  position = 'left'
}) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const openDetailsModal = () => setIsDetailsModalOpen(true);
  const closeDetailsModal = () => setIsDetailsModalOpen(false);

  const positionClasses = {
    left: 'justify-start',
    center: 'justify-center', 
    right: 'justify-end'
  };

  return (
    <>
      {/* View Details Button */}
      <div className={`flex ${positionClasses[position]} ${className}`}>
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openDetailsModal();
          }}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center"
        >
          View Details →
        </button>
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] mx-4 shadow-2xl transform transition-all duration-300 scale-100 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Why Choose DigiCashOn?
                    </h2>
                    <p className="text-white/80 text-sm">
                      Your trusted repair service partner
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-4 space-y-4">
              
              {/* Section 1: 100% Data Safety */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">100% data safety</h3>
                    <p className="text-sm text-gray-600">No data is accessed, copied, or shared at any step.</p>
                  </div>
                </div>
              </div>

              {/* Section 2: We service all brands */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <h3 className="font-bold text-gray-900 text-lg mb-3">We service all brands</h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                    <div className="text-sm font-bold text-blue-600">Microsoft</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                    <div className="text-sm font-bold text-orange-600">XIAOMI</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                    <div className="text-sm font-bold text-blue-700">DELL</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                    <div className="text-sm font-bold text-blue-800">SAMSUNG</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                    <div className="text-sm font-bold text-red-600">LG</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                    <div className="text-sm font-bold text-black">SONY</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                    <div className="text-sm font-bold text-blue-600">HP</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                    <div className="text-sm font-bold text-gray-800">ASUS</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                    <div className="text-sm font-bold text-green-600">acer</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Logos & trademarks are used for illustrative purposes.
                </p>
              </div>

              {/* Section 3: Our Process */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                <h3 className="font-bold text-gray-900 text-lg mb-3">Our process</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Internal cleaning</h4>
                      <p className="text-xs text-gray-600">We chemically clean the motherboard, processor & fans</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Cooling paste replacement</h4>
                      <p className="text-xs text-gray-600">We replace the cooling paste to reduce overheating</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Performance boost</h4>
                      <p className="text-xs text-gray-600">We clear cache, defragment, update drivers & run diagnostics</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">External cleaning</h4>
                      <p className="text-xs text-gray-600">We clean & polish external surfaces for a final touch</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">5</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Warranty activation</h4>
                      <p className="text-xs text-gray-600">Your appliance will automatically come under 180 days warranty</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Top Technicians */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-100">
                <h3 className="font-bold text-gray-900 text-lg mb-3">Top technicians</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-700 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-800">Background verified</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-700 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-800">Trained across all major brands</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-700 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-800">Certified under Skill India Programme</span>
                  </div>
                </div>
              </div>

              {/* Section 5: Customer Reviews */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-100">
                <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center">
                  <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  ★4.82 Customer Reviews
                </h3>
                <div className="text-sm text-gray-600 mb-3">11K reviews</div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs">★5</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">11K</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs">★4</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '15%'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">254</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs">★3</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '8%'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">121</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs">★2</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '5%'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">93</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs">★1</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '12%'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">246</span>
                  </div>
                </div>
              </div>

              {/* Section 6: Disclaimer */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Disclaimer
                </h3>
                <div className="text-xs text-gray-600 leading-relaxed">
                  <p className="mb-2">
                    DigiCashOn may run diagnostic checks on customers' devices to identify any faults or issues. We recommend that customers back up all important data, personal or sensitive information before submitting their device for repair/service.
                  </p>
                  <p className="mb-2">
                    DigiCashOn will not be responsible for any loss, corruption or damage of data, software, or removable media during the repair/servicing process. We also recommend removing sensitive data from the device before submitting it for added security.
                  </p>
                  <p>
                    Data loss may also occur due to unforeseen device issues which may not be under DigiCashOn's control. By proceeding, you acknowledge this risk.
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 px-8 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-lg text-gray-700">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-semibold">Trusted by 50,000+ customers across India</span>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
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

export default ViewDetailsButton;
