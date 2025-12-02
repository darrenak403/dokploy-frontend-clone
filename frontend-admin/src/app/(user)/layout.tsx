"use client";
import { useState } from "react";

import ProtectedRoute from "@/libs/ProtectedRoute";

import { Sidebar } from "@/components/shared/profile/Sidebar";

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute
      allowedRoles={["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_STAFF", "ROLE_DOCTOR"]}
    >
      {/* full width fixed container */}
      <div className="fixed top-18 left-0 right-0 bottom-0 overflow-auto">
        <div className="flex gap-2 sm:gap-4 md:gap-6 p-2 sm:p-3 md:p-4 h-full">
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

            <div className="border border-gray-200 dark:border-gray-700 p-2 sm:p-3 md:p-4 rounded-lg shadow-md h-full min-h-0 bg-white dark:bg-slate-800 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
