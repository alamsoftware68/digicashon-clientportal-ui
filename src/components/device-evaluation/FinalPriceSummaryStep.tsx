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

interface PriceCalculationResult {
  id: number;
  userId: number;
  superCategory: string;
  category: string;
  brandId: number;
  brandName: string;
  brandModelId: number;
  brandModelName: string;
  processorId: number;
  processorName: string;
  graphicsId?: number;
  graphicsName?: string;
  ramId: number;
  ramLabel: string;
  storageId: number;
  storageLabel: string;
  screenSizeId?: number;
  screenSizeLabel?: string;
  conditionCode: string;
  hasInvoice: boolean;
  hasBox: boolean;
  ageCode: string;
  ageMonths?: number;
  functionalIssues: {
    issueId: number;
    issueCode: string;
    issueLabel: string;
    priceDeduction: number;
    severity: string;
  }[];
  priceBreakdown: {
    basePrice: number;
    specImpact: number;
    conditionMultiplier: number;
    ageDepreciation: number;
    issueDeductions: number;
    invoicePremium: number;
    boxPremium: number;
    processingFee: number;
  };
  finalPrice: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface FinalPriceSummaryStepProps {
  evaluationData: EvaluationData;
  model: BrandModel;
  brand: Brand;
}

const FinalPriceSummaryStep: React.FC<FinalPriceSummaryStepProps> = ({
  evaluationData,
  model,
  brand,
}) => {
  const [priceData, setPriceData] = useState<PriceCalculationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const calculatePrice = async () => {
      try {
        setLoading(true);
        setError("");

        // Prepare request data
        const requestData = {
          userId: 1, // TODO: Get from auth context
          superCategory: evaluationData.superCategory,
          category: evaluationData.superCategory, // For now, same as superCategory
          brandId: evaluationData.brandId,
          brandModelId: evaluationData.brandModelId,
          processorId: evaluationData.processorId!,
          graphicsId: evaluationData.graphicsId || undefined,
          ramId: evaluationData.ramId!,
          storageId: evaluationData.storageId!,
          screenSizeId: evaluationData.screenSizeId || undefined,
          conditionCode: evaluationData.conditionCode!,
          hasInvoice: evaluationData.hasInvoice,
          hasBox: evaluationData.hasBox,
          ageCode: evaluationData.ageCode!,
          functionalIssueIds: evaluationData.functionalIssueIds,
          notes: `Customer mobile: ${evaluationData.mobileNumber}`,
        };

        console.log("Sending price calculation request:", requestData);

        // Call price calculation API
        const response = await apiService.calculateDevicePrice(requestData);

        if (response.success && response.data) {
          console.log("Price calculation response:", response.data);
          setPriceData(response.data);
        } else {
          console.error("Price calculation failed:", response);
          setError(response.message || "Failed to calculate price");
        }
      } catch (err: any) {
        console.error("Error calculating price:", err);
        setError("An error occurred while calculating the price");
      } finally {
        setLoading(false);
      }
    };

    calculatePrice();
  }, [evaluationData]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedSlot) {
      alert("Please select address and pickup slot");
      return;
    }

    setPlacingOrder(true);
    // TODO: Implement order placement API call
    setTimeout(() => {
      alert("Order placed successfully! We will contact you soon.");
      setPlacingOrder(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400 mb-4"></div>
        <p className="text-white text-lg">Calculating your device price...</p>
      </div>
    );
  }

  if (error || !priceData) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h3 className="text-white text-2xl font-bold mb-2">Error Calculating Price</h3>
        <p className="text-gray-400 mb-6">{error || "Unable to calculate price"}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content - Left Side (2 columns on large screens) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Final Price Card */}
        <div className="bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 rounded-3xl p-8 shadow-2xl border border-cyan-400">
          <div className="text-center">
            <p className="text-white/80 text-sm font-semibold uppercase tracking-wide mb-2">
              Estimated Selling Price
            </p>
            <div className="text-6xl font-bold text-white mb-4">
              ₹{priceData.finalPrice.toLocaleString()}
            </div>
            <p className="text-white/90 text-base">
              For your {brand.name} {model.name}
            </p>
          </div>
        </div>

        {/* Device Configuration Summary */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700">
          <h3 className="text-white font-bold text-2xl mb-6">Device Configuration</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/30 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Brand & Model</p>
              <p className="text-white font-semibold">{priceData.brandName} {priceData.brandModelName}</p>
            </div>

            <div className="bg-gray-700/30 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Processor</p>
              <p className="text-white font-semibold">{priceData.processorName}</p>
            </div>

            {priceData.graphicsName && (
              <div className="bg-gray-700/30 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Graphics Card</p>
                <p className="text-white font-semibold">{priceData.graphicsName}</p>
              </div>
            )}

            <div className="bg-gray-700/30 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">RAM</p>
              <p className="text-white font-semibold">{priceData.ramLabel}</p>
            </div>

            <div className="bg-gray-700/30 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Storage</p>
              <p className="text-white font-semibold">{priceData.storageLabel}</p>
            </div>

            {priceData.screenSizeLabel && (
              <div className="bg-gray-700/30 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Screen Size</p>
                <p className="text-white font-semibold">{priceData.screenSizeLabel}</p>
              </div>
            )}
          </div>

          {/* Functional Issues */}
          {priceData.functionalIssues && priceData.functionalIssues.length > 0 && (
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3">Functional Issues</h4>
              <div className="space-y-2">
                {priceData.functionalIssues.map((issue) => (
                  <div key={issue.issueId} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex justify-between items-center">
                    <span className="text-red-300 text-sm">{issue.issueLabel}</span>
                    <span className="text-red-400 text-sm font-semibold">-₹{issue.priceDeduction}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accessories */}
          <div className="mt-6">
            <h4 className="text-white font-semibold mb-3">Accessories</h4>
            <div className="flex space-x-4">
              <div className={`flex-1 ${priceData.hasInvoice ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-700/30 border-gray-600'} border rounded-xl p-3 text-center`}>
                <p className={`text-sm ${priceData.hasInvoice ? 'text-green-300' : 'text-gray-400'}`}>
                  Invoice: {priceData.hasInvoice ? '✓ Yes' : '✗ No'}
                </p>
              </div>
              <div className={`flex-1 ${priceData.hasBox ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-700/30 border-gray-600'} border rounded-xl p-3 text-center`}>
                <p className={`text-sm ${priceData.hasBox ? 'text-green-300' : 'text-gray-400'}`}>
                  Box: {priceData.hasBox ? '✓ Yes' : '✗ No'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700">
          <h3 className="text-white font-bold text-2xl mb-6">Price Breakdown</h3>

          <div className="space-y-3">
            {priceData.priceBreakdown.specImpact !== 0 && (
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-300">Specification Impact</span>
                <span className={`font-semibold ${priceData.priceBreakdown.specImpact > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {priceData.priceBreakdown.specImpact > 0 ? '+' : ''}₹{priceData.priceBreakdown.specImpact.toLocaleString()}
                </span>
              </div>
            )}

            {priceData.priceBreakdown.conditionMultiplier !== 1 && (
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-300">Condition Adjustment ({(priceData.priceBreakdown.conditionMultiplier * 100).toFixed(0)}%)</span>
                <span className="text-orange-400 font-semibold">Applied</span>
              </div>
            )}

            {priceData.priceBreakdown.ageDepreciation !== 0 && priceData.priceBreakdown.ageDepreciation !== 1 && (
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-300">Age Depreciation ({(priceData.priceBreakdown.ageDepreciation * 100).toFixed(0)}%)</span>
                <span className="text-orange-400 font-semibold">Applied</span>
              </div>
            )}

            {priceData.priceBreakdown.issueDeductions !== 0 && (
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-300">Issue Deductions</span>
                <span className="text-red-400 font-semibold">-₹{Math.abs(priceData.priceBreakdown.issueDeductions).toLocaleString()}</span>
              </div>
            )}

            {priceData.priceBreakdown.invoicePremium !== 0 && (
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-300">Invoice Premium</span>
                <span className="text-green-400 font-semibold">+₹{priceData.priceBreakdown.invoicePremium.toLocaleString()}</span>
              </div>
            )}

            {priceData.priceBreakdown.boxPremium !== 0 && (
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-300">Box Premium</span>
                <span className="text-green-400 font-semibold">+₹{priceData.priceBreakdown.boxPremium.toLocaleString()}</span>
              </div>
            )}

            {priceData.priceBreakdown.processingFee !== 0 && (
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-300">Processing Fee</span>
                <span className="text-red-400 font-semibold">-₹{Math.abs(priceData.priceBreakdown.processingFee).toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-3">
              <span className="text-white font-bold text-lg">Final Price</span>
              <span className="text-cyan-400 font-bold text-2xl">₹{priceData.finalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Address & Pickup */}
      <div className="lg:col-span-1 space-y-6">
        {/* Contact Info */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-700">
          <h4 className="text-white font-semibold text-lg mb-4">Contact Information</h4>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Mobile Number</p>
            <p className="text-white font-semibold">+91 {evaluationData.mobileNumber}</p>
          </div>
        </div>

        {/* Address Selection */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-700">
          <h4 className="text-white font-semibold text-lg mb-4">📍 Pickup Address</h4>

          <div className="space-y-3">
            <button
              onClick={() => setSelectedAddress("home")}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedAddress === "home"
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-gray-600 bg-gray-700/30 hover:border-gray-500"
              }`}
            >
              <p className="text-white font-medium">Home Address</p>
              <p className="text-gray-400 text-sm mt-1">123 Main Street, City</p>
            </button>

            <button
              onClick={() => setSelectedAddress("office")}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedAddress === "office"
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-gray-600 bg-gray-700/30 hover:border-gray-500"
              }`}
            >
              <p className="text-white font-medium">Office Address</p>
              <p className="text-gray-400 text-sm mt-1">456 Business Park, City</p>
            </button>

            <button className="w-full p-4 rounded-xl border-2 border-dashed border-gray-600 hover:border-cyan-400 transition-colors text-cyan-400 text-center">
              + Add New Address
            </button>
          </div>
        </div>

        {/* Pickup Slot */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-700">
          <h4 className="text-white font-semibold text-lg mb-4">📅 Pickup Slot</h4>

          <div className="space-y-3">
            <button
              onClick={() => setSelectedSlot("tomorrow-morning")}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedSlot === "tomorrow-morning"
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-gray-600 bg-gray-700/30 hover:border-gray-500"
              }`}
            >
              <p className="text-white font-medium">Tomorrow Morning</p>
              <p className="text-gray-400 text-sm mt-1">9:00 AM - 12:00 PM</p>
            </button>

            <button
              onClick={() => setSelectedSlot("tomorrow-afternoon")}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedSlot === "tomorrow-afternoon"
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-gray-600 bg-gray-700/30 hover:border-gray-500"
              }`}
            >
              <p className="text-white font-medium">Tomorrow Afternoon</p>
              <p className="text-gray-400 text-sm mt-1">2:00 PM - 5:00 PM</p>
            </button>

            <button
              onClick={() => setSelectedSlot("weekend")}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedSlot === "weekend"
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-gray-600 bg-gray-700/30 hover:border-gray-500"
              }`}
            >
              <p className="text-white font-medium">This Weekend</p>
              <p className="text-gray-400 text-sm mt-1">Saturday/Sunday</p>
            </button>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={!selectedAddress || !selectedSlot || placingOrder}
          className={`w-full font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform flex items-center justify-center ${
            selectedAddress && selectedSlot && !placingOrder
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 hover:shadow-xl hover:scale-105 text-white"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          {placingOrder ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              <span>Placing Order...</span>
            </>
          ) : (
            <>
              <span className="text-lg">Place Order</span>
              <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>

        {(!selectedAddress || !selectedSlot) && (
          <p className="text-center text-gray-400 text-sm">
            Please select address and pickup slot to continue
          </p>
        )}
      </div>
    </div>
  );
};

export default FinalPriceSummaryStep;
