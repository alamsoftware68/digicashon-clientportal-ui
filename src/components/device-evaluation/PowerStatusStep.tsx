"use client";

import React, { useState } from "react";
import Image from "next/image";

interface PowerStatusStepProps {
  model: {
    id: number;
    name: string;
    basePrice: number;
    iconUrl: string | null;
  };
  brand: {
    id: number;
    name: string;
    brandType: string;
    iconUrl: string | null;
  };
  evaluationData: any;
  onAnswer: (answer: boolean) => void;
}

const PowerStatusStep: React.FC<PowerStatusStepProps> = ({
  model,
  brand,
  evaluationData,
  onAnswer,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showDeadDeviceModal, setShowDeadDeviceModal] = useState(false);

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    if (!answer) {
      // Show dead device modal
      setShowDeadDeviceModal(true);
    } else {
      // Continue to next step
      setTimeout(() => {
        onAnswer(answer);
      }, 300);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Question */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-10 border border-gray-700">
              {/* Step Header */}
              <div className="mb-8">
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-2 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-cyan-500 text-white text-xs font-bold flex items-center justify-center mr-3">
                    1
                  </span>
                  STEP 1 • DEVICE HEALTH
                </p>
                <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                  <div className="w-1/8 h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></div>
                </div>
              </div>

              {/* Question */}
              <h1 className="text-white text-4xl font-bold mb-2">
                Does your laptop
              </h1>
              <h1 className="text-cyan-400 text-4xl font-bold mb-8">
                switch on normally?
              </h1>

              {/* Answer Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => handleAnswer(true)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    selectedAnswer === true
                      ? "border-cyan-500 bg-cyan-500/20"
                      : "border-gray-600 hover:border-gray-500 bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xl font-semibold">Yes</span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 ${
                        selectedAnswer === true
                          ? "border-cyan-500 bg-cyan-500"
                          : "border-gray-500"
                      } flex items-center justify-center`}
                    >
                      {selectedAnswer === true && (
                        <div className="w-3 h-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleAnswer(false)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    selectedAnswer === false
                      ? "border-red-500 bg-red-500/20"
                      : "border-gray-600 hover:border-gray-500 bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xl font-semibold">No</span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 ${
                        selectedAnswer === false
                          ? "border-red-500 bg-red-500"
                          : "border-gray-500"
                      } flex items-center justify-center`}
                    >
                      {selectedAnswer === false && (
                        <div className="w-3 h-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </button>
              </div>

              {/* Helper Text */}
              <div className="flex items-start bg-gray-800/50 rounded-xl p-4 border border-gray-700">
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
                <p className="text-gray-300 text-sm">
                  Your answers only affect pricing – they do not create any obligation
                  to sell.
                </p>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                <button className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors">
                  Back to summary
                </button>
                <button
                  disabled={selectedAnswer === null}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                    selectedAnswer !== null
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Device Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 border border-gray-700 sticky top-8">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-4">
                DEVICE EVALUATION
              </p>

              {/* Device Info */}
              <div className="flex items-center mb-6">
                {brand.iconUrl && (
                  <div className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center mr-4 p-2">
                    <Image
                      src={brand.iconUrl}
                      alt={brand.name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-white font-bold text-lg">{model.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {brand.brandType} • {brand.name} laptop
                  </p>
                </div>
              </div>

              {/* Starting Estimate */}
              <div className="border-t border-gray-700 pt-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Starting estimate</span>
                  <span className="text-cyan-400 text-xl font-bold">
                    ₹{evaluationData.basePrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Current Step */}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Current step</span>
                  <span className="text-white font-semibold">Power status</span>
                </div>
              </div>

              {/* Next Steps Info */}
              <div className="mt-6 bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <p className="text-gray-300 text-xs leading-relaxed">
                  Next, we'll ask about display condition, body condition, and
                  accessories to finalize your quote.
                </p>
                <p className="text-cyan-400 text-xs mt-2">
                  • Honest answers help us keep offers accurate and transparent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dead Device Modal */}
      {showDeadDeviceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-white text-2xl font-bold mb-3">
                Sorry, we can't proceed
              </h3>
              <p className="text-gray-300 text-base mb-6">
                We don't deal with dead laptops. Please contact our customer service
                for alternative options.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    /* Redirect to contact support */
                    window.location.href = "tel:+918888888888";
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                >
                  Contact Support
                </button>
                <button
                  onClick={() => setShowDeadDeviceModal(false)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PowerStatusStep;
