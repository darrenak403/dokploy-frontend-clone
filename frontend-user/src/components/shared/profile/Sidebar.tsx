"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@iconify/react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const base = "/profile";

  const menuItems = [
    {
      key: "/profile",
      href: `${base}`,
      icon: "mdi:account-outline",
      label: "Hồ sơ của tôi",
    },
    {
      key: "/records",
      href: "/records",
      icon: "mdi:file-document-outline",
      label: "Hồ sơ bệnh án",
    },
    {
      key: "/profile/password",
      href: `${base}/password`,
      icon: "mdi:lock-outline",
      label: "Đổi mật khẩu",
    },
  ] as const;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`min-w-[20rem] min-h-[88vh] flex flex-col gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-lg border border-zinc-200 dark:border-r dark:border-zinc-600 dark:bg-gray-800 transition-all duration-300 ease-in-out lg:translate-x-0 lg:opacity-100 ${
          isOpen
            ? "fixed left-2 top-20 z-50 translate-x-0 opacity-100"
            : "fixed -translate-x-[calc(100%+1rem)] opacity-0 lg:relative lg:flex"
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 z-10"
          aria-label="Close menu"
        >
          <Icon
            icon="solar:close-circle-bold"
            className="w-6 h-6 text-gray-700 dark:text-gray-300"
          />
        </button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8 dark:text-white">
            Xin chào bạn!
          </h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onClose}
                className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-left transition-all duration-200 ease-in-out rounded-md transform hover:scale-[1.02] active:scale-[0.98] ${
                  isActive
                    ? "bg-red-50 text-red-600 border-l-4 border-red-500 dark:bg-red-900/20 dark:text-red-400 shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:shadow-sm dark:text-gray-300 dark:hover:bg-slate-700"
                }`}
              >
                <Icon
                  icon={item.icon}
                  className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200"
                />
                <span className="font-medium text-sm sm:text-base">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
