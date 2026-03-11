"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import apiService from "@/services/api";

export default function LaptopConditionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [allConditionOptions, setAllConditionOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConditionOptions() {
      try {
        setLoading(true);
        const response = await apiService.getConditionMultipliers();
        if (response.success && response.data) {
          const mappedConditions = response.data.map((condition: any) => ({
            id: condition.conditionCode,
            title: condition.conditionLabel,
            description: `${condition.multiplierPercentage}% of base value`,
            requiresInvoice: condition.requiresInvoice,
            minAge: condition.minDeviceAgeMonths || 0,
            apiId: condition.id,
          }));
          setAllConditionOptions(mappedConditions);
        } else {
          setError(response.message || 'Failed to load condition options');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load condition options');
      } finally {
        setLoading(false);
      }
    }
    fetchConditionOptions();
  }, []);

  const canContinue = selectedCondition !== null;

  const powerStatus = searchParams.get("power") ?? "yes";
  const processor = searchParams.get("processor");
  const ram = searchParams.get("ram");
  const storage = searchParams.get("storage");
  const screenSize = searchParams.get("screenSize");
  const graphics = searchParams.get("graphics");
  const touchScreen = searchParams.get("touchScreen");
  const issues = searchParams.get("issues");
  const hasInvoice = searchParams.get("hasInvoice");
  const hasOriginalBox = searchParams.get("hasOriginalBox");
  const deviceAge = searchParams.get("age"); // device-age page passes 'age' parameter

  // Filter options based on device age
  const conditionOptions = useMemo(() => {
    // If device age is "lt-1" (less than 1 year), show all 4 options including "Like New"
    if (deviceAge === "lt-1") {
      return allConditionOptions;
    }
    // If invoice=No (coming directly from accessories) OR age is "1-3" or "gt-3", show only 3 options (exclude "Like New")
    return allConditionOptions.filter(opt => opt.id !== "like-new");
  }, [deviceAge, allConditionOptions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading condition options...</p>
          </div>
        </div>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-8 lg:gap-10 items-start">
          {/* Left column: condition selection */}
          <section className="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-[0_18px_60px_rgba(15,23,42,0.9)] p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-y-0 -right-40 w-80 bg-gradient-to-bl from-purple-500/20 via-pink-500/0 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute -top-32 -left-24 h-56 w-56 bg-purple-500/10 blur-3xl pointer-events-none" />

            <header className="relative flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
                  Step {hasInvoice === "Yes" ? "7" : "6"} • Physical condition
                </p>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  How is your
                  <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-rose-200 bg-clip-text text-transparent">
                    Laptop Condition?
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px]">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Select the condition that best matches.
                </span>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {conditionOptions.map((opt) => {
                const selected = selectedCondition === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedCondition(opt.id)}
                    className={`group flex flex-col items-start justify-between rounded-2xl border px-4 py-4 text-left transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-2xl hover:border-purple-400/70 hover:bg-slate-800/80 ${
                      selected
                        ? "border-purple-400 bg-purple-500/10 text-purple-100 shadow-[0_0_0_1px_rgba(168,85,247,0.6)]"
                        : "border-slate-700 bg-slate-900/70 text-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-3">
                      <h3 className="text-sm sm:text-base font-semibold">
                        {opt.title}
                      </h3>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                          selected
                            ? "border-purple-400 bg-purple-400 text-slate-950"
                            : "border-slate-500 text-slate-400 group-hover:border-purple-300 group-hover:text-purple-200"
                        }`}
                      >
                        {selected ? "✓" : ""}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 group-hover:text-slate-300">
                      {opt.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="relative mt-8 flex flex-col items-center justify-between gap-3 text-xs sm:flex-row sm:text-sm text-slate-400">
              <p>
                Physical condition affects your device's valuation.
              </p>
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => {
                  if (!selectedCondition) return;
                  setIsMobileDialogOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 shadow-lg shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-40 hover:shadow-purple-400/60 disabled:hover:shadow-purple-500/40"
              >
                <span>Continue</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M13 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </section>

          {/* Right column: summary */}
          <aside className="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-[0_18px_60px_rgba(15,23,42,0.9)] p-5 sm:p-6 flex flex-col gap-5">
            <header className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
              <div className="relative h-14 w-20 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/Samsung.png"
                  alt="Galaxy Book Go Series"
                  width={96}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-1">
                  Device evaluation
                </p>
                <h2 className="text-sm sm:text-base font-semibold">
                  Galaxy Book Go Series
                </h2>
                <p className="text-[11px] text-slate-400">
                  Windows • Samsung laptop
                </p>
              </div>
            </header>

            <div className="space-y-3 text-xs sm:text-sm">
              {deviceAge && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Device Age</span>
                  <span className="font-semibold text-slate-100">
                    {deviceAge === "lt-1" ? "Less than 1 year" :
                     deviceAge === "1-3" ? "Between 1 and 3 years" :
                     deviceAge === "gt-3" ? "More than 3 years" : deviceAge}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Laptop Condition</span>
                <span className="font-semibold text-slate-100 text-right max-w-[60%]">
                  {selectedCondition ? 
                    conditionOptions.find(opt => opt.id === selectedCondition)?.title.split(' - ')[0] ?? "Not selected" 
                    : "Not selected"}
                </span>
              </div>
            </div>

            <div className="mt-auto pt-3 border-t border-slate-800/80 text-[11px] sm:text-xs text-slate-400 space-y-2">
              <p>
                {conditionOptions.length === 4 
                  ? "All 4 condition options are available (device is less than 1 year old with invoice)."
                  : "3 condition options available (Like New excluded)."}
              </p>
              <p className="flex items-center gap-2">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-purple-400" />
                Be honest for accurate valuation.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />

      {isMobileDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => {
              setIsMobileDialogOpen(false);
              setMobileError("");
            }}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl">
            <div className="absolute -top-16 -right-10 h-32 w-32 bg-purple-500/20 blur-3xl" />
            <header className="relative mb-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-1">
                One last step
              </p>
              <h2 className="text-xl font-semibold tracking-tight">
                Enter your mobile number
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                We will use this to share your device price and help you complete the sale.
              </p>
            </header>

            <div className="relative mb-4 flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-300" htmlFor="mobile-number">
                Mobile number
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 focus-within:border-purple-400 focus-within:bg-slate-900">
                <span className="text-xs text-slate-400">+91</span>
                <input
                  id="mobile-number"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                  placeholder="Enter your 10-digit mobile number"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value.replace(/[^0-9]/g, ""));
                    if (mobileError) setMobileError("");
                  }}
                />
              </div>
              {mobileError && (
                <p className="text-[11px] text-rose-400">{mobileError}</p>
              )}
              <p className="text-[11px] text-slate-500">
                By continuing, you agree to be contacted on this number regarding your device valuation.
              </p>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsMobileDialogOpen(false);
                  setMobileError("");
                }}
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs sm:text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!mobileNumber || mobileNumber.length !== 10) {
                    setMobileError("Please enter a valid 10-digit mobile number.");
                    return;
                  }

                  if (!selectedCondition) return;

                  const params = new URLSearchParams({
                    power: powerStatus,
                    processor: processor ?? "",
                    ram: ram ?? "",
                    storage: storage ?? "",
                    screenSize: screenSize ?? "",
                    graphics: graphics ?? "",
                    touchScreen: touchScreen ?? "",
                    issues: issues ?? "",
                    hasInvoice: hasInvoice ?? "",
                    hasOriginalBox: hasOriginalBox ?? "",
                    deviceAge: deviceAge ?? "",
                    laptopCondition: selectedCondition,
                    mobileNumber,
                  });

                  router.push(
                    `/sell/windows/laptop/samsung/galaxy-book-go-series/price-summary?${params.toString()}`
                  );
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 shadow-lg shadow-purple-500/40 hover:shadow-purple-400/60"
              >
                Get Price
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
