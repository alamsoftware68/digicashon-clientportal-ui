'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useAuth } from '@/contexts/AuthContext';

export default function PriceSummaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuth();
  
  const [basePrice] = useState(200);
  const [pickupCharges] = useState(100);
  const [processingFee] = useState(49);
  const [discount] = useState(100);
  
  // Calculate total
  const totalAmount = basePrice + pickupCharges + processingFee - discount;
  
  // Get all device details from URL params
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
  const bodyScratch = searchParams.get('bodyScratch');
  const topDent = searchParams.get('topDent');
  const baseDent = searchParams.get('baseDent');
  const hinges = searchParams.get('hinges');
  const panel = searchParams.get('panel');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoggedIn) {
      router.push('/sell/windows/laptop/samsung/galaxy-book-go-series/physical-condition');
    }
  }, [isLoggedIn, router]);

  const formatIssues = () => {
    if (!issues) return 'None';
    const ids = issues.split(',').filter(Boolean);
    if (!ids.length) return 'None';
    return ids.join(', ');
  };

  const formatAge = () => {
    if (!age) return 'Not selected';
    if (age === 'lt-1') return 'Less than 1 year';
    if (age === '1-3') return 'Between 1 and 3 years';
    if (age === 'gt-3') return 'More than 3 years';
    return 'Not selected';
  };

  const handleSellNow = () => {
    // TODO: Navigate to address selection or final confirmation
    alert('Proceeding to sell your device...');
  };

  const handleRecalculate = () => {
    // Navigate back to power status page to restart the flow
    router.push('/sell/windows/laptop/samsung/galaxy-book-go-series/power-status');
  };

  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Device Header with Image */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative h-16 w-24 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/Samsung.png"
                  alt="Galaxy Book Go Series"
                  width={80}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Galaxy Book Go Series
                </h1>
                <p className="text-slate-400 text-sm">Windows • Samsung Laptop</p>
              </div>
            </div>
          </div>

          {/* Main Content - Compact Single Column Design */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-6">
            {/* Left Column - Price Summary Card */}
            <div className="space-y-4">
              {/* Price Display Card */}
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-900/60 rounded-2xl border border-slate-800/80 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Estimated selling price</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">₹{totalAmount}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-medium">
                        Best Offer
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-slate-800/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Base Price</span>
                      <span className="font-medium text-white">₹{basePrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Pickup Charges</span>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 text-xs font-medium">FREE</span>
                        <span className="line-through text-slate-600">₹{pickupCharges}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Processing Fee</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">-₹{processingFee}</span>
                        <span className="line-through text-slate-600 text-xs">₹{pickupCharges}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleSellNow}
                      className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 hover:scale-[1.02]"
                    >
                      <span>Sell Now</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={handleRecalculate}
                      className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/40 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Recalculate Price</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-900/60 rounded-xl border border-slate-800/60 p-4 text-center">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 mb-2">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-white mb-1">Fast Payment</p>
                  <p className="text-[10px] text-slate-400">Instant transfer</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl border border-slate-800/60 p-4 text-center">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 mb-2">
                    <svg className="h-5 w-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-white mb-1">Free Pickup</p>
                  <p className="text-[10px] text-slate-400">Doorstep service</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl border border-slate-800/60 p-4 text-center">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 mb-2">
                    <svg className="h-5 w-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-white mb-1">100% Safe</p>
                  <p className="text-[10px] text-slate-400">Secure process</p>
                </div>
              </div>

              {/* Info Alert */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <div className="flex gap-3">
                  <svg className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Our team will contact you within 24 hours to schedule the pickup. Get real-time updates on WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Payment Options */}
            <div className="space-y-4">
              {/* Payment Options Card */}
              <div className="bg-slate-900/60 rounded-2xl border border-slate-800/60 p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Payment Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-purple-500/10">
                      <svg className="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-white">Instant Cash</p>
                      <p className="text-[10px] text-slate-400">UPI / Bank Transfer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-500/10">
                      <svg className="h-4 w-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-white">Paytm Wallet</p>
                      <p className="text-[10px] text-slate-400">Digital payment</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-500/10">
                      <svg className="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-white">Amazon Pay</p>
                      <p className="text-[10px] text-slate-400">Gift voucher</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Updates Card */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <h3 className="text-sm font-semibold text-white">Get Updates</h3>
                </div>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  Receive instant notifications about your order status and pickup schedule.
                </p>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-xs font-medium text-green-300 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>Enable WhatsApp Alerts</span>
                </button>
              </div>
            </div>
          </div>

          {/* FAQs Section */}
          <section className="mt-8 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-[0_18px_60px_rgba(15,23,42,0.9)] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">FAQs</h2>
            
            <div className="space-y-4">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer py-3 text-sm sm:text-base font-medium hover:text-emerald-400 transition-colors">
                  <span>How did you calculate my device price?</span>
                  <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-2 text-sm text-slate-400 pb-3">
                  We calculate your device price based on the configuration, age, and physical condition you selected during the evaluation process.
                </p>
              </details>

              <details className="group border-t border-slate-800 pt-4">
                <summary className="flex items-center justify-between cursor-pointer py-3 text-sm sm:text-base font-medium hover:text-emerald-400 transition-colors">
                  <span>Will I get the same device price as offered?</span>
                  <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-2 text-sm text-slate-400 pb-3">
                  Yes, you will receive the quoted price if your device matches the condition you selected. Our team will verify during pickup.
                </p>
              </details>

              <details className="group border-t border-slate-800 pt-4">
                <summary className="flex items-center justify-between cursor-pointer py-3 text-sm sm:text-base font-medium hover:text-emerald-400 transition-colors">
                  <span>How does Voucher payment work?</span>
                  <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-2 text-sm text-slate-400 pb-3">
                  We offer multiple payment options including instant bank transfer, UPI, Paytm, and Amazon Pay vouchers. Choose your preferred method during checkout.
                </p>
              </details>
            </div>

            <button 
              type="button"
              className="mt-6 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Load More FAQs
            </button>
          </section>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
