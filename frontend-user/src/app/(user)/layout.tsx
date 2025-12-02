"use client";
import { useState } from "react";

import { Sidebar } from "@/components/shared/profile/Sidebar";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-5rem)]">
      <div className="flex gap-2 sm:gap-4 md:gap-6 p-2 sm:p-3 md:p-4 sm:p-6 h-full">
        {/* Left side - Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Right side - Main content: important -> flex-1 w-0 */}
        <div className="flex flex-col flex-1 w-0 h-full min-h-0 gap-2 sm:gap-3 md:gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-between w-full lg:hidden p-3 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
            aria-label="Open menu"
          >
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Danh mục
            </span>
            <svg
              className="w-6 h-6 text-gray-700 dark:text-gray-300"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          <div className="border border-gray-200 dark:border-gray-700 p-2 sm:p-3 md:p-4 rounded-lg h-full min-h-screen bg-white dark:bg-slate-800 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
