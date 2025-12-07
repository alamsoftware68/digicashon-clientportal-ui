'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SellProductPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="group flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-200">
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
            <h1 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-sm">
              Sell Your Device
            </h1>
            <div className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-sm"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Turn your old devices into instant cash! Get the best value for your used phones, laptops, and tablets with our hassle-free selling process.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">Best Price Guarantee</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">Instant Payment</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">Free Pickup</span>
            </div>
          </div>
        </div>

        {/* Main Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Windows */}
          <Link href="/sell/windows" className="group">
            <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Content */}
              <div className="relative p-8">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:scale-110">
                    {/* Laptop Icon */}
                    <svg className="w-14 h-14 text-blue-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                    Popular
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white transition-colors duration-500 mb-3 text-center">
                  Windows
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-500 text-center mb-4 leading-relaxed">
                  Get instant quotes for your Dell, HP, Lenovo and other Windows laptops
                </p>
                
                {/* Features */}
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                    <svg className="w-5 h-5 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Best price for all brands
                  </li>
                  <li className="flex items-center text-sm text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                    <svg className="w-5 h-5 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Free data wiping service
                  </li>
                  <li className="flex items-center text-sm text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                    <svg className="w-5 h-5 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Same-day payment
                  </li>
                </ul>
                
                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-white group-hover:to-white text-white group-hover:text-blue-600 font-bold py-3 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                  Sell Now →
                </button>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200/20 rounded-full -ml-12 -mb-12 group-hover:bg-white/10 transition-colors duration-500"></div>
            </div>
          </Link>

          {/* Apple */}
          <Link href="/sell/apple" className="group">
            <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Content */}
              <div className="relative p-8">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:scale-110">
                    {/* Apple Icon */}
                    <svg className="w-14 h-14 text-gray-800 group-hover:text-white transition-colors duration-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                    Premium
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white transition-colors duration-500 mb-3 text-center">
                  Apple
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-500 text-center mb-4 leading-relaxed">
                  Get top value for your MacBook, MacBook Air, MacBook Pro, and iMac
                </p>
                
                {/* Features */}
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                    <svg className="w-5 h-5 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Premium pricing for Apple
                  </li>
                  <li className="flex items-center text-sm text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                    <svg className="w-5 h-5 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Expert Mac evaluation
                  </li>
                  <li className="flex items-center text-sm text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                    <svg className="w-5 h-5 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Same-day payment
                  </li>
                </ul>
                
                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-gray-700 to-gray-900 group-hover:from-white group-hover:to-white text-white group-hover:text-gray-800 font-bold py-3 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                  Sell Now →
                </button>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200/20 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-300/20 rounded-full -ml-12 -mb-12 group-hover:bg-white/10 transition-colors duration-500"></div>
            </div>
          </Link>

          {/* Sell Mobile */}
          <Link href="/sell/mobile" className="group">
            <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Content */}
              <div className="relative p-8">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:scale-110">
                    {/* Mobile Icon */}
                    <svg className="w-14 h-14 text-emerald-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                    Hot Deal
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white transition-colors duration-500 mb-3 text-center">
                  Sell MOBILE
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-500 text-center mb-4 leading-relaxed">
                  Sell your iPhone, Samsung, OnePlus, and other smartphones at great prices
                </p>
                
                {/* Features */}
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                    <svg className="w-5 h-5 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Top market value
                  </li>
                  <li className="flex items-center text-sm text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                    <svg className="w-5 h-5 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Quick inspection process
                  </li>
                  <li className="flex items-center text-sm text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                    <svg className="w-5 h-5 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Instant cash payment
                  </li>
                </ul>
                
                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 group-hover:from-white group-hover:to-white text-white group-hover:text-emerald-600 font-bold py-3 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                  Sell Now →
                </button>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-200/20 rounded-full -ml-12 -mb-12 group-hover:bg-white/10 transition-colors duration-500"></div>
            </div>
          </Link>

          {/* Sell Tablet/iPad */}
          <Link href="/sell/tablet" className="group">
            <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Content */}
              <div className="relative p-8">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:scale-110">
                    {/* Tablet Icon */}
                    <svg className="w-14 h-14 text-pink-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Best Value
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white transition-colors duration-500 mb-3 text-center">
                  Sell TABLET/iPAD
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-500 text-center mb-4 leading-relaxed">
                  Get excellent prices for your iPad, Samsung Galaxy Tab, and other tablets
                </p>
                
                {/* Features */}
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                    <svg className="w-5 h-5 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Competitive pricing
                  </li>
                  <li className="flex items-center text-sm text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                    <svg className="w-5 h-5 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All brands accepted
                  </li>
                  <li className="flex items-center text-sm text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                    <svg className="w-5 h-5 mr-2 text-green-500 group-hover:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Fast & secure process
                  </li>
                </ul>
                
                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 group-hover:from-white group-hover:to-white text-white group-hover:text-pink-600 font-bold py-3 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                  Sell Now →
                </button>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200/20 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-200/20 rounded-full -ml-12 -mb-12 group-hover:bg-white/10 transition-colors duration-500"></div>
            </div>
          </Link>
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-800">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Works</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Choose Device</h3>
              <p className="text-sm text-gray-600">Select your device category and provide details</p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Get Quote</h3>
              <p className="text-sm text-gray-600">Receive an instant price quote for your device</p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Schedule Pickup</h3>
              <p className="text-sm text-gray-600">We'll collect your device from your doorstep</p>
            </div>
            
            {/* Step 4 */}
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">4</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Get Paid</h3>
              <p className="text-sm text-gray-600">Receive instant payment after inspection</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Sell Your Device?</h2>
          <p className="text-xl mb-8 text-white/90">Get the best price for your used devices today!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Get Started Now
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellProductPage;
