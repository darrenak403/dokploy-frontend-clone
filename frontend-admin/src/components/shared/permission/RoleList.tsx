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
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
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

      {/* Header */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Icon
              icon="mdi:account-group"
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400"
            />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Danh sách vai trò
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {roles.length} vai trò
            </p>
          </div>
        </div>
      </div>

      {/* Roles List */}
      <div className="flex-1 overflow-auto p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`border-2 transition-all ${
                draggedOverRoleId === role.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-lg"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
              }`}
              onDragOver={(e) => handleDragOver(e, role.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, role.id)}
            >
              <CardBody className="p-3 sm:p-4">
                {/* Role Header */}
                <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {role.roleName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {role.roleCode}
                    </p>
                  </div>
                  {draggedOverRoleId === role.id && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Icon
                        icon="mdi:arrow-down"
                        className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-bounce"
                      />
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        Thả vào đây
                      </span>
                    </div>
                  )}
                </div>

                {/* Permissions */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      icon="mdi:shield-key"
                      className="w-4 h-4 text-gray-400"
                    />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Quyền ({role.permissions?.length || 0})
                    </span>
                  </div>

                  {role.permissions && role.permissions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="group flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-xs sm:text-sm hover:shadow-md transition-all"
                        >
                          <Icon
                            icon="mdi:key"
                            className="w-3 h-3 text-gray-900 dark:text-white"
                          />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {permission.name}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemovePermission(role.id, permission.id)
                            }
                            className="ml-1 w-5 h-5 flex items-center justify-center rounded-md text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100"
                            disabled={isMutating}
                          >
                            <Icon icon="mdi:close" className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                      <Icon icon="mdi:drag" className="w-4 h-4 text-gray-400" />
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic">
                        Kéo quyền vào đây để gán cho vai trò này
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleList;
