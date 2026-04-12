"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";

interface BrandModel {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  iconUrl: string | null;
  enabled: boolean;
  brandId: number;
}

interface Brand {
  id: number;
  name: string;
  brandType: string;
  iconUrl: string | null;
}

interface EvaluationData {
  superCategory: string;
  brandId: number;
  brandName: string;
  brandModelId: number;
  brandModelName: string;
  basePrice: number;
  powerStatus: boolean | null;
  processorId: number | null;
  graphicsId: number | null;
  ramId: number | null;
  storageId: number | null;
  screenSizeId: number | null;
  functionalIssueIds: number[];
  hasInvoice: boolean;
  hasBox: boolean;
  ageCode: string | null;
  conditionCode: string | null;
  mobileNumber: string;
}

interface PriceCalculationResult {
  id: number;
  userId: number;
  superCategory: string;
  category: string;
  brandId: number;
  brandName: string;
  brandModelId: number;
  brandModelName: string;
  processorId: number;
  processorName: string;
  graphicsId?: number;
  graphicsName?: string;
  ramId: number;
  ramLabel: string;
  storageId: number;
  storageLabel: string;
  screenSizeId?: number;
  screenSizeLabel?: string;
  conditionCode: string;
  hasInvoice: boolean;
  hasBox: boolean;
  ageCode: string;
  ageMonths?: number;
  functionalIssues: {
    issueId: number;
    issueCode: string;
    issueLabel: string;
    priceDeduction: number;
    severity: string;
  }[];
  priceBreakdown: {
    basePrice: number;
    specImpact: number;
    conditionMultiplier: number;
    ageDepreciation: number;
    issueDeductions: number;
    invoicePremium: number;
    boxPremium: number;
    processingFee: number;
  };
  finalPrice: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface FinalPriceSummaryStepProps {
  evaluationData: EvaluationData;
  model: BrandModel;
  brand: Brand;
}

// ── Helpers ─────────────────────────────────────────────────────────────────
const DAY_NAMES   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const TIME_SLOTS = [
  { id: "morning",   label: "Morning",   time: "9:00 AM – 12:00 PM" },
  { id: "afternoon", label: "Afternoon", time: "2:00 PM –  5:00 PM" },
  { id: "evening",   label: "Evening",   time: "5:00 PM –  8:00 PM" },
];

function generateWeekDays(): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

function isToday(d: Date) {
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
}

function fmtDate(d: Date) {
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}

// ── Component ────────────────────────────────────────────────────────────────
const FinalPriceSummaryStep: React.FC<FinalPriceSummaryStepProps> = ({
  evaluationData,
  model,
  brand,
}) => {
  const router = useRouter();
  const { user, isLoggedIn, fetchUserAddresses, addAddress } = useAuth();

  // Price calculation
  const [priceData, setPriceData]   = useState<PriceCalculationResult | null>(null);
  const [loading, setLoading]       = useState(true);
  const [calcError, setCalcError]   = useState("");

  // Modal visibility flags
  const [showLoginModal,   setShowLoginModal]   = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showSuccess,      setShowSuccess]      = useState(false);

  // When login modal is closed we may want to auto-open Order Summary
  const pendingOrderAfterLogin = useRef(false);

  // Address (inside Order Summary modal)
  const [summaryAddress,    setSummaryAddress]    = useState<any | null>(null);
  const [showAddForm,       setShowAddForm]       = useState(false);
  const [newAddr, setNewAddr] = useState({ type: "Home", address: "", city: "", state: "", zipCode: "", isDefault: false });
  const [addingAddr,        setAddingAddr]        = useState(false);

  // Slot (inside Order Summary modal)
  const weekDays = useMemo(() => generateWeekDays(), []);
  const [summaryDate,       setSummaryDate]       = useState<Date | null>(null);
  const [summaryTimeSlot,   setSummaryTimeSlot]   = useState<string | null>(null);

  // Place order
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError,   setOrderError]   = useState<string | null>(null);
  const [orderId,      setOrderId]      = useState<string>("");

  // ── Calculate price on mount ───────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setCalcError("");
        const req = {
          userId: user?.id ? parseInt(user.id) : 1,
          superCategory: evaluationData.superCategory,
          category:      evaluationData.superCategory,
          brandId:       evaluationData.brandId,
          brandModelId:  evaluationData.brandModelId,
          processorId:   evaluationData.processorId!,
          graphicsId:    evaluationData.graphicsId  || undefined,
          ramId:         evaluationData.ramId!,
          storageId:     evaluationData.storageId!,
          screenSizeId:  evaluationData.screenSizeId || undefined,
          conditionCode: evaluationData.conditionCode!,
          hasInvoice:    evaluationData.hasInvoice,
          hasBox:        evaluationData.hasBox,
          ageCode:       evaluationData.ageCode!,
          functionalIssueIds: evaluationData.functionalIssueIds,
          notes: `Customer mobile: ${evaluationData.mobileNumber}`,
        };
        const res = await apiService.calculateDevicePrice(req);
        if (res.success && res.data) {
          setPriceData(res.data);
        } else {
          setCalcError(res.message || "Failed to calculate price");
        }
      } catch {
        setCalcError("An error occurred while calculating the price");
      } finally {
        setLoading(false);
      }
    })();
  }, [evaluationData]);

  // ── When user logs in while pendingOrderAfterLogin is set, open summary ───
  useEffect(() => {
    if (isLoggedIn && pendingOrderAfterLogin.current) {
      pendingOrderAfterLogin.current = false;
      setShowLoginModal(false);
      openOrderSummary();
    }
  }, [isLoggedIn]);

  // ── Open Order Summary — fetch addresses & pre-select default ─────────────
  const openOrderSummary = async () => {
    if (user) {
      await fetchUserAddresses();
    }
    // Pre-select default or first address
    const addresses = user?.addresses ?? [];
    if (addresses.length > 0 && !summaryAddress) {
      setSummaryAddress(addresses.find((a: any) => a.isDefault) ?? addresses[0]);
    }
    setShowOrderSummary(true);
  };

  // ── Place Order button click ───────────────────────────────────────────────
  const handlePlaceOrderClick = () => {
    if (!isLoggedIn) {
      pendingOrderAfterLogin.current = true;
      setShowLoginModal(true);
    } else {
      openOrderSummary();
    }
  };

  // ── Handle Login Modal close ───────────────────────────────────────────────
  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    // If user is now logged in (e.g. closed after login), open summary
    if (isLoggedIn && pendingOrderAfterLogin.current) {
      pendingOrderAfterLogin.current = false;
      openOrderSummary();
    } else {
      pendingOrderAfterLogin.current = false;
    }
  };

  // ── Confirm & place order ─────────────────────────────────────────────────
  const canConfirm = summaryAddress && summaryDate && summaryTimeSlot;

  const handleConfirmOrder = async () => {
    if (!priceData || !canConfirm) return;
    setPlacingOrder(true);
    setOrderError(null);
    try {
      const res = await apiService.approveDeviceEvaluation(priceData.id);
      if (res.success) {
        // Persist address + schedule so the Order Details modal can display them
        const addrParts = [summaryAddress?.address, summaryAddress?.city, summaryAddress?.state, summaryAddress?.zipCode].filter(Boolean);
        localStorage.setItem(`sell_order_meta_${priceData.id}`, JSON.stringify({
          pickupAddress: summaryAddress?.fullAddress || addrParts.join(', '),
          addressType: summaryAddress?.type || 'Home',
          pickupDate: summaryDate?.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' }),
          pickupTimeSlot: summaryTimeSlot,
        }));
        setOrderId(`ORD-EVAL-${priceData.id}`);
        setShowOrderSummary(false);
        setShowSuccess(true);
      } else {
        setOrderError(res.message || "Failed to place order. Please try again.");
      }
    } catch {
      setOrderError("An error occurred. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  // ── Add new address inline ─────────────────────────────────────────────────
  const handleAddAddress = async () => {
    if (!newAddr.address || !newAddr.city || !newAddr.state || !newAddr.zipCode) {
      alert("Please fill in all address fields.");
      return;
    }
    if (!/^\d{6}$/.test(newAddr.zipCode)) {
      alert("ZIP code must be exactly 6 numeric digits.");
      return;
    }
    try {
      setAddingAddr(true);
      await addAddress(newAddr);
      await fetchUserAddresses();
      // Auto-select the newly added address (last in list)
      const updated = user?.addresses ?? [];
      if (updated.length > 0) setSummaryAddress(updated[updated.length - 1]);
      setNewAddr({ type: "Home", address: "", city: "", state: "", zipCode: "", isDefault: false });
      setShowAddForm(false);
    } catch (err: any) {
      alert(err?.message || "Failed to add address. Please try again.");
    } finally {
      setAddingAddr(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mb-4" />
        <p className="text-gray-700 text-lg">Calculating your device price...</p>
      </div>
    );
  }

  if (calcError || !priceData) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h3 className="text-gray-900 text-2xl font-bold mb-2">Error Calculating Price</h3>
        <p className="text-gray-500 mb-6">{calcError || "Unable to calculate price"}</p>
        <button onClick={() => window.location.reload()} className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  const slotLabel = summaryDate && summaryTimeSlot
    ? `${fmtDate(summaryDate)} · ${TIME_SLOTS.find(s => s.id === summaryTimeSlot)?.time}`
    : null;

  return (
    <>
      {/* ═══════════════════════ MAIN LAYOUT ═══════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left / Main content ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Final Price hero */}
          <div className="bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 rounded-3xl p-8 shadow-lg border border-cyan-400">
            <div className="text-center">
              <p className="text-white/80 text-sm font-semibold uppercase tracking-wide mb-2">Estimated Selling Price</p>
              <div className="text-6xl font-bold text-white mb-4">₹{priceData.finalPrice.toLocaleString()}</div>
              <p className="text-white/90 text-base">For your {brand.name} {model.name}</p>
            </div>
          </div>

          {/* Device Configuration */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-gray-900 font-bold text-2xl mb-6">Device Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Brand & Model",  value: `${priceData.brandName} ${priceData.brandModelName}` },
                { label: "Processor",      value: priceData.processorName },
                ...(priceData.graphicsName ? [{ label: "Graphics Card", value: priceData.graphicsName }] : []),
                { label: "RAM",            value: priceData.ramLabel },
                { label: "Storage",        value: priceData.storageLabel },
                ...(priceData.screenSizeLabel ? [{ label: "Screen Size", value: priceData.screenSizeLabel }] : []),
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-gray-500 text-sm mb-1">{item.label}</p>
                  <p className="text-gray-900 font-semibold">{item.value}</p>
                </div>
              ))}
            </div>

            {priceData.functionalIssues?.length > 0 && (
              <div className="mt-6">
                <h4 className="text-gray-900 font-semibold mb-3">Functional Issues</h4>
                <div className="space-y-2">
                  {priceData.functionalIssues.map(issue => (
                    <div key={issue.issueId} className="bg-red-50 border border-red-200 rounded-xl p-3 flex justify-between">
                      <span className="text-red-700 text-sm">{issue.issueLabel}</span>
                      <span className="text-red-600 text-sm font-semibold">-₹{issue.priceDeduction}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <h4 className="text-gray-900 font-semibold mb-3">Accessories</h4>
              <div className="flex space-x-4">
                {[
                  { label: "Invoice", has: priceData.hasInvoice },
                  { label: "Box",     has: priceData.hasBox     },
                ].map(item => (
                  <div key={item.label} className={`flex-1 ${item.has ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"} border rounded-xl p-3 text-center`}>
                    <p className={`text-sm ${item.has ? "text-green-700" : "text-gray-500"}`}>
                      {item.label}: {item.has ? "✓ Yes" : "✗ No"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-gray-900 font-bold text-2xl mb-6">Price Breakdown</h3>
            <div className="space-y-3">
              {priceData.priceBreakdown.specImpact !== 0 && (
                <BreakdownRow label="Spec Quality Score" value={`${priceData.priceBreakdown.specImpact.toFixed(1)}%`} color="text-blue-600" />
              )}
              {priceData.priceBreakdown.conditionMultiplier !== 1 && (
                <BreakdownRow label={`Condition Adjustment (${(priceData.priceBreakdown.conditionMultiplier*100).toFixed(0)}%)`} value="Applied" color="text-orange-600" />
              )}
              {priceData.priceBreakdown.ageDepreciation !== 0 && priceData.priceBreakdown.ageDepreciation !== 1 && (
                <BreakdownRow label={`Age Depreciation (${(priceData.priceBreakdown.ageDepreciation*100).toFixed(0)}%)`} value="Applied" color="text-orange-600" />
              )}
              {priceData.priceBreakdown.issueDeductions !== 0 && (
                <BreakdownRow label="Issue Deductions" value={`-₹${Math.abs(priceData.priceBreakdown.issueDeductions).toLocaleString()}`} color="text-red-500" />
              )}
              {priceData.priceBreakdown.invoicePremium !== 0 && (
                <BreakdownRow label="Invoice Premium" value={`+₹${priceData.priceBreakdown.invoicePremium.toLocaleString()}`} color="text-green-600" />
              )}
              {priceData.priceBreakdown.boxPremium !== 0 && (
                <BreakdownRow label="Box Premium" value={`+₹${priceData.priceBreakdown.boxPremium.toLocaleString()}`} color="text-green-600" />
              )}
              {priceData.priceBreakdown.processingFee !== 0 && (
                <BreakdownRow label="Processing Fee" value={`-₹${Math.abs(priceData.priceBreakdown.processingFee).toLocaleString()}`} color="text-red-500" />
              )}
              <div className="flex justify-between items-center pt-3">
                <span className="text-gray-900 font-bold text-lg">Final Price</span>
                <span className="text-cyan-600 font-bold text-2xl">₹{priceData.finalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <h4 className="text-gray-900 font-semibold text-lg mb-4">Contact Information</h4>
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
              <p className="text-gray-500 text-sm mb-1">Mobile Number</p>
              <p className="text-gray-900 font-semibold">+91 {evaluationData.mobileNumber}</p>
            </div>
          </div>

          {/* Sell Summary card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-lg">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Your Offer</p>
            <div className="text-4xl font-extrabold mb-1">₹{priceData.finalPrice.toLocaleString()}</div>
            <p className="text-slate-300 text-sm">{brand.name} {model.name}</p>
            <div className="mt-4 border-t border-slate-700 pt-4 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Processor</span>
                <span className="text-slate-200 font-medium">{priceData.processorName}</span>
              </div>
              <div className="flex justify-between">
                <span>RAM</span>
                <span className="text-slate-200 font-medium">{priceData.ramLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>Storage</span>
                <span className="text-slate-200 font-medium">{priceData.storageLabel}</span>
              </div>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            onClick={handlePlaceOrderClick}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-5 px-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 text-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Place Order
          </button>

          <p className="text-center text-gray-400 text-xs">
            {isLoggedIn ? "Click to review & confirm your sell order" : "Login required to place the order"}
          </p>
        </div>
      </div>

      {/* ═══════════════════════ LOGIN MODAL ═══════════════════════ */}
      <LoginModal isOpen={showLoginModal} onClose={handleLoginModalClose} />

      {/* ═══════════════════════ ORDER SUMMARY MODAL ═══════════════════════ */}
      {showOrderSummary && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8">

            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-t-3xl px-7 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Review Your Order</h2>
                <p className="text-cyan-100 text-sm mt-0.5">Confirm details before placing your sell order</p>
              </div>
              <button onClick={() => { setShowOrderSummary(false); setOrderError(null); }}
                className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-7 space-y-6">

              {/* Device + Price */}
              <div className="flex items-center justify-between bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-5 border border-cyan-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Device</p>
                  <p className="font-bold text-gray-900 text-lg">{priceData.brandName} {priceData.brandModelName}</p>
                  <p className="text-xs text-gray-500 mt-1">{priceData.processorName} · {priceData.ramLabel} · {priceData.storageLabel}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Sell Price</p>
                  <p className="text-3xl font-extrabold text-cyan-600">₹{priceData.finalPrice.toLocaleString()}</p>
                </div>
              </div>

              {/* ── Pickup Address ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-xs font-bold">1</span>
                    Pickup Address
                  </h3>
                  {!showAddForm && (
                    <button onClick={() => setShowAddForm(true)}
                      className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New
                    </button>
                  )}
                </div>

                {showAddForm ? (
                  /* Inline add address form */
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-800">New Address</p>
                      <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <select value={newAddr.type} onChange={e => setNewAddr({...newAddr, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-cyan-400 outline-none">
                      <option>Home</option><option>Work</option><option>Other</option>
                    </select>
                    <input type="text" placeholder="Street Address" value={newAddr.address}
                      onChange={e => setNewAddr({...newAddr, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-cyan-400 outline-none" />
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: "city",    ph: "City"    },
                        { key: "state",   ph: "State"   },
                        { key: "zipCode", ph: "ZIP Code" },
                      ].map(f => (
                        <input key={f.key} type="text" placeholder={f.ph}
                          value={(newAddr as any)[f.key]}
                          onChange={e => setNewAddr({...newAddr, [f.key]: e.target.value})}
                          maxLength={f.key === "zipCode" ? 6 : undefined}
                          className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-cyan-400 outline-none" />
                      ))}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => setShowAddForm(false)} disabled={addingAddr}
                        className="flex-1 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50">
                        Cancel
                      </button>
                      <button onClick={handleAddAddress} disabled={addingAddr}
                        className="flex-1 py-2 bg-cyan-500 text-white rounded-xl text-sm font-medium hover:bg-cyan-600 disabled:opacity-50">
                        {addingAddr ? "Saving..." : "Save Address"}
                      </button>
                    </div>
                  </div>
                ) : (user?.addresses ?? []).length === 0 ? (
                  /* No addresses */
                  <div className="text-center py-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 text-sm mb-3">No saved addresses</p>
                    <button onClick={() => setShowAddForm(true)}
                      className="text-cyan-600 text-sm font-semibold hover:text-cyan-700">
                      + Add Your Address
                    </button>
                  </div>
                ) : (
                  /* Address list */
                  <div className="space-y-2">
                    {(user?.addresses ?? []).map((addr: any) => {
                      const sel = summaryAddress?.id === addr.id;
                      return (
                        <button key={addr.id} onClick={() => setSummaryAddress(addr)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${sel ? "border-cyan-400 bg-cyan-50" : "border-gray-200 hover:border-gray-300"}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-sm font-semibold text-gray-900">{addr.type}</p>
                                {addr.isDefault && (
                                  <span className="text-[10px] bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded-full font-medium">Default</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 leading-snug truncate">
                                {addr.address}, {addr.city}, {addr.state} – {addr.zipCode}
                              </p>
                            </div>
                            {sel && (
                              <div className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Pickup Slot ── */}
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
                  Pickup Date & Time
                </h3>

                {/* 7-day strip */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {weekDays.map((d, i) => {
                    const sel = summaryDate?.toDateString() === d.toDateString();
                    return (
                      <button key={i} onClick={() => { setSummaryDate(d); setSummaryTimeSlot(null); }}
                        className={`flex flex-col items-center py-2.5 px-1 rounded-xl transition-all ${sel ? "bg-cyan-500 shadow-md" : "hover:bg-gray-100"}`}>
                        <span className={`text-[10px] font-medium mb-0.5 ${sel ? "text-white/80" : "text-gray-400"}`}>
                          {isToday(d) ? "Today" : DAY_NAMES[d.getDay()]}
                        </span>
                        <span className={`text-sm font-bold ${sel ? "text-white" : "text-gray-800"}`}>{d.getDate()}</span>
                        <span className={`text-[9px] mt-0.5 ${sel ? "text-white/70" : "text-gray-400"}`}>{MONTH_NAMES[d.getMonth()]}</span>
                      </button>
                    );
                  })}
                </div>

                {summaryDate ? (
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(slot => {
                      const sel = summaryTimeSlot === slot.id;
                      return (
                        <button key={slot.id} onClick={() => setSummaryTimeSlot(slot.id)}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${sel ? "border-cyan-400 bg-cyan-50" : "border-gray-200 hover:border-gray-300"}`}>
                          <p className={`text-sm font-semibold ${sel ? "text-cyan-700" : "text-gray-800"}`}>{slot.label}</p>
                          <p className={`text-[10px] mt-0.5 ${sel ? "text-cyan-500" : "text-gray-500"}`}>{slot.time}</p>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-3">Select a date to see available time slots</p>
                )}
              </div>

              {/* Selected summary pill */}
              {summaryAddress && slotLabel && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-emerald-700 font-medium truncate">{summaryAddress.address}, {summaryAddress.city}</p>
                    <p className="text-xs text-emerald-600">{slotLabel}</p>
                  </div>
                </div>
              )}

              {orderError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{orderError}</div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-1">
                <button onClick={() => { setShowOrderSummary(false); setOrderError(null); }} disabled={placingOrder}
                  className="flex-1 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm">
                  Back
                </button>
                <button onClick={handleConfirmOrder} disabled={!canConfirm || placingOrder}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    canConfirm && !placingOrder
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.01]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}>
                  {placingOrder ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Placing Order...</>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Place Order
                    </>
                  )}
                </button>
              </div>
              {!canConfirm && (
                <p className="text-center text-xs text-gray-400 -mt-2">
                  {!summaryAddress && !summaryDate ? "Select address and pickup date to continue"
                    : !summaryAddress ? "Select a pickup address"
                    : !summaryDate ? "Select a pickup date"
                    : "Select a time slot to continue"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════ SUCCESS NOTIFICATION ═══════════════════════ */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">

            {/* Confetti-style top band */}
            <div className="relative bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 px-8 py-10 text-white text-center overflow-hidden">
              {/* Decorative blobs */}
              <div className="absolute top-2 right-6 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-2 left-6 w-20 h-20 bg-white/10 rounded-full blur-2xl" />

              {/* Checkmark */}
              <div className="relative mx-auto w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-5 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold mb-1">Order Placed!</h2>
              <p className="text-emerald-100 text-sm">Your sell order has been confirmed</p>
            </div>

            {/* Details */}
            <div className="px-8 py-6 space-y-4">

              {/* Order ID pill */}
              <div className="flex items-center justify-center">
                <div className="bg-slate-100 rounded-xl px-5 py-3 text-center">
                  <p className="text-xs text-gray-500 mb-0.5 font-medium">Order Reference</p>
                  <p className="text-lg font-extrabold text-gray-900 tracking-wider">{orderId}</p>
                </div>
              </div>

              {/* Info rows */}
              <div className="space-y-3">
                <InfoRow icon="device" label="Device" value={`${priceData.brandName} ${priceData.brandModelName}`} />
                <InfoRow icon="price"  label="Sell Price" value={`₹${priceData.finalPrice.toLocaleString()}`} valueClass="text-emerald-600 font-bold" />
                {summaryAddress && (
                  <InfoRow icon="location" label="Pickup From"
                    value={`${summaryAddress.address}, ${summaryAddress.city}`} />
                )}
                {slotLabel && <InfoRow icon="calendar" label="Scheduled" value={slotLabel} />}
              </div>

              <p className="text-xs text-gray-400 text-center pt-1">
                Our team will contact you before the pickup to confirm.
              </p>
            </div>

            {/* Actions */}
            <div className="px-8 pb-7 flex gap-3">
              <button onClick={() => setShowSuccess(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm">
                Close
              </button>
              <button
                onClick={() => { setShowSuccess(false); router.push("/profile?tab=orders"); }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View Order History
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ── Small helpers ─────────────────────────────────────────────────────────────

const BreakdownRow = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
    <span className="text-gray-600">{label}</span>
    <span className={`font-semibold ${color}`}>{value}</span>
  </div>
);

const ICONS: Record<string, React.ReactNode> = {
  device:   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8M12 17v4"/></svg>,
  price:    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  location: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  calendar: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
};

const InfoRow = ({ icon, label, value, valueClass = "text-gray-900 font-semibold" }: {
  icon: string; label: string; value: string; valueClass?: string;
}) => (
  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 flex-shrink-0">
      {ICONS[icon]}
    </div>
    <div className="flex-1 min-w-0 flex justify-between items-center">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-sm ${valueClass} text-right max-w-[60%] truncate`}>{value}</span>
    </div>
  </div>
);

export default FinalPriceSummaryStep;
