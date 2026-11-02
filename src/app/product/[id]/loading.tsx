"use client";

import MainLayout from "@/components/layout/MainLayout";

export default function ProductLoading() {
  return (
    <MainLayout>
      <div className="min-h-[75vh] flex flex-col items-center justify-center pt-28 pb-16 px-4 bg-[#FDFBF7]">
        <div className="relative flex items-center justify-center mb-6">
          {/* Outer glowing pulsing circle */}
          <div className="absolute w-20 h-20 rounded-full bg-[#8CFF64]/25 animate-ping" />
          
          {/* Inner smooth dual-color spinning ring */}
          <div className="w-14 h-14 rounded-full border-4 border-gray-200 border-t-[#8CFF64] border-r-[#5BBF3D] animate-spin shadow-md" />
        </div>

        <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Loading Product Details...
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
          Please wait a moment while we fetch the latest details and prices.
        </p>

        {/* Minimal skeleton preview */}
        <div className="w-full max-w-4xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 opacity-40 animate-pulse pointer-events-none">
          <div className="aspect-square bg-gray-200 rounded-2xl w-full" />
          <div className="space-y-4 py-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded w-full mt-6" />
            <div className="h-12 bg-gray-200 rounded-xl w-full mt-6" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

