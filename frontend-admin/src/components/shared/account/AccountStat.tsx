"use client";
import React, { useMemo } from "react";

import { Icon } from "@iconify/react";

import { User } from "@/types/profile";

import { useFetchGetAllUserSwrSingleton } from "@/hook/singleton/swrs/user/useFetchGetAllUserSwr";

const AccountStat: React.FC = () => {
  const useFetchAll = useFetchGetAllUserSwrSingleton();
  const { data, isLoading } = useFetchAll ?? {
    data: undefined,
    isLoading: false,
  };

  const stats = useMemo(() => {
    const users: User[] = Array.isArray(data?.data) ? data?.data : [];

    const total = users.length;

    // Users with complete profile (have all basic info)
    const completeProfiles = users.filter(
      (p) =>
        p.fullName &&
        p.phone &&
        p.email &&
        p.address &&
        p.gender &&
        p.dateOfBirth
    ).length;

    // Users by gender
    const maleCount = users.filter(
      (p) => p.gender?.toLowerCase() === "male"
    ).length;

    const femaleCount = users.filter(
      (p) => p.gender?.toLowerCase() === "female"
    ).length;

    const incompleteProfiles = total - completeProfiles;
    const percentComplete =
      total > 0 ? Math.round((completeProfiles / total) * 100) : 0;

    // recentUsers, active, deleted are not available in the current User shape
    // provide safe defaults so UI can render reliably
    const recentUsers = 0;
    const active = 0;
    const deleted = 0;

    return {
      total,
      completeProfiles,
      incompleteProfiles,
      percentComplete,
      maleCount,
      femaleCount,
      recentUsers,
      active,
      deleted,
    };
  }, [data]);

  const cards = [
    {
      id: "total",
      title: "Tất cả người dùng",
      value: isLoading ? "…" : String(stats.total),
      subtitle: "Tất cả hồ sơ người dùng",
      icon: "mdi:account-group",
      accent: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
      bgCard: "bg-white dark:bg-gray-800",
    },
    {
      id: "complete",
      title: "Hồ sơ hoàn chỉnh",
      value: isLoading ? "…" : `${stats.completeProfiles}`,
      subtitle: isLoading ? "" : `${stats.percentComplete}% hồ sơ hoàn chỉnh`,
      icon: "mdi:clipboard-check",
      accent:
        "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400",
      bgCard: "bg-white dark:bg-gray-800",
    },
    {
      id: "incomplete",
      title: "Hồ sơ chưa hoàn chỉnh",
      value: isLoading ? "…" : String(stats.incompleteProfiles),
      subtitle: "Cần hoàn thiện thông tin",
      icon: "mdi:alert-circle",
      accent:
        "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400",
      bgCard: "bg-white dark:bg-gray-800",
    },
    {
      id: "male",
      title: "Nam",
      value: isLoading ? "…" : String(stats.maleCount),
      subtitle: "Số người dùng nam",
      icon: "mdi:gender-male",
      accent: "bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400",
      bgCard: "bg-white dark:bg-gray-800",
    },
  ];

  // Gender breakdown cards (smaller)
  // const genderCards = [
  //   {
  //     id: "male",
  //     title: "Male",
  //     value: isLoading ? "…" : String(stats.maleCount),
  //     icon: "mdi:gender-male",
  //     accent: "bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400",
  //   },
  //   {
  //     id: "female",
  //     title: "Female",
  //     value: isLoading ? "…" : String(stats.femaleCount),
  //     icon: "mdi:gender-female",
  //     accent: "bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400",
  //   },
  //   {
  //     id: "deleted",
  //     title: "Deleted",
  //     value: isLoading ? "…" : String(stats.deleted),
  //     icon: "mdi:account-remove",
  //     accent: "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400",
  //   },
  // ];

  return (
    <section aria-label="Patient statistics" className="w-full space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

export default AccountStat;
