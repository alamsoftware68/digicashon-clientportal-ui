"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const issueOptions = [
  {
    id: "keyboard",
    title: "Keyboard not working",
    icon: "/images/image-icon/device-functional-condition/keyboard-not-working.png",
  },
  {
    id: "cd-dvd",
    title: "CD / DVD drive issues",
    icon: "/images/image-icon/device-functional-condition/cd-drive-not-working.png",
  },
  {
    id: "touchpad",
    title: "Touchpad / click issue",
    icon: "/images/image-icon/device-functional-condition/touchpad-issue.png",
  },
  {
    id: "battery",
    title: "Battery / backup issue",
    icon: "/images/image-icon/device-functional-condition/battery-issue.png",
  },
  {
    id: "speakers",
    title: "Speakers not working",
    icon: "/images/image-icon/device-functional-condition/speaker-not-working.png",
  },
  {
    id: "wifi",
    title: "Wi‑Fi / wireless issue",
    icon: "/images/image-icon/device-functional-condition/wifi-wireless-issue.png",
  },
  {
    id: "charger",
    title: "Charger / adapter issue",
    icon: "/images/image-icon/device-functional-condition/charger-adaptor-issue.png",
  },
  {
    id: "usb",
    title: "USB port not working",
    icon: "/images/image-icon/device-functional-condition/usb-port-not-working.png",
  },
  {
    id: "webcam",
    title: "Webcam not working",
    icon: "/images/image-icon/device-functional-condition/webcame-not-working.png",
  },
  {
    id: "charging-port",
    title: "Charging port issue",
    icon: "/images/image-icon/device-functional-condition/charging-port-issue.png",
  },
  {
    id: "storage",
    title: "Hard drive / SSD issue",
    icon: "/images/image-icon/device-functional-condition/hard-disk-not-working.png",
  },
  {
    id: "motherboard",
    title: "Motherboard / system issue",
    icon: "/images/image-icon/device-functional-condition/motherboard-not-working.png",
  },
];

export default function FunctionalConditionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  const canContinue = true; // Always allow to continue (no issues means device works fine)

  const powerStatus = searchParams.get("power") ?? "yes";
  const processor = searchParams.get("processor");
  const ram = searchParams.get("ram");
  const storage = searchParams.get("storage");
  const screenSize = searchParams.get("screenSize");
  const graphics = searchParams.get("graphics");

  const selectedIssueLabels = selectedIssues.map((id) => {
    const found = issueOptions.find((opt) => opt.id === id);
    return { id, label: found?.title ?? "Custom issue" };
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-8 lg:gap-10 items-start">
          {/* Left column: functional condition grid */}
          <section className="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-[0_18px_60px_rgba(15,23,42,0.9)] p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-y-0 -right-40 w-80 bg-gradient-to-bl from-emerald-500/20 via-sky-500/0 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute -top-32 -left-24 h-56 w-56 bg-sky-500/10 blur-3xl pointer-events-none" />

            <header className="relative flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
                  Step 4 • Functional condition
                </p>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  Does your device
                  <span className="block bg-gradient-to-r from-emerald-300 via-sky-300 to-teal-200 bg-clip-text text-transparent">
                    function properly?
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px]">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  You can select multiple issues if needed.
                </span>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {issueOptions.map((opt) => {
                const selected = selectedIssues.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedIssues((prev) =>
                        prev.includes(opt.id)
                          ? prev.filter((id) => id !== opt.id)
                          : [...prev, opt.id]
                      );
                    }}
                    className={`group flex flex-col items-start justify-between rounded-2xl border px-4 py-3 text-left text-xs sm:text-sm transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-2xl hover:border-emerald-400/70 hover:bg-slate-800/80 ${
                      selected
                        ? "border-emerald-400 bg-emerald-500/10 text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.6)]"
                        : "border-slate-700 bg-slate-900/70 text-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="flex items-center gap-2">
                        {/* Icon image */}
                        <div className="relative h-9 w-9 flex-shrink-0 rounded-xl bg-slate-800/50 border border-slate-600 group-hover:border-emerald-300 overflow-hidden flex items-center justify-center">
                          <Image
                            src={opt.icon}
                            alt={opt.title}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <span className="font-semibold leading-snug text-left">
                          {opt.title}
                        </span>
                      </div>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                          selected
                            ? "border-emerald-400 bg-emerald-400 text-slate-950"
                            : "border-slate-500 text-slate-400 group-hover:border-emerald-300 group-hover:text-emerald-200"
                        }`}
                      >
                        {selected ? "✓" : ""}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-400 group-hover:text-slate-300">
                      {opt.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="relative mt-8 flex flex-col items-center justify-between gap-3 text-xs sm:flex-row sm:text-sm text-slate-400">
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => {
                  const params = new URLSearchParams({
                    power: powerStatus,
                    processor: processor ?? "",
                    ram: ram ?? "",
                    storage: storage ?? "",
                    screenSize: screenSize ?? "",
                    graphics: graphics ?? "",
                    issues: selectedIssues.length > 0 ? selectedIssues.join(",") : "none",
                  });
                  router.push(
                    `/sell/windows/laptop/samsung/galaxy-book-go-series/accessories?${params.toString()}`
                  );
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-40 hover:shadow-emerald-400/60 disabled:hover:shadow-emerald-500/40"
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
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-1">
                  Power status
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    Does the laptop switch ON?
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {powerStatus === "yes" ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-1">
                  System configuration
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Processor</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {processor ?? "Not selected"}
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
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {storage ?? "Not selected"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-1">
                  Additional features
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Screen size</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {screenSize ?? "Not selected"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Graphics</span>
                    <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                      {graphics ?? "Not selected"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-1">
                  Functional condition
                </p>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-slate-400 mt-0.5">Primary issues</span>
                  {selectedIssueLabels.length === 0 ? (
                    <span className="font-semibold text-slate-100 text-right text-[11px]">
                      Not selected
                    </span>
                  ) : (
                    <div className="max-w-[70%] max-h-24 overflow-y-auto">
                      <ul className="space-y-0.5 text-[11px] leading-snug text-slate-100 font-semibold text-right">
                        {selectedIssueLabels.map((item) => (
                          <li key={item.id} className="truncate">
                            {item.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
