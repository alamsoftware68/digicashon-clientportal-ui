'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const scratchOptions = [
  { id: 'scratch-none', label: 'No scratches on screen', description: 'Front glass looks clean with no visible marks.' },
  { id: 'scratch-minor', label: '1–2 light scratches', description: 'A couple of light hairline marks visible in bright light.' },
  { id: 'scratch-few', label: 'More than 2 scratches', description: 'Multiple light scratches but no deep damage.' },
  { id: 'scratch-cracked', label: 'Screen cracked or broken', description: 'Visible crack or broken glass on the display.' },
];

const discolorationOptions = [
  { id: 'discolor-none', label: 'No discolouration', description: 'Colours look normal across the entire display.' },
  { id: 'discolor-minor', label: 'Minor discolouration', description: 'Slight colour shift or tint in a small area.' },
  { id: 'discolor-major', label: 'Major discolouration', description: 'Large area with yellowish, bluish, or faded colours.' },
];

const spotsOptions = [
  { id: 'spots-none', label: 'No spots on screen', description: 'No bright or dark spots are visible.' },
  { id: 'spots-few', label: '1–2 minor spots', description: 'Small uneven patches only visible on solid colours.' },
  { id: 'spots-many', label: 'Large / many spots', description: 'Clearly visible spots or blotches on the screen.' },
];

const linesOptions = [
  { id: 'lines-none', label: 'No lines', description: 'No lines or flickering bars anywhere on the screen.' },
  { id: 'lines-visible', label: 'Visible lines', description: 'Thin vertical or horizontal lines visible during use.' },
  { id: 'lines-flicker', label: 'Display flickering', description: 'Screen flickers, jitters or brightness pulses.' },
  { id: 'lines-dead', label: 'Black dots / dead pixels', description: 'One or more dead pixels or tiny black dots.' },
];

export default function ScreenConditionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [scratch, setScratch] = useState<string | null>(null);
  const [discoloration, setDiscoloration] = useState<string | null>(null);
  const [spots, setSpots] = useState<string | null>(null);
  const [lines, setLines] = useState<string | null>(null);

  const canContinue = Boolean(scratch && discoloration && spots && lines);

  const powerStatus = searchParams.get('power') ?? 'yes';
  const processor = searchParams.get('processor');
  const ram = searchParams.get('ram');
  const storage = searchParams.get('storage');
  const screenSize = searchParams.get('screenSize');
  const graphics = searchParams.get('graphics');
  const issues = searchParams.get('issues');

  const formatIssues = () => {
    if (!issues) return 'Not selected';
    const ids = issues.split(',').filter(Boolean);
    if (!ids.length) return 'Not selected';
    return ids.join(', ');
  };

  const findLabel = (list: { id: string; label: string }[], id: string | null) => {
    if (!id) return 'Not selected';
    const found = list.find((item) => item.id === id);
    return found?.label ?? 'Not selected';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-8 lg:gap-10 items-start">
          {/* Left column: screen condition controls */}
          <section className="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-[0_18px_60px_rgba(15,23,42,0.9)] p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-y-0 -right-40 w-80 bg-gradient-to-bl from-cyan-500/20 via-sky-500/0 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute -top-32 -left-24 h-56 w-56 bg-sky-500/10 blur-3xl pointer-events-none" />

            <header className="relative flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">Step 5 • Screen condition</p>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  Select the screen
                  <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-200 bg-clip-text text-transparent">
                    condition of your device
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="flex h-1.5 w-24 rounded-full bg-slate-800 overflow-hidden">
                    <span className="h-full w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400" />
                  </div>
                  <span>5 / 5</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px]">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  The better the condition, the more we can pay.
                </span>
              </div>
            </header>

            <p className="relative text-sm sm:text-base text-slate-300 mb-8 max-w-2xl">
              Tell us about any scratches, discolouration, spots or lines on your Galaxy Book Go screen. Choose the option
              in each row that best matches your display.
            </p>

            {/* Scratch / broken */}
            <div className="mb-8">
              <div className="mb-3">
                <h2 className="text-sm sm:text-base font-semibold">Scratch or broken on screen</h2>
                <p className="text-xs text-slate-400">Select the closest scratch or broken condition.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {scratchOptions.map((opt) => {
                  const selected = scratch === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setScratch(opt.id)}
                      className={`group flex flex-col items-start justify-between rounded-2xl border px-4 py-3 text-left text-xs sm:text-[13px] transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-xl hover:border-cyan-400/70 hover:bg-slate-800/80 ${
                        selected
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.5)]'
                          : 'border-slate-700 bg-slate-900/70 text-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="flex items-center gap-2">
                          {/* simple custom icon */}
                          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-600">
                            <span className="relative flex h-5 w-7 items-center justify-center rounded-md border border-slate-400 bg-slate-900/80 overflow-hidden">
                              <span className="h-2 w-4 rounded-sm bg-slate-800/80" />
                              {opt.id !== 'scratch-none' && (
                                <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-red-400/70 opacity-70" />
                              )}
                            </span>
                            <span className="absolute -bottom-1 h-1.5 w-7 rounded-sm bg-slate-900/90 border border-slate-600" />
                          </span>
                          <span className="font-semibold leading-snug">{opt.label}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 group-hover:text-slate-300">{opt.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Discolouration */}
            <div className="mb-8">
              <div className="mb-3">
                <h2 className="text-sm sm:text-base font-semibold">Discolouration on screen</h2>
                <p className="text-xs text-slate-400">Select how much colour shift or tint is visible.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {discolorationOptions.map((opt) => {
                  const selected = discoloration === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDiscoloration(opt.id)}
                      className={`group flex flex-col items-start justify-between rounded-2xl border px-4 py-3 text-left text-xs sm:text-[13px] transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-xl hover:border-cyan-400/70 hover:bg-slate-800/80 ${
                        selected
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.5)]'
                          : 'border-slate-700 bg-slate-900/70 text-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="flex items-center gap-2">
                          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-600">
                            <span className="relative flex h-5 w-7 items-center justify-center rounded-md border border-slate-400 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
                              {opt.id === 'discolor-minor' && (
                                <span className="absolute inset-y-0 right-0 w-1/3 bg-yellow-400/40" />
                              )}
                              {opt.id === 'discolor-major' && (
                                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/40 via-pink-400/40 to-blue-400/40" />
                              )}
                            </span>
                            <span className="absolute -bottom-1 h-1.5 w-7 rounded-sm bg-slate-900/90 border border-slate-600" />
                          </span>
                          <span className="font-semibold leading-snug">{opt.label}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 group-hover:text-slate-300">{opt.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Spots */}
            <div className="mb-8">
              <div className="mb-3">
                <h2 className="text-sm sm:text-base font-semibold">Spots on screen</h2>
                <p className="text-xs text-slate-400">Select the condition related to spots or blotches.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {spotsOptions.map((opt) => {
                  const selected = spots === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSpots(opt.id)}
                      className={`group flex flex-col items-start justify-between rounded-2xl border px-4 py-3 text-left text-xs sm:text-[13px] transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-xl hover:border-cyan-400/70 hover:bg-slate-800/80 ${
                        selected
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.5)]'
                          : 'border-slate-700 bg-slate-900/70 text-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="flex items-center gap-2">
                          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-600">
                            <span className="relative flex h-5 w-7 items-center justify-center rounded-md border border-slate-400 bg-slate-900/80">
                              {opt.id !== 'spots-none' && (
                                <>
                                  <span className="h-1 w-1 rounded-full bg-slate-500" />
                                  <span className="ml-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
                                  <span className="ml-1 h-0.5 w-0.5 rounded-full bg-slate-500" />
                                </>
                              )}
                            </span>
                            <span className="absolute -bottom-1 h-1.5 w-7 rounded-sm bg-slate-900/90 border border-slate-600" />
                          </span>
                          <span className="font-semibold leading-snug">{opt.label}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 group-hover:text-slate-300">{opt.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lines / flicker */}
            <div className="mb-4">
              <div className="mb-3">
                <h2 className="text-sm sm:text-base font-semibold">Lines or flicker on screen</h2>
                <p className="text-xs text-slate-400">Select any visible lines, flicker or dead pixels.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {linesOptions.map((opt) => {
                  const selected = lines === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setLines(opt.id)}
                      className={`group flex flex-col items-start justify-between rounded-2xl border px-4 py-3 text-left text-xs sm:text-[13px] transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-xl hover:border-cyan-400/70 hover:bg-slate-800/80 ${
                        selected
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.5)]'
                          : 'border-slate-700 bg-slate-900/70 text-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="flex items-center gap-2">
                          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-600">
                            <span className="relative flex h-5 w-7 items-center justify-center rounded-md border border-slate-400 bg-slate-900/80 overflow-hidden">
                              {opt.id === 'lines-visible' && (
                                <span className="absolute inset-y-1 left-2 w-0.5 rounded-full bg-cyan-400" />
                              )}
                              {opt.id === 'lines-flicker' && (
                                <span className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-cyan-400 via-transparent to-cyan-400 animate-pulse" />
                              )}
                              {opt.id === 'lines-dead' && (
                                <>
                                  <span className="h-1 w-1 rounded-full bg-slate-500" />
                                  <span className="ml-1 h-1 w-1 rounded-full bg-slate-500" />
                                </>
                              )}
                            </span>
                            <span className="absolute -bottom-1 h-1.5 w-7 rounded-sm bg-slate-900/90 border border-slate-600" />
                          </span>
                          <span className="font-semibold leading-snug">{opt.label}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 group-hover:text-slate-300">{opt.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative mt-6 flex flex-col items-center justify-between gap-3 text-xs sm:flex-row sm:text-sm text-slate-400">
              <p>
                Screen condition has a strong impact on pricing. Honest answers help us show an offer that matches the
                real value of your device.
              </p>
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => {
                  if (!scratch || !discoloration || !spots || !lines) return;
                  const params = new URLSearchParams({
                    power: powerStatus,
                    processor: processor ?? '',
                    ram: ram ?? '',
                    storage: storage ?? '',
                    screenSize: screenSize ?? '',
                    graphics: graphics ?? '',
                    issues: issues ?? '',
                    scratch,
                    discoloration,
                    spots,
                    lines,
                  });
                  router.push(`/sell/windows/laptop/samsung/galaxy-book-go-series/device-age?${params.toString()}`);
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
                      {screenSize ?? 'Not selected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Graphics</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {graphics ?? 'Not selected'}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-400 mt-0.5">Functional issues</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] text-[11px] leading-snug whitespace-pre-line">
                      {formatIssues()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-1">Screen condition</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Scratch / broken</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {findLabel(scratchOptions, scratch)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Discolouration</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {findLabel(discolorationOptions, discoloration)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Spots</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {findLabel(spotsOptions, spots)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Lines / flicker</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {findLabel(linesOptions, lines)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-3 border-t border-slate-800/80 text-[11px] sm:text-xs text-slate-400 space-y-2">
              <p>
                Once you review these details we&apos;ll calculate the best possible price for your Galaxy Book Go Series based
                on power status, configuration, functional condition and screen quality.
              </p>
              <p className="flex items-center gap-2">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                You&apos;re very close to seeing your final value.
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
