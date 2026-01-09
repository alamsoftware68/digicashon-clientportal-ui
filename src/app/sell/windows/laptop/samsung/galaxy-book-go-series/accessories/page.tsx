"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function AccessoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [hasInvoice, setHasInvoice] = useState<string | null>(null);
  const [hasOriginalBox, setHasOriginalBox] = useState<string | null>(null);

  const canContinue = hasInvoice !== null;

  const powerStatus = searchParams.get("power") ?? "yes";
  const processor = searchParams.get("processor");
  const ram = searchParams.get("ram");
  const storage = searchParams.get("storage");
  const screenSize = searchParams.get("screenSize");
  const graphics = searchParams.get("graphics");
  const touchScreen = searchParams.get("touchScreen");
  const issues = searchParams.get("issues");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-8 lg:gap-10 items-start">
          {/* Left column: accessories selection */}
          <section className="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-[0_18px_60px_rgba(15,23,42,0.9)] p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-y-0 -right-40 w-80 bg-gradient-to-bl from-cyan-500/20 via-sky-500/0 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute -top-32 -left-24 h-56 w-56 bg-cyan-500/10 blur-3xl pointer-events-none" />

            <header className="relative flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
                  Step 5 • Accessories
                </p>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  Accessories which
                  <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-200 bg-clip-text text-transparent">
                    you have
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px]">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Invoice is mandatory to select.
                </span>
              </div>
            </header>

            {/* Invoice - Mandatory */}
            <div className="relative mb-6">
              <div className="mb-3 flex items-end justify-between gap-2">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold flex items-center gap-2">
                    Invoice
                    <span className="text-red-400 text-xs">*</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Do you have the original purchase invoice?
                  </p>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300">
                  Required
                </span>
              </div>
              <div className="flex gap-3">
                {["Yes", "No"].map((option) => {
                  const selected = hasInvoice === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setHasInvoice(option)}
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400/70 hover:bg-slate-800/80 ${
                        selected
                          ? "border-cyan-400 bg-cyan-500/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.5)]"
                          : "border-slate-700 bg-slate-900/70 text-slate-200"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Original Box - Optional */}
            <div className="relative mb-8">
              <div className="mb-3 flex items-end justify-between gap-2">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold">
                    Original Box
                  </h2>
                  <p className="text-xs text-slate-400">
                    Do you have the original box? (Optional)
                  </p>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300">
                  Optional
                </span>
              </div>
              <div className="flex gap-3">
                {["Yes", "No"].map((option) => {
                  const selected = hasOriginalBox === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setHasOriginalBox(option)}
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400/70 hover:bg-slate-800/80 ${
                        selected
                          ? "border-cyan-400 bg-cyan-500/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.5)]"
                          : "border-slate-700 bg-slate-900/70 text-slate-200"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative mt-4 flex flex-col items-center justify-between gap-3 text-xs sm:flex-row sm:text-sm text-slate-400">
              <p>
                Invoice selection determines the next step in your evaluation.
              </p>
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => {
                  if (!hasInvoice) return;
                  const params = new URLSearchParams({
                    power: powerStatus,
                    processor: processor ?? "",
                    ram: ram ?? "",
                    storage: storage ?? "",
                    screenSize: screenSize ?? "",
                    graphics: graphics ?? "",
                    touchScreen: touchScreen ?? "",
                    issues: issues ?? "",
                    hasInvoice,
                    hasOriginalBox: hasOriginalBox ?? "No",
                  });
                  
                  // Navigate based on invoice selection
                  if (hasInvoice === "Yes") {
                    router.push(
                      `/sell/windows/laptop/samsung/galaxy-book-go-series/device-age?${params.toString()}`
                    );
                  } else {
                    router.push(
                      `/sell/windows/laptop/samsung/galaxy-book-go-series/laptop-condition?${params.toString()}`
                    );
                  }
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
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Invoice</span>
                <span className="font-semibold text-slate-100">
                  {hasInvoice ?? "Not selected"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Original Box</span>
                <span className="font-semibold text-slate-100">
                  {hasOriginalBox ?? "Not selected"}
                </span>
              </div>
            </div>

            <div className="mt-auto pt-3 border-t border-slate-800/80 text-[11px] sm:text-xs text-slate-400 space-y-2">
              <p>
                Having the invoice and original box can increase your device's
                resale value significantly.
              </p>
              <p className="flex items-center gap-2">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Invoice is required to proceed.
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
