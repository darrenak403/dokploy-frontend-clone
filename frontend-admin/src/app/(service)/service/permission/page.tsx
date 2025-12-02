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
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0">
        <MainTitle />
      </div>

      <div className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4">
        <PermissionStats />
      </div>

      <div className="flex-1 min-h-0 px-4 sm:px-6 pb-4">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div className="h-full min-h-[600px] lg:min-h-0">
            <PermissionList />
          </div>
          <div className="h-full min-h-[450px] lg:min-h-0">
            <RoleList allPermissions={allPermissions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionPage;
