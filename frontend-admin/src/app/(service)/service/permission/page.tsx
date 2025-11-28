"use client";
import React from "react";

import { useFetchGetAllPermissionSwrSingleton } from "@/hook/singleton/swrs/permission/useFetchGetAllPermissionSwr";

import MainTitle from "@/components/shared/permission/MainTitle";
import PermissionList from "@/components/shared/permission/PermissionList";
import PermissionStats from "@/components/shared/permission/PermissionStats";
import RoleList from "@/components/shared/permission/RoleList";

const PermissionPage = () => {
  const permissionsSwr = useFetchGetAllPermissionSwrSingleton();
  const { data: permissionsData } = permissionsSwr || {};
  const allPermissions = Array.isArray(permissionsData?.data)
    ? permissionsData?.data
    : [];

  return (
    <div className="h-full flex flex-col gap-6">
      <MainTitle />

      <PermissionStats />

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-auto">
          <RoleList allPermissions={allPermissions} />
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-auto">
          <PermissionList />
        </div>
      </div>
    </div>
  );
};

export default PermissionPage;
