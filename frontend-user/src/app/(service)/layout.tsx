"use client";
import { useState } from "react";

import ProtectedRoute from "@/libs/ProtectedRoute";

import SidebarService from "@/components/shared/layout/SidebarService";

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={["ROLE_PATIENT"]}>
      {/* full width fixed container */}
      <div className="fixed top-18 left-0 right-0 bottom-0 overflow-auto">
        <div className="flex gap-2 sm:gap-4 md:gap-6 p-2 sm:p-3 md:p-4 h-full">
          {/* Left side - Sidebar */}
          <SidebarService
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Right side - Main content: important -> flex-1 w-0 */}
          <div className="flex-1 w-0 h-full min-h-0">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden fixed top-20 left-4 z-40 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-gray-700"
              aria-label="Open menu"
            >
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
