"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@iconify/react";

export function Sidebar() {
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
    <div className="min-w-[20rem] min-h-[88vh] flex flex-col gap-6 bg-white p-6 rounded-lg border border-zinc-200 dark:border-r dark:border-zinc-600 dark:bg-gray-800">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8 dark:text-white">
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
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ease-in-out rounded-md transform hover:scale-[1.02] active:scale-[0.98] ${
                isActive
                  ? "bg-red-50 text-red-600 border-l-4 border-red-500 dark:bg-red-900/20 dark:text-red-400 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:shadow-sm dark:text-gray-300 dark:hover:bg-slate-700"
              }`}
            >
              <Icon
                icon={item.icon}
                className="w-5 h-5 transition-transform duration-200"
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
