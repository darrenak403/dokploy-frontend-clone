"use client";
<<<<<<< HEAD
import React, { useMemo } from "react";
=======
import React from "react";
>>>>>>> 706ea9b95546c6814000ecbbd6afdf4667f0da2f

import { Icon } from "@iconify/react";

import { useFetchGetAllMonitoringSwrSingleton } from "@/hook/singleton/swrs/monitoring/useFetchGetAllMonitoringSwr";
<<<<<<< HEAD
import { getMonitoringStats } from "@/modules/monitoring/getAllMonitoringHelpers";

const MonitoringStat: React.FC = () => {
  const swrResult = useFetchGetAllMonitoringSwrSingleton();
  const { data, isLoading } = swrResult || {};

  const stats = useMemo(() => {
    const monitoringData = Array.isArray(data) ? data : [];
    return getMonitoringStats(monitoringData);
  }, [data]);
=======

import { getMonitoringStats } from "@/modules/monitoring/getAllMonitoringHelpers";

const MonitoringStat = () => {
  const swrResult = useFetchGetAllMonitoringSwrSingleton();
  const { data, isLoading } = swrResult || {};
  const stats = getMonitoringStats(data || []);
>>>>>>> 706ea9b95546c6814000ecbbd6afdf4667f0da2f

  const cards = [
    {
      id: "total",
      title: "Tổng số hoạt động",
      value: isLoading ? "…" : String(stats.total),
      subtitle: "Tất cả các sự kiện",
      icon: "mdi:chart-line",
      accent: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
      bgCard: "bg-white dark:bg-gray-800",
    },
    {
      id: "success",
      title: "Thành công",
      value: isLoading ? "…" : String(stats.successCount),
      subtitle: `Tỷ lệ thành công: ${stats.successRate}%`,
      icon: "mdi:check-circle",
      accent:
        "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400",
      bgCard: "bg-white dark:bg-gray-800",
    },
    {
      id: "failure",
      title: "Thất bại",
      value: isLoading ? "…" : String(stats.failureCount),
      subtitle: "Các hoạt động thất bại",
      icon: "mdi:alert-circle",
      accent: "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400",
      bgCard: "bg-white dark:bg-gray-800",
    },
    {
      id: "error",
      title: "Lỗi",
      value: isLoading ? "…" : String(stats.errorCount),
      subtitle: "Các lỗi hệ thống",
      icon: "mdi:alert-octagon",
      accent:
        "bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400",
      bgCard: "bg-white dark:bg-gray-800",
    },
    {
      id: "recent",
      title: "Hoạt động gần đây",
      value: isLoading ? "…" : String(stats.recentActivities),
      subtitle: "1 giờ qua",
      icon: "mdi:clock-fast",
      accent:
        "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400",
      bgCard: "bg-white dark:bg-gray-800",
    },
    {
      id: "services",
      title: "Dịch vụ hoạt động",
      value: isLoading ? "…" : String(stats.uniqueServices),
      subtitle: "Số dịch vụ khác nhau",
      icon: "mdi:server-network",
<<<<<<< HEAD
      accent:
        "bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400",
=======
      accent: "bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400",
>>>>>>> 706ea9b95546c6814000ecbbd6afdf4667f0da2f
      bgCard: "bg-white dark:bg-gray-800",
    },
    {
      id: "performers",
      title: "Người thực hiện",
      value: isLoading ? "…" : String(stats.uniquePerformers),
      subtitle: "Số người dùng khác nhau",
      icon: "mdi:account-multiple",
      accent: "bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400",
      bgCard: "bg-white dark:bg-gray-800",
    },
  ];

  return (
    <section aria-label="Monitoring statistics" className="w-full space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {cards.map((c) => (
          <div
            key={c.id}
            className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 ${c.bgCard} shadow-none hover:shadow-lg transform hover:scale-[1.01] origin-center transition-all duration-500 ease-in-out`}
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

export default MonitoringStat;
