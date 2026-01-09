"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const options = [
  {
    id: "yes",
    label: "Yes",
  },
  {
    id: "no",
    label: "No",
  },
];

export default function PowerStatusPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [showNoModal, setShowNoModal] = useState(false);

  const handleOptionClick = (id: string) => {
    setSelected(id);

    if (id === "yes") {
      router.push(
        "/sell/windows/laptop/samsung/galaxy-book-go-series/system-configuration?power=yes"
      );
    }

    if (id === "no") {
      setShowNoModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-8 lg:gap-10 items-start">
          {/* Left: question card */}
          <section className="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-[0_18px_60px_rgba(15,23,42,0.9)] p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-y-0 -right-40 w-80 bg-gradient-to-bl from-cyan-500/20 via-sky-500/0 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute -top-32 -left-24 h-56 w-56 bg-cyan-500/10 blur-3xl pointer-events-none" />

            <header className="relative flex items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
                  Step 1 • Device health
                </p>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  Does your laptop
                  <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-200 bg-clip-text text-transparent">
                    switch on normally?
                  </span>
                </h1>
              </div>
              <div className="hidden sm:flex flex-col items-end text-right text-xs text-slate-400">
                <span className="text-[10px] uppercase tracking-[0.18em] mb-1">
                  Progress
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex h-1.5 w-16 rounded-full bg-slate-700 overflow-hidden">
                    <span className="h-full w-1/3 bg-gradient-to-r from-cyan-400 to-sky-400" />
                  </div>
                </div>
              </div>
            </header>

            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
              {options.map((opt) => {
                const isActive = selected === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleOptionClick(opt.id)}
                    className={`group text-left rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 transition-all duration-200 flex items-start gap-3 sm:gap-4 bg-slate-900/60 hover:bg-slate-800/80 hover:border-cyan-500/60 ${
                      isActive
                        ? "border-cyan-400 bg-slate-800/80 shadow-[0_0_0_1px_rgba(34,211,238,0.4)]"
                        : "border-slate-700"
                    }`}
                  >
                    <span
                      className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border text-xs transition-colors ${
                        isActive
                          ? "border-cyan-400 bg-cyan-400 text-slate-900"
                          : "border-slate-500 bg-transparent text-slate-400 group-hover:border-cyan-400 group-hover:text-cyan-300"
                      }`}
                    >
                      {isActive ? "✓" : ""}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm sm:text-base font-semibold text-white mb-1">
                        {opt.label}
                      </span>
                      <span className="block text-xs sm:text-sm text-slate-300"></span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-400">
              <p className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293A1 1 0 006.293 10.707l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Your answers only affect pricing – they do not create any
                obligation to sell.
              </p>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="rounded-xl border border-slate-600 px-4 py-2 text-xs sm:text-sm font-medium text-slate-200 hover:bg-slate-800/80 hover:border-slate-400 transition-colors"
                >
                  Back to summary
                </button>
                <button
                  type="button"
                  disabled
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/40 opacity-50 cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>

            {/* No-option modal */}
            {showNoModal && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="relative w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/95 p-6 shadow-[0_22px_80px_rgba(15,23,42,1)]">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-red-500/20 blur-3xl" />
                  <div className="pointer-events-none absolute -left-8 -bottom-8 h-28 w-28 rounded-full bg-sky-500/10 blur-3xl" />

                  <div className="relative space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                      <span>Important notice</span>
                    </div>

                    <h2 className="text-xl font-semibold">
                      We&apos;re not dealing with
                      <span className="block bg-gradient-to-r from-red-300 via-amber-200 to-sky-200 bg-clip-text text-transparent">
                        dead laptops right now.
                      </span>
                    </h2>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      At the moment, this program only supports laptops that
                      switch on normally. For guidance on repairing your Galaxy
                      Book Go or exploring other options, our customer care team
                      will be happy to help.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 text-xs sm:text-sm">
                      <button
                        type="button"
                        onClick={() => setShowNoModal(false)}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-4 py-2 font-medium text-slate-200 hover:bg-slate-800/80 hover:border-slate-400 transition-colors"
                      >
                        Close
                      </button>
                      <a
                        href="tel:1800123456"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 hover:shadow-emerald-400/60 transition-all"
                      >
                        <span>Contact customer care</span>
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
                            d="M3 5h6M5 3v6m4 8h8m-2-2v6M8 11a9 9 0 019-9m0 0v4m0-4h-4"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Right: device summary card */}
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
                <span className="text-slate-400">Starting estimate</span>
                <span className="font-semibold text-cyan-300">10,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current step</span>
                <span className="font-medium text-slate-100">Power status</span>
              </div>
            </div>

            <div className="mt-auto pt-3 border-t border-slate-800/80 text-[11px] sm:text-xs text-slate-400 space-y-2">
              <p>
                Next, we&apos;ll ask about display condition, body condition,
                and accessories to finalize your quote.
              </p>
              <p className="flex items-center gap-2">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Honest answers help us keep offers accurate and transparent.
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
