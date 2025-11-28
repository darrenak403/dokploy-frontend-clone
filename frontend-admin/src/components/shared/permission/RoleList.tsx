"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Alert, Card, CardBody, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";

import { Permission } from "@/types/permission";

import { useFetchGetAllRoleCore } from "@/hook/singleton/swrs/permission/useFetchGetAllRoleSwr";
import { useFetchRemovePermissionFromRoleSwrSingleton } from "@/hook/singleton/swrs/permission/useFetchRemovePermissionFromRoleSwr";
import { useFetchUpdatePermissionSwrCore } from "@/hook/singleton/swrs/permission/useFetchUpdatePermissionSwr";

interface RoleListProps {
  allPermissions?: Permission[];
  onDragStart?: (permission: Permission) => void;
}

const RoleList: React.FC<RoleListProps> = () => {
  const rolesSwr = useFetchGetAllRoleCore();
  const updatePermissionSwr = useFetchUpdatePermissionSwrCore(null);
  const removePermissionSwr = useFetchRemovePermissionFromRoleSwrSingleton();

  const { data: rolesData, isLoading, mutate } = rolesSwr || {};
  const { updateRolePermissions, isMutating } = updatePermissionSwr || {};

  const roles = useMemo(
    () => (Array.isArray(rolesData?.data) ? rolesData?.data : []),
    [rolesData?.data]
  );
  const [draggedOverRoleId, setDraggedOverRoleId] = useState<number | null>(
    null
  );
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [showAlert, setShowAlert] = useState(false);
  const alertTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent, roleId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverRoleId(roleId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDraggedOverRoleId(null);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent, roleId: number) => {
      e.preventDefault();
      e.stopPropagation();
      setDraggedOverRoleId(null);

      const permissionData = e.dataTransfer.getData("application/json");
      if (!permissionData) return;

      try {
        const permission: Permission = JSON.parse(permissionData);
        const role = roles.find((r) => r.id === roleId);

        if (!role) return;

        // Kiểm tra xem permission đã có trong role chưa
        const hasPermission = role.permissions?.some(
          (p) => p.id === permission.id
        );

        if (hasPermission) {
          setAlertMessage(
            `Quyền "${permission.name}" đã có trong vai trò này.`
          );
          setAlertColor("danger");
          setShowAlert(true);
          if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
          alertTimerRef.current = setTimeout(() => setShowAlert(false), 3000);
          return;
        }

        // Thêm permission vào role
        const currentPermissionIds = role.permissions?.map((p) => p.id) || [];
        const newPermissionIds = [...currentPermissionIds, permission.id];

        // Gọi API update
        if (updateRolePermissions) {
          const result = await updateRolePermissions({
            id: roleId,
            payload: { permissionIds: newPermissionIds },
          });

          if (result && result.statusCode === 200) {
            // Refresh data
            mutate?.();
            setAlertMessage(
              `Đã thêm quyền "${permission.name}" vào vai trò "${role.roleName}".`
            );
            setAlertColor("success");
            setShowAlert(true);
            if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
            alertTimerRef.current = setTimeout(() => setShowAlert(false), 3000);
          } else {
            throw new Error(result?.error || "Cập nhật thất bại");
          }
        }
      } catch (error) {
        console.error("Error updating role permissions:", error);
        setAlertMessage("Không thể cập nhật quyền. Vui lòng thử lại.");
        setAlertColor("danger");
        setShowAlert(true);
        if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
        alertTimerRef.current = setTimeout(() => setShowAlert(false), 5000);
      }
    },
    [roles, updateRolePermissions, mutate]
  );

  const handleRemovePermission = async (
    roleId: number,
    permissionId: number
  ) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn sẽ xóa quyền này khỏi vai trò!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;
    if (!removePermissionSwr) return;

    try {
      await removePermissionSwr.removePermissionFromRole({
        roleId,
        permissionId,
      });
      mutate?.();
      setAlertMessage("Đã xóa quyền khỏi vai trò thành công");
      setAlertColor("success");
      setShowAlert(true);
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
      alertTimerRef.current = setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Lỗi xóa quyền:", error);
      setAlertMessage("Có lỗi xảy ra khi xóa quyền");
      setAlertColor("danger");
      setShowAlert(true);
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
      alertTimerRef.current = setTimeout(() => setShowAlert(false), 5000);
    }
  };

  useEffect(() => {
    return () => {
      if (alertTimerRef.current) {
        clearTimeout(alertTimerRef.current);
      }
    };
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
      {/* Alert */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="fixed top-20 right-4 z-[999] w-auto max-w-sm"
          >
            <Alert
              color={alertColor}
              title={alertMessage}
              variant="flat"
              className="shadow-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 mb-4">
        <Icon
          icon="mdi:account-group"
          className="w-6 h-6 text-gray-600 dark:text-gray-400"
        />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Danh sách vai trò
        </h2>
      </div>

      <div className="space-y-4">
        {roles.map((role) => (
          <Card
            key={role.id}
            className={`border-2 transition-all shadow-md ${
              draggedOverRoleId === role.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "border-gray-200 dark:border-gray-700"
            }`}
            onDragOver={(e) => handleDragOver(e, role.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, role.id)}
          >
            <CardBody className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {role.roleName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {role.roleCode}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {role.permissions && role.permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-sm"
                      >
                        <span className="text-gray-900 dark:text-white">
                          {permission.name}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemovePermission(role.id, permission.id)
                          }
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          disabled={isMutating}
                        >
                          <Icon icon="mdi:close" className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Chưa có quyền nào
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoleList;
