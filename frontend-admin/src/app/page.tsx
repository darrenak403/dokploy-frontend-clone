"use client";
import React from "react";

import { HighlightFeature, MainTitle, TitleAnimation } from "@/components";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-[#121212] mx-auto">
      <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-center py-3">
        <TitleAnimation />
      </div>
      <div className="max-w-7xl mx-auto">
        <div>
          <MainTitle />
        </div>
        <div>
          <HighlightFeature />
        </div>
      </div>
    </div>
  );
}
