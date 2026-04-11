"use client";

import React, { useState } from "react";
import Image from "next/image";

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

interface AccessoriesStepProps {
  model: BrandModel;
  brand: Brand;
  evaluationData: EvaluationData;
  onUpdate: (updates: Partial<EvaluationData>) => void;
  onContinue: () => void;
}

const AccessoriesStep: React.FC<AccessoriesStepProps> = ({
  model,
  brand,
  evaluationData,
  onUpdate,
  onContinue,
}) => {
  const [hasInvoice, setHasInvoice] = useState<boolean | null>(
    evaluationData.hasInvoice
  );
  const [hasBox, setHasBox] = useState<boolean>(evaluationData.hasBox);

  const handleInvoiceSelection = (value: boolean) => {
    setHasInvoice(value);
    onUpdate({ hasInvoice: value });
  };

  const handleBoxSelection = (value: boolean) => {
    setHasBox(value);
    onUpdate({ hasBox: value });
  };

  const handleContinue = () => {
    if (hasInvoice === null) return;
    onContinue();
  };

  const canContinue = hasInvoice !== null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          {/* Progress Indicator */}
          <div className="mb-6">
            <p className="text-cyan-600 text-sm font-semibold tracking-wide uppercase">
              Step 5 • Accessories
            </p>
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full w-5/8"></div>
            </div>
          </div>

          {/* Question Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Which accessories do you have?
            </h2>
            <p className="text-gray-500 text-base">
              Accessories can increase your device's value
            </p>
          </div>

          {/* Invoice Section - REQUIRED */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">📄</div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-lg">Purchase Invoice</h3>
                  <p className="text-gray-500 text-sm">Original purchase receipt</p>
                </div>
              </div>
              <span className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full border border-red-200">
                Required
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleInvoiceSelection(true)}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  hasInvoice === true
                    ? "border-green-400 bg-green-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="text-4xl">✅</div>
                  <div className="text-center">
                    <p className={`font-semibold ${hasInvoice === true ? "text-green-700" : "text-gray-900"}`}>
                      Yes, I have it
                    </p>
                    <p className="text-sm text-gray-500 mt-1">+₹500 value</p>
                  </div>
                  {hasInvoice === true && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => handleInvoiceSelection(false)}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  hasInvoice === false
                    ? "border-orange-400 bg-orange-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="text-4xl">❌</div>
                  <div className="text-center">
                    <p className={`font-semibold ${hasInvoice === false ? "text-orange-700" : "text-gray-900"}`}>
                      No, I don't have it
                    </p>
                    <p className="text-sm text-gray-500 mt-1">No deduction</p>
                  </div>
                  {hasInvoice === false && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            </div>

            {hasInvoice === null && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Please select whether you have the invoice
              </p>
            )}
          </div>

          {/* Original Box Section - OPTIONAL */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">📦</div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-lg">Original Box</h3>
                  <p className="text-gray-500 text-sm">Box with packaging</p>
                </div>
              </div>
              <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                Optional
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleBoxSelection(true)}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  hasBox === true
                    ? "border-green-400 bg-green-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="text-4xl">✅</div>
                  <div className="text-center">
                    <p className={`font-semibold ${hasBox === true ? "text-green-700" : "text-gray-900"}`}>
                      Yes, I have it
                    </p>
                    <p className="text-sm text-gray-500 mt-1">+₹200 value</p>
                  </div>
                  {hasBox === true && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => handleBoxSelection(false)}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  hasBox === false
                    ? "border-gray-400 bg-gray-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="text-4xl">❌</div>
                  <div className="text-center">
                    <p className={`font-semibold ${hasBox === false ? "text-gray-700" : "text-gray-900"}`}>
                      No, I don't have it
                    </p>
                    <p className="text-sm text-gray-500 mt-1">No deduction</p>
                  </div>
                  {hasBox === false && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-blue-700 text-sm">
                Having the original invoice and box can significantly increase your device's resale value.
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`w-full font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform flex items-center justify-center group ${
              canContinue
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 hover:shadow-xl hover:scale-[1.02] text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <span className="text-lg">Continue</span>
            {canContinue && (
              <svg className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm sticky top-8">
          <div className="mb-6">
            <h3 className="text-gray-900 font-bold text-lg mb-4">Device Summary</h3>

            <div className="flex items-center space-x-4 mb-6">
              {model.iconUrl && (
                <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center p-2">
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
                <p className="text-gray-900 font-semibold">{model.name}</p>
                <p className="text-gray-500 text-sm">{brand.name}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Base Price</span>
                <span className="text-gray-900 font-medium">₹{model.basePrice.toFixed(0)}</span>
              </div>
              <div className="h-px bg-gray-200"></div>

              {evaluationData.functionalIssueIds.length > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Functional Issues</span>
                    <span className="text-red-500 font-medium">{evaluationData.functionalIssueIds.length} selected</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                </>
              )}
            </div>
          </div>

          {/* Current Step */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-gray-900 font-semibold mb-3">Accessories</h4>
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Invoice:</span>
                  {hasInvoice === true && <span className="text-green-600 font-medium">Yes (+₹500)</span>}
                  {hasInvoice === false && <span className="text-orange-600 font-medium">No</span>}
                  {hasInvoice === null && <span className="text-gray-400">Not selected</span>}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Original Box:</span>
                  {hasBox ? <span className="text-green-600 font-medium">Yes (+₹200)</span> : <span className="text-gray-400">No</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h4 className="text-gray-900 font-semibold mb-3">Progress</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-green-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Power Status
              </div>
              <div className="flex items-center text-green-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                System Configuration
              </div>
              <div className="flex items-center text-green-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Functional Issues
              </div>
              <div className="flex items-center text-cyan-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                Accessories
              </div>
              <div className="flex items-center text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Device Age
              </div>
              <div className="flex items-center text-gray-400">
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

export default AccessoriesStep;
