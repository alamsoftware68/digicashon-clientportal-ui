"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import apiService from "@/services/api";

interface BrandModel {
  id: number;
  name: string;
  description: string;
  brandId: number;
  brandType: string;
  basePrice: number;
  iconUrl: string | null;
  enabled: boolean;
}

interface Brand {
  id: number;
  name: string;
  iconUrl: string | null;
  enabled: boolean;
  brandType: string;
}

const BrandModelListPage = () => {
  const params = useParams();
  const router = useRouter();
  const superCategory = params.superCategory as string;
  const brandSlug = params.brand as string;

  const [models, setModels] = useState<BrandModel[]>([]);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // First, fetch all super categories to find the exact name
        const superCategoriesResponse = await apiService.getSuperCategories();
        let exactCategoryName = "";

        if (superCategoriesResponse.success && superCategoriesResponse.data) {
          // Find the super category that matches this slug
          const matchingSuperCategory = superCategoriesResponse.data.find(
            (cat) => cat.name.toLowerCase().replace(/[\s\/]+/g, "-") === superCategory
          );

          if (matchingSuperCategory) {
            exactCategoryName = matchingSuperCategory.name;
          } else {
            // Fallback: Convert slug to proper category name
            exactCategoryName = superCategory
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }
        } else {
          // Fallback if super categories fetch fails
          exactCategoryName = superCategory
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }

        setCategoryName(exactCategoryName);

        // Fetch brands to get the brand ID
        const brandsResponse = await apiService.getBrands(exactCategoryName);
        if (brandsResponse.success && brandsResponse.data) {
          // Find the matching brand
          const matchingBrand = brandsResponse.data.find(
            (b) => b.name.toLowerCase().replace(/\s+/g, "-") === brandSlug
          );

          if (matchingBrand) {
            setBrand(matchingBrand);

            // Fetch models for this brand
            const modelsResponse = await apiService.getBrandModels(matchingBrand.id);
            if (modelsResponse.success && modelsResponse.data) {
              setModels(modelsResponse.data);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching brand models:", error);
      } finally {
        setLoading(false);
      }
    };

    if (superCategory && brandSlug) {
      fetchData();
    }
  }, [superCategory, brandSlug]);

  const handleBackClick = () => {
    router.push(`/sell/${superCategory}`);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to {categoryName} Brands
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          {brand && (
            <div className="flex items-center justify-center mb-4">
              {brand.iconUrl && (
                <div className="w-16 h-16 mr-4">
                  <Image
                    src={brand.iconUrl}
                    alt={`${brand.name} Logo`}
                    width={64}
                    height={64}
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
              <h1 className="text-4xl font-bold text-gray-900">
                {brand.name} Models
              </h1>
            </div>
          )}
          <p className="text-lg text-gray-600">
            Select your {brand?.name || ""} model to get started
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        ) : models.length === 0 ? (
          /* No Models Found */
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📱</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Models Available
            </h3>
            <p className="text-gray-500">
              We currently don't have any models for {brand?.name || "this brand"}.
            </p>
          </div>
        ) : (
          /* Model Grid - Centered */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-fit mx-auto">
            {models.map((model, index) => {
              // Define gradient colors for variety
              const gradients = [
                {
                  bg: "from-blue-500 via-indigo-600 to-purple-700",
                  icon: "from-blue-100 to-indigo-100",
                  button: "from-blue-600 to-indigo-600",
                },
                {
                  bg: "from-green-500 via-teal-600 to-cyan-700",
                  icon: "from-green-100 to-teal-100",
                  button: "from-green-600 to-teal-600",
                },
                {
                  bg: "from-purple-500 via-pink-600 to-rose-700",
                  icon: "from-purple-100 to-pink-100",
                  button: "from-purple-600 to-pink-600",
                },
                {
                  bg: "from-orange-500 via-red-600 to-pink-700",
                  icon: "from-orange-100 to-red-100",
                  button: "from-orange-600 to-red-600",
                },
                {
                  bg: "from-gray-700 via-gray-800 to-black",
                  icon: "from-gray-100 to-gray-200",
                  button: "from-gray-700 to-gray-900",
                },
              ];

              const gradient = gradients[index % gradients.length];
              const modelSlug = model.name.toLowerCase().replace(/\s+/g, "-");

              return (
                <Link
                  key={model.id}
                  href={`/sell/${superCategory}/${brandSlug}/${modelSlug}`}
                  className="group"
                >
                  <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2 h-full min-h-[260px] min-w-[200px] w-full flex flex-col">
                    {/* Background Gradient on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                    {/* Content */}
                    <div className="relative p-6 flex flex-col justify-between flex-1">
                      {/* Model Icon/Image */}
                      <div className="mb-4">
                        <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${gradient.icon} rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-500 shadow-md group-hover:shadow-xl overflow-hidden p-3`}>
                          {model.iconUrl ? (
                            <Image
                              src={model.iconUrl}
                              alt={`${model.name} Image`}
                              width={80}
                              height={80}
                              className="object-contain w-full h-full"
                            />
                          ) : (
                            <div className="text-5xl">💻</div>
                          )}
                        </div>
                      </div>

                      {/* Model Name */}
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-white transition-colors duration-500 text-center mb-2">
                          {model.name}
                        </h3>
                        {model.description && (
                          <p className="text-xs text-gray-500 group-hover:text-white/80 transition-colors duration-500 text-center">
                            {model.description}
                          </p>
                        )}
                      </div>

                      {/* Select Button */}
                      <button className={`w-full bg-gradient-to-r ${gradient.button} group-hover:from-white group-hover:to-white text-white group-hover:text-gray-800 font-semibold py-2.5 rounded-lg shadow-md group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-105 text-sm`}>
                        Select Model →
                      </button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8 group-hover:bg-white/20 transition-colors duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8 group-hover:bg-white/20 transition-colors duration-500"></div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandModelListPage;
