'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface LaptopModelSelectionProps {
  brand: string;
}

const LaptopModelSelection: React.FC<LaptopModelSelectionProps> = ({ brand }) => {
  const router = useRouter();

  // Dell laptop models
  const dellModels = [
    { name: 'DELL INSPIRON', image: '/images/laptop/dell/Dell_Inspirion_Series.png', color: 'from-blue-500 to-blue-600' },
    { name: 'DELL VOSTRO', image: '/images/laptop/dell/Dell_Vostro_Series.png', color: 'from-gray-600 to-gray-700' },
    { name: 'DELL STUDIO', image: '/images/laptop/dell/Dell_Other_Series.png', color: 'from-amber-600 to-orange-600' },
    { name: 'DELL LATITUDE', image: '/images/laptop/dell/Dell_Latitude_Series.png', color: 'from-slate-700 to-slate-800' },
    { name: 'DELL XPS', image: '/images/laptop/dell/Dell_XPS_Series.png', color: 'from-indigo-600 to-purple-600' },
    { name: 'DELL ALIENWARE', image: '/images/laptop/dell/Dell_AlienWare_Series.png', color: 'from-emerald-600 to-teal-700' },
    { name: 'DELL CHROMEBOOK', image: '/images/laptop/dell/Dell_Other_Series.png', color: 'from-cyan-600 to-blue-600' },
    { name: 'DELL G3 GAMING LAPTOP', image: '/images/laptop/dell/Dell_G_Series.png', color: 'from-blue-700 to-indigo-700' },
    { name: 'DELL G5 GAMING LAPTOP', image: '/images/laptop/dell/Dell_G_Series.png', color: 'from-blue-800 to-indigo-800' },
    { name: 'DELL G7 GAMING LAPTOP', image: '/images/laptop/dell/Dell_G_Series.png', color: 'from-blue-900 to-indigo-900' },
    { name: 'DELL PRECISION', image: '/images/laptop/dell/Dell_Precision_Series.png', color: 'from-gray-700 to-gray-800' },
  ];

  // You can add other brand models here in the future
  const getModelsByBrand = (brandName: string) => {
    switch (brandName.toLowerCase()) {
      case 'dell':
        return dellModels;
      // Add other brands here
      default:
        return [];
    }
  };

  const models = getModelsByBrand(brand);
  const brandNameUpper = brand.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12 lg:py-16">
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
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
            Select the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              {brandNameUpper} LAPTOP/MACBOOK
            </span>
            {' '}Model Series
          </h1>
          <p className="text-lg text-gray-600">
            to sell used {brandNameUpper} LAPTOP/MACBOOK
          </p>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {models.map((model, index) => (
            <Link
              key={model.name}
              href={`/sell/laptop/${brand.toLowerCase()}/${model.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group"
            >
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${model.color} opacity-0 group-hover:opacity-95 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative p-6">
                  {/* Image/Icon Container */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-4 flex items-center justify-center min-h-[180px] group-hover:bg-white/20 transition-all duration-300">
                    <Image
                      src={model.image}
                      alt={model.name}
                      width={180}
                      height={140}
                      className="object-contain max-h-40 w-auto group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Model Name */}
                  <h3 className="text-center text-sm lg:text-base font-bold text-gray-800 group-hover:text-white transition-colors duration-300 uppercase tracking-wide leading-tight">
                    {model.name}
                  </h3>
                </div>

                {/* Bottom highlight bar */}
                <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${model.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                
                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Can't find your model?</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              No worries! Our support team is here to help you find the right model and get you the best price for your {brandNameUpper} laptop.
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

export default LaptopModelSelection;
