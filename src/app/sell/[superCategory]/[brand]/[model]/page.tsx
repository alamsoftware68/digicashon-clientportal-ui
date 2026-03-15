"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import apiService from "@/services/api";
import InitialPriceStep from "@/components/device-evaluation/InitialPriceStep";
import PowerStatusStep from "@/components/device-evaluation/PowerStatusStep";
import SystemConfigStep from "@/components/device-evaluation/SystemConfigStep";
import FunctionalIssuesStep from "@/components/device-evaluation/FunctionalIssuesStep";
import AccessoriesStep from "@/components/device-evaluation/AccessoriesStep";
import DeviceAgeStep from "@/components/device-evaluation/DeviceAgeStep";
import PhysicalConditionStep from "@/components/device-evaluation/PhysicalConditionStep";
import FinalPriceSummaryStep from "@/components/device-evaluation/FinalPriceSummaryStep";

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

// Evaluation steps
type EvaluationStep =
  | "initial-price"
  | "power-status"
  | "system-config"
  | "functional-issues"
  | "accessories"
  | "device-age"
  | "physical-condition"
  | "final-price";

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

const DeviceEvaluationPage = () => {
  const params = useParams();
  const router = useRouter();
  const superCategory = params.superCategory as string;
  const brandSlug = params.brand as string;
  const modelSlug = params.model as string;

  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<EvaluationStep>("initial-price");
  const [brand, setBrand] = useState<Brand | null>(null);
  const [model, setModel] = useState<BrandModel | null>(null);
  const [categoryName, setCategoryName] = useState("");

  const [evaluationData, setEvaluationData] = useState<EvaluationData>({
    superCategory: "",
    brandId: 0,
    brandName: "",
    brandModelId: 0,
    brandModelName: "",
    basePrice: 0,
    powerStatus: null,
    processorId: null,
    graphicsId: null,
    ramId: null,
    storageId: null,
    screenSizeId: null,
    functionalIssueIds: [],
    hasInvoice: false,
    hasBox: false,
    ageCode: null,
    conditionCode: null,
    mobileNumber: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch super categories to get exact name
        const superCategoriesResponse = await apiService.getSuperCategories();
        let exactCategoryName = "";

        if (superCategoriesResponse.success && superCategoriesResponse.data) {
          const matchingSuperCategory = superCategoriesResponse.data.find(
            (cat) => cat.name.toLowerCase().replace(/[\s\/]+/g, "-") === superCategory
          );
          exactCategoryName = matchingSuperCategory?.name || superCategory;
        }

        setCategoryName(exactCategoryName);

        // Fetch brands to get brand details
        const brandsResponse = await apiService.getBrands(exactCategoryName);
        if (brandsResponse.success && brandsResponse.data) {
          const matchingBrand = brandsResponse.data.find(
            (b) => b.name.toLowerCase().replace(/\s+/g, "-") === brandSlug
          );

          if (matchingBrand) {
            setBrand(matchingBrand);

            // Fetch models
            const modelsResponse = await apiService.getBrandModels(matchingBrand.id);
            if (modelsResponse.success && modelsResponse.data) {
              const matchingModel = modelsResponse.data.find(
                (m) => m.name.toLowerCase().replace(/\s+/g, "-") === modelSlug
              );

              if (matchingModel) {
                setModel(matchingModel);
                setEvaluationData((prev) => ({
                  ...prev,
                  superCategory: exactCategoryName,
                  brandId: matchingBrand.id,
                  brandName: matchingBrand.name,
                  brandModelId: matchingModel.id,
                  brandModelName: matchingModel.name,
                  basePrice: matchingModel.basePrice,
                }));
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching device data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (superCategory && brandSlug && modelSlug) {
      fetchData();
    }
  }, [superCategory, brandSlug, modelSlug]);

  const handleBackClick = () => {
    if (currentStep === "initial-price") {
      router.push(`/sell/${superCategory}/${brandSlug}`);
    } else {
      // Navigate to previous step
      const steps: EvaluationStep[] = [
        "initial-price",
        "power-status",
        "system-config",
        "functional-issues",
        "accessories",
        "device-age",
        "physical-condition",
        "final-price",
      ];
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex > 0) {
        setCurrentStep(steps[currentIndex - 1]);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400"></div>
      </div>
    );
  }

  if (!model || !brand) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Model Not Found</h2>
          <p className="text-gray-400 mb-6">
            We couldn't find the device you're looking for.
          </p>
          <button
            onClick={() => router.push(`/sell/${superCategory}/${brandSlug}`)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Models
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* Render current step component */}
        {currentStep === "initial-price" && (
          <InitialPriceStep
            model={model}
            brand={brand}
            onContinue={() => setCurrentStep("power-status")}
          />
        )}

        {currentStep === "power-status" && (
          <PowerStatusStep
            model={model}
            brand={brand}
            evaluationData={evaluationData}
            onAnswer={(answer) => {
              setEvaluationData((prev) => ({ ...prev, powerStatus: answer }));
              if (answer) {
                setCurrentStep("system-config");
              }
              // If false, show popup handled in component
            }}
          />
        )}

        {currentStep === "system-config" && (
          <SystemConfigStep
            model={model}
            brand={brand}
            evaluationData={evaluationData}
            onUpdate={(updates) => setEvaluationData((prev) => ({ ...prev, ...updates }))}
            onContinue={() => setCurrentStep("functional-issues")}
          />
        )}

        {currentStep === "functional-issues" && (
          <FunctionalIssuesStep
            model={model}
            brand={brand}
            evaluationData={evaluationData}
            onUpdate={(issueIds: number[]) =>
              setEvaluationData((prev) => ({ ...prev, functionalIssueIds: issueIds }))
            }
            onContinue={() => setCurrentStep("accessories")}
          />
        )}

        {currentStep === "accessories" && (
          <AccessoriesStep
            model={model}
            brand={brand}
            evaluationData={evaluationData}
            onUpdate={(updates: Partial<EvaluationData>) => setEvaluationData((prev) => ({ ...prev, ...updates }))}
            onContinue={() => setCurrentStep("device-age")}
          />
        )}

        {currentStep === "device-age" && (
          <DeviceAgeStep
            model={model}
            brand={brand}
            evaluationData={evaluationData}
            onSelect={(ageCode: string) => {
              setEvaluationData((prev) => ({ ...prev, ageCode }));
              setCurrentStep("physical-condition");
            }}
          />
        )}

        {currentStep === "physical-condition" && (
          <PhysicalConditionStep
            model={model}
            brand={brand}
            evaluationData={evaluationData}
            onSelect={(conditionCode: string) => {
              setEvaluationData((prev) => ({ ...prev, conditionCode }));
              // Show mobile number modal next
            }}
            onMobileSubmit={(mobile: string) => {
              setEvaluationData((prev) => ({ ...prev, mobileNumber: mobile }));
              setCurrentStep("final-price");
            }}
          />
        )}

        {currentStep === "final-price" && (
          <FinalPriceSummaryStep
            evaluationData={evaluationData}
            model={model}
            brand={brand}
          />
        )}
      </div>
    </div>
  );
};


export default DeviceEvaluationPage;
