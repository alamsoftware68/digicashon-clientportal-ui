'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const slides = [
    {
      id: 1,
      title: "Hassle-free Laptop Repairs at Your Doorstep",
      bgColor: "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400",
      textColor: "text-gray-800",
      description: "Professional laptop repair services delivered to your home with expert technicians",
      image: "/images/laptop-repair-1.jpg",
      imageAlt: "Woman using laptop on couch for hassle-free repairs"
    },
    {
      id: 2,
      title: "Book Your Laptop Repair in Seconds",
      bgColor: "bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800",
      textColor: "text-white",
      accentColor: "text-cyan-300",
      description: "Quick and easy online booking system - get your repair scheduled instantly",
      image: "/images/laptop-repair-2.jpg",
      imageAlt: "Woman with headphones booking laptop repair online"
    },
    {
      id: 3,
      title: "Laptop Fixed. Hassle-Free. Quick Support.",
      bgColor: "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600",
      textColor: "text-white",
      description: "Expert repair services with guaranteed quality and fast turnaround",
      trustBadge: true,
      image: "/images/laptop-repair-3.jpg",
      imageAlt: "Happy woman with fixed laptop showing customer satisfaction"
    },
    {
      id: 4,
      title: "Get Your Laptop Repaired in 24 Hours!",
      bgColor: "bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500",
      textColor: "text-white",
      description: "Same-day repair service available for urgent laptop issues",
      image: "/images/laptop-repair-4.jpg",
      imageAlt: "Woman working on laptop with 24-hour repair service"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleCTAClick = () => {
    router.push('/repair/laptop');
  };

  return (
    <section className="relative w-full h-[600px] overflow-hidden">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0' 
                : index < currentSlide 
                  ? 'opacity-0 -translate-x-full' 
                  : 'opacity-0 translate-x-full'
            }`}
          >
            <div className={`w-full h-full ${slide.bgColor} flex items-center justify-center relative overflow-hidden`}>
              {/* Background Animation Elements */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
              <div className="absolute top-32 right-20 w-16 h-16 bg-white/15 rounded-full animate-pulse"></div>
              <div className="absolute bottom-20 left-32 w-12 h-12 bg-white/20 rounded-full animate-bounce delay-300"></div>
              <div className="absolute bottom-40 right-40 w-8 h-8 bg-white/25 rounded-full animate-pulse delay-500"></div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="grid lg:grid-cols-2 gap-8 items-center h-full">
                  {/* Content Side */}
                  <div className={`space-y-6 ${slide.textColor} z-10 relative`}>
                    <div className="space-y-4">
                      <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                        {slide.id === 2 ? (
                          <>
                            <span className="text-yellow-400">Book Your Laptop</span>
                            <br />
                            <span className={slide.accentColor}>Repair in Seconds</span>
                          </>
                        ) : (
                          slide.title
                        )}
                      </h1>
                      <p className="text-lg lg:text-xl opacity-90 max-w-lg">
                        {slide.description}
                      </p>
                    </div>

                    {/* Trust Badge for slide 3 */}
                    {slide.trustBadge && (
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 max-w-xs">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-white">Trusted by</p>
                            <p className="text-2xl font-bold text-white">50k+</p>
                            <p className="text-sm text-white/80">Happy Customers</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CTA Button */}
                    <div className="pt-4">
                      <button 
                        onClick={handleCTAClick}
                        className="bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        {slide.id === 2 ? 'Book Repair Now' : 'Get Started'}
                      </button>
                    </div>
                  </div>

                  {/* Image Side */}
                  <div className="relative">
                    {/* Multiple Floating Background Elements */}
                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full animate-float-slow delay-100"></div>
                    <div className="absolute top-16 -left-6 w-16 h-16 bg-white/15 rounded-full animate-float-fast delay-300"></div>
                    <div className="absolute -bottom-6 right-12 w-20 h-20 bg-white/12 rounded-full animate-float delay-500"></div>
                    <div className="absolute bottom-20 -left-4 w-12 h-12 bg-white/20 rounded-full animate-float-slow delay-700"></div>
                    
                    {/* Main Floating Image Container */}
                    <div className="relative z-10 animate-float-fast">
                      <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                        {/* Real Image Container with Enhanced Floating Effect */}
                        <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-xl">
                          {/* Actual Image Display */}
                          <div className="relative w-full h-full">
                            <Image
                              src={slide.image}
                              alt={slide.imageAlt}
                              fill
                              className="object-cover transition-transform duration-700 hover:scale-110"
                              priority={index === 0}
                              onError={(e) => {
                                console.log('Image failed to load:', slide.image);
                              }}
                              placeholder="blur"
                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                            />
                            
                            {/* Gradient overlay for better text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            
                            {/* Floating decorative elements overlay */}
                            <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full animate-bounce delay-200"></div>
                            <div className="absolute bottom-8 left-6 w-6 h-6 bg-white/30 rounded-full animate-float delay-400"></div>
                            <div className="absolute top-1/2 right-2 w-4 h-4 bg-white/25 rounded-full animate-pulse delay-600"></div>
                          </div>
                          
                        </div>
                      </div>
                    </div>

                    {/* Additional Floating Decorative Elements */}
                    <div className="absolute top-1/4 -right-6 w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full animate-bounce delay-150 opacity-80"></div>
                    <div className="absolute bottom-1/4 -left-6 w-10 h-10 bg-gradient-to-br from-green-300 to-green-400 rounded-full animate-float delay-350 opacity-70"></div>
                    <div className="absolute top-1/2 -right-4 w-8 h-8 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full animate-pulse delay-550 opacity-60"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors z-20"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors z-20"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

    </section>
  );
};

export default ImageSlider;
