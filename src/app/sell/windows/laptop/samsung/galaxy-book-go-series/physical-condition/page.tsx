'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';

const bodyScratchOptions = [
  { id: 'body-scratch-none', label: 'No visible scratches', description: 'Body looks clean with only normal wipe marks.' },
  { id: 'body-scratch-light', label: 'Light surface marks', description: 'Few hairline marks visible on close inspection.' },
  { id: 'body-scratch-heavy', label: 'Heavy scratches / scuffs', description: 'Multiple visible scratches or scuffed corners.' },
];

const topDentOptions = [
  { id: 'top-dent-none', label: 'No dents on top panel', description: 'Top lid is straight with no visible dents.' },
  { id: 'top-dent-minor', label: '1–2 minor dents', description: 'Small soft dents that do not affect opening/closing.' },
  { id: 'top-dent-many', label: 'More than 2 dents', description: 'Multiple or deep dents on the top cover.' },
];

const baseDentOptions = [
  { id: 'base-dent-none', label: 'No dents on base panel', description: 'Bottom case is flat with no deformation.' },
  { id: 'base-dent-minor', label: 'Minor dents / bends', description: 'Slight bend or one small dent on the base.' },
  { id: 'base-dent-major', label: 'Major dents or warped base', description: 'Noticeable dents or warping of the base panel.' },
];

const hingeOptions = [
  { id: 'hinge-ok', label: 'Hinges firm and smooth', description: 'Screen opens smoothly and stays fixed in place.' },
  { id: 'hinge-loose', label: 'Loose or noisy hinges', description: 'Screen wobbles, feels loose, or makes creaking sounds.' },
];

const panelOptions = [
  { id: 'panel-ok', label: 'No crack or loose panel', description: 'Body panels fit well with no gaps or cracks.' },
  { id: 'panel-loose', label: 'Loose panel', description: 'Small gaps or slightly loose palmrest / lid plastics.' },
  { id: 'panel-cracked', label: 'Cracked / broken panel', description: 'Visible crack or missing chunk on the body.' },
];

export default function PhysicalConditionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuth();

  // Initialize states from URL params if they exist (for returning after login)
  const [bodyScratch, setBodyScratch] = useState<string | null>(searchParams.get('bodyScratch'));
  const [topDent, setTopDent] = useState<string | null>(searchParams.get('topDent'));
  const [baseDent, setBaseDent] = useState<string | null>(searchParams.get('baseDent'));
  const [hinges, setHinges] = useState<string | null>(searchParams.get('hinges'));
  const [panel, setPanel] = useState<string | null>(searchParams.get('panel'));
  const [showLoginModal, setShowLoginModal] = useState(false);

  const canContinue = Boolean(bodyScratch && topDent && baseDent && hinges && panel);

  const powerStatus = searchParams.get('power') ?? 'yes';
  const processor = searchParams.get('processor');
  const ram = searchParams.get('ram');
  const storage = searchParams.get('storage');
  const screenSize = searchParams.get('screenSize');
  const graphics = searchParams.get('graphics');
  const issues = searchParams.get('issues');
  const scratch = searchParams.get('scratch');
  const discoloration = searchParams.get('discoloration');
  const spots = searchParams.get('spots');
  const lines = searchParams.get('lines');
  const age = searchParams.get('age');

  const formatIssues = () => {
    if (!issues) return 'Not selected';
    const ids = issues.split(',').filter(Boolean);
    if (!ids.length) return 'Not selected';
    return ids.join(', ');
  };

  const formatAge = () => {
    if (!age) return 'Not selected';
    if (age === 'lt-1') return 'Less than 1 year';
    if (age === '1-3') return 'Between 1 and 3 years';
    if (age === 'gt-3') return 'More than 3 years';
    return 'Not selected';
  };

  const navigateToPriceSummary = () => {
    if (!bodyScratch || !topDent || !baseDent || !hinges || !panel) return;
    const params = new URLSearchParams({
      power: powerStatus,
      processor: processor ?? '',
      ram: ram ?? '',
      storage: storage ?? '',
      screenSize: screenSize ?? '',
      graphics: graphics ?? '',
      issues: issues ?? '',
      scratch: scratch ?? '',
      discoloration: discoloration ?? '',
      spots: spots ?? '',
      lines: lines ?? '',
      age: age ?? '',
      bodyScratch,
      topDent,
      baseDent,
      hinges,
      panel,
    });
    router.push(`/sell/windows/laptop/samsung/galaxy-book-go-series/price-summary?${params.toString()}`);
  };

  const storeSellFlowData = () => {
    // Store sell flow data in sessionStorage for post-login redirect
    const sellFlowData = {
      flow: 'sell-laptop',
      device: 'galaxy-book-go-series',
      params: {
        power: powerStatus,
        processor: processor ?? '',
        ram: ram ?? '',
        storage: storage ?? '',
        screenSize: screenSize ?? '',
        graphics: graphics ?? '',
        issues: issues ?? '',
        scratch: scratch ?? '',
        discoloration: discoloration ?? '',
        spots: spots ?? '',
        lines: lines ?? '',
        age: age ?? '',
        bodyScratch,
        topDent,
        baseDent,
        hinges,
        panel,
      },
      redirectUrl: '/sell/windows/laptop/samsung/galaxy-book-go-series/price-summary'
    };
    sessionStorage.setItem('sellFlowData', JSON.stringify(sellFlowData));
  };

  useEffect(() => {
    if (showLoginModal && isLoggedIn) {
      setShowLoginModal(false);
      navigateToPriceSummary();
    }
  }, [isLoggedIn, showLoginModal]);

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
          {/* Left column: physical condition */}
          <section className="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-[0_18px_60px_rgba(15,23,42,0.9)] p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-y-0 -right-40 w-80 bg-gradient-to-bl from-emerald-500/20 via-sky-500/0 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute -top-32 -left-24 h-56 w-56 bg-sky-500/10 blur-3xl pointer-events-none" />

            <header className="relative flex flex-col gap-2 mb-8">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Select the physical condition of your device
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                The better your laptop body looks, the more we can offer. Choose the option in each row that best matches
                your device.
              </p>
            </header>

            {/* Scratch on body */}
            <div className="mb-8">
              <div className="mb-3">
                <h2 className="text-sm sm:text-base font-semibold">Scratches on body</h2>
                <p className="text-xs text-slate-400">Select the closest body scratch condition.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {bodyScratchOptions.map((opt) => {
                  const selected = bodyScratch === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setBodyScratch(opt.id)}
                      className={`group flex flex-col items-start justify-between rounded-2xl border px-4 py-3 text-left text-xs sm:text-[13px] transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-xl hover:border-emerald-400/70 hover:bg-slate-800/80 ${
                        selected
                          ? 'border-emerald-400 bg-emerald-500/10 text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.5)]'
                          : 'border-slate-700 bg-slate-900/70 text-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="flex items-center gap-2">
                          {/* custom side-view icon */}
                          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-600">
                            <span className="relative h-5 w-6 border border-slate-400 rounded-md bg-slate-900/80">
                              {opt.id !== 'body-scratch-none' && (
                                <span className="absolute inset-y-1 right-0 w-1 bg-gradient-to-b from-emerald-400/60 to-transparent" />
                              )}
                            </span>
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

            {/* Dents on top panel */}
            <div className="mb-8">
              <div className="mb-3">
                <h2 className="text-sm sm:text-base font-semibold">Dent on top panel</h2>
                <p className="text-xs text-slate-400">Select the dent condition on the top cover of the laptop.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {topDentOptions.map((opt) => {
                  const selected = topDent === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTopDent(opt.id)}
                      className={`group flex flex-col items-start justify-between rounded-2xl border px-4 py-3 text-left text-xs sm:text-[13px] transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-xl hover:border-emerald-400/70 hover:bg-slate-800/80 ${
                        selected
                          ? 'border-emerald-400 bg-emerald-500/10 text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.5)]'
                          : 'border-slate-700 bg-slate-900/70 text-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="flex items-center gap-2">
                          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-600">
                            <span className="relative h-3 w-6 border border-slate-400 rounded-md bg-slate-900/80">
                              {opt.id !== 'top-dent-none' && (
                                <span className="absolute inset-x-2 bottom-0 h-1 rounded-t-full bg-slate-700" />
                              )}
                            </span>
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

            {/* Dents on base panel */}
            <div className="mb-8">
              <div className="mb-3">
                <h2 className="text-sm sm:text-base font-semibold">Dent on base panel</h2>
                <p className="text-xs text-slate-400">Select the condition of the bottom panel.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {baseDentOptions.map((opt) => {
                  const selected = baseDent === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setBaseDent(opt.id)}
                      className={`group flex flex-col items-start justify-between rounded-2xl border px-4 py-3 text-left text-xs sm:text-[13px] transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-xl hover:border-emerald-400/70 hover:bg-slate-800/80 ${
                        selected
                          ? 'border-emerald-400 bg-emerald-500/10 text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.5)]'
                          : 'border-slate-700 bg-slate-900/70 text-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="flex items-center gap-2">
                          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-600">
                            <span className="relative h-2 w-6 border border-slate-400 rounded-md bg-slate-900/80">
                              {opt.id !== 'base-dent-none' && (
                                <span className="absolute inset-x-2 top-0 h-1 rounded-b-full bg-slate-700" />
                              )}
                            </span>
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

            {/* Loose hinges */}
            <div className="mb-8">
              <div className="mb-3">
                <h2 className="text-sm sm:text-base font-semibold">Loose hinges</h2>
                <p className="text-xs text-slate-400">Select the condition of the screen hinges.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hingeOptions.map((opt) => {
                  const selected = hinges === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setHinges(opt.id)}
                      className={`group flex flex-col items-start justify-between rounded-2xl border px-4 py-3 text-left text-xs sm:text-[13px] transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-xl hover:border-emerald-400/70 hover:bg-slate-800/80 ${
                        selected
                          ? 'border-emerald-400 bg-emerald-500/10 text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.5)]'
                          : 'border-slate-700 bg-slate-900/70 text-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="flex items-center gap-2">
                          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-600">
                            <span className="relative h-4 w-6 border border-slate-400 rounded-md bg-slate-900/80">
                              {opt.id === 'hinge-loose' && (
                                <span className="absolute bottom-0 left-1 h-2 w-3 origin-bottom-left rotate-6 border border-slate-500 rounded-md" />
                              )}
                            </span>
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

            {/* Cracked or loose panel */}
            <div className="mb-4">
              <div className="mb-3">
                <h2 className="text-sm sm:text-base font-semibold">Cracked or loose panel</h2>
                <p className="text-xs text-slate-400">Select the condition of the outer body panels.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {panelOptions.map((opt) => {
                  const selected = panel === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPanel(opt.id)}
                      className={`group flex flex-col items-start justify-between rounded-2xl border px-4 py-3 text-left text-xs sm:text-[13px] transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-xl hover:border-emerald-400/70 hover:bg-slate-800/80 ${
                        selected
                          ? 'border-emerald-400 bg-emerald-500/10 text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.5)]'
                          : 'border-slate-700 bg-slate-900/70 text-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="flex items-center gap-2">
                          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-600">
                            <span className="relative h-5 w-6 border border-slate-400 rounded-md bg-slate-900/80">
                              {opt.id === 'panel-loose' && (
                                <span className="absolute right-0 top-0 h-full w-1 bg-emerald-400/60" />
                              )}
                              {opt.id === 'panel-cracked' && (
                                <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-red-400/70" />
                              )}
                            </span>
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
                Physical condition helps us understand cosmetic repairs or part replacements that might be required for your
                Galaxy Book Go Series.
              </p>
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => {
                  if (!canContinue) return;
                  if (isLoggedIn) {
                    // Clear sellFlowData since user is already logged in and proceeding
                    sessionStorage.removeItem('sellFlowData');
                    sessionStorage.removeItem('sellFlowProcessed');
                    navigateToPriceSummary();
                  } else {
                    // Store sell flow data before opening login modal
                    storeSellFlowData();
                    setShowLoginModal(true);
                  }
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
                      {scratch ?? 'Not selected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Discolouration</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {discoloration ?? 'Not selected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Spots</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {spots ?? 'Not selected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Lines / flicker</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {lines ?? 'Not selected'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-1">Age of laptop</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Selected age</span>
                  <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                    {formatAge()}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-1">Physical condition</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Body scratches</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {findLabel(bodyScratchOptions, bodyScratch)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Top panel dents</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {findLabel(topDentOptions, topDent)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Base panel dents</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {findLabel(baseDentOptions, baseDent)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Hinges</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {findLabel(hingeOptions, hinges)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Panels</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {findLabel(panelOptions, panel)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-3 border-t border-slate-800/80 text-[11px] sm:text-xs text-slate-400 space-y-2">
              <p>
                We now have a complete picture of your Galaxy Book Go Series – configuration, screen and body condition.
                The next step can calculate your final offer.
              </p>
              <p className="flex items-center gap-2">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Honest and accurate details help us keep pricing transparent.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
      {/* Signup/Login modal for sell flow */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}
