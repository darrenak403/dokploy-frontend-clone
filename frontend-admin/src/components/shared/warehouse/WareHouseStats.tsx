"use client";
import React, { useMemo } from "react";

import { Icon } from "@iconify/react";

import { useFetchGetAllInstrumentSwrSingleton } from "@/hook/singleton/swrs/warehouse/useFetchGetAllInstrumentSwr";

const WareHouseStats: React.FC = () => {
  // Fetch data from API
  const { data, isLoading } = useFetchGetAllInstrumentSwrSingleton() || {
    data: undefined,
    isLoading: false,
  };

  const stats = useMemo(() => {
    // Get instruments array from API response
    const equipments = data?.data?.data || [];

    const ready = equipments.filter(
      (e) => (e.status || "").toUpperCase() === "READY"
    ).length;
    const processing = equipments.filter(
      (e) => (e.status || "").toUpperCase() === "PROCESSING"
    ).length;
    const maintenance = equipments.filter(
      (e) => (e.status || "").toUpperCase() === "MAINTENANCE"
    ).length;
    const error = equipments.filter(
      (e) => (e.status || "").toUpperCase() === "ERROR"
    ).length;
    const inactive = equipments.filter(
      (e) => (e.status || "").toUpperCase() === "INACTIVE"
    ).length;

    return { ready, processing, maintenance, error, inactive };
  }, [data]);

  const cards = [
    {
      id: "ready",
      title: "Sẵn sàng",
      value: isLoading ? "…" : String(stats.ready),
      subtitle: "Thiết bị khả dụng",
      icon: "mdi:check-circle",
      accent:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    },
    {
      id: "processing",
      title: "Chờ xử lý",
      value: isLoading ? "…" : String(stats.processing),
      subtitle: "Đang đợi xử lí",
      icon: "mdi:cog",
      accent:
        "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      id: "maintenance",
      title: "Bảo trì",
      value: isLoading ? "…" : String(stats.maintenance),
      subtitle: "Đang bảo trì",
      icon: "mdi:wrench",
      accent:
        "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
    },
    {
      id: "error",
      title: "Lỗi",
      value: isLoading ? "…" : String(stats.error),
      subtitle: "Thiết bị lỗi",
      icon: "mdi:alert-circle",
      accent: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    },
    {
      id: "inactive",
      title: "Không hoạt động",
      value: isLoading ? "…" : String(stats.inactive),
      subtitle: "Ngừng hoạt động",
      icon: "mdi:power-off",
      accent: "bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400",
    },
  ];

  return (
    <section aria-label="Warehouse equipment statistics" className="w-full">
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-5">
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

export default WareHouseStats;
