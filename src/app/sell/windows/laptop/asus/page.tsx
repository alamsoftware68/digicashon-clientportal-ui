'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function SellAsusLaptop() {
  const router = useRouter();

  const series = [
    { 
      name: 'ASUS ROG Series', 
      description: 'Republic of Gamers - Premium gaming',
      color: 'from-red-600 to-red-800',
    },
    { 
      name: 'ASUS TUF Gaming Series', 
      description: 'Tough gaming laptops',
      color: 'from-orange-500 to-orange-700',
    },
    { 
      name: 'ASUS Zenbook Series', 
      description: 'Premium ultrabooks',
      color: 'from-blue-500 to-blue-700',
    },
    { 
      name: 'ASUS Vivobook Series', 
      description: 'Everyday laptops',
      color: 'from-purple-500 to-purple-700',
    },
    { 
      name: 'ASUS Chromebook Series', 
      description: 'Chrome OS laptops',
      color: 'from-green-500 to-green-700',
    },
    { 
      name: 'Asus Other Series', 
      description: 'Other Asus models',
      color: 'from-gray-600 to-gray-800',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 py-16 lg:py-24 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="group flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-red-500 transition-all duration-200">
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

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="mr-4">
                <Image src="/images/ASUS.png" alt="ASUS" width={80} height={80} className="object-contain" />
              </div>
              <div className="relative inline-block">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-red-600 drop-shadow-sm">
                  ASUS Laptops
                </h1>
                <div className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-blue-400 to-red-400 rounded-full blur-sm"></div>
              </div>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Select your ASUS laptop series to get an instant quote
            </p>
          </div>

          {/* Series Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {series.map((item) => (
              <Link 
                key={item.name} 
                href={`/sell/windows/laptop/asus/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group"
              >
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 hover:-translate-y-1 h-full">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  {/* Content */}
                  <div className="relative p-6 flex flex-col h-full min-h-[180px]">
                    {/* Icon */}
                    <div className="mb-4">
                      <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg group-hover:bg-white/20 group-hover:shadow-2xl transition-all duration-300`}>
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Series Name */}
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-white transition-colors duration-300 text-center mb-2">
                      {item.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-center mb-4 flex-grow">
                      {item.description}
                    </p>
                    
                    {/* CTA Button */}
                    <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 group-hover:from-white group-hover:to-white text-white group-hover:text-cyan-600 font-semibold py-2.5 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105 text-sm">
                      Select Series →
                    </button>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/20 rounded-full -mr-10 -mt-10 group-hover:bg-white/10 transition-colors duration-300"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-red-200/20 rounded-full -ml-8 -mb-8 group-hover:bg-white/10 transition-colors duration-300"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Selling Your ASUS Laptop
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-red-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">All ASUS Series</h3>
                    <p className="text-sm text-gray-600">ROG, TUF, Zenbook, Vivobook, and all other ASUS models</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Premium Value</h3>
                    <p className="text-sm text-gray-600">Top prices for gaming and professional ASUS laptops</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Instant Payment</h3>
                    <p className="text-sm text-gray-600">Quick evaluation with same-day payment option</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Data Protection</h3>
                    <p className="text-sm text-gray-600">Professional data wiping for complete security</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
