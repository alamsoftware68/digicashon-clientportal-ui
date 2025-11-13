'use client';

import React from 'react';
import Link from 'next/link';

const DeviceSellingSection = () => {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            We Made{' '}
            <span className="relative text-blue-900">
              Repairing
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400 rounded"></div>
            </span>{' '}
            <span className="text-blue-900">Simpler</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search Your Device for Repair.."
              className="w-full px-6 py-4 pr-16 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-900 text-white p-3 rounded-full hover:bg-blue-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          {/* Category Selection Text */}
          <div className="text-center mt-4">
            <span className="text-gray-500 text-sm">--- or choose a category ---</span>
          </div>
        </div>

        {/* Device Categories */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-lg mx-auto">
            {/* Repair Laptop */}
            <Link href="/repair/laptop" className="text-center group cursor-pointer">
              <div className="relative">
                {/* Main card container */}
                <div className="w-24 h-24 mx-auto mb-4 p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-100 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 group-hover:scale-110 overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 via-transparent to-purple-100/10 rounded-xl"></div>
                  
                  {/* Laptop SVG icon */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue-600 group-hover:text-blue-700 transition-all duration-300 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {/* Animated circuit pattern on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity duration-500">
                    <svg className="w-8 h-8 text-indigo-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l.01 6.5c0 .28.22.5.5.5s.5-.22.5-.5L13 2h-1zm0 13.5c0 .28.22.5.5.5s.5-.22.5-.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5zM8.5 8.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm7 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm-3.5 7c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Floating badge */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              
              {/* Text */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">Repair Laptop</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">Professional laptop repair services</p>
              </div>
            </Link>

            {/* Sell Product */}
            <Link href="/sell-product" className="text-center group cursor-pointer">
              <div className="relative">
                {/* Main card container */}
                <div className="w-24 h-24 mx-auto mb-4 p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-2 border-purple-100 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all duration-300 group-hover:scale-110 overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100/10 via-transparent to-pink-100/10 rounded-xl"></div>
                  
                  {/* Shopping Bag SVG icon */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-purple-600 group-hover:text-purple-700 transition-all duration-300 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  
                  {/* Dollar sign animation on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-70 transition-opacity duration-500">
                    <svg className="w-10 h-10 text-pink-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Floating badge */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              
              {/* Text */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">Sell Product</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">Turn your devices into cash</p>
              </div>
            </Link>
          </div>
        </div>

        {/* App Store Ratings */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* App Store */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.13997 6.91 8.85997 6.88C10.15 6.85 11.36 7.72 12.11 7.72C12.86 7.72 14.3 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                </svg>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">Download on the</div>
                <div className="text-sm font-semibold text-gray-900">App Store</div>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <span className="text-2xl font-bold text-gray-900 mr-1">4.7</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500">571 reviews</div>
            </div>
          </div>

          {/* Google Play */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">GET IT ON</div>
                <div className="text-sm font-semibold text-gray-900">Google Play</div>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <span className="text-2xl font-bold text-gray-900 mr-1">4.5</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500">5K+ reviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeviceSellingSection;
