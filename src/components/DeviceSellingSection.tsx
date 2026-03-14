"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import apiService from "@/services/api";

interface SuperCategory {
  id: number;
  name: string;
  description: string;
  bullet1: string;
  bullet2: string;
  bullet3: string;
  iconUrl: string | null;
  enabled: boolean;
}

const DeviceSellingSection = () => {
  const [superCategories, setSuperCategories] = useState<SuperCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuperCategories = async () => {
      try {
        setLoading(true);
        const response = await apiService.getSuperCategories();
        if (response.success && response.data) {
          setSuperCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching super categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuperCategories();
  }, []);
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            We Made{" "}
            <span className="relative text-blue-900">
              Selling
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400 rounded"></div>
            </span>{" "}
            <span className="text-blue-900">Simpler</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search Your Device for Repair.."
              className="w-full px-6 py-4 pr-16 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-900 text-white p-3 rounded-full hover:bg-blue-800 transition-colors">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Category Selection Text */}
          <div className="text-center mt-4">
            <span className="text-gray-500 text-sm">
              --- or choose a category ---
            </span>
          </div>
        </div>

        {/* Device Categories - Sell Your Device */}
        <div className="mb-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 xl:gap-8">
              {superCategories.map((category, index) => {
                // Define gradient colors for each category
                const gradients = [
                  {
                    bg: "from-blue-500 via-indigo-600 to-purple-700",
                    icon: "from-blue-100 to-indigo-100",
                    button: "from-blue-600 to-indigo-600",
                    badge: "from-green-400 to-emerald-500",
                    badgeText: "Popular",
                  },
                  {
                    bg: "from-gray-700 via-gray-800 to-black",
                    icon: "from-gray-100 to-gray-200",
                    button: "from-gray-700 to-gray-900",
                    badge: "from-gray-400 to-gray-600",
                    badgeText: "Premium",
                  },
                  {
                    bg: "from-emerald-500 via-teal-600 to-cyan-700",
                    icon: "from-emerald-100 to-teal-100",
                    button: "from-emerald-600 to-teal-600",
                    badge: "from-yellow-400 to-orange-500",
                    badgeText: "Hot Deal",
                  },
                  {
                    bg: "from-pink-500 via-rose-600 to-red-700",
                    icon: "from-pink-100 to-rose-100",
                    button: "from-pink-600 to-rose-600",
                    badge: "from-blue-400 to-indigo-500",
                    badgeText: "Best Value",
                  },
                ];

                // Cycle through gradients if there are more than 4 categories
                const gradient = gradients[index % gradients.length];

                // Generate URL-friendly slug from category name (replace spaces and slashes)
                const categorySlug = category.name.toLowerCase().replace(/[\s\/]+/g, '-');

                return (
                  <Link
                    key={category.id}
                    href={`/sell/${categorySlug}`}
                    className="group"
                  >
                    <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2 h-full min-h-[280px] flex flex-col">
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                      {/* Content */}
                      <div className="relative p-6 flex flex-col justify-between flex-1">
                        {/* Icon Container */}
                        <div className="relative mb-4">
                          <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${gradient.icon} rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:scale-110 overflow-hidden p-2`}>
                            {/* Category Icon */}
                            {category.iconUrl ? (
                              <Image
                                src={category.iconUrl}
                                alt={`${category.name} Logo`}
                                width={64}
                                height={64}
                                className="object-contain w-full h-full"
                              />
                            ) : (
                              <div className="text-4xl">📱</div>
                            )}
                          </div>

                          {/* Floating Badge */}
                          <div className={`absolute -top-2 -right-2 bg-gradient-to-r ${gradient.badge} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                            {gradient.badgeText}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-500 mb-4 text-center">
                          {category.name}
                        </h3>

                        {/* CTA Button */}
                        <button className={`w-full bg-gradient-to-r ${gradient.button} group-hover:from-white group-hover:to-white text-white group-hover:text-gray-800 font-semibold py-3 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105 text-sm`}>
                          Sell Now →
                        </button>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:bg-white/20 transition-colors duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10 group-hover:bg-white/20 transition-colors duration-500"></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Backup: If no categories, show a message */}
        {!loading && superCategories.length === 0 && (
          <div className="mb-12">
            <div className="text-center py-10 text-gray-500">
              No categories available at the moment. Please check back later.
            </div>
          </div>
        )}

        {/* Old hardcoded cards have been replaced with dynamic super categories above */}

        {/* App Store Ratings */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* App Store */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.13997 6.91 8.85997 6.88C10.15 6.85 11.36 7.72 12.11 7.72C12.86 7.72 14.3 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                </svg>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">
                  Download on the
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  App Store
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <span className="text-2xl font-bold text-gray-900 mr-1">
                  4.7
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500">571 reviews</div>
            </div>
          </div>

          {/* Google Play */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">GET IT ON</div>
                <div className="text-sm font-semibold text-gray-900">
                  Google Play
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <span className="text-2xl font-bold text-gray-900 mr-1">
                  4.5
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500">5K+ reviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeviceSellingSection;
