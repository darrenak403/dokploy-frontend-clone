"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";

import { formatDateTimeToDate } from "@/modules";
import {
  Alert,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";

import { useFetchDeleteReagentSwrSingleton } from "@/hook/singleton/swrs/instrument/useFetchDeleteReagentsSwr";
import { useFetchGetAllReagentSwrSingleton } from "@/hook/singleton/swrs/instrument/useFetchGetAllReagentSwr";
import { useFetchUpdateStatusReagentsSwrSingleton } from "@/hook/singleton/swrs/instrument/useFetchUpdateStatusReagentsSwr";

import {
  getStatusDisplay,
  getStatusIcon,
} from "@/modules/regent/getAllRegentHelper";

const RegentList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [showAlert, setShowAlert] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<{ [key: string]: number }>({});
  const MIN_UPDATE_INTERVAL = 5000;

  const { data, error, isLoading, mutate } =
    useFetchGetAllReagentSwrSingleton() || {
      data: undefined,
      error: undefined,
      isLoading: false,
      mutate: undefined,
    };

  const updateReagentStatusSwr = useFetchUpdateStatusReagentsSwrSingleton();
  const deleteReagentSwr = useFetchDeleteReagentSwrSingleton();

  const handleStatusChange = async (
    reagentId: string | number,
    currentQuantity: number,
    newStatus: string
  ) => {
    if (isUpdating !== null) {
      setAlertMessage("Vui lòng đợi cập nhật hiện tại hoàn tất!");
      setAlertColor("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    const updateKey = String(reagentId);
    const now = Date.now();
    const lastUpdateTime = lastUpdateTimeRef.current[updateKey] || 0;
    const timeSinceLastUpdate = now - lastUpdateTime;

    if (timeSinceLastUpdate < MIN_UPDATE_INTERVAL) {
      const remainingTime = Math.ceil(
        (MIN_UPDATE_INTERVAL - timeSinceLastUpdate) / 1000
      );
      setAlertMessage(
        `Vui lòng đợi ${remainingTime} giây trước khi cập nhật lại thuốc thử này!`
      );
      setAlertColor("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      setIsUpdating(updateKey);

      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }

      lastUpdateTimeRef.current[updateKey] = now;

      const result = await updateReagentStatusSwr?.updateReagentStatus?.({
        reagentId: reagentId,
        payload: {
          reagentStatus: newStatus as "AVAILABLE" | "OUT_OF_STOCK" | "EXPIRED",
          quantity: currentQuantity,
        },
      });

      if (result?.data) {
        setAlertMessage("Cập nhật trạng thái thành công!");
        setAlertColor("success");
        setShowAlert(true);

        updateTimerRef.current = setTimeout(() => setShowAlert(false), 3000);

        mutate?.();
      } else {
        setAlertMessage(result?.message || "Có lỗi xảy ra khi cập nhật");
        setAlertColor("danger");
        setShowAlert(true);
        updateTimerRef.current = setTimeout(() => setShowAlert(false), 5000);
      }
    } catch (error: any) {
      console.error("Update reagent status error:", error);
      setAlertMessage(
        error?.response?.data?.message ||
          "Không thể kết nối đến máy chủ. Vui lòng thử lại."
      );
      setAlertColor("danger");
      setShowAlert(true);
      updateTimerRef.current = setTimeout(() => setShowAlert(false), 5000);
    } finally {
      setIsUpdating(null);
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
    };
  }, []);

  const handleDelete = async (
    reagentId: string | number,
    reagentName: string
  ) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: `Bạn có chắc chắn muốn xóa thuốc thử "${reagentName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(reagentId);

      const deleteResult = await deleteReagentSwr?.deleteReagent?.({
        reagentId: reagentId,
      });

      if (deleteResult?.data) {
        setAlertMessage("Xóa thuốc thử thành công!");
        setAlertColor("success");
        setShowAlert(true);
        updateTimerRef.current = setTimeout(() => setShowAlert(false), 3000);

        // Refresh data
        mutate?.();
      } else {
        setAlertMessage(deleteResult?.message || "Có lỗi xảy ra khi xóa");
        setAlertColor("danger");
        setShowAlert(true);
        updateTimerRef.current = setTimeout(() => setShowAlert(false), 5000);
      }
    } catch (error: any) {
      console.error("Delete reagent error:", error);
      setAlertMessage(
        error?.response?.data?.message ||
          "Không thể kết nối đến máy chủ. Vui lòng thử lại."
      );
      setAlertColor("danger");
      setShowAlert(true);
      updateTimerRef.current = setTimeout(() => setShowAlert(false), 5000);
    } finally {
      setDeletingId(null);
    }
  };

  const reagents = !data
    ? []
    : data.data.map((reagent: any) => ({
        id: reagent.id || reagent.reagentId,
        reagentType: reagent.reagentType,
        reagentName: reagent.reagentName,
        lotNumber: reagent.lotNumber,
        quantity: reagent.quantity,
        unit: reagent.unit,
        expiryDate: reagent.expiryDate,
        vendorId: reagent.vendorId,
        vendorName: reagent.vendorName,
        vendorContact: reagent.vendorContact,
        installedBy: reagent.installedBy,
        installedDate: reagent.installedDate ?? reagent.installDate,
        status: reagent.status,
        remarks: reagent.remarks,
      }));

  const filteredBySearch = reagents.filter((reagent: any) => {
    const query = searchQuery.toLowerCase();
    return (
      (reagent.reagentName || "").toLowerCase().includes(query) ||
      (reagent.lotNumber || "").toLowerCase().includes(query)
    );
  });

  const filteredEquipments =
    statusFilter === "all"
      ? filteredBySearch
      : filteredBySearch.filter((eq) => eq.status === statusFilter);

  // no side effects needed

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Danh Sách Thuốc Thử</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isLoading
                ? "Đang tải..."
                : `${filteredEquipments.length} thuốc thử trong hệ thống`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 lg:w-auto sm:w-full">
            <Input
              className="sm:flex-1 lg:w-64"
              placeholder="Tìm kiếm theo tên hoặc mã lô..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={
                <Icon icon="mdi:magnify" className="h-4 w-4 text-default-400" />
              }
              size="sm"
              variant="bordered"
              disabled={isLoading}
            />

            <Select
              aria-label="Chọn trạng thái"
              placeholder="Tất cả trạng thái"
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) =>
                setStatusFilter(Array.from(keys)[0] as string)
              }
              size="sm"
              variant="bordered"
              className="w-full sm:w-48"
              disabled={isLoading}
            >
              <SelectItem key="all">Tất cả trạng thái</SelectItem>
              <SelectItem key="AVAILABLE">Có sẵn</SelectItem>
              <SelectItem key="OUT_OF_STOCK">Hết hàng</SelectItem>
              <SelectItem key="EXPIRED">Hết hạn sử dụng</SelectItem>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" label="Đang tải dữ liệu..." />
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-8">
            <Icon
              icon="mdi:alert-circle"
              className="mx-auto h-12 w-12 text-red-500 mb-4"
            />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Lỗi tải dữ liệu
            </h3>
            <p className="text-sm text-default-500">
              Không thể tải danh sách thuốc thử. Vui lòng thử lại sau.
            </p>
          </div>
        )}

        {!isLoading && !error && filteredEquipments.length === 0 && (
          <div className="text-center py-8">
            <Icon
              icon="mdi:package-variant-closed"
              className="mx-auto h-12 w-12 text-default-300 mb-4"
            />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Không tìm thấy thuốc thử
            </h3>
            <p className="text-sm text-default-500">
              {searchQuery || statusFilter !== "all"
                ? "Vui lòng điều chỉnh tìm kiếm hoặc bộ lọc của bạn."
                : "Chưa có thuốc thử nào trong hệ thống."}
            </p>
          </div>
        )}

        {!isLoading && !error && filteredEquipments.length > 0 && (
          <div className="space-y-4">
            {filteredEquipments.map((equipment: any, idx: number) => {
              const statusDisplay = getStatusDisplay(equipment.status);
              const updateKey = String(equipment.id);
              const isThisItemUpdating = isUpdating === updateKey;
              const isAnyItemUpdating = isUpdating !== null;

              return (
                <div
                  key={`${equipment.lotNumber || idx}`}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4
                           hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">
                      {equipment.reagentName}
                    </h3>

                    <div className="flex items-center gap-2">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            variant="bordered"
                            size="sm"
                            isDisabled={isAnyItemUpdating}
                            className={`
                            ${statusDisplay.borderColor} 
                            ${statusDisplay.bgColor}
                            ${statusDisplay.color}
                            font-medium min-w-[180px]
                            ${
                              isAnyItemUpdating
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }
                          `}
                            startContent={
                              isThisItemUpdating ? (
                                <Spinner size="sm" />
                              ) : (
                                <Icon
                                  icon={getStatusIcon(equipment.status)}
                                  className="h-4 w-4"
                                />
                              )
                            }
                            endContent={
                              <Icon
                                icon="mdi:chevron-down"
                                className="h-4 w-4"
                              />
                            }
                          >
                            {statusDisplay.text}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Chọn trạng thái mới"
                          onAction={(key) => {
                            if (key !== equipment.status && equipment.id) {
                              handleStatusChange(
                                equipment.id,
                                equipment.quantity,
                                key as string
                              );
                            }
                          }}
                          disabledKeys={[equipment.status]}
                        >
                          <DropdownItem
                            key="AVAILABLE"
                            startContent={
                              <Icon
                                icon="mdi:check-circle"
                                className="h-4 w-4 text-green-600"
                              />
                            }
                            className="text-green-600"
                          >
                            Có sẵn
                          </DropdownItem>
                          <DropdownItem
                            key="OUT_OF_STOCK"
                            startContent={
                              <Icon
                                icon="mdi:package-variant-closed"
                                className="h-4 w-4 text-yellow-600"
                              />
                            }
                            className="text-yellow-600"
                          >
                            Hết hàng
                          </DropdownItem>
                          <DropdownItem
                            key="EXPIRED"
                            startContent={
                              <Icon
                                icon="mdi:timer-alert"
                                className="h-4 w-4 text-red-600"
                              />
                            }
                            className="text-red-600"
                          >
                            Hết hạn sử dụng
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>

                      {equipment.id && (
                        <button
                          onClick={() =>
                            handleDelete(equipment.id, equipment.reagentName)
                          }
                          disabled={
                            deletingId === equipment.id || isAnyItemUpdating
                          }
                          className={`
                          w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 
                          flex items-center justify-center
                          transition-all duration-200
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${
                            deletingId === equipment.id
                              ? "cursor-wait"
                              : "cursor-pointer"
                          }
                        `}
                          aria-label="Xóa thuốc thử"
                        >
                          {deletingId === equipment.id ? (
                            <Spinner size="sm" color="white" />
                          ) : (
                            <Icon
                              icon="mdi:delete"
                              className="w-4 h-4 text-white"
                            />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Loại thuốc thử:
                      </p>
                      <p className="font-medium">{equipment.reagentType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Mã lô:</p>
                      <p className="font-medium">{equipment.lotNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Số lượng:
                      </p>
                      <p className="font-medium">
                        {equipment.quantity} {equipment.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">HSD:</p>
                      <p className="font-medium">
                        {formatDateTimeToDate(equipment.expiryDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Mã NCC:
                      </p>
                      <p className="font-medium">{equipment.vendorId}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Nhà cung cấp:
                      </p>
                      <p className="font-medium">{equipment.vendorName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Liên hệ NCC:
                      </p>
                      <p className="font-medium">
                        {equipment.vendorContact || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Lắp đặt bởi:
                      </p>
                      <p className="font-medium">{equipment.installedBy}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Ngày lắp đặt:
                      </p>
                      <p className="font-medium">
                        {formatDateTimeToDate(equipment.installedDate)}
                      </p>
                    </div>
                    {equipment.remarks ? (
                      <div className="sm:col-span-2 lg:col-span-3">
                        <p className="text-gray-500 dark:text-gray-400">
                          Ghi chú:{" "}
                          <span className="font-bold whitespace-pre-wrap">
                            {equipment.remarks}
                          </span>
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegentList;
