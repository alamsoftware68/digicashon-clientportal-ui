'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const screenSizeOptions = [
  {
    id: '10-11',
    label: '10–11 inch',
    description: 'Ultra‑compact display ideal for travel and basic everyday tasks.',
  },
  {
    id: '12-13',
    label: '12–13 inch',
    description: 'Balanced size for portability and comfortable work sessions.',
  },
  {
    id: '14-15',
    label: '14–15 inch',
    description: 'Full‑size laptop display for productivity and entertainment.',
  },
  {
    id: 'above-15',
    label: 'Above 15 inch',
    description: 'Large screen for designers, gamers, and multitaskers.',
  },
];

const graphicsOptions = [
  {
    id: 'available',
    label: 'Graphics card available',
    description: 'Your laptop has a dedicated NVIDIA or AMD graphics card and it works fine.',
  },
  {
    id: 'not-available',
    label: 'Graphics card not available',
    description: 'Your laptop only uses integrated graphics from Intel or AMD.',
  },
  {
    id: 'not-working',
    label: 'Graphics card not working',
    description: 'The dedicated graphics card is present but has issues or is not detected.',
  },
];

export default function AdditionalFeaturesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [screenSize, setScreenSize] = useState<string | null>(null);
  const [graphics, setGraphics] = useState<string | null>(null);

  const canContinue = Boolean(screenSize && graphics);

  const powerStatus = searchParams.get('power') ?? 'yes';
  const processor = searchParams.get('processor');
  const ram = searchParams.get('ram');
  const storage = searchParams.get('storage');

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-8 lg:gap-10 items-start">
          {/* Left column: feature selection */}
          <section className="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-[0_18px_60px_rgba(15,23,42,0.9)] p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-y-0 -right-40 w-80 bg-gradient-to-bl from-emerald-500/20 via-sky-500/0 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute -top-32 -left-24 h-56 w-56 bg-sky-500/10 blur-3xl pointer-events-none" />

            <header className="relative flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">Step 3 • Additional features</p>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  Select the
                  <span className="block bg-gradient-to-r from-emerald-300 via-sky-300 to-teal-200 bg-clip-text text-transparent">
                    additional features of your device
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="flex h-1.5 w-24 rounded-full bg-slate-800 overflow-hidden">
                    <span className="h-full w-3/3 bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400" />
                  </div>
                  <span>3 / 3</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px]">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Final step before your exact value.
                </span>
              </div>
            </header>

            <p className="relative text-sm sm:text-base text-slate-300 mb-8 max-w-2xl">
              Tell us about your screen size and graphics card so we can fine‑tune your quote. Choose the options that
              best match your Galaxy Book Go Series.
            </p>

            {/* Screen size */}
            <div className="relative mb-8">
              <div className="mb-3 flex items-end justify-between gap-2">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold">Screen size</h2>
                  <p className="text-xs text-slate-400">Select the approximate size of your laptop display.</p>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300">
                  Display
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {screenSizeOptions.map((opt) => {
                  const selected = screenSize === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setScreenSize(opt.id)}
                      className={`group flex flex-col items-start justify-between rounded-2xl border px-4 py-3 text-left text-sm sm:text-[15px] transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-xl hover:border-emerald-400/70 hover:bg-slate-800/80 ${
                        selected
                          ? 'border-emerald-400 bg-emerald-500/10 text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.5)]'
                          : 'border-slate-700 bg-slate-900/70 text-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="font-semibold">{opt.label}</span>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px] ${
                            selected
                              ? 'border-emerald-400 bg-emerald-400 text-slate-950'
                              : 'border-slate-500 text-slate-400 group-hover:border-emerald-300 group-hover:text-emerald-200'
                          }`}
                        >
                          {selected ? '✓' : ''}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-400 group-hover:text-slate-300">
                        {opt.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Graphics card */}
            <div className="relative mb-6">
              <div className="mb-3 flex items-end justify-between gap-2">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold">External graphics card (NVIDIA / AMD)</h2>
                  <p className="text-xs text-slate-400">
                    Let us know if your laptop has a dedicated graphics card and whether it is working.
                  </p>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300">
                  Graphics
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {graphicsOptions.map((opt) => {
                  const selected = graphics === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setGraphics(opt.id)}
                      className={`group flex flex-col items-start justify-between rounded-2xl border px-4 py-3 text-left text-xs sm:text-[13px] transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-xl hover:border-cyan-400/70 hover:bg-slate-800/80 ${
                        selected
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.5)]'
                          : 'border-slate-700 bg-slate-900/70 text-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="font-semibold leading-snug">{opt.label}</span>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px] ${
                            selected
                              ? 'border-cyan-400 bg-cyan-400 text-slate-950'
                              : 'border-slate-500 text-slate-400 group-hover:border-cyan-300 group-hover:text-cyan-200'
                          }`}
                        >
                          {selected ? '✓' : ''}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-400 group-hover:text-slate-300">
                        {opt.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative mt-6 flex flex-col items-center justify-between gap-3 text-xs sm:flex-row sm:text-sm text-slate-400">
              <p>
                We&apos;ll combine these answers with your system configuration to calculate the most accurate price for
                your Galaxy Book Go Series.
              </p>
          <button
                type="button"
                disabled={!canContinue}
                onClick={() => {
                  if (!screenSize || !graphics) return;
                  const params = new URLSearchParams({
                    power: powerStatus,
                    processor: processor ?? '',
                    ram: ram ?? '',
                    storage: storage ?? '',
                    screenSize,
                    graphics,
                  });
                  router.push(`/sell/windows/laptop/samsung/galaxy-book-go-series/functional-condition?${params.toString()}`);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-40 hover:shadow-emerald-400/60 disabled:hover:shadow-emerald-500/40"
              >
                <span>Continue</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 5l7 7-7 7" />
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
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-1">Device evaluation</p>
                <h2 className="text-sm sm:text-base font-semibold">Galaxy Book Go Series</h2>
                <p className="text-[11px] text-slate-400">Windows • Samsung laptop</p>
              </div>
            </header>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-1">Power status</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Does the laptop switch ON?</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {powerStatus === 'yes' ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-1">System configuration</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Processor</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {processor ?? 'Not selected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">RAM</span>
                    <span className="font-semibold text-slate-100">{ram ?? 'Not selected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Hard Disk / SSD</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {storage ?? 'Not selected'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-1">Additional features</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Screen size</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {screenSize
                        ? screenSizeOptions.find((opt) => opt.id === screenSize)?.label ?? screenSize
                        : 'Not selected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Graphics</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {graphics
                        ? graphicsOptions.find((opt) => opt.id === graphics)?.label ?? graphics
                        : 'Not selected'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-3 border-t border-slate-800/80 text-[11px] sm:text-xs text-slate-400 space-y-2">
              <p>
                You&apos;re almost done. Once you confirm these details, we&apos;ll show you the best possible price for your
                Galaxy Book Go Series.
              </p>
              <p className="flex items-center gap-2">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
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
