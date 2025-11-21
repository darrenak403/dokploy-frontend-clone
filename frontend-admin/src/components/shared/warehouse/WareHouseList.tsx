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

import { useFetchGetAllInstrumentSwrSingleton } from "@/hook/singleton/swrs/warehouse/useFetchGetAllInstrumentSwr";
import { useFetchUpdateInstrumentSwrSingleton } from "@/hook/singleton/swrs/warehouse/useFetchUpdateWareHouseIntrustmentSwr";

import {
  getStatusDisplay,
  getStatusIcon,
} from "@/modules/wareHouse/createUpdateWareHouseIntrustmentHelper";

const WareHouseList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [showAlert, setShowAlert] = useState(false);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<{ [key: number]: number }>({});
  const MIN_UPDATE_INTERVAL = 5000;

  const { data, error, isLoading, mutate } =
    useFetchGetAllInstrumentSwrSingleton() || {
      data: undefined,
      error: undefined,
      isLoading: false,
    };

  const updateInstrumentSwr = useFetchUpdateInstrumentSwrSingleton();

  const handleStatusChange = async (
    instrumentId: number,
    newStatus: string
  ) => {
    if (isUpdating !== null) {
      setAlertMessage("Vui lòng đợi cập nhật hiện tại hoàn tất!");
      setAlertColor("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    const now = Date.now();
    const lastUpdateTime = lastUpdateTimeRef.current[instrumentId] || 0;
    const timeSinceLastUpdate = now - lastUpdateTime;

    if (timeSinceLastUpdate < MIN_UPDATE_INTERVAL) {
      const remainingTime = Math.ceil(
        (MIN_UPDATE_INTERVAL - timeSinceLastUpdate) / 1000
      );
      setAlertMessage(
        `Vui lòng đợi ${remainingTime} giây trước khi cập nhật lại thiết bị này!`
      );
      setAlertColor("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      setIsUpdating(instrumentId);

      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }

      lastUpdateTimeRef.current[instrumentId] = now;

      const result = await updateInstrumentSwr?.updateInstrument?.({
        id: instrumentId,
        payload: { status: newStatus },
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
      console.error("Update instrument error:", error);
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

  const equipments = !data?.data?.data
    ? []
    : data.data.data.map((instrument) => ({
        id: instrument.id,
        name: instrument.name,
        serialNumber: instrument.serialNumber,
        status: instrument.status,
        createdBy: instrument.createdBy,
        createdAt: instrument.createdAt,
      }));

  const filteredBySearch = equipments.filter((eq) => {
    const query = searchQuery.toLowerCase();
    return (
      eq.name.toLowerCase().includes(query) ||
      eq.serialNumber.toLowerCase().includes(query)
    );
  });

  const filteredEquipments =
    statusFilter === "all"
      ? filteredBySearch
      : filteredBySearch.filter((eq) => eq.status === statusFilter);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
    };
  }, []);

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
            <h2 className="text-xl font-semibold">Danh Sách Thiết Bị</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isLoading
                ? "Đang tải..."
                : `${filteredEquipments.length} thiết bị trong hệ thống`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 lg:w-auto sm:w-full">
            <Input
              className="sm:flex-1 lg:w-64"
              placeholder="Tìm kiếm theo tên hoặc số seri..."
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
              <SelectItem key="READY">Sẵn sàng</SelectItem>
              <SelectItem key="PROCESSING">Đang xử lý</SelectItem>
              <SelectItem key="MAINTENANCE">Bảo trì</SelectItem>
              <SelectItem key="ERROR">Lỗi</SelectItem>
              <SelectItem key="INACTIVE">Không hoạt động</SelectItem>
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
              Không thể tải danh sách thiết bị. Vui lòng thử lại sau.
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
              Không tìm thấy thiết bị
            </h3>
            <p className="text-sm text-default-500">
              {searchQuery || statusFilter !== "all"
                ? "Vui lòng điều chỉnh tìm kiếm hoặc bộ lọc của bạn."
                : "Chưa có thiết bị nào trong hệ thống."}
            </p>
          </div>
        )}

        {!isLoading && !error && filteredEquipments.length > 0 && (
          <div className="space-y-4">
            {filteredEquipments.map((equipment) => {
              const statusDisplay = getStatusDisplay(equipment.status);
              const isThisItemUpdating = isUpdating === equipment.id;
              const isAnyItemUpdating = isUpdating !== null;

              return (
                <div
                  key={equipment.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4
                           hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{equipment.name}</h3>

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
                            <Icon icon="mdi:chevron-down" className="h-4 w-4" />
                          }
                        >
                          {statusDisplay.text}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Chọn trạng thái mới"
                        onAction={(key) => {
                          if (key !== equipment.status) {
                            handleStatusChange(equipment.id, key as string);
                          }
                        }}
                        disabledKeys={[equipment.status]}
                      >
                        <DropdownItem
                          key="READY"
                          startContent={
                            <Icon
                              icon="mdi:check-circle"
                              className="h-4 w-4 text-green-600"
                            />
                          }
                          className="text-green-600"
                        >
                          Sẵn sàng
                        </DropdownItem>
                        <DropdownItem
                          key="PROCESSING"
                          startContent={
                            <Icon
                              icon="mdi:cog"
                              className="h-4 w-4 text-purple-600"
                            />
                          }
                          className="text-purple-600"
                        >
                          Đang xử lý
                        </DropdownItem>
                        <DropdownItem
                          key="MAINTENANCE"
                          startContent={
                            <Icon
                              icon="mdi:wrench"
                              className="h-4 w-4 text-yellow-600"
                            />
                          }
                          className="text-yellow-600"
                        >
                          Bảo trì
                        </DropdownItem>
                        <DropdownItem
                          key="ERROR"
                          startContent={
                            <Icon
                              icon="mdi:alert-circle"
                              className="h-4 w-4 text-red-600"
                            />
                          }
                          className="text-red-600"
                        >
                          Lỗi
                        </DropdownItem>
                        <DropdownItem
                          key="INACTIVE"
                          startContent={
                            <Icon
                              icon="mdi:power-off"
                              className="h-4 w-4 text-gray-600"
                            />
                          }
                          className="text-gray-600"
                        >
                          Không hoạt động
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Số Seri:
                      </p>
                      <p className="font-medium">{equipment.serialNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Người Tạo:
                      </p>
                      <p className="font-medium">{equipment.createdBy}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Tạo Lúc:
                      </p>
                      <p className="font-medium">
                        {formatDateTimeToDate(equipment.createdAt)}
                      </p>
                    </div>
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

export default WareHouseList;
