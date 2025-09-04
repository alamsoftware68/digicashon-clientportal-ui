'use client';

import React from 'react';

const Newsletter = () => {
  return (
    <section className="bg-slate-700 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-2">
              Subscribe To Our
            </h2>
            <h3 className="text-2xl lg:text-3xl font-semibold text-white">
              Newsletter
            </h3>
          </div>

          {/* Email Subscription Form */}
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email id"
                className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900"
              />
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6 py-3 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
