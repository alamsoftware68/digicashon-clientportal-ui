'use client';

import React from 'react';

const WhyChooseUs = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us?
          </h2>
          <div className="w-20 h-1 bg-blue-900 mx-auto rounded mb-6"></div>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-600 leading-relaxed">
              Looking to sell your old devices? Choose DigiCashOn for a seamless experience. We buy all kinds of gadgets, from phones to laptops, and offer doorstep pickup for added 
              convenience. With instant payment upon receiving your device and the assurance of the best market price, selling has never been easier. What sets us apart? Our user-friendly 
              website lets you evaluate your device&apos;s value and select a pickup time slot that fits your schedule. Experience the ease and reliability of DigiCashOn today.
            </p>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Comprehensive Device Buying */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 4h10v14H7V4z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Comprehensive Device Buying</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Sell your old phones, tablets, laptops, and smartwatches hassle-free with us! We accept all types of devices for your convenience.
            </p>
          </div>

          {/* Convenient Doorstep Pickup */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Convenient Doorstep Pickup</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Save time with our convenient doorstep pickup service. We offer doorstep pickup services, ensuring a seamless and convenient selling experience for our customers.
            </p>
          </div>

          {/* Instant Payment */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Instant Payment</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              No more waiting for your money! With us, you&apos;ll receive instant payment as soon as we receive and verify your device.
            </p>
          </div>

          {/* Best Market Price Guarantee */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Best Market Price Guarantee</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Trust us to offer you the best price for your device compared to the market. Sell with confidence and get the value you deserve.
            </p>
          </div>

          {/* Self-Evaluation */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Self-Evaluation</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Evaluate your device&apos;s price at your own convenience using our user-friendly website. Know exactly what your device is worth before we pickup.
            </p>
          </div>

          {/* Flexible Pickup Scheduling */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 bg-teal-500 rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  <path d="m12.5 7-1 1v4.25l2.5 1.5.75-1.23-1.75-1.02z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Flexible Pickup Scheduling</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Choose a pickup time slot that suits your schedule. We offer flexibility to ensure a smooth and convenient pickup process for our customers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
