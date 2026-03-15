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

interface AgeOption {
  id: number;
  ageCode: string;
  ageLabel: string;
  minMonths: number;
  maxMonths: number;
  depreciationPercentage: number;
  displayOrder: number;
  enabled: boolean;
}

interface DeviceAgeStepProps {
  model: BrandModel;
  brand: Brand;
  evaluationData: EvaluationData;
  onSelect: (ageCode: string) => void;
}

// Map age codes to emojis and colors
const getAgeStyle = (index: number) => {
  const styles = [
    {
      emoji: "🆕",
      gradient: "from-green-500 to-emerald-600",
      border: "border-green-400",
      bg: "bg-green-400/10",
      shadow: "shadow-green-400/20",
      text: "text-green-300",
    },
    {
      emoji: "📅",
      gradient: "from-blue-500 to-cyan-600",
      border: "border-blue-400",
      bg: "bg-blue-400/10",
      shadow: "shadow-blue-400/20",
      text: "text-blue-300",
    },
    {
      emoji: "⏰",
      gradient: "from-orange-500 to-amber-600",
      border: "border-orange-400",
      bg: "bg-orange-400/10",
      shadow: "shadow-orange-400/20",
      text: "text-orange-300",
    },
  ];
  return styles[index % styles.length];
};

const DeviceAgeStep: React.FC<DeviceAgeStepProps> = ({
  model,
  brand,
  evaluationData,
  onSelect,
}) => {
  const [ageOptions, setAgeOptions] = useState<AgeOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgeOptions = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAgeDepreciationOptions();
        if (response.success && response.data) {
          // Sort by display order
          const sortedOptions = response.data.sort(
            (a, b) => a.displayOrder - b.displayOrder
          );
          setAgeOptions(sortedOptions);
        }
      } catch (error) {
        console.error("Error fetching age options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgeOptions();
  }, []);

  const handleAgeSelection = (ageCode: string) => {
    onSelect(ageCode);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content - Left Side (2 columns on large screens) */}
      <div className="lg:col-span-2">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700">
          {/* Progress Indicator */}
          <div className="mb-6">
            <p className="text-cyan-400 text-sm font-semibold tracking-wide uppercase">
              Step 6 • Device Age
            </p>
            <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full w-3/4"></div>
            </div>
          </div>

          {/* Question Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              How old is your device?
            </h2>
            <p className="text-gray-400 text-base">
              Select the age range that best matches your device's purchase date
            </p>
          </div>

          {/* Age Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {ageOptions.map((option, index) => {
              const style = getAgeStyle(index);
              return (
                <button
                  key={option.id}
                  onClick={() => handleAgeSelection(option.ageCode)}
                  className={`group relative p-8 rounded-2xl border-2 border-gray-600 bg-gray-800/50 hover:border-${style.border} hover:${style.bg} hover:shadow-lg hover:${style.shadow} transition-all duration-300 transform hover:scale-105`}
                >
                  {/* Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>

                  {/* Content */}
                  <div className="relative flex flex-col items-center space-y-4">
                    {/* Emoji Icon */}
                    <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                      {style.emoji}
                    </div>

                    {/* Age Label */}
                    <div className="text-center">
                      <h3 className={`font-bold text-lg text-white group-hover:${style.text} transition-colors mb-2`}>
                        {option.ageLabel}
                      </h3>
                      {option.depreciationPercentage > 0 && (
                        <p className="text-gray-400 text-sm group-hover:text-gray-300">
                          -{option.depreciationPercentage}% depreciation
                        </p>
                      )}
                    </div>

                    {/* Arrow Icon */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg
                        className="w-8 h-8 text-cyan-400"
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

                  {/* Decorative corner elements */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900/5 rounded-full -mr-6 -mt-6 group-hover:bg-gradient-to-br from-gray-800 to-gray-900/10 transition-colors"></div>
                  <div className="absolute bottom-0 left-0 w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900/5 rounded-full -ml-5 -mb-5 group-hover:bg-gradient-to-br from-gray-800 to-gray-900/10 transition-colors"></div>
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
                Device age affects resale value. Newer devices typically fetch a better price.
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

              <div className="flex justify-between">
                <span className="text-gray-400">Accessories</span>
                <span className="text-green-400 font-medium">
                  {evaluationData.hasInvoice && evaluationData.hasBox
                    ? "Invoice + Box"
                    : evaluationData.hasInvoice
                    ? "Invoice only"
                    : evaluationData.hasBox
                    ? "Box only"
                    : "None"}
                </span>
              </div>
            </div>
          </div>

          {/* Current Step */}
          <div className="border-t border-gray-700 pt-6">
            <h4 className="text-white font-semibold mb-3">Current Step</h4>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
              <p className="text-cyan-300 font-medium mb-2">Device Age</p>
              <p className="text-gray-400 text-sm">Select your device's age to continue</p>
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
                Power Status
              </div>
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
                Functional Issues
              </div>
              <div className="flex items-center text-green-400">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Accessories
              </div>
              <div className="flex items-center text-cyan-400">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                Device Age
              </div>
              <div className="flex items-center text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Physical Condition
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceAgeStep;
