'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LaptopBrandSelection = () => {
  const router = useRouter();

  const brands = [
    { name: 'DELL', logo: '🖥️', color: 'from-blue-500 to-blue-600' },
    { name: 'SAMSUNG', logo: '💻', color: 'from-blue-600 to-indigo-600' },
    { name: 'SONY', logo: '🎮', color: 'from-gray-700 to-gray-900' },
    { name: 'HP', logo: '🔵', color: 'from-cyan-500 to-blue-600' },
    { name: 'TOSHIBA', logo: '🔴', color: 'from-red-500 to-red-600' },
    { name: 'ACER', logo: '🟢', color: 'from-green-600 to-teal-600' },
    { name: 'ASUS', logo: '⚡', color: 'from-blue-600 to-indigo-700' },
    { name: 'LENOVO', logo: '🔷', color: 'from-blue-700 to-indigo-800' },
    { name: 'MICROSOFT', logo: '🪟', color: 'from-blue-500 to-cyan-500' },
    { name: 'APPLE', logo: '🍎', color: 'from-gray-800 to-black' },
    { name: 'HCL', logo: '💼', color: 'from-blue-600 to-blue-700' },
    { name: 'MI', logo: '📱', color: 'from-orange-500 to-orange-600' },
    { name: 'HONOR', logo: '✨', color: 'from-purple-500 to-pink-500' },
    { name: 'MICROMAX', logo: '📲', color: 'from-orange-600 to-red-600' },
    { name: 'LAVA', logo: '🌋', color: 'from-pink-500 to-red-500' },
    { name: 'IBALL', logo: '🔴', color: 'from-red-600 to-red-700' },
    { name: 'NOKIA', logo: '📞', color: 'from-blue-700 to-blue-800' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="group flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-indigo-500 transition-all duration-200">
              <svg 
                className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="font-semibold text-sm group-hover:translate-x-1 transition-transform duration-200">Back</span>
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
              To sell your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                LAPTOP/MACBOOK
              </span>
            </h1>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full blur-sm"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the brand
          </p>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
          {brands.map((brand, index) => (
            <Link
              key={brand.name}
              href={`/sell/laptop/${brand.name.toLowerCase()}`}
              className="group"
            >
              <div className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 hover:-translate-y-2 cursor-pointer">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative p-6 flex flex-col items-center justify-center min-h-[160px]">
                  {/* Logo/Icon */}
                  <div className="mb-4 text-5xl transform group-hover:scale-110 transition-transform duration-300">
                    {brand.logo}
                  </div>
                  
                  {/* Brand Name */}
                  <h3 className="text-base lg:text-lg font-bold text-gray-800 group-hover:text-white transition-colors duration-300 text-center uppercase tracking-wide">
                    {brand.name}
                  </h3>
                </div>

                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Bottom highlight */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${brand.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-3xl shadow-lg p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Can't find your brand?</h3>
            <p className="text-gray-600 mb-4">
              Don't worry! Contact our support team, and we'll help you get the best price for your laptop.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaptopBrandSelection;
