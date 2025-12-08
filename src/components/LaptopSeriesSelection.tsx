'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LaptopSeriesSelectionProps {
  brand: string;
  model: string;
}

const LaptopSeriesSelection: React.FC<LaptopSeriesSelectionProps> = ({ brand, model }) => {
  const router = useRouter();

  // Dell Inspiron series
  const dellInspironSeries = [
    { name: 'DELL INSPIRON 17 7000 SERIES', image: '💻', color: 'from-blue-600 to-indigo-600' },
    { name: 'DELL INSPIRON 17 5000 SERIES', image: '💻', color: 'from-blue-500 to-blue-600' },
    { name: 'DELL INSPIRON 15 7500 SERIES', image: '💻', color: 'from-gray-700 to-gray-800' },
    { name: 'DELL INSPIRON 15 7000 SERIES', image: '💻', color: 'from-red-500 to-pink-600' },
    { name: 'DELL INSPIRON 14 7000 SERIES', image: '💻', color: 'from-pink-500 to-rose-600' },
    { name: 'DELL INSPIRON 13 7000 SERIES', image: '💻', color: 'from-gray-400 to-gray-500' },
    { name: 'DELL INSPIRON 15 5500 SERIES', image: '💻', color: 'from-orange-600 to-red-600' },
    { name: 'DELL INSPIRON 14 5000 SERIES', image: '💻', color: 'from-blue-400 to-cyan-500' },
    { name: 'DELL INSPIRON 13 5000 SERIES', image: '💻', color: 'from-orange-500 to-amber-600' },
    { name: 'DELL INSPIRON 15 3000 SERIES', image: '💻', color: 'from-slate-600 to-gray-700' },
    { name: 'DELL INSPIRON 14 3000 SERIES', image: '💻', color: 'from-gray-600 to-slate-700' },
    { name: 'DELL INSPIRON 11 3000 SERIES', image: '💻', color: 'from-gray-700 to-slate-800' },
  ];

  // You can add other model series here in the future
  const getSeriesByModel = (brandName: string, modelName: string) => {
    const key = `${brandName.toLowerCase()}-${modelName.toLowerCase()}`;
    switch (key) {
      case 'dell-dell-inspiron':
        return dellInspironSeries;
      // Add other models here
      default:
        return [];
    }
  };

  const series = getSeriesByModel(brand, model);
  const modelNameDisplay = model.toUpperCase().replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 py-12 lg:py-16">
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
        <div className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Browse Laptop Model
          </h1>
          <p className="text-lg text-gray-600">
            Select your {modelNameDisplay} series
          </p>
        </div>

        {/* Series Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {series.map((item, index) => (
            <Link
              key={item.name}
              href={`/sell/laptop/${brand.toLowerCase()}/${model.toLowerCase()}/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group"
            >
              <div className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative p-6">
                  {/* Image Container */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-4 flex items-center justify-center min-h-[200px] group-hover:from-blue-50 group-hover:to-indigo-50 transition-all duration-300">
                    {/* Laptop SVG Icon */}
                    <svg 
                      className="w-32 h-32 text-gray-400 group-hover:text-blue-600 transition-all duration-300 transform group-hover:scale-110" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {/* Series Name */}
                  <h3 className="text-center text-xs lg:text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 uppercase tracking-wide leading-tight">
                    {item.name}
                  </h3>
                </div>

                {/* Bottom highlight bar */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                
                {/* Hover effect border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500 transition-colors duration-300"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-3xl mx-auto border border-gray-100">
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Can't find your series?</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Don't worry! Our support team is here to help you identify your laptop model and get you the best price.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact Support
                </span>
              </button>
              <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Live Chat
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaptopSeriesSelection;
