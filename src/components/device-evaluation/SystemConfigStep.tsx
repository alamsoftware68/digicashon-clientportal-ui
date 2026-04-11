"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import apiService from "@/services/api";

interface SystemConfigStepProps {
  model: any;
  brand: any;
  evaluationData: any;
  onUpdate: (updates: any) => void;
  onContinue: () => void;
}

const SystemConfigStep: React.FC<SystemConfigStepProps> = ({
  model,
  brand,
  evaluationData,
  onUpdate,
  onContinue,
}) => {
  const [processors, setProcessors] = useState<any[]>([]);
  const [graphics, setGraphics] = useState<any[]>([]);
  const [ramOptions, setRamOptions] = useState<any[]>([]);
  const [storageOptions, setStorageOptions] = useState<any[]>([]);
  const [screenSizes, setScreenSizes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selections, setSelections] = useState({
    processorId: null as number | null,
    graphicsId: null as number | null,
    ramId: null as number | null,
    storageId: null as number | null,
    screenSizeId: null as number | null,
    hasTouchScreen: false,
  });

  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        setLoading(true);
        const [procResp, graphResp, ramResp, storResp, screenResp] =
          await Promise.all([
            apiService.getProcessors(),
            apiService.getGraphicsCards(),
            apiService.getRamOptions(),
            apiService.getStorageOptions(),
            apiService.getScreenSizes(),
          ]);

        if (procResp.success) setProcessors(procResp.data || []);
        if (graphResp.success) setGraphics(graphResp.data || []);
        if (ramResp.success) setRamOptions(ramResp.data || []);
        if (storResp.success) setStorageOptions(storResp.data || []);
        if (screenResp.success) setScreenSizes(screenResp.data || []);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigurations();
  }, []);

  const handleContinue = () => {
    if (selections.processorId && selections.ramId && selections.storageId) {
      onUpdate(selections);
      onContinue();
    }
  };

  const isFormValid =
    selections.processorId && selections.ramId && selections.storageId;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side - Configuration Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-sm">
            {/* Step Header */}
            <div className="mb-8">
              <p className="text-gray-500 text-sm uppercase tracking-wider mb-2 flex items-center">
                <span className="w-8 h-8 rounded-full bg-cyan-500 text-white text-xs font-bold flex items-center justify-center mr-3">
                  2
                </span>
                STEP 2 • SYSTEM CONFIGURATION
              </p>
              <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden mb-4">
                <div className="w-1/4 h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="text-gray-900 text-3xl font-bold">System</h1>
                <div className="bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                  <p className="text-cyan-600 text-xs">
                    • Honest answers help us show the best value.
                  </p>
                </div>
              </div>
              <h1 className="text-gray-900 text-3xl font-bold mb-2">Configuration</h1>
              <h1 className="text-cyan-600 text-3xl font-bold">Details</h1>
            </div>

            {/* Processor Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-900 font-semibold">Processor</label>
                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                  CPU
                </span>
              </div>
              <select
                value={selections.processorId || ""}
                onChange={(e) =>
                  setSelections((prev) => ({
                    ...prev,
                    processorId: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="">Select processor...</option>
                {processors.map((proc) => (
                  <option key={proc.id} value={proc.id}>
                    {proc.processorName} - {proc.brand} {proc.generation}
                  </option>
                ))}
              </select>
            </div>

            {/* Graphics Card Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-900 font-semibold">Graphics Card</label>
                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                  GPU
                </span>
              </div>
              <select
                value={selections.graphicsId || ""}
                onChange={(e) =>
                  setSelections((prev) => ({
                    ...prev,
                    graphicsId: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="">Select graphics card...</option>
                {graphics.map((graph) => (
                  <option key={graph.id} value={graph.id}>
                    {graph.graphicsName} - {graph.vramGb}GB
                  </option>
                ))}
              </select>
            </div>

            {/* Screen Size Selection */}
            {screenSizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-gray-900 font-semibold">Screen Size</label>
                  <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                    Display
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {screenSizes.map((screen) => (
                    <button
                      key={screen.id}
                      onClick={() =>
                        setSelections((prev) => ({ ...prev, screenSizeId: screen.id }))
                      }
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selections.screenSizeId === screen.id
                          ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <p className="text-sm font-semibold">{screen.sizeLabel}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Touch Screen Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-900 font-semibold">Touch Screen</label>
                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                  Touch
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    setSelections((prev) => ({ ...prev, hasTouchScreen: true }))
                  }
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selections.hasTouchScreen
                      ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold">Touch</p>
                </button>
                <button
                  onClick={() =>
                    setSelections((prev) => ({ ...prev, hasTouchScreen: false }))
                  }
                  className={`p-4 rounded-xl border-2 transition-all ${
                    !selections.hasTouchScreen
                      ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold">Non-Touch</p>
                </button>
              </div>
            </div>

            {/* RAM Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-900 font-semibold">RAM</label>
                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                  Memory
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ramOptions.map((ram) => (
                  <button
                    key={ram.id}
                    onClick={() =>
                      setSelections((prev) => ({ ...prev, ramId: ram.id }))
                    }
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selections.ramId === ram.id
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <p className="text-sm font-semibold">{ram.capacityLabel}</p>
                  </button>
                ))}
                <button className="p-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300 transition-all">
                  <p className="text-sm font-semibold">Other</p>
                </button>
              </div>
            </div>

            {/* Storage Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-900 font-semibold">Hard Disk / SSD</label>
                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                  Storage
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {storageOptions.map((storage) => (
                  <button
                    key={storage.id}
                    onClick={() =>
                      setSelections((prev) => ({ ...prev, storageId: storage.id }))
                    }
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selections.storageId === storage.id
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <p className="text-sm font-semibold">{storage.storageLabel}</p>
                  </button>
                ))}
                <button className="p-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300 transition-all">
                  <p className="text-sm font-semibold">Other</p>
                </button>
              </div>
            </div>

            {/* Status Message */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-6">
              <p className="text-gray-600 text-sm">
                {isFormValid
                  ? "✓ All required details collected. Ready to continue!"
                  : "Please select Processor, RAM, and Storage to continue."}
              </p>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!isFormValid}
              className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center ${
                isFormValid
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <span className="text-lg">Continue</span>
              <svg
                className="w-5 h-5 ml-2"
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

        {/* Right Side - Device Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm sticky top-8">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">
              DEVICE EVALUATION
            </p>

            {/* Device Info */}
            <div className="flex items-center mb-6">
              {brand.iconUrl && (
                <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mr-4 p-2">
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
                <h3 className="text-gray-900 font-bold text-lg">{model.name}</h3>
                <p className="text-gray-500 text-sm">
                  {brand.brandType} • {brand.name} laptop
                </p>
              </div>
            </div>

            {/* Does the laptop switch ON? */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">
                  Does the laptop switch ON?
                </span>
                <span className="text-green-600 text-sm flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  Yes
                </span>
              </div>
            </div>

            {/* Selected Configurations */}
            {selections.processorId && (
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Processor</span>
                  <span className="text-gray-900 text-sm font-medium">
                    {processors.find((p) => p.id === selections.processorId)
                      ?.processorName || "Not selected"}
                  </span>
                </div>
              </div>
            )}

            {selections.ramId && (
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">RAM</span>
                  <span className="text-gray-900 text-sm font-medium">
                    {ramOptions.find((r) => r.id === selections.ramId)
                      ?.capacityLabel || "Not selected"}
                  </span>
                </div>
              </div>
            )}

            {selections.storageId && (
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Hard Disk / SSD</span>
                  <span className="text-gray-900 text-sm font-medium">
                    {storageOptions.find((s) => s.id === selections.storageId)
                      ?.storageLabel || "Not selected"}
                  </span>
                </div>
              </div>
            )}

            {/* Progress Info */}
            <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-cyan-600 text-xs">
                • You're just a couple of taps away from seeing your final value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfigStep;
