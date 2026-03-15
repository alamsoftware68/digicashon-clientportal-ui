"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import apiService from "@/services/api";

interface BrandModel {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  iconUrl: string | null;
  enabled: boolean;
  brandId: number;
}

interface Brand {
  id: number;
  name: string;
  brandType: string;
  iconUrl: string | null;
}

interface EvaluationData {
  superCategory: string;
  brandId: number;
  brandName: string;
  brandModelId: number;
  brandModelName: string;
  basePrice: number;
  powerStatus: boolean | null;
  processorId: number | null;
  graphicsId: number | null;
  ramId: number | null;
  storageId: number | null;
  screenSizeId: number | null;
  functionalIssueIds: number[];
  hasInvoice: boolean;
  hasBox: boolean;
  ageCode: string | null;
  conditionCode: string | null;
  mobileNumber: string;
}

interface ConditionOption {
  id: number;
  conditionCode: string;
  conditionLabel: string;
  multiplierPercentage: number;
  requiresInvoice: boolean;
  minDeviceAgeMonths: number;
  maxDeviceAgeMonths: number;
  displayOrder: number;
  enabled: boolean;
}

interface PhysicalConditionStepProps {
  model: BrandModel;
  brand: Brand;
  evaluationData: EvaluationData;
  onSelect: (conditionCode: string) => void;
  onMobileSubmit: (mobile: string) => void;
}

// Map condition codes to emojis and colors
const getConditionStyle = (index: number) => {
  const styles = [
    {
      emoji: "✨",
      gradient: "from-emerald-500 to-green-600",
      border: "border-emerald-400",
      bg: "bg-emerald-400/10",
      shadow: "shadow-emerald-400/20",
      text: "text-emerald-300",
      description: "Zero scratches, looks brand new",
    },
    {
      emoji: "👍",
      gradient: "from-blue-500 to-cyan-600",
      border: "border-blue-400",
      bg: "bg-blue-400/10",
      shadow: "shadow-blue-400/20",
      text: "text-blue-300",
      description: "Minor scratches, works perfectly",
    },
    {
      emoji: "📱",
      gradient: "from-orange-500 to-amber-600",
      border: "border-orange-400",
      bg: "bg-orange-400/10",
      shadow: "shadow-orange-400/20",
      text: "text-orange-300",
      description: "Visible scratches, functions fine",
    },
    {
      emoji: "⚠️",
      gradient: "from-red-500 to-rose-600",
      border: "border-red-400",
      bg: "bg-red-400/10",
      shadow: "shadow-red-400/20",
      text: "text-red-300",
      description: "Significant wear and tear",
    },
  ];
  return styles[index % styles.length];
};

const PhysicalConditionStep: React.FC<PhysicalConditionStepProps> = ({
  model,
  brand,
  evaluationData,
  onSelect,
  onMobileSubmit,
}) => {
  const [conditionOptions, setConditionOptions] = useState<ConditionOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState("");

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        setLoading(true);
        const response = await apiService.getConditionMultipliers();
        if (response.success && response.data) {
          // Sort by display order
          const sortedOptions = response.data.sort(
            (a, b) => a.displayOrder - b.displayOrder
          );
          setConditionOptions(sortedOptions);
        }
      } catch (error) {
        console.error("Error fetching condition options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConditions();
  }, []);

  const handleConditionSelection = (conditionCode: string) => {
    setSelectedCondition(conditionCode);
    onSelect(conditionCode);
    // Show mobile modal after selection
    setShowMobileModal(true);
  };

  const validateMobileNumber = (number: string): boolean => {
    // Indian mobile number validation: 10 digits
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(number);
  };

  const handleMobileSubmit = () => {
    if (!validateMobileNumber(mobileNumber)) {
      setMobileError("Please enter a valid 10-digit mobile number");
      return;
    }
    setMobileError("");
    setShowMobileModal(false);
    onMobileSubmit(mobileNumber);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only digits
    if (value.length <= 10) {
      setMobileNumber(value);
      setMobileError("");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Side (2 columns on large screens) */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700">
            {/* Progress Indicator */}
            <div className="mb-6">
              <p className="text-cyan-400 text-sm font-semibold tracking-wide uppercase">
                Step 7 • Physical Condition
              </p>
              <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full w-[87.5%]"></div>
              </div>
            </div>

            {/* Question Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">
                How is your {brand.name} condition?
              </h2>
              <p className="text-gray-400 text-base">
                Be honest about the physical state of your device
              </p>
            </div>

            {/* Condition Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {conditionOptions.map((option, index) => {
                const style = getConditionStyle(index);
                return (
                  <button
                    key={option.id}
                    onClick={() => handleConditionSelection(option.conditionCode)}
                    className={`group relative p-6 rounded-2xl border-2 border-gray-600 bg-gray-800/50 hover:border-${style.border} hover:${style.bg} hover:shadow-lg hover:${style.shadow} transition-all duration-300 transform hover:scale-105`}
                  >
                    {/* Gradient Overlay on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>

                    {/* Content */}
                    <div className="relative flex items-start space-x-4">
                      {/* Emoji Icon */}
                      <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        {style.emoji}
                      </div>

                      {/* Condition Info */}
                      <div className="flex-1 text-left">
                        <h3 className={`font-bold text-xl text-white group-hover:${style.text} transition-colors mb-2`}>
                          {option.conditionLabel}
                        </h3>
                        <p className="text-gray-400 text-sm group-hover:text-gray-300 mb-2">
                          {style.description}
                        </p>
                        {option.multiplierPercentage !== 100 && (
                          <p className="text-gray-500 text-xs">
                            {option.multiplierPercentage}% of value
                          </p>
                        )}
                      </div>

                      {/* Arrow Icon */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-cyan-400"
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
                      </div>
                    </div>

                    {/* Decorative corner element */}
                    <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900/5 rounded-full -mr-5 -mt-5 group-hover:bg-gradient-to-br from-gray-800 to-gray-900/10 transition-colors"></div>
                  </button>
                );
              })}
            </div>

            {/* Info Note */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-blue-300 text-sm">
                  Physical condition significantly impacts resale value. Accurate assessment ensures fair pricing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Side (1 column on large screens) */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-700 sticky top-8">
            {/* Device Summary */}
            <div className="mb-6">
              <h3 className="text-white font-bold text-lg mb-4">Device Summary</h3>

              {/* Device Image */}
              <div className="flex items-center space-x-4 mb-6">
                {model.iconUrl && (
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-xl flex items-center justify-center p-2">
                    <Image
                      src={model.iconUrl}
                      alt={model.name}
                      width={56}
                      height={56}
                      className="object-contain"
                    />
                  </div>
                )}
                <div>
                  <p className="text-white font-semibold">{model.name}</p>
                  <p className="text-gray-400 text-sm">{brand.name}</p>
                </div>
              </div>

              {/* Configuration Details */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Base Price</span>
                  <span className="text-white font-medium">₹{model.basePrice.toFixed(0)}</span>
                </div>
                <div className="h-px bg-gray-700"></div>

                {evaluationData.ageCode && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Device Age</span>
                      <span className="text-green-400 font-medium">Selected ✓</span>
                    </div>
                    <div className="h-px bg-gray-700"></div>
                  </>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-400">Accessories</span>
                  <span className="text-green-400 font-medium">
                    {evaluationData.hasInvoice && evaluationData.hasBox
                      ? "Both"
                      : evaluationData.hasInvoice
                      ? "Invoice"
                      : "None"}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Step */}
            <div className="border-t border-gray-700 pt-6">
              <h4 className="text-white font-semibold mb-3">Current Step</h4>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-cyan-300 font-medium mb-2">Physical Condition</p>
                <p className="text-gray-400 text-sm">Select condition to get your final price</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="border-t border-gray-700 pt-6 mt-6">
              <h4 className="text-white font-semibold mb-3">Progress</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-green-400">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  System Configuration
                </div>
                <div className="flex items-center text-green-400">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Accessories & Age
                </div>
                <div className="flex items-center text-cyan-400">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                  Physical Condition
                </div>
                <div className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Final Price
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Number Modal */}
      {showMobileModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-white text-2xl font-bold mb-3">
                One Last Step!
              </h3>
              <p className="text-gray-300 text-base">
                Enter your mobile number to get your device's final price
              </p>
            </div>

            {/* Mobile Number Input */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500">+91</span>
                </div>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  placeholder="9876543210"
                  className={`w-full bg-gray-700/50 border ${
                    mobileError ? "border-red-500" : "border-gray-600"
                  } rounded-xl pl-14 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all`}
                  maxLength={10}
                />
              </div>
              {mobileError && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {mobileError}
                </p>
              )}
            </div>

            {/* Info Note */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mb-6">
              <div className="flex items-start space-x-2">
                <svg
                  className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-blue-300 text-xs">
                  We'll use this number to share your device price and help you complete the sale
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => setShowMobileModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMobileSubmit}
                disabled={mobileNumber.length !== 10}
                className={`flex-1 font-semibold py-3 px-6 rounded-xl shadow-lg transition-all ${
                  mobileNumber.length === 10
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white hover:shadow-xl"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                Get Price
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhysicalConditionStep;
