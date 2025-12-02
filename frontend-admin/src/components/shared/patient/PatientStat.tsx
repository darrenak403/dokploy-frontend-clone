"use client";
import React, { useMemo } from "react";

import { Icon } from "@iconify/react";

import { Patient } from "@/types/patient";

import { useFetchAllPatientSwrSingleton } from "@/hook/singleton/swrs/patient/useFetchAllPatientSwr";

const PatientStat: React.FC = () => {
  const useFetchAll = useFetchAllPatientSwrSingleton();
  const { data, isLoading } = useFetchAll ?? {
    data: undefined,
    isLoading: false,
  };

  const stats = useMemo(() => {
    const patients: Patient[] = Array.isArray(data?.data?.data)
      ? data?.data?.data
      : [];

    const total = patients.length;

    // Active patients (not deleted)
    const active = patients.filter(
      (p) => p.deleted !== 1 && p.deleted !== true
    ).length;

    // Deleted patients
    const deleted = patients.filter(
      (p) => p.deleted === 1 || p.deleted === true
    ).length;

    // Patients with complete profile (have all basic info)
    const completeProfiles = patients.filter(
      (p) => p.fullName && p.phone && p.email && p.address && p.gender && p.yob
    ).length;

    // Patients by gender
    const maleCount = patients.filter(
      (p) => p.gender?.toLowerCase() === "male"
    ).length;

    const femaleCount = patients.filter(
      (p) => p.gender?.toLowerCase() === "female"
    ).length;

    // Recent patients (created in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPatients = patients.filter((p) => {
      if (!p.createdAt) return false;
      // Parse DD/MM/YYYY HH:mm:ss format
      const [datePart] = p.createdAt.split(" ");
      const [day, month, year] = datePart.split("/");
      const createdDate = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );
      return createdDate >= thirtyDaysAgo;
    }).length;

    return {
      total,
      active,
      deleted,
      completeProfiles,
      maleCount,
      femaleCount,
      recentPatients,
    };
  }, [data]);

  const cards = [
    {
      id: "total",
      title: "Tất cả bệnh nhân",
      value: isLoading ? "…" : String(stats.total),
      subtitle: "Tất cả hồ sơ bệnh nhân",
      icon: "mdi:account-group",
      accent: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
      bgCard: "bg-white dark:bg-gray-800",
    },
    {
      id: "active",
      title: "Bệnh nhân đang hoạt động",
      value: isLoading ? "…" : String(stats.active),
      subtitle: "Hiện đang hoạt động",
      icon: "mdi:account-check",
      accent:
        "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400",
      bgCard: "bg-white dark:bg-gray-800",
    },
    {
      id: "complete",
      title: "Hồ sơ hoàn chỉnh",
      value: isLoading ? "…" : String(stats.completeProfiles),
      subtitle: "Tất cả thông tin đã được điền",
      icon: "mdi:clipboard-check",
      accent:
        "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400",
      bgCard: "bg-white dark:bg-gray-800",
    },
    {
      id: "recent",
      title: "Bệnh nhân gần đây",
      value: isLoading ? "…" : String(stats.recentPatients),
      subtitle: "30 ngày qua",
      icon: "mdi:account-plus",
      accent:
        "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400",
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
    <section aria-label="Patient statistics" className="w-full">
      {/* Main Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {cards.map((c) => (
          <div
            key={c.id}
            className={`p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 ${c.bgCard} shadow-none hover:shadow-lg transform hover:scale-[1.01] origin-center transition-all duration-500 ease-in-out`}
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

export default PatientStat;
