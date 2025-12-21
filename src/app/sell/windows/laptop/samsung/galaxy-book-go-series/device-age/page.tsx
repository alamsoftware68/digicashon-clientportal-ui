'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const ageOptions = [
  {
    id: 'lt-1',
    label: 'Less than 1 year',
    description: 'Usually still under manufacturer warranty. Invoice may be required.',
  },
  {
    id: '1-3',
    label: 'Between 1 and 3 years',
    description: 'Typical everyday usage with moderate wear and tear.',
  },
  {
    id: 'gt-3',
    label: 'More than 3 years',
    description: 'Older device – value depends more on condition than age.',
  },
];

export default function DeviceAgePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [age, setAge] = useState<string | null>(null);

  const canContinue = Boolean(age);

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

  const formatIssues = () => {
    if (!issues) return 'Not selected';
    const ids = issues.split(',').filter(Boolean);
    if (!ids.length) return 'Not selected';
    return ids.join(', ');
  };

  const formatAge = () => {
    const found = ageOptions.find((o) => o.id === age);
    return found?.label ?? 'Not selected';
  };

  const handleContinue = () => {
    if (!age) return;
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
      age,
    });
    router.push(`/sell/windows/laptop/samsung/galaxy-book-go-series/physical-condition?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-8 lg:gap-10 items-start">
          {/* Left column: device age */}
          <section className="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-[0_18px_60px_rgba(15,23,42,0.9)] p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-y-0 -right-40 w-80 bg-gradient-to-bl from-emerald-500/20 via-sky-500/0 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute -top-32 -left-24 h-56 w-56 bg-sky-500/10 blur-3xl pointer-events-none" />

            <header className="relative text-center mb-10">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">Age of your device</h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
                Let us know how old your laptop is. For very new devices, we may ask for a purchase invoice for
                verification.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {ageOptions.map((opt) => {
                const selected = age === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setAge(opt.id);
                      // Immediately continue like a radio step
                      const next = opt.id;
                      if (next) {
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
                          age: next,
                        });
                        router.push(
                          `/sell/windows/laptop/samsung/galaxy-book-go-series/physical-condition?${params.toString()}`,
                        );
                      }
                    }}
                    className={`group flex flex-col items-start justify-between rounded-2xl border px-4 py-4 text-left text-xs sm:text-sm transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-xl hover:border-emerald-400/70 hover:bg-slate-800/80 ${
                      selected
                        ? 'border-emerald-400 bg-emerald-500/10 text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.5)]'
                        : 'border-slate-700 bg-slate-900/70 text-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border text-[11px] group-hover:border-emerald-300 group-hover:text-emerald-200">
                          {selected ? '●' : ''}
                        </span>
                        <span className="font-semibold leading-snug">{opt.label}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 group-hover:text-slate-300">{opt.description}</p>
                  </button>
                );
              })}
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
            </div>

            <div className="mt-auto pt-3 border-t border-slate-800/80 text-[11px] sm:text-xs text-slate-400 space-y-2">
              <p>
                We combine age with configuration and condition to estimate how much life is left in your Galaxy Book Go
                Series.
              </p>
              <p className="flex items-center gap-2">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Newer devices with good condition usually receive higher offers.
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
