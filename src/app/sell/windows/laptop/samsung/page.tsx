'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import apiService from '@/services/api';

// Default gradient colors for models
const gradientColors = [
  'from-sky-500 to-sky-700',
  'from-blue-500 to-blue-700',
  'from-indigo-500 to-indigo-700',
  'from-purple-500 to-purple-700',
  'from-fuchsia-500 to-fuchsia-700',
  'from-cyan-500 to-cyan-700',
  'from-teal-500 to-teal-700',
  'from-emerald-500 to-emerald-700',
  'from-sky-600 to-blue-700',
  'from-blue-600 to-indigo-700',
  'from-indigo-600 to-purple-700',
  'from-purple-600 to-violet-700',
  'from-violet-600 to-fuchsia-700',
  'from-fuchsia-600 to-pink-700',
  'from-rose-500 to-amber-600',
  'from-slate-500 to-slate-700',
];

export default function SellSamsungLaptop() {
  const router = useRouter();
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSamsungModels() {
      try {
        setLoading(true);
        setError(null);

        // First, get all brands for Laptop
        const brandsRes = await apiService.getBrands('Laptop');

        if (!brandsRes.success || !brandsRes.data) {
          throw new Error('Failed to fetch brands');
        }

        // Find Samsung brand
        const samsungBrand = brandsRes.data.find(
          (brand: any) => brand.name.toLowerCase() === 'samsung'
        );

        if (!samsungBrand) {
          throw new Error('Samsung brand not found');
        }

        // Get models for Samsung brand
        const modelsRes = await apiService.getBrandModels(samsungBrand.id);

        if (!modelsRes.success || !modelsRes.data) {
          throw new Error('Failed to fetch Samsung models');
        }

        // Map models with gradient colors
        const modelsWithColors = modelsRes.data.map((model: any, index: number) => ({
          id: model.id,
          name: model.name,
          description: `Samsung ${model.name}`,
          color: gradientColors[index % gradientColors.length],
          basePrice: model.basePrice,
        }));

        setModels(modelsWithColors);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching Samsung models:', err);
        setError(err.message || 'Failed to load Samsung models');
        setLoading(false);
      }
    }

    fetchSamsungModels();
  }, []);

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
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="mr-4">
                <Image src="/images/Samsung.png" alt="Samsung" width={80} height={80} className="object-contain" />
              </div>
              <div className="relative inline-block">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 drop-shadow-sm">
                  Samsung Galaxy Book
                </h1>
                <div className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full blur-sm"></div>
              </div>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Select your Samsung Galaxy Book model to get an instant quote
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Models</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Model Selection Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 max-w-6xl mx-auto">
              {models.map((model) => (
                <Link
                  key={model.id}
                  href={`/sell/windows/laptop/samsung/${model.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group"
                >
                  <div className="relative bg-white/90 border border-slate-100 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 hover:scale-[1.02] h-full">
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${model.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                    {/* Content */}
                    <div className="relative p-4 md:p-5 flex flex-col h-full min-h-[140px]">
                      {/* Icon */}
                      <div className="mb-3 flex justify-center">
                        <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${model.color} rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/70 group-hover:ring-offset-2 group-hover:ring-offset-white group-hover:bg-white/15 transition-all duration-300`}>
                          <svg className="w-7 h-7 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>

                      {/* Model Name */}
                      <h3 className="text-base md:text-lg font-semibold text-slate-900 group-hover:text-white transition-colors duration-300 text-center mb-1 leading-snug">
                        {model.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs md:text-sm text-slate-600 group-hover:text-white/90 transition-colors duration-300 text-center mb-3 flex-grow">
                        {model.description}
                      </p>

                      {/* CTA Button */}
                      <button className="mt-auto w-full bg-gradient-to-r from-cyan-600 to-blue-600 group-hover:from-white group-hover:to-white text-xs md:text-sm text-white group-hover:text-cyan-600 font-semibold py-2 rounded-xl shadow-md group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                        Select Model →
                      </button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/20 rounded-full -mr-12 -mt-12 group-hover:bg-white/10 transition-colors duration-300"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-200/20 rounded-full -ml-10 -mb-10 group-hover:bg-white/10 transition-colors duration-300"></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          </div>

          {/* Info Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Selling Your Samsung Galaxy Book
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">All Conditions Accepted</h3>
                    <p className="text-sm text-gray-600">We buy laptops in any condition - working, damaged, or broken</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Instant Cash Offer</h3>
                    <p className="text-sm text-gray-600">Get paid immediately after device inspection and approval</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Data Protection</h3>
                    <p className="text-sm text-gray-600">Professional data wiping to keep your information secure</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Free Home Pickup</h3>
                    <p className="text-sm text-gray-600">We'll collect your device from your doorstep at no cost</p>
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
