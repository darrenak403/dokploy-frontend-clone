"use client";
import React, { useMemo } from "react";

import { Icon } from "@iconify/react";

import { TestOrder } from "@/types/test-order";

import { useFetchAllTestOrderSwrCore } from "@/hook/singleton/swrs/test-order/useFetchAllTestOrderSwr";

const TestOrderStat: React.FC = () => {
  // fetch all orders (single page for stats); server returns data.testOrders
  const { data, isLoading } = useFetchAllTestOrderSwrCore("/orders");

  const stats = useMemo(() => {
    const orders: TestOrder[] = Array.isArray(data?.data?.list)
      ? data!.data!.list
      : (data?.data?.testOrders ?? []);

    const total = orders.length;
    const pending = orders.filter(
      (o) => (o.status || "").toUpperCase() === "PENDING"
    ).length;
    const completed = orders.filter(
      (o) => (o.status || "").toUpperCase() === "COMPLETED"
    ).length;
    const highPriority = orders.filter(
      (o) => String(o.priority || "").toUpperCase() === "HIGH"
    ).length;

    return { total, pending, completed, highPriority };
  }, [data]);

  const cards = [
    {
      id: "total",
      title: "Tất cả đơn xét nghiệm",
      value: isLoading ? "…" : String(stats.total),
      subtitle: "Tất cả đơn xét nghiệm",
      icon: "mdi:clipboard-list",
      accent: "bg-blue-50 text-blue-600",
    },
    {
      id: "pending",
      title: "Hồ sơ đang chờ",
      value: isLoading ? "…" : String(stats.pending),
      subtitle: "Đang chờ xử lý",
      icon: "mdi:timer-sand",
      accent: "bg-yellow-50 text-yellow-600",
    },
    {
      id: "completed",
      title: "Hồ sơ đã hoàn thành",
      value: isLoading ? "…" : String(stats.completed),
      subtitle: "Đơn đã hoàn thành",
      icon: "mdi:check-circle",
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      id: "high",
      title: "Hồ sơ ưu tiên cao",
      value: isLoading ? "…" : String(stats.highPriority),
      subtitle: "Đơn khẩn cấp",
      icon: "mdi:alert-circle",
      accent: "bg-red-50 text-red-600",
    },
  ];

  return (
    <section aria-label="Test order statistics" className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {cards.map((c) => (
          <div
            key={c.id}
            className="p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-none hover:shadow-lg transform hover:scale-[1.01] origin-center transition-all duration-500 ease-in-out"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100">
                {c.title}
              </h3>
              <div
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-md flex items-center justify-center ${c.accent}`}
                aria-hidden
              >
                <Icon
                  icon={c.icon}
                  width="16"
                  height="16"
                  className="sm:w-5 sm:h-5"
                />
              </div>
            </div>

            <div className="mt-2 sm:mt-3">
              <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {c.value}
              </div>
              <div className="mt-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                {c.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestOrderStat;
