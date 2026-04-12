"use client";

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";

interface SellOrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any; // sell order object from OrdersHistory
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:     { label: "Pending Review",  color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
  CONFIRMED:   { label: "Confirmed",       color: "text-blue-700",   bg: "bg-blue-50 border-blue-200"   },
  IN_PROGRESS: { label: "In Progress",     color: "text-purple-700", bg: "bg-purple-50 border-purple-200"},
  COMPLETED:   { label: "Completed",       color: "text-green-700",  bg: "bg-green-50 border-green-200" },
  CANCELLED:   { label: "Cancelled",       color: "text-red-700",    bg: "bg-red-50 border-red-200"     },
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const fmtPrice = (p: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(p);

interface OrderMeta {
  pickupAddress: string;
  addressType: string;
  pickupDate: string;
  pickupTimeSlot: string;
}

const SellOrderDetailsModal: React.FC<SellOrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
  const [orderMeta, setOrderMeta] = useState<OrderMeta | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    if (!isOpen || !order) return;
    // Extract evaluation ID from "SELL-92" → 92
    const evalId = order.orderNumber?.replace("SELL-", "");
    if (evalId) {
      try {
        const raw = localStorage.getItem(`sell_order_meta_${evalId}`);
        if (raw) setOrderMeta(JSON.parse(raw));
      } catch {
        // ignore parse errors
      }
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const status = order.status as string;
  const statusCfg = STATUS_CONFIG[status] ?? { label: status, color: "text-gray-700", bg: "bg-gray-50 border-gray-200" };
  const dd = order.deviceDetails ?? {};

  // jsPDF default font cannot render the Rs symbol — use plain INR prefix
  const fmtPricePdf = (p: number) =>
    "INR " + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(p);

  const downloadAsPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const section = (title: string, yPos: number) => {
        pdf.setFontSize(13);
        pdf.setTextColor(51, 51, 51);
        pdf.text(title, 20, yPos);
        return yPos + 9;
      };

      const divider = (yPos: number) => {
        pdf.setDrawColor(220, 220, 220);
        pdf.line(20, yPos, 190, yPos);
        return yPos + 8;
      };

      // ── Header ──
      pdf.setFontSize(20);
      pdf.setTextColor(30, 30, 30);
      pdf.text("DigiCashOn - Sell Order Details", 20, 25);

      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Order Number: ${order.orderNumber}`, 20, 38);
      pdf.text(`Date: ${fmtDate(order.createdAt)}`, 20, 45);
      pdf.text(`Status: ${statusCfg.label}`, 20, 52);

      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 58, 190, 58);

      let y = 68;

      // ── Price Summary ──
      y = section("Price Summary", y);
      pdf.setFontSize(10);
      pdf.setTextColor(120, 120, 120);
      pdf.text("Sell Price:", 20, y);
      pdf.setFontSize(12);
      pdf.setTextColor(22, 163, 74); // emerald
      pdf.text(fmtPricePdf(order.totalPrice), 70, y);
      y += 5;
      y = divider(y);

      // ── Device Specs ──
      y = section("Device Specifications", y);
      pdf.setFontSize(10);

      const specs: [string, string][] = [
        ["Device",      dd.name],
        ["Processor",   dd.processor],
        ["RAM",         dd.ram],
        ["Storage",     dd.storage],
        ["Graphics",    dd.graphics],
        ["Screen Size", dd.screenSize],
        ["Condition",   dd.conditionCode ? dd.conditionCode.replace(/-/g, " ") : ""],
        ["Device Age",  dd.ageCode ? dd.ageCode.replace(/_/g, " ") : ""],
      ].filter(([, v]) => v) as [string, string][];

      specs.forEach(([label, value]) => {
        pdf.setTextColor(120, 120, 120);
        pdf.text(`${label}:`, 20, y);
        pdf.setTextColor(51, 51, 51);
        pdf.text(value, 70, y);
        y += 7;
      });

      y += 2;
      y = divider(y);

      // ── Pickup Details ──
      if (orderMeta?.pickupAddress) {
        y = section("Pickup Details", y);
        pdf.setFontSize(10);

        pdf.setTextColor(120, 120, 120);
        pdf.text(`Address Type:`, 20, y);
        pdf.setTextColor(51, 51, 51);
        pdf.text(orderMeta.addressType, 70, y);
        y += 7;

        pdf.setTextColor(120, 120, 120);
        pdf.text(`Address:`, 20, y);
        pdf.setTextColor(51, 51, 51);
        const addrLines = pdf.splitTextToSize(orderMeta.pickupAddress, 115);
        pdf.text(addrLines, 70, y);
        y += addrLines.length * 6 + 2;

        if (orderMeta.pickupDate) {
          pdf.setTextColor(120, 120, 120);
          pdf.text(`Pickup Date:`, 20, y);
          pdf.setTextColor(51, 51, 51);
          pdf.text(orderMeta.pickupDate, 70, y);
          y += 7;

          pdf.setTextColor(120, 120, 120);
          pdf.text(`Time Slot:`, 20, y);
          pdf.setTextColor(51, 51, 51);
          pdf.text(orderMeta.pickupTimeSlot ?? "", 70, y);
          y += 7;
        }

        y += 2;
        y = divider(y);
      }

      // ── What Happens Next ──
      if (status === "PENDING" || status === "CONFIRMED") {
        if (y > 240) { pdf.addPage(); y = 20; }
        y = section("What Happens Next?", y);
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        const steps = [
          "1. Our team will review your device evaluation",
          "2. We will contact you to confirm the pickup schedule",
          "3. Our technician will collect the device and verify the condition",
          `4. Payment of ${fmtPricePdf(order.totalPrice)} will be processed after verification`,
        ];
        steps.forEach(step => {
          const lines = pdf.splitTextToSize(step, 170);
          pdf.text(lines, 20, y);
          y += lines.length * 6 + 2;
        });
      }

      // ── Footer ──
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Generated on ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`,
          20, 285
        );
        pdf.text(`Page ${i} of ${pageCount}`, 170, 285);
      }

      pdf.save(`SellOrder-${order.orderNumber}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-cyan-100 uppercase tracking-widest">Sell Order</span>
              <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {order.orderNumber}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{dd.name || "Device Sell"}</h2>
            <p className="text-cyan-100 text-sm mt-0.5">Placed on {fmtDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            {/* ── Download PDF ── */}
            <button
              onClick={downloadAsPDF}
              disabled={isGeneratingPdf}
              title="Download as PDF"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 disabled:opacity-50 rounded-xl transition-colors text-white text-xs font-semibold"
            >
              {isGeneratingPdf ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="hidden sm:inline">Generating…</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="hidden sm:inline">Download PDF</span>
                </>
              )}
            </button>
            {/* ── Close ── */}
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-7 space-y-6">

          {/* ── Status + Price ── */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${statusCfg.bg} ${statusCfg.color}`}>
              <span className="w-2 h-2 rounded-full bg-current opacity-70" />
              {statusCfg.label}
            </span>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-0.5">Sell Price</p>
              <p className="text-2xl font-extrabold text-emerald-600">{fmtPrice(order.totalPrice)}</p>
            </div>
          </div>

          {/* ── Device Specs ── */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 bg-slate-100 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700">Device Specifications</h3>
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-200">
              {[
                { label: "Device",      value: dd.name        },
                { label: "Processor",   value: dd.processor   },
                { label: "RAM",         value: dd.ram         },
                { label: "Storage",     value: dd.storage     },
                { label: "Graphics",    value: dd.graphics    },
                { label: "Screen Size", value: dd.screenSize  },
              ].filter(row => row.value).map((row, i) => (
                <div key={i} className="px-5 py-3">
                  <p className="text-xs text-gray-500 mb-0.5">{row.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Condition & Age ── */}
          {(dd.conditionCode || dd.ageCode) && (
            <div className="grid grid-cols-2 gap-4">
              {dd.conditionCode && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                  <p className="text-xs text-orange-600 font-medium mb-0.5">Condition</p>
                  <p className="text-sm font-semibold text-orange-800 capitalize">
                    {dd.conditionCode.replace(/-/g, " ")}
                  </p>
                </div>
              )}
              {dd.ageCode && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                  <p className="text-xs text-blue-600 font-medium mb-0.5">Device Age</p>
                  <p className="text-sm font-semibold text-blue-800 capitalize">
                    {dd.ageCode.replace(/_/g, " ")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Pickup Address ── */}
          {orderMeta ? (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 bg-slate-100 border-b border-slate-200 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-sm font-semibold text-slate-700">Pickup Details</h3>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="px-5 py-3">
                  <p className="text-xs text-gray-500 mb-0.5">Address ({orderMeta.addressType})</p>
                  <p className="text-sm font-semibold text-gray-900">{orderMeta.pickupAddress}</p>
                </div>
                {orderMeta.pickupDate && (
                  <div className="grid grid-cols-2 divide-x divide-slate-100">
                    <div className="px-5 py-3">
                      <p className="text-xs text-gray-500 mb-0.5">Pickup Date</p>
                      <p className="text-sm font-semibold text-gray-900">{orderMeta.pickupDate}</p>
                    </div>
                    <div className="px-5 py-3">
                      <p className="text-xs text-gray-500 mb-0.5">Time Slot</p>
                      <p className="text-sm font-semibold text-gray-900">{orderMeta.pickupTimeSlot}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 flex items-center gap-3">
              <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-amber-700">Our team will contact you to schedule the pickup.</p>
            </div>
          )}

          {/* ── Order Info ── */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 bg-slate-100 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700">Order Information</h3>
            </div>
            <div className="divide-y divide-slate-100">
              <InfoRow label="Order Number"  value={order.orderNumber} />
              <InfoRow label="Order Date"    value={fmtDate(order.createdAt)} />
              <InfoRow label="Order Type"    value="Device Sell" badge />
              <InfoRow label="Status"        value={statusCfg.label} />
              <InfoRow label="Sell Price"    value={fmtPrice(order.totalPrice)} highlight />
            </div>
          </div>

          {/* ── What happens next ── */}
          {(status === "PENDING" || status === "CONFIRMED") && (
            <div className="bg-cyan-50 border border-cyan-200 rounded-2xl px-5 py-4">
              <p className="text-xs font-semibold text-cyan-700 uppercase tracking-wide mb-2">What happens next?</p>
              <ol className="space-y-1.5 text-sm text-cyan-800">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-200 text-cyan-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  Our team will review your device evaluation
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-200 text-cyan-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  We will contact you to confirm the pickup schedule
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-200 text-cyan-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  Our technician will collect the device and verify the condition
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-200 text-cyan-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                  Payment of <strong>{fmtPrice(order.totalPrice)}</strong> will be processed after verification
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-7 pb-7">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ── small helper ──────────────────────────────────────────────────────────────
const InfoRow = ({
  label, value, highlight = false, badge = false
}: { label: string; value: string; highlight?: boolean; badge?: boolean }) => (
  <div className="px-5 py-3 flex items-center justify-between">
    <span className="text-sm text-gray-500">{label}</span>
    {badge ? (
      <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">
        💰 {value}
      </span>
    ) : (
      <span className={`text-sm font-semibold ${highlight ? "text-emerald-600" : "text-gray-900"}`}>
        {value}
      </span>
    )}
  </div>
);

export default SellOrderDetailsModal;
