"use client";

import React, { useState, useEffect } from "react";
import apiService from "../services/api";
import jsPDF from "jspdf";

// Order details response interface based on API response
interface OrderDetailsResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  version: number;
  orderNumber: string;
  status: string;
  totalPrice: number;
  problemDescription: string;
  solutionDescription?: string;
  scheduledDate?: string;
  completedDate?: string;
  pickupAddress: string;
  customerNotes?: string;
  technicianNotes?: string;
  service?: {
    id: number;
    createdAt: string;
    updatedAt: string;
    version: number;
    name: string;
    description: string;
    deviceType: string;
    basePrice: number;
    estimatedDurationHours: number;
    isActive: boolean;
    isFeatured: boolean;
    imageUrl?: string;
    badge?: string;
  };
  orderItems: {
    id: number;
    createdAt: string;
    updatedAt: string;
    version: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    notes?: string;
    service: {
      id: number;
      createdAt: string;
      updatedAt: string;
      version: number;
      name: string;
      description: string;
      deviceType: string;
      basePrice: number;
      estimatedDurationHours: number;
      isActive: boolean;
      isFeatured: boolean;
      imageUrl?: string;
      badge?: string;
    };
    serviceName?: string;
    serviceCategory?: string;
    serviceTitle?: string;
    serviceItemId?: number;
  }[];
  technician?: any;
  address: {
    id: number;
    createdAt: string;
    updatedAt: string;
    version: number;
    type: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
    fullAddress: string;
  };
}

interface OrderDetailsViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

const OrderDetailsViewModal: React.FC<OrderDetailsViewModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
}) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetailsResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    if (isOpen && orderNumber) {
      fetchOrderDetails();
    }
  }, [isOpen, orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log(
        "[OrderDetailsView] Fetching order details for:",
        orderNumber
      );

      // Check if this is a laptop sell order (starts with SL-)
      if (orderNumber.startsWith('SL-')) {
        console.log("[OrderDetailsView] This is a laptop sell order, loading from localStorage");
        
        const sellOrders = JSON.parse(localStorage.getItem('laptop_sell_orders') || '[]');
        const sellOrder = sellOrders.find((order: any) => order.orderNumber === orderNumber);
        
        if (sellOrder) {
          // Transform laptop sell order to OrderDetailsResponse format
          const transformedOrder: OrderDetailsResponse = {
            id: sellOrder.id,
            createdAt: sellOrder.orderDate,
            updatedAt: sellOrder.orderDate,
            version: 1,
            orderNumber: sellOrder.orderNumber,
            status: sellOrder.status,
            totalPrice: sellOrder.totalAmount,
            problemDescription: `Laptop Sell Request - ${sellOrder.deviceName}`,
            scheduledDate: sellOrder.pickupDate,
            pickupAddress: sellOrder.address,
            orderItems: [{
              id: sellOrder.id,
              createdAt: sellOrder.orderDate,
              updatedAt: sellOrder.orderDate,
              version: 1,
              quantity: 1,
              unitPrice: sellOrder.totalAmount,
              totalPrice: sellOrder.totalAmount,
              notes: `Pickup scheduled for ${sellOrder.pickupDate} (${sellOrder.pickupTimeSlot})`,
              service: {
                id: sellOrder.id,
                createdAt: sellOrder.orderDate,
                updatedAt: sellOrder.orderDate,
                version: 1,
                name: `${sellOrder.deviceName} - Laptop Sell`,
                description: `${sellOrder.brand || 'Brand'} ${sellOrder.deviceName}\nProcessor: ${sellOrder.processor}\nRAM: ${sellOrder.ram}\nStorage: ${sellOrder.storage}\nPickup Time: ${sellOrder.pickupTimeSlot}`,
                deviceType: 'LAPTOP_SELL',
                basePrice: sellOrder.totalAmount,
                estimatedDurationHours: 1,
                isActive: true,
                isFeatured: false
              },
              serviceName: `${sellOrder.deviceName} - Laptop Sell`,
              serviceCategory: 'Laptop Sell',
              serviceTitle: sellOrder.deviceName
            }],
            address: {
              id: sellOrder.id,
              createdAt: sellOrder.orderDate,
              updatedAt: sellOrder.orderDate,
              version: 1,
              type: 'Pickup Address',
              address: sellOrder.address,
              city: '',
              state: '',
              zipCode: '',
              isDefault: false,
              fullAddress: sellOrder.address
            }
          };
          
          setOrderDetails(transformedOrder);
          console.log(
            "[OrderDetailsView] Laptop sell order loaded successfully:",
            transformedOrder
          );
          setIsLoading(false);
          return;
        } else {
          throw new Error("Laptop sell order not found");
        }
      }

      // Otherwise, fetch from API
      const result = await apiService.getOrderDetails(orderNumber);

      if (result.success && result.data) {
        setOrderDetails(result.data);
        console.log(
          "[OrderDetailsView] Order details loaded successfully:",
          result.data
        );
      } else {
        throw new Error(result.message || "Failed to fetch order details");
      }
    } catch (error: any) {
      console.error("[OrderDetailsView] Error fetching order details:", error);
      setError(error.message || "Failed to load order details");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      PICKUP_REQUESTED: "bg-orange-100 text-orange-800 border-orange-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
      IN_PROGRESS: "bg-purple-100 text-purple-800 border-purple-200",
      COMPLETED: "bg-green-100 text-green-800 border-green-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      REFUNDED: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PICKUP_REQUESTED":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case "PENDING":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "CONFIRMED":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "IN_PROGRESS":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        );
      case "COMPLETED":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "CANCELLED":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const downloadOrderAsPDF = async () => {
    if (!orderDetails) return;

    try {
      setIsGeneratingPdf(true);

      // Create a new PDF instance
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add header
      pdf.setFontSize(20);
      pdf.setTextColor(51, 51, 51);
      pdf.text("DigiCashOn - Order Details", 20, 25);

      // Add order info
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Order Number: ${orderDetails.orderNumber}`, 20, 40);
      pdf.text(`Date: ${formatDate(orderDetails.createdAt)}`, 20, 48);
      pdf.text(`Status: ${orderDetails.status.replace("_", " ")}`, 20, 56);

      // Add a line separator
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 65, 190, 65);

      let yPosition = 80;

      // Add order summary
      pdf.setFontSize(14);
      pdf.setTextColor(51, 51, 51);
      pdf.text("Order Summary", 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        `Total Amount: ${formatPrice(orderDetails.totalPrice)}`,
        20,
        yPosition
      );
      yPosition += 8;
      pdf.text(
        `Service Items: ${orderDetails.orderItems.length}`,
        20,
        yPosition
      );
      yPosition += 15;

      // Add service items
      pdf.setFontSize(14);
      pdf.setTextColor(51, 51, 51);
      pdf.text("Service Items", 20, yPosition);
      yPosition += 10;

      orderDetails.orderItems.forEach((item, index) => {
        pdf.setFontSize(12);
        pdf.setTextColor(51, 51, 51);
        pdf.text(
          `${index + 1}. ${
            item.serviceName || item.serviceTitle || item.service.name
          }`,
          20,
          yPosition
        );
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `Category: ${item.serviceCategory || "Service"}`,
          25,
          yPosition
        );
        yPosition += 6;
        pdf.text(`Description: ${item.service.description}`, 25, yPosition);
        yPosition += 6;
        pdf.text(
          `Unit Price: ${formatPrice(item.unitPrice)} | Quantity: ${
            item.quantity
          }`,
          25,
          yPosition
        );
        yPosition += 12;

        // Check if we need a new page
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
      });

      // Add address
      pdf.setFontSize(14);
      pdf.setTextColor(51, 51, 51);
      pdf.text("Service Address", 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Type: ${orderDetails.address.type}`, 20, yPosition);
      yPosition += 6;

      // Split long address text
      const addressLines = pdf.splitTextToSize(
        orderDetails.address.fullAddress,
        170
      );
      pdf.text(addressLines, 20, yPosition);
      yPosition += addressLines.length * 6 + 10;

      // Add notes if available
      if (
        orderDetails.problemDescription ||
        orderDetails.customerNotes ||
        orderDetails.technicianNotes
      ) {
        if (yPosition > 230) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(14);
        pdf.setTextColor(51, 51, 51);
        pdf.text("Notes & Information", 20, yPosition);
        yPosition += 10;

        if (orderDetails.problemDescription) {
          pdf.setFontSize(12);
          pdf.setTextColor(51, 51, 51);
          pdf.text("Problem Description:", 20, yPosition);
          yPosition += 8;

          pdf.setFontSize(10);
          pdf.setTextColor(100, 100, 100);
          const problemLines = pdf.splitTextToSize(
            orderDetails.problemDescription,
            170
          );
          pdf.text(problemLines, 20, yPosition);
          yPosition += problemLines.length * 6 + 8;
        }

        if (orderDetails.customerNotes) {
          pdf.setFontSize(12);
          pdf.setTextColor(51, 51, 51);
          pdf.text("Customer Notes:", 20, yPosition);
          yPosition += 8;

          pdf.setFontSize(10);
          pdf.setTextColor(100, 100, 100);
          const customerLines = pdf.splitTextToSize(
            orderDetails.customerNotes,
            170
          );
          pdf.text(customerLines, 20, yPosition);
          yPosition += customerLines.length * 6 + 8;
        }

        if (orderDetails.technicianNotes) {
          pdf.setFontSize(12);
          pdf.setTextColor(51, 51, 51);
          pdf.text("Technician Notes:", 20, yPosition);
          yPosition += 8;

          pdf.setFontSize(10);
          pdf.setTextColor(100, 100, 100);
          const techLines = pdf.splitTextToSize(
            orderDetails.technicianNotes,
            170
          );
          pdf.text(techLines, 20, yPosition);
        }
      }

      // Add footer
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Generated on ${new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}`,
          20,
          285
        );
        pdf.text(`Page ${i} of ${pageCount}`, 170, 285);
      }

      // Download the PDF
      pdf.save(`Order-${orderDetails.orderNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 overflow-hidden max-h-[92vh]">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Order Details
                </h2>
                <p className="text-slate-300 text-sm">
                  {orderDetails &&
                    `${orderDetails.orderNumber} • ${formatDate(
                      orderDetails.createdAt
                    )}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Download PDF Button */}
              {orderDetails && (
                <button
                  onClick={downloadOrderAsPDF}
                  disabled={isGeneratingPdf}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 rounded-lg transition-colors group"
                  title="Download Order as PDF"
                >
                  {isGeneratingPdf ? (
                    <>
                      <svg
                        className="animate-spin w-3.5 h-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="text-xs font-medium text-white hidden sm:inline">
                        Generating...
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3.5 h-3.5 text-white group-hover:text-blue-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-xs font-medium text-white group-hover:text-blue-100 hidden sm:inline">
                        Download
                      </span>
                    </>
                  )}
                </button>
              )}
              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors group"
                title="Close"
              >
                <svg
                  className="w-4 h-4 text-white group-hover:text-gray-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 max-h-[calc(92vh-80px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Loading Order Details...
                </h3>
                <p className="text-gray-500">
                  Please wait while we fetch your order information
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Failed to Load Order
              </h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={fetchOrderDetails}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : orderDetails ? (
            <div className="space-y-4">
              {/* Order Summary Cards - Mobile Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-2.5 shadow-md">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-blue-700 mb-0.5">
                        Total Amount
                      </h3>
                      <p className="text-base sm:text-lg font-bold text-blue-900">
                        {formatPrice(orderDetails.totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-2.5 shadow-md">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-green-700 mb-0.5">
                        Service Items
                      </h3>
                      <p className="text-base sm:text-lg font-bold text-green-900">
                        {orderDetails.orderItems.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200 rounded-lg p-3 shadow-sm sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-2.5 shadow-md">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-purple-700 mb-0.5">
                        Order Status
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          orderDetails.status
                        )}`}
                      >
                        <span className="text-sm font-semibold">
                          {orderDetails.status.replace("_", " ")}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Status Progress Tracker - Only for Laptop Sell Orders */}
              {orderDetails.service?.deviceType === 'LAPTOP_SELL' && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-base font-semibold text-gray-900 mb-4">Order Status</h4>
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{
                          width: orderDetails.status === 'PICKUP_REQUESTED' ? '25%' :
                                 orderDetails.status === 'CONFIRMED' ? '58%' :
                                 orderDetails.status === 'IN_PROGRESS' ? '83%' :
                                 orderDetails.status === 'COMPLETED' ? '100%' : '0%'
                        }}
                      />
                    </div>
                    
                    {/* Progress Steps */}
                    <div className="relative flex justify-between">
                      {/* Step 1: Pickup Requested */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          orderDetails.status === 'PICKUP_REQUESTED' || orderDetails.status === 'CONFIRMED' || orderDetails.status === 'IN_PROGRESS' || orderDetails.status === 'COMPLETED'
                            ? 'bg-green-500 border-green-500'
                            : 'bg-white border-gray-300'
                        }`}>
                          <svg className={`w-5 h-5 ${
                            orderDetails.status === 'PICKUP_REQUESTED' || orderDetails.status === 'CONFIRMED' || orderDetails.status === 'IN_PROGRESS' || orderDetails.status === 'COMPLETED'
                              ? 'text-white'
                              : 'text-gray-400'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-xs font-semibold text-gray-900 mt-2 text-center max-w-[90px]">
                          Pickup Requested
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDate(orderDetails.createdAt).split(',')[0]}
                        </p>
                        {orderDetails.status === 'PICKUP_REQUESTED' && (
                          <span className="mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Active
                          </span>
                        )}
                      </div>

                      {/* Step 2: Pickup Confirmed */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          orderDetails.status === 'CONFIRMED' || orderDetails.status === 'IN_PROGRESS' || orderDetails.status === 'COMPLETED'
                            ? 'bg-green-500 border-green-500'
                            : 'bg-white border-gray-300'
                        }`}>
                          <svg className={`w-5 h-5 ${
                            orderDetails.status === 'CONFIRMED' || orderDetails.status === 'IN_PROGRESS' || orderDetails.status === 'COMPLETED'
                              ? 'text-white'
                              : 'text-gray-400'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-xs font-semibold text-gray-900 mt-2 text-center max-w-[90px]">
                          Pickup Confirmed
                        </p>
                        {orderDetails.status === 'CONFIRMED' && (
                          <span className="mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Active
                          </span>
                        )}
                      </div>

                      {/* Step 3: Pickup Started */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          orderDetails.status === 'IN_PROGRESS' || orderDetails.status === 'COMPLETED'
                            ? 'bg-green-500 border-green-500'
                            : 'bg-white border-gray-300'
                        }`}>
                          <svg className={`w-5 h-5 ${
                            orderDetails.status === 'IN_PROGRESS' || orderDetails.status === 'COMPLETED'
                              ? 'text-white'
                              : 'text-gray-400'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-xs font-semibold text-gray-900 mt-2 text-center max-w-[90px]">
                          Pickup Started
                        </p>
                        {orderDetails.status === 'IN_PROGRESS' && (
                          <span className="mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Active
                          </span>
                        )}
                      </div>

                      {/* Step 4: Pickup Completed */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          orderDetails.status === 'COMPLETED'
                            ? 'bg-green-500 border-green-500'
                            : 'bg-white border-gray-300'
                        }`}>
                          <svg className={`w-5 h-5 ${
                            orderDetails.status === 'COMPLETED'
                              ? 'text-white'
                              : 'text-gray-400'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-xs font-semibold text-gray-900 mt-2 text-center max-w-[90px]">
                          Pickup Completed
                        </p>
                        {orderDetails.status === 'COMPLETED' && (
                          <span className="mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Message */}
                  {orderDetails.status === 'PICKUP_REQUESTED' && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        ✨ <strong>Awesome!</strong> We've received your pickup request. Looking for a pickup ninja for you.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Pickup Date & Time - Only for Laptop Sell Orders */}
              {orderDetails.service?.deviceType === 'LAPTOP_SELL' && orderDetails.scheduledDate && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-base font-semibold text-gray-900 mb-4">Pickup Date & Time</h4>
                  
                  <div className="space-y-3">
                    {/* Pickup Date */}
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-gray-900">
                          {orderDetails.scheduledDate}
                        </p>
                      </div>
                    </div>

                    {/* Pickup Time */}
                    {orderDetails.orderItems[0]?.notes && (
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900">
                            {orderDetails.orderItems[0].notes.split('(')[1]?.replace(')', '') || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {orderDetails.status === 'PICKUP_REQUESTED' && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => alert('Cancel order functionality - coming soon!')}
                        className="flex-1 px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                      >
                        Cancel Order
                      </button>
                      <button
                        onClick={() => alert('Reschedule functionality - coming soon!')}
                        className="flex-1 px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                      >
                        Reschedule
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Service Items */}
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Service Items
                </h4>

                <div className="space-y-3">
                  {orderDetails.orderItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="mb-3">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                            {item.serviceCategory || "Service"}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            #{index + 1}
                          </span>
                        </div>
                        <h5 className="text-base font-semibold text-gray-900 mb-1">
                          {item.serviceName ||
                            item.serviceTitle ||
                            item.service.name}
                        </h5>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.service.description}
                        </p>
                      </div>

                      {/* Item Details - Mobile Responsive */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-sm">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700">
                              Unit Price:
                            </span>
                            <span className="text-gray-900 ml-2 font-semibold">
                              {formatPrice(item.unitPrice)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700">
                              Quantity:
                            </span>
                            <span className="text-gray-900 ml-2 font-semibold">
                              {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Summary */}
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-lg p-3 sm:p-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div className="flex items-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 7h6m0 0v8a2 2 0 01-2 2H9a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-800">
                          Order Summary
                        </p>
                        <p className="text-xs text-blue-600">
                          {orderDetails.orderItems.length} item
                          {orderDetails.orderItems.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg sm:text-xl font-bold text-blue-700">
                        {formatPrice(orderDetails.totalPrice)}
                      </p>
                      <p className="text-xs text-blue-600">Total</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Address */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <h5 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Service Address
                </h5>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {orderDetails.address.type}
                  </span>
                  {orderDetails.address.isDefault && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {orderDetails.address.fullAddress}
                </p>
              </div>

              {/* Notes Section */}
              {(orderDetails.problemDescription ||
                orderDetails.customerNotes ||
                orderDetails.technicianNotes) && (
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    Notes & Information
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    {orderDetails.problemDescription && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <h5 className="font-medium text-orange-800 mb-1 flex items-center text-sm">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                          Problem Description
                        </h5>
                        <p className="text-sm text-orange-900 leading-relaxed">
                          {orderDetails.problemDescription}
                        </p>
                      </div>
                    )}

                    {orderDetails.customerNotes && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h5 className="font-medium text-green-800 mb-1 flex items-center text-sm">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Customer Notes
                        </h5>
                        <p className="text-sm text-green-900 leading-relaxed">
                          {orderDetails.customerNotes}
                        </p>
                      </div>
                    )}

                    {orderDetails.technicianNotes && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <h5 className="font-medium text-purple-800 mb-1 flex items-center text-sm">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Technician Notes
                        </h5>
                        <p className="text-sm text-purple-900 leading-relaxed">
                          {orderDetails.technicianNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-3 sm:p-4 border-t">
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg font-medium hover:from-slate-700 hover:to-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsViewModal;
