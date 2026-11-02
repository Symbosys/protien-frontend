"use client";

import MainLayout from "@/components/layout/MainLayout";

export default function ProductLoading() {
  return (
    <MainLayout>
      <div className="min-h-[75vh] flex flex-col items-center justify-center pt-28 pb-16 px-4 bg-[#FDFBF7]">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-20 h-20 rounded-full bg-[#8CFF64]/25 animate-ping" />
          <div className="w-14 h-14 rounded-full border-4 border-gray-200 border-t-[#8CFF64] border-r-[#5BBF3D] animate-spin shadow-md" />
        </div>

        <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Loading Product Details...
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
          Please wait a moment while we fetch the latest details.
        </p>
      </div>
    </MainLayout>
  );
}

