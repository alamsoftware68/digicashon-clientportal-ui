"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

// Complete processor list as per requirements
const processorOptions = [
  "Intel Core i3 6th Gen",
  "Intel Core i3 7th Gen",
  "Intel Core i3 8th Gen",
  "Intel Core i3 9th Gen",
  "Intel Core i3 10th Gen",
  "Intel Core i3 11th Gen",
  "Intel Core i3 12th Gen",
  "Intel Core i3 13th Gen",
  "Intel Core i3 14th Gen",
  "Intel Core i5 6th Gen",
  "Intel Core i5 7th Gen",
  "Intel Core i5 8th Gen",
  "Intel Core i5 9th Gen",
  "Intel Core i5 10th Gen",
  "Intel Core i5 11th Gen",
  "Intel Core i5 12th Gen",
  "Intel Core i5 13th Gen",
  "Intel Core i5 14th Gen",
  "Intel Core i7 6th Gen",
  "Intel Core i7 7th Gen",
  "Intel Core i7 8th Gen",
  "Intel Core i7 9th Gen",
  "Intel Core i7 10th Gen",
  "Intel Core i7 11th Gen",
  "Intel Core i7 12th Gen",
  "Intel Core i7 13th Gen",
  "Intel Core i7 14th Gen",
  "Intel Core i9 6th Gen",
  "Intel Core i9 7th Gen",
  "Intel Core i9 8th Gen",
  "Intel Core i9 9th Gen",
  "Intel Core i9 10th Gen",
  "Intel Core i9 11th Gen",
  "Intel Core i9 12th Gen",
  "Intel Core i9 13th Gen",
  "Intel Core i9 14th Gen",
  "Intel Core Ultra 5",
  "Intel Core Ultra 5 2nd Gen",
  "Intel Core Ultra 7",
  "Intel Core Ultra 7 2nd Gen",
];

// Graphics options as per requirements
const graphicsOptions = [
  "No graphics",
  "4 GB Graphic GTX 1650",
  "6 GB Graphic GTX 1660",
  "8 GB Graphic GTX 1680",
  "4 GB Graphic RTX 2050",
  "6 GB Graphic RTX 2060",
  "8 GB Graphic RTX 2070/2080",
  "4 GB Graphic RTX 3050",
  "6 GB Graphic RTX 3060",
  "8 GB Graphic RTX 3070/3080",
  "6 GB Graphic RTX 4050",
  "8 GB Graphic RTX 4060/4070",
  "12 GB Graphic RTX 4080",
  "8 GB Graphic RTX 5050/5060",
  "12 GB Graphic RTX 5070",
  "Radeon RX 5000 Series",
  "Radeon RX 6000 Series",
  "Radeon RX 7000 Series",
];

// Screen size options
const screenSizeOptions = [
  { id: "10-11", label: "10–11 inch" },
  { id: "12-13", label: "12–13 inch" },
  { id: "14-15", label: "14–15 inch" },
  { id: "above-15", label: "Above 15 inch" },
];

const ramOptions = ["4 GB", "8 GB", "16 GB", "32 GB", "Other"];
const allRamOptions = [
  "512 MB",
  "1 GB",
  "1.5 GB",
  "2 GB",
  "3 GB",
  "4 GB",
  "6 GB",
  "8 GB",
  "10 GB",
  "12 GB",
  "16 GB",
  "18 GB",
  "20 GB",
  "24 GB",
  "32 GB",
  "36 GB",
  "48 GB",
  "64 GB",
  "96 GB",
];

const storageOptions = [
  "128 GB SSD",
  "256 GB SSD",
  "512 GB SSD",
  "1 TB SSD",
  "Other",
];
const allStorageOptions = [
  "60 GB HDD",
  "160 GB HDD",
  "80 GB HDD",
  "100 GB HDD",
  "120 GB HDD",
  "200 GB HDD",
  "250 GB HDD",
  "320 GB HDD",
  "500 GB HDD",
  "640 GB HDD",
  "750 GB HDD",
  "1 TB HDD",
  "1.5 GB HDD",
  "2 TB HDD",
  "32 GB SSD",
  "64 GB SSD",
  "128 GB SSD",
  "256 GB SSD",
  "512 GB SSD",
  "1 TB SSD",
  "1.5 TB SSD",
  "2 TB SSD",
  "320 GB + 64 GB SSD",
  "320 GB HDD + 128 GB SSD",
  "320 GB HDD + 256 GB SSD",
  "500 GB HDD + 32 GB SSD",
  "500 GB HDD + 128 GB SSD",
  "500 GB HDD + 256 GB SSD",
  "1 TB HDD + 128 GB SSD",
  "1 TB HDD + 256 GB SSD",
  "1 TB HDD + 512 GB SSD",
  "2 TB HDD + 128 GB SSD",
  "2 TB HDD + 256 GB SSD",
  "2 TB HDD + 512 GB SSD",
];

export default function SystemConfigurationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [processor, setProcessor] = useState<string | null>(null);
  const [graphics, setGraphics] = useState<string | null>(null);
  const [screenSize, setScreenSize] = useState<string | null>(null);
  const [touchScreen, setTouchScreen] = useState<string | null>(null);
  const [ram, setRam] = useState<string | null>(null);
  const [storage, setStorage] = useState<string | null>(null);

  const [showRamModal, setShowRamModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);

  const canContinue = Boolean(
    processor && graphics && screenSize && touchScreen && ram && storage
  );

  const powerStatus = searchParams.get("power") ?? "yes";

  const handleRamQuickSelect = (item: string) => {
    if (item === "Other") {
      setShowRamModal(true);
      return;
    }
    setRam(item);
  };

  const handleStorageQuickSelect = (item: string) => {
    if (item === "Other") {
      setShowStorageModal(true);
      return;
    }
    setStorage(item);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-8 lg:gap-10 items-start">
          {/* Left column: configuration cards */}
          <section className="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-[0_18px_60px_rgba(15,23,42,0.9)] p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-y-0 -right-40 w-80 bg-gradient-to-bl from-cyan-500/20 via-sky-500/0 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute -top-32 -left-24 h-56 w-56 bg-cyan-500/10 blur-3xl pointer-events-none" />

            <header className="relative flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
                  Step 2 • System configuration
                </p>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  System Configuration
                  <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-200 bg-clip-text text-transparent">
                    Details
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="flex h-1.5 w-20 rounded-full bg-slate-800 overflow-hidden">
                    <span className="h-full w-2/3 bg-gradient-to-r from-cyan-400 to-sky-400" />
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px]">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Honest answers help us show the best value.
                </span>
              </div>
            </header>

            {/* Processor Dropdown */}
            <div className="relative mb-6">
              <div className="mb-3 flex items-end justify-between gap-2">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold">
                    Processor
                  </h2>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300">
                  CPU
                </span>
              </div>
              <select
                value={processor ?? ""}
                onChange={(e) => setProcessor(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
              >
                <option value="" disabled>
                  Select processor...
                </option>
                {processorOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Graphics Dropdown */}
            <div className="relative mb-6">
              <div className="mb-3 flex items-end justify-between gap-2">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold">
                    Graphics Card
                  </h2>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300">
                  GPU
                </span>
              </div>
              <select
                value={graphics ?? ""}
                onChange={(e) => setGraphics(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
              >
                <option value="" disabled>
                  Select graphics card...
                </option>
                {graphicsOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Screen Size */}
            <div className="relative mb-6">
              <div className="mb-3 flex items-end justify-between gap-2">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold">
                    Screen Size
                  </h2>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300">
                  Display
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {screenSizeOptions.map((opt) => {
                  const selected = screenSize === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setScreenSize(opt.id)}
                      className={`rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-medium transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400/70 hover:bg-slate-800/80 ${
                        selected
                          ? "border-cyan-400 bg-cyan-500/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.5)]"
                          : "border-slate-700 bg-slate-900/70 text-slate-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Touch / Non-Touch */}
            <div className="relative mb-6">
              <div className="mb-3 flex items-end justify-between gap-2">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold">
                    Touch Screen
                  </h2>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300">
                  Touch
                </span>
              </div>
              <div className="flex gap-3">
                {["Touch", "Non-Touch"].map((item) => {
                  const selected = touchScreen === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTouchScreen(item)}
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400/70 hover:bg-slate-800/80 ${
                        selected
                          ? "border-cyan-400 bg-cyan-500/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.5)]"
                          : "border-slate-700 bg-slate-900/70 text-slate-200"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RAM */}
            <div className="relative mb-6">
              <div className="mb-3 flex items-end justify-between gap-2">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold">RAM</h2>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300">
                  Memory
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {ramOptions.map((item) => {
                  const selected = ram === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleRamQuickSelect(item)}
                      className={`rounded-full border px-4 py-2 text-xs sm:text-sm transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400/70 hover:bg-slate-800/80 ${
                        selected
                          ? "border-cyan-400 bg-cyan-500/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.5)]"
                          : "border-slate-700 bg-slate-900/70 text-slate-200"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Storage */}
            <div className="relative mb-8">
              <div className="mb-3 flex items-end justify-between gap-2">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold">
                    Hard Disk / SSD
                  </h2>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300">
                  Storage
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {storageOptions.map((item) => {
                  const selected = storage === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleStorageQuickSelect(item)}
                      className={`rounded-full border px-4 py-2 text-xs sm:text-sm transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400/70 hover:bg-slate-800/80 ${
                        selected
                          ? "border-cyan-400 bg-cyan-500/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.5)]"
                          : "border-slate-700 bg-slate-900/70 text-slate-200"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative mt-4 flex flex-col items-center justify-between gap-3 text-xs sm:flex-row sm:text-sm text-slate-400">
              <p>All details collected. Ready to move to the next step!</p>
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => {
                  if (
                    !processor ||
                    !graphics ||
                    !screenSize ||
                    !touchScreen ||
                    !ram ||
                    !storage
                  )
                    return;
                  const params = new URLSearchParams({
                    power: powerStatus,
                    processor,
                    graphics,
                    screenSize,
                    touchScreen,
                    ram,
                    storage,
                  });
                  router.push(
                    `/sell/windows/laptop/samsung/galaxy-book-go-series/functional-condition?${params.toString()}`
                  );
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-40 hover:shadow-cyan-400/60 disabled:hover:shadow-cyan-500/40"
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

            {/* RAM modal */}
            {showRamModal && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="relative w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/95 p-6 shadow-[0_22px_80px_rgba(15,23,42,1)]">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
                  <div className="pointer-events-none absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-sky-500/10 blur-3xl" />

                  <div className="relative space-y-4 max-h-[24rem] overflow-y-auto pr-1">
                    <header className="space-y-1 pb-2 border-b border-slate-800/80 mb-2">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        RAM • Full list
                      </p>
                      <h2 className="text-lg font-semibold">
                        Select your RAM capacity
                      </h2>
                      <p className="text-xs text-slate-400">
                        Choose the memory size that matches your laptop for the
                        most accurate pricing.
                      </p>
                    </header>

                    <div className="grid grid-cols-2 gap-2">
                      {allRamOptions.map((item) => {
                        const selected = ram === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setRam(item);
                              setShowRamModal(false);
                            }}
                            className={`flex items-center justify-between gap-2 rounded-2xl border px-3 py-2 text-left text-xs sm:text-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400/70 hover:bg-slate-800/80 ${
                              selected
                                ? "border-cyan-400 bg-cyan-500/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.5)]"
                                : "border-slate-700 bg-slate-900/70 text-slate-200"
                            }`}
                          >
                            <span className="flex-1 truncate">{item}</span>
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] ${
                                selected
                                  ? "border-cyan-400 bg-cyan-400 text-slate-950"
                                  : "border-slate-500 text-slate-400"
                              }`}
                            >
                              {selected ? "●" : ""}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowRamModal(false)}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/80 hover:border-slate-400 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Storage modal */}
            {showStorageModal && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="relative w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900/95 p-6 shadow-[0_22px_80px_rgba(15,23,42,1)]">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-500/25 blur-3xl" />
                  <div className="pointer-events-none absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-cyan-500/15 blur-3xl" />

                  <div className="relative space-y-4 max-h-[26rem] overflow-y-auto pr-1">
                    <header className="space-y-1 pb-2 border-b border-slate-800/80 mb-2">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        Hard Disk / SSD • Full list
                      </p>
                      <h2 className="text-lg font-semibold">
                        Select your storage configuration
                      </h2>
                      <p className="text-xs text-slate-400">
                        Pick the option that best matches your hard disk or SSD
                        setup. Combo options include both HDD and SSD.
                      </p>
                    </header>

                    <div className="space-y-2">
                      {allStorageOptions.map((item) => {
                        const selected = storage === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setStorage(item);
                              setShowStorageModal(false);
                            }}
                            className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5 text-left text-xs sm:text-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400/70 hover:bg-slate-800/80 ${
                              selected
                                ? "border-cyan-400 bg-cyan-500/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.5)]"
                                : "border-slate-700 bg-slate-900/70 text-slate-200"
                            }`}
                          >
                            <span className="flex-1 truncate">{item}</span>
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] ${
                                selected
                                  ? "border-cyan-400 bg-cyan-400 text-slate-950"
                                  : "border-slate-500 text-slate-400"
                              }`}
                            >
                              {selected ? "●" : ""}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowStorageModal(false)}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/80 hover:border-slate-400 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Right column: live summary */}
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
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  Does the laptop switch ON?
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {powerStatus === "yes" ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Processor</span>
                <span className="font-semibold text-slate-100 text-right max-w-[55%] truncate">
                  {processor ?? "Not selected"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Graphics</span>
                <span className="font-semibold text-slate-100 text-right max-w-[55%] truncate">
                  {graphics ?? "Not selected"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Screen Size</span>
                <span className="font-semibold text-slate-100">
                  {screenSize
                    ? screenSizeOptions.find((opt) => opt.id === screenSize)
                        ?.label
                    : "Not selected"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Touch Screen</span>
                <span className="font-semibold text-slate-100">
                  {touchScreen ?? "Not selected"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">RAM</span>
                <span className="font-semibold text-slate-100">
                  {ram ?? "Not selected"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hard Disk / SSD</span>
                <span className="font-semibold text-slate-100 text-right max-w-[55%] truncate">
                  {storage ?? "Not selected"}
                </span>
              </div>
            </div>

            <div className="mt-auto pt-3 border-t border-slate-800/80 text-[11px] sm:text-xs text-slate-400 space-y-2">
              <p className="flex items-center gap-2">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                You&apos;re just a couple of taps away from seeing your final
                value.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
