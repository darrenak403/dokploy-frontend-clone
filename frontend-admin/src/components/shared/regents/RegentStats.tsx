"use client";
import React, { useMemo } from "react";

import { Icon } from "@iconify/react";

import { useFetchGetAllReagentSwrSingleton } from "@/hook/singleton/swrs/instrument/useFetchGetAllReagentSwr";

const RegentStats: React.FC = () => {
  // Fetch data from API
  const { data, isLoading } = useFetchGetAllReagentSwrSingleton() || {
    data: undefined,
    isLoading: false,
  };

  const stats = useMemo(() => {
    // Get instruments array from API response
    const reagents = data?.data || [];

    const available = reagents.filter(
      (e) => (e.status || "").toUpperCase() === "AVAILABLE"
    ).length;
    const outOfStock = reagents.filter(
      (e) => (e.status || "").toUpperCase() === "OUT_OF_STOCK"
    ).length;
    const expired = reagents.filter(
      (e) => (e.status || "").toUpperCase() === "EXPIRED"
    ).length;

    return { available, outOfStock, expired };
  }, [data]);

  const cards = [
    {
      id: "available",
      title: "Có sẵn",
      value: isLoading ? "…" : String(stats.available),
      subtitle: "Thuốc thử khả dụng",
      icon: "mdi:check-circle",
      accent:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    },
    {
      id: "outOfStock",
      title: "Hết hàng",
      value: isLoading ? "…" : String(stats.outOfStock),
      subtitle: "Thuốc thử hết hàng",
      icon: "mdi:package-variant-closed",
      accent:
        "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      id: "expired",
      title: "Hết hạn sử dụng",
      value: isLoading ? "…" : String(stats.expired),
      subtitle: "Thuốc thử hết hạn sử dụng",
      icon: "mdi:timer-alert",
      accent:
        "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
    },
  ];

  return (
    <section aria-label="Regent statistics" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <div
            key={c.id}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-none hover:shadow-lg transform hover:scale-[1.01] origin-center transition-all duration-500 ease-in-out"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {c.title}
              </h3>
              <div
                className={`w-9 h-9 rounded-md flex items-center justify-center ${c.accent}`}
                aria-hidden
              >
                <Icon icon={c.icon} width="20" height="20" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {c.value}
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {c.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RegentStats;
