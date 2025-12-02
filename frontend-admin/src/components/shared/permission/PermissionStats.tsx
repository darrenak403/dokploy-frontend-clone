"use client";
import React, { useMemo } from "react";

import { Icon } from "@iconify/react";

import { useFetchGetAllPermissionSwrSingleton } from "@/hook/singleton/swrs/permission/useFetchGetAllPermissionSwr";
import { useFetchGetAllRoleCore } from "@/hook/singleton/swrs/permission/useFetchGetAllRoleSwr";

const PermissionStats = () => {
  const rolesSwr = useFetchGetAllRoleCore();
  const permissionsSwr = useFetchGetAllPermissionSwrSingleton();

  const { data: rolesData, isLoading: isLoadingRoles } = rolesSwr || {};
  const { data: permissionsData, isLoading: isLoadingPermissions } =
    permissionsSwr || {};

  const stats = useMemo(() => {
    const roles = Array.isArray(rolesData?.data) ? rolesData?.data : [];
    const permissions = Array.isArray(permissionsData?.data)
      ? permissionsData?.data
      : [];

    const totalRoles = roles.length;
    const totalPermissions = permissions.length;

    // Tính tổng số permissions được sử dụng trong các roles
    const totalPermissionsUsed = roles.reduce((acc, role) => {
      return acc + (role.permissions?.length || 0);
    }, 0);

    // Tính số roles có permissions
    const rolesWithPermissions = roles.filter(
      (role) => role.permissions && role.permissions.length > 0
    ).length;

    // Tính số roles không có permissions
    const rolesWithoutPermissions = totalRoles - rolesWithPermissions;

    // Tính trung bình permissions mỗi role
    const avgPermissionsPerRole =
      totalRoles > 0 ? Math.round(totalPermissionsUsed / totalRoles) : 0;

    return {
      totalRoles,
      totalPermissions,
      totalPermissionsUsed,
      rolesWithPermissions,
      rolesWithoutPermissions,
      avgPermissionsPerRole,
    };
  }, [rolesData, permissionsData]);

  const cards = [
    {
      id: "totalRoles",
      title: "Tổng số vai trò",
      value: isLoadingRoles ? "…" : String(stats.totalRoles),
      subtitle: "Tất cả các vai trò trong hệ thống",
      icon: "mdi:account-group",
      accent: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
      bgCard: "bg-white dark:bg-gray-800",
    },
    {
      id: "totalPermissions",
      title: "Tổng số quyền",
      value: isLoadingPermissions ? "…" : String(stats.totalPermissions),
      subtitle: "Tất cả các quyền có sẵn",
      icon: "mdi:key-variant",
      accent:
        "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400",
      bgCard: "bg-white dark:bg-gray-800",
    },
    {
      id: "rolesWithPermissions",
      title: "Vai trò có quyền",
      value: isLoadingRoles ? "…" : String(stats.rolesWithPermissions),
      subtitle: `Trung bình ${stats.avgPermissionsPerRole} quyền/vai trò`,
      icon: "mdi:check-circle",
      accent:
        "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400",
      bgCard: "bg-white dark:bg-gray-800",
    },
    {
      id: "rolesWithoutPermissions",
      title: "Vai trò chưa có quyền",
      value: isLoadingRoles ? "…" : String(stats.rolesWithoutPermissions),
      subtitle: "Cần cấu hình quyền",
      icon: "mdi:alert-circle",
      accent:
        "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400",
      bgCard: "bg-white dark:bg-gray-800",
    },
  ];

  return (
    <section aria-label="Permission statistics" className="w-full">
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

export default PermissionStats;
