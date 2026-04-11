"use client";

import React from "react";
import Image from "next/image";

interface InitialPriceStepProps {
  model: {
    id: number;
    name: string;
    basePrice: number;
    iconUrl: string | null;
  };
  brand: {
    id: number;
    name: string;
    iconUrl: string | null;
  };
  onContinue: () => void;
}

const InitialPriceStep: React.FC<InitialPriceStepProps> = ({
  model,
  brand,
  onContinue,
}) => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-50 border border-cyan-200">
          <div className="w-2 h-2 rounded-full bg-cyan-500 mr-3 animate-pulse"></div>
          <span className="text-cyan-700 text-sm font-medium uppercase tracking-wide">
            {brand.name} • {model.name}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Device Display */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          <h2 className="text-gray-900 text-2xl font-bold mb-6">Sell your</h2>
          <h1 className="text-cyan-600 text-4xl font-extrabold mb-8">
            {model.name}
          </h1>

          {/* Device Image Card */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 mb-6">
            <div className="flex items-center justify-center mb-4">
              {brand.iconUrl ? (
                <Image
                  src={brand.iconUrl}
                  alt={brand.name}
                  width={120}
                  height={120}
                  className="object-contain"
                />
              ) : (
                <div className="text-8xl text-blue-500">
                  {brand.name.substring(0, 1)}
                </div>
              )}
            </div>
          </div>

          {/* Starting Price */}
          <div className="mb-6">
            <p className="text-gray-500 text-sm uppercase tracking-wide mb-2">
              GET PRICE UPTO
            </p>
            <div className="flex items-baseline">
              <span className="text-cyan-600 text-5xl font-bold">
                {model.basePrice.toLocaleString("en-IN")}
              </span>
              <span className="text-gray-500 text-xl ml-2">
                Estimated Price
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Get Exact Value */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          <h3 className="text-gray-900 text-2xl font-bold mb-4">
            Get Exact Value
          </h3>

          <div className="mb-6">
            <div className="flex items-baseline mb-2">
              <p className="text-gray-500 text-sm mr-2">Base estimate</p>
              <p className="text-gray-400 text-xs">
                For a device in good condition
              </p>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-gray-900 text-3xl font-bold">
                ₹{model.basePrice.toLocaleString("en-IN")}
              </span>
              <span className="text-green-600 text-sm font-medium">
                Up to +15% for like-new
              </span>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
          >
            <span className="text-lg">Get Exact Value</span>
            <svg
              className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>

          {/* Trust Indicators */}
          <div className="mt-8 space-y-3">
            <div className="flex items-start">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-sm">
                No obligation to sell – you're free to walk away.
              </p>
            </div>

            <div className="flex items-start">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-sm">
                Secure process with verified partners and safe data wiping.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialPriceStep;
