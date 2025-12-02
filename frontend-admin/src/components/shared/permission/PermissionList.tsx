"use client";
import React, { useCallback, useState } from "react";

import { useFetchGetAllPermissionSwrSingleton } from "@/hook";
import { Alert, Button, Card, CardBody, Input, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";
import { mutate } from "swr";

import { Permission } from "@/types/permission";

import { useCreatePermissionDisclosureSingleton } from "@/hook/singleton/discloresures/permission/useCreatePermissionDiscloresure";
import { useFetchDeletePermissionSwrSingleton } from "@/hook/singleton/swrs/permission/useFetchDeletePermissionSwr";

const PermissionList: React.FC = () => {
  const { onOpen } = useCreatePermissionDisclosureSingleton();
  const permissionsSwr = useFetchGetAllPermissionSwrSingleton();
  const { data: permissionsData, isLoading } = permissionsSwr || {};
  const deletePermissionSwr = useFetchDeletePermissionSwrSingleton();

  const permissions = Array.isArray(permissionsData?.data)
    ? permissionsData?.data
    : [];
  const [searchText, setSearchText] = useState("");
  const [draggedPermission, setDraggedPermission] = useState<Permission | null>(
    null
  );
  const [showAlert, setShowAlert] = useState(false);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [alertMessage, setAlertMessage] = useState("");

  const filteredPermissions = permissions.filter(
    (permission) =>
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

  const handleAddPermission = () => {
    onOpen();
  };

  const handleDeletePermission = async (permissionId: number) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn sẽ không thể hoàn tác hành động này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;
    if (!deletePermissionSwr) return;

    try {
      await deletePermissionSwr.deletePermission(permissionId);
      await mutate("/roles/permissions");
      setShowAlert(true);
      setAlertColor("success");
      setAlertMessage("Đã xoá quyền thành công");
      setTimeout(() => setShowAlert(false), 3000);
      // Có thể mutate để refresh list
    } catch (error) {
      console.error("Lỗi xóa quyền:", error);
      setShowAlert(true);
      setAlertColor("danger");
      setAlertMessage("Có lỗi xảy ra khi xóa quyền");
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Icon
                icon="mdi:key-variant"
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400"
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Danh sách quyền
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {filteredPermissions.length} quyền
              </p>
            </div>
          </div>
          <Button
            variant="solid"
            size="sm"
            className="w-full sm:w-auto bg-black text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
            onPress={() => handleAddPermission()}
          >
            <Icon icon="mdi:plus" className="w-4 h-4" />
            <span>Thêm quyền</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <Input
          placeholder="Tìm kiếm quyền..."
          value={searchText}
          onValueChange={setSearchText}
          startContent={
            <Icon icon="mdi:magnify" className="w-4 h-4 text-gray-400" />
          }
          size="sm"
          variant="bordered"
          classNames={{
            input: "text-sm",
            inputWrapper: "h-10",
          }}
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-3 sm:p-4">
        {filteredPermissions.length > 0 ? (
          <div className="space-y-3">
            {filteredPermissions.map((permission) => (
              <Card
                key={permission.id}
                className={`cursor-move border transition-all hover:shadow-md ${
                  draggedPermission?.id === permission.id
                    ? "opacity-50 border-blue-500 shadow-lg"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, permission)}
                onDragEnd={handleDragEnd}
              >
                <CardBody className="p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    {/* Drag Icon */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      <Icon
                        icon="mdi:drag"
                        className="w-4 h-4 text-gray-400 dark:text-gray-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1">
                        {permission.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {permission.description}
                      </p>
                    </div>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeletePermission(permission.id)}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <Icon icon="mdi:delete-outline" className="w-4 h-4" />
                    </button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <Icon icon="mdi:key-variant" className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
              {searchText ? "Không tìm thấy quyền nào" : "Chưa có quyền nào"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchText
                ? "Thử tìm kiếm với từ khóa khác"
                : "Nhấn 'Thêm quyền' để bắt đầu"}
            </p>
          </div>
        )}
      </div>

      {/* Alert */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="fixed top-20 right-4 z-[999] w-auto max-w-[90vw] sm:max-w-sm"
          >
            <Alert
              color={alertColor}
              title={alertMessage}
              variant="flat"
              className="shadow-lg bg-background border border-gray-200 dark:border-gray-700"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PermissionList;
