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
    <div className="p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-md h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 mb-4">
          <Icon
            icon="mdi:key-variant"
            className="w-6 h-6 text-gray-600 dark:text-gray-400"
          />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Danh sách quyền
          </h2>
        </div>
        <Button
          variant="solid"
          size="sm"
          className="mb-4 bg-black text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
          onPress={() => handleAddPermission()}
        >
          Thêm quyền
        </Button>
      </div>

      <Input
        placeholder="Tìm kiếm quyền..."
        value={searchText}
        onValueChange={setSearchText}
        startContent={
          <Icon icon="mdi:magnify" className="w-4 h-4 text-gray-400" />
        }
        className="mb-4"
      />

      <div className="space-y-2">
        {filteredPermissions.length > 0 ? (
          filteredPermissions.map((permission) => (
            <Card
              key={permission.id}
              className={`cursor-move border-2 transition-all shadow-md hover:shadow-md ${
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
                    className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-2 flex-shrink-0"
                  />
                  <Icon
                    icon="si:bin-duotone"
                    className="w-4 h-4 text-red-400 dark:text-gray-500 ml-2 flex-shrink-0 cursor-pointer"
                    onClick={() => handleDeletePermission(permission.id)}
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
