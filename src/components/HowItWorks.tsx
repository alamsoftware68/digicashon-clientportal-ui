'use client';

import React from 'react';

const HowItWorks = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How it Works
          </h2>
          <div className="w-20 h-1 bg-blue-900 mx-auto rounded"></div>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="text-center">
            <div className="relative mb-6">
              {/* Step Number */}
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-blue-600">1</span>
              </div>
              
              {/* Icon */}
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto relative">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                {/* Character illustration */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-400 rounded-full"></div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Evaluate Price</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Choose your device and tell us about its present condition and our advanced AI technology will find the correct price for you.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="relative mb-6">
              {/* Step Number */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-600">2</span>
              </div>
              
              {/* Icon */}
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto relative">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                {/* Character illustration */}
                <div className="absolute -bottom-2 -left-2 w-6 h-8 bg-orange-400 rounded-t-full"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Schedule Pickup</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Book free pickup on a slot that matches convenience at home or work place.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="relative mb-6">
              {/* Step Number */}
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-purple-600">3</span>
              </div>
              
              {/* Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto relative">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                  </svg>
                </div>
                {/* Character illustration */}
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-400 rounded-full"></div>
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Payment</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              There we stored that once our executive picks up your device you will get instant payment is transferred all the way!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
