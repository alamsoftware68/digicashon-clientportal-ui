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

interface FunctionalIssue {
  id: number;
  issueCode: string;
  issueLabel: string;
  priceDeduction: number;
  severity: string;
  displayOrder: number;
  enabled: boolean;
}

interface FunctionalIssuesStepProps {
  model: BrandModel;
  brand: Brand;
  evaluationData: EvaluationData;
  onUpdate: (issueIds: number[]) => void;
  onContinue: () => void;
}

const getIssueEmoji = (issueCode: string): string => {
  const emojiMap: { [key: string]: string } = {
    "keyboard-issue": "⌨️",
    "trackpad-issue": "🖱️",
    "battery-issue": "🔋",
    "screen-issue": "📺",
    "speaker-issue": "🔊",
    "camera-issue": "📷",
    "wifi-issue": "📡",
    "bluetooth-issue": "🔵",
    "port-issue": "🔌",
    "overheating": "🔥",
    "cd-dvd-issue": "💿",
    "hinge-issue": "🔧",
  };
  return emojiMap[issueCode] || "⚠️";
};

const FunctionalIssuesStep: React.FC<FunctionalIssuesStepProps> = ({
  model,
  brand,
  evaluationData,
  onUpdate,
  onContinue,
}) => {
  const [issues, setIssues] = useState<FunctionalIssue[]>([]);
  const [selectedIssues, setSelectedIssues] = useState<number[]>(
    evaluationData.functionalIssueIds
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const response = await apiService.getFunctionalIssues();
        if (response.success && response.data) {
          const sortedIssues = response.data.sort(
            (a, b) => a.displayOrder - b.displayOrder
          );
          setIssues(sortedIssues);
        }
      } catch (error) {
        console.error("Error fetching functional issues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleIssueToggle = (issueId: number) => {
    let updatedIssues: number[];
    if (selectedIssues.includes(issueId)) {
      updatedIssues = selectedIssues.filter((id) => id !== issueId);
    } else {
      updatedIssues = [...selectedIssues, issueId];
    }
    setSelectedIssues(updatedIssues);
    onUpdate(updatedIssues);
  };

  const getSelectedIssuesLabels = (): string[] => {
    return selectedIssues
      .map((id) => issues.find((issue) => issue.id === id)?.issueLabel)
      .filter((label): label is string => label !== undefined);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          {/* Progress Indicator */}
          <div className="mb-6">
            <p className="text-cyan-600 text-sm font-semibold tracking-wide uppercase">
              Step 4 • Functional Condition
            </p>
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full w-1/2"></div>
            </div>
          </div>

          {/* Question Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Does your device function properly?
            </h2>
            <p className="text-gray-500 text-base">
              Select any issues your device has. You can select multiple issues or skip if there are none.
            </p>
          </div>

          {/* Issues Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {issues.map((issue) => {
              const isSelected = selectedIssues.includes(issue.id);
              return (
                <button
                  key={issue.id}
                  onClick={() => handleIssueToggle(issue.id)}
                  className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`text-4xl flex-shrink-0 transition-transform duration-300 ${
                        isSelected ? "scale-110" : ""
                      }`}
                    >
                      {getIssueEmoji(issue.issueCode)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold mb-1 transition-colors ${
                          isSelected ? "text-cyan-700" : "text-gray-900"
                        }`}
                      >
                        {issue.issueLabel}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        -₹{issue.priceDeduction.toFixed(0)} deduction
                      </p>
                    </div>

                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-blue-700 text-sm">
                Selecting issues will affect your final price. Be honest to ensure accurate valuation.
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center group"
          >
            <span className="text-lg">
              {selectedIssues.length > 0 ? "Continue with Issues" : "No Issues - Continue"}
            </span>
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
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm sticky top-8">
          {/* Device Summary */}
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
                <span className="text-gray-500">Category</span>
                <span className="text-gray-900 font-medium">{evaluationData.superCategory}</span>
              </div>
              <div className="h-px bg-gray-200"></div>

              <div className="flex justify-between">
                <span className="text-gray-500">Base Price</span>
                <span className="text-gray-900 font-medium">₹{model.basePrice.toFixed(0)}</span>
              </div>

              {evaluationData.processorId && (
                <>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Configuration</span>
                    <span className="text-cyan-600 font-medium">Selected ✓</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Current Step */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-gray-900 font-semibold mb-3">Current Step</h4>
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
              <p className="text-cyan-700 font-medium mb-2">Functional Issues</p>
              {selectedIssues.length === 0 ? (
                <p className="text-gray-500 text-sm">No issues selected</p>
              ) : (
                <ul className="space-y-1">
                  {getSelectedIssuesLabels().map((label, idx) => (
                    <li key={idx} className="text-gray-600 text-sm flex items-center">
                      <span className="text-red-400 mr-2">•</span>
                      {label}
                    </li>
                  ))}
                </ul>
              )}
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
              <div className="flex items-center text-cyan-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                Functional Issues
              </div>
              <div className="flex items-center text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Accessories
              </div>
              <div className="flex items-center text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Device Age & Condition
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionalIssuesStep;
