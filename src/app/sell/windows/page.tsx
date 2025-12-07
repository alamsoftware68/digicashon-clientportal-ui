'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function SellWindows() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 lg:py-24 pt-32">
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

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="relative inline-block mb-6">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 drop-shadow-sm">
                Sell Windows Device
              </h1>
              <div className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full blur-sm"></div>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose the type of Windows device you want to sell
            </p>
          </div>

          {/* Device Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Laptop Option */}
            <Link href="/sell/windows/laptop" className="group">
              <div className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2 h-full">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative p-6 flex flex-col h-full">
                  {/* Icon Container */}
                  <div className="relative mb-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:scale-110">
                      {/* Laptop Icon */}
                      <svg className="w-12 h-12 text-blue-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white transition-colors duration-500 mb-2 text-center">
                    Laptop
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-500 text-center mb-4 leading-relaxed">
                    Dell, HP, Lenovo, Asus, Acer and other Windows laptops
                  </p>
                  
                  {/* Features */}
                  <ul className="space-y-1.5 mb-4 flex-grow">
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg className="w-4 h-4 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Best price for all brands
                    </li>
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg className="w-4 h-4 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Free data wiping service
                    </li>
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg className="w-4 h-4 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Same-day payment
                    </li>
                  </ul>
                  
                  {/* CTA Button */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-white group-hover:to-white text-white group-hover:text-blue-600 font-semibold py-2.5 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                    Select Laptop →
                  </button>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200/20 rounded-full -ml-12 -mb-12 group-hover:bg-white/10 transition-colors duration-500"></div>
              </div>
            </Link>

            {/* Desktop Option */}
            <Link href="/sell/windows/desktop" className="group">
              <div className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2 h-full">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative p-6 flex flex-col h-full">
                  {/* Icon Container */}
                  <div className="relative mb-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:scale-110">
                      {/* Desktop Icon */}
                      <svg className="w-12 h-12 text-indigo-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 16h16" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white transition-colors duration-500 mb-2 text-center">
                    Desktop
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-500 text-center mb-4 leading-relaxed">
                    Dell, HP, Lenovo, Asus and other Windows desktop computers
                  </p>
                  
                  {/* Features */}
                  <ul className="space-y-1.5 mb-4 flex-grow">
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg className="w-4 h-4 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Competitive market rates
                    </li>
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg className="w-4 h-4 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Free pickup service
                    </li>
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg className="w-4 h-4 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Instant cash payment
                    </li>
                  </ul>
                  
                  {/* CTA Button */}
                  <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:from-white group-hover:to-white text-white group-hover:text-indigo-600 font-semibold py-2.5 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                    Select Desktop →
                  </button>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200/20 rounded-full -ml-12 -mb-12 group-hover:bg-white/10 transition-colors duration-500"></div>
              </div>
            </Link>
          </div>

          {/* Info Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Why Sell Your Windows Device to Us?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Best Prices</h3>
                  <p className="text-sm text-gray-600">Get the highest market value for your Windows devices</p>
                </div>
                <div>
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Quick Process</h3>
                  <p className="text-sm text-gray-600">Fast evaluation and instant payment</p>
                </div>
                <div>
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Secure & Safe</h3>
                  <p className="text-sm text-gray-600">Complete data wiping and secure handling</p>
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
