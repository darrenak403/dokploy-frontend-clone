"use client";

import React from "react";

const MainTitle = () => {
  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-700 bg-transparent">
      <div className="max-w-screen-xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Quản lí hệ thống
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            Quản lý các hoạt động và sự kiện trong hệ thống
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainTitle;
