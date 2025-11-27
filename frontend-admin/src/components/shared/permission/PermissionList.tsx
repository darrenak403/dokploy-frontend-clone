"use client";
import React, { useState, useCallback } from "react";

import { Card, CardBody, Input, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";

import { Permission } from "@/types/permission";

import { useFetchGetAllPermissionSwrSingleton } from "@/hook/singleton/swrs/permission/useFetchGetAllPermissionSwr";

const PermissionList: React.FC = () => {
  const permissionsSwr = useFetchGetAllPermissionSwrSingleton();
  const { data: permissionsData, isLoading } = permissionsSwr || {};
  
  const permissions = Array.isArray(permissionsData?.data) ? permissionsData?.data : [];
  const [searchText, setSearchText] = useState("");
  const [draggedPermission, setDraggedPermission] = useState<Permission | null>(null);

  const filteredPermissions = permissions.filter((permission) =>
    permission.name.toLowerCase().includes(searchText.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, permission: Permission) => {
      setDraggedPermission(permission);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("application/json", JSON.stringify(permission));
      // Thêm một class để styling khi drag
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.opacity = "0.5";
      }
    },
    []
  );

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedPermission(null);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon icon="mdi:key-variant" className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Danh sách quyền
        </h2>
      </div>

      <Input
        placeholder="Tìm kiếm quyền..."
        value={searchText}
        onValueChange={setSearchText}
        startContent={<Icon icon="mdi:magnify" className="w-4 h-4 text-gray-400" />}
        className="mb-4"
      />

      <div className="space-y-2">
        {filteredPermissions.length > 0 ? (
          filteredPermissions.map((permission) => (
            <Card
              key={permission.id}
              className={`cursor-move border-2 transition-all hover:shadow-lg ${
                draggedPermission?.id === permission.id
                  ? "opacity-50 border-blue-500"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, permission)}
              onDragEnd={handleDragEnd}
            >
              <CardBody className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {permission.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {permission.description}
                    </p>
                  </div>
                  <Icon
                    icon="mdi:drag"
                    className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-2 flex-shrink-0"
                  />
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {searchText ? "Không tìm thấy quyền nào" : "Chưa có quyền nào"}
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionList;
