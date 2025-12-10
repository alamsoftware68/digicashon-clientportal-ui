"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const DeviceSellingSection = () => {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            We Made{" "}
            <span className="relative text-blue-900">
              Selling
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400 rounded"></div>
            </span>{" "}
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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Category Selection Text */}
          <div className="text-center mt-4">
            <span className="text-gray-500 text-sm">
              --- or choose a category ---
            </span>
          </div>
        </div>

        {/* Device Categories - Sell Your Device */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Windows */}
            <Link href="/sell/windows" className="group">
              <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative p-6">
                  {/* Icon Container */}
                  <div className="relative mb-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:scale-110 overflow-hidden">
                      {/* Windows Logo Image */}
                      <Image
                        src="/images/Windows.png"
                        alt="Windows Logo"
                        width={56}
                        height={56}
                        className="object-contain"
                      />
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                      Popular
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-500 mb-2 text-center">
                    Windows
                  </h3>

                  {/* Features */}
                  <ul className="space-y-1 mb-4">
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg
                        className="w-4 h-4 mr-1 text-green-500 group-hover:text-green-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Best price for all brands
                    </li>
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg
                        className="w-4 h-4 mr-1 text-green-500 group-hover:text-green-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Free data wiping service
                    </li>
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg
                        className="w-4 h-4 mr-1 text-green-500 group-hover:text-green-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Same-day payment
                    </li>
                  </ul>

                  {/* CTA Button */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-white group-hover:to-white text-white group-hover:text-blue-600 font-semibold py-2.5 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105 text-sm">
                    Sell Now →
                  </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/20 rounded-full -mr-10 -mt-10 group-hover:bg-white/10 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-200/20 rounded-full -ml-10 -mb-10 group-hover:bg-white/10 transition-colors duration-500"></div>
              </div>
            </Link>

            {/* Apple */}
            <Link href="/sell/apple" className="group">
              <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative p-6">
                  {/* Icon Container */}
                  <div className="relative mb-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:scale-110">
                      {/* Apple Icon */}
                      <svg
                        className="w-12 h-12 text-gray-800 group-hover:text-white transition-colors duration-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                      Premium
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-500 mb-2 text-center">
                    Apple
                  </h3>

                  {/* Features */}
                  <ul className="space-y-1 mb-4">
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg
                        className="w-4 h-4 mr-1 text-green-500 group-hover:text-green-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Premium pricing for Apple
                    </li>
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg
                        className="w-4 h-4 mr-1 text-green-500 group-hover:text-green-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Expert Mac evaluation
                    </li>
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg
                        className="w-4 h-4 mr-1 text-green-500 group-hover:text-green-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Same-day payment
                    </li>
                  </ul>

                  {/* CTA Button */}
                  <button className="w-full bg-gradient-to-r from-gray-700 to-gray-900 group-hover:from-white group-hover:to-white text-white group-hover:text-gray-800 font-semibold py-2.5 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105 text-sm">
                    Sell Now →
                  </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gray-200/20 rounded-full -mr-10 -mt-10 group-hover:bg-white/10 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gray-300/20 rounded-full -ml-10 -mb-10 group-hover:bg-white/10 transition-colors duration-500"></div>
              </div>
            </Link>

            {/* Sell Mobile */}
            <Link href="/sell/mobile" className="group">
              <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative p-6">
                  {/* Icon Container */}
                  <div className="relative mb-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:scale-110 overflow-hidden p-1">
                      {/* Mobile Logo Image */}
                      <Image
                        src="/images/Sell Mobile.png"
                        alt="Mobile Logo"
                        width={110}
                        height={110}
                        className="object-contain w-full h-full"
                      />
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                      Hot Deal
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-500 mb-2 text-center">
                    Sell MOBILE
                  </h3>

                  {/* Features */}
                  <ul className="space-y-1 mb-4">
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg
                        className="w-4 h-4 mr-1 text-green-500 group-hover:text-green-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Top market value
                    </li>
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg
                        className="w-4 h-4 mr-1 text-green-500 group-hover:text-green-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Quick inspection process
                    </li>
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg
                        className="w-4 h-4 mr-1 text-green-500 group-hover:text-green-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Instant cash payment
                    </li>
                  </ul>

                  {/* CTA Button */}
                  <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 group-hover:from-white group-hover:to-white text-white group-hover:text-emerald-600 font-semibold py-2.5 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105 text-sm">
                    Sell Now →
                  </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200/20 rounded-full -mr-10 -mt-10 group-hover:bg-white/10 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-teal-200/20 rounded-full -ml-10 -mb-10 group-hover:bg-white/10 transition-colors duration-500"></div>
              </div>
            </Link>

            {/* Sell Tablet/iPad */}
            <Link href="/sell/tablet" className="group">
              <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative p-6">
                  {/* Icon Container */}
                  <div className="relative mb-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:scale-110 overflow-hidden p-1">
                      {/* Tablet Logo Image */}
                      <Image
                        src="/images/Tablet iPAD.png"
                        alt="Tablet iPad Logo"
                        width={110}
                        height={110}
                        className="object-contain w-full h-full"
                      />
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                      Best Value
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-500 mb-2 text-center">
                    Sell TABLET/iPAD
                  </h3>

                  {/* Features */}
                  <ul className="space-y-1 mb-4">
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg
                        className="w-4 h-4 mr-1 text-green-500 group-hover:text-green-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Competitive pricing
                    </li>
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg
                        className="w-4 h-4 mr-1 text-green-500 group-hover:text-green-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      All brands accepted
                    </li>
                    <li className="flex items-center text-xs text-gray-700 group-hover:text-white/90 transition-colors duration-500">
                      <svg
                        className="w-4 h-4 mr-1 text-green-500 group-hover:text-green-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Fast & secure process
                    </li>
                  </ul>

                  {/* CTA Button */}
                  <button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 group-hover:from-white group-hover:to-white text-white group-hover:text-pink-600 font-semibold py-2.5 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105 text-sm">
                    Sell Now →
                  </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-200/20 rounded-full -mr-10 -mt-10 group-hover:bg-white/10 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-rose-200/20 rounded-full -ml-10 -mb-10 group-hover:bg-white/10 transition-colors duration-500"></div>
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
                <svg
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.13997 6.91 8.85997 6.88C10.15 6.85 11.36 7.72 12.11 7.72C12.86 7.72 14.3 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                </svg>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">
                  Download on the
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  App Store
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <span className="text-2xl font-bold text-gray-900 mr-1">
                  4.7
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">GET IT ON</div>
                <div className="text-sm font-semibold text-gray-900">
                  Google Play
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <span className="text-2xl font-bold text-gray-900 mr-1">
                  4.5
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
