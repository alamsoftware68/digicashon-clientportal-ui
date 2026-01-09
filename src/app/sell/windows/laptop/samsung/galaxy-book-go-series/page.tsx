"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function GalaxyBookGoSeriesPage() {
  const router = useRouter();

  const basePrice = 10000; // base indicative price

  return (
    <div className="min-h-screen">
      <Header />

      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center space-x-2 text-slate-300 hover:text-white transition-colors duration-200 mb-6"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:bg-cyan-500 group-hover:border-cyan-400 transition-all">
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </span>
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-8 lg:gap-10 items-start">
            {/* Left: hero + details */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                Samsung • Galaxy Book Go Series
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                Sell your
                <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-200 bg-clip-text text-transparent">
                  Galaxy Book Go Series
                </span>
              </h1>

              {/* Device preview card */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-5 sm:p-6 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
                <div className="absolute -top-24 -right-24 h-60 w-60 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />

                <div className="relative flex flex-col sm:flex-row gap-6 items-center">
                  <div className="flex-1 flex justify-center">
                    <div className="relative w-64 sm:w-72 aspect-video rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shadow-inner flex items-center justify-center overflow-hidden">
                      <Image
                        src="/images/Samsung.png"
                        alt="Galaxy Book Go"
                        width={260}
                        height={160}
                        className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
                      />
                      <div className="pointer-events-none absolute inset-x-8 bottom-3 h-1/3 bg-gradient-to-t from-black/30 via-black/0 to-transparent" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    <div>
                      <div className="text-xs font-medium tracking-wide text-slate-400 uppercase mb-1">
                        Starting Price (Good Condition)
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl sm:text-4xl font-semibold text-cyan-300">
                          10,000
                        </span>
                        <span className="text-xs sm:text-sm text-slate-400 mb-1">
                          estimated
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: actions card */}
            <div className="lg:pl-4">
              <div className="sticky top-24">
                <div className="rounded-3xl bg-white text-slate-900 shadow-[0_18px_60px_rgba(15,23,42,0.7)] border border-slate-200 p-5 sm:p-6 space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                      Get Exact Value
                    </h2>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3">
                    <div className="text-xs sm:text-sm text-slate-600">
                      Base estimate
                      <div className="text-[10px] sm:text-[11px] text-slate-400">
                        For a device in good condition
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-semibold text-slate-900">
                        10,000
                      </div>
                      <div className="text-[11px] text-emerald-600 font-medium">
                        Up to +15% for like‑new
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        "/sell/windows/laptop/samsung/galaxy-book-go-series/power-status"
                      )
                    }
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 px-4 py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-cyan-600/40 hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 hover:-translate-y-[1px]"
                  >
                    <span>Get Exact Value</span>
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

                  <div className="space-y-3 border-t border-slate-200 pt-4 mt-2 text-xs sm:text-sm">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <p className="text-slate-600">
                        No obligation to sell – you&apos;re free to walk away.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-sky-500">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 2l7.997 3.884v.09c0 4.873-3.134 9.395-7.523 10.894a1.75 1.75 0 01-1.148 0C5.137 15.27 2.003 10.747 2.003 5.974v-.09z" />
                        </svg>
                      </span>
                      <p className="text-slate-600">
                        Secure process with verified partners and safe data
                        wiping.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
