"use client";
import React from "react";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import type { PriorityOption } from "@/types/test-order";

import { useViewTestOrderDiscloresureSingleton } from "@/hook/singleton/discloresures";
import { useFetchAllPatientSwrSingleton } from "@/hook/singleton/swrs/patient/useFetchAllPatientSwr";
import { useFetchTestOrderByIdSwrSingleton } from "@/hook/singleton/swrs/test-order/useFetchTestOrderByIdSwr";

import { calcAgeFromDate } from "@/modules/day";
import { genderOptions } from "@/modules/patient/createUpdateHelpers";
import {
  getPriorityColor,
  getPriorityText,
  getStatusColor,
  getStatusText,
  parseDateOnly,
  priorityTokenToClass,
} from "@/modules/test-order/getAllTestOrderHelper";

export default function ViewTestOrderModal() {
  const { isOpen, onOpenChange, onClose, testOrderId } =
    useViewTestOrderDiscloresureSingleton();
  const selectedTestOrderId = testOrderId;

  const { error, isLoading, testOrder } = useFetchTestOrderByIdSwrSingleton(
    isOpen ? selectedTestOrderId : null
  );

  // fetch all patients to map patientCode
  const { data: patientsData } = useFetchAllPatientSwrSingleton();

  const patientsList = Array.isArray(patientsData?.data)
    ? patientsData.data
    : (patientsData?.data?.data ?? []);
  const patientCodeMap = new Map<string, string>();
  for (const p of patientsList) {
    if (p && p.id != null)
      patientCodeMap.set(String(p.id), p.patientCode ?? "");
  }

  const handleClose = () => {
    onClose();
  };

  const statusColorClass = (status?: string) => {
    const c = getStatusColor(status);
    switch (c) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-500";
      case "danger":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh] bg-background",
        header: "border-b border-gray-200 dark:border-gray-700 bg-background",
        body: "bg-background",
        footer: "border-t border-gray-200 dark:border-gray-700 bg-background",
        backdrop: "bg-black/50 dark:bg-black/70",
        wrapper: "items-center justify-center",
      }}
    >
      <ModalContent className="bg-background text-foreground">
        {() => (
          <>
            <ModalHeader className="flex items-center gap-2 bg-background text-foreground">
              <Icon icon="mdi:clipboard-text" className="h-5 w-5" />
              <span className="text-foreground">Chi tiết đơn xét nghiệm</span>
            </ModalHeader>

            <ModalBody className="py-6 bg-background">
              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-center items-center py-8">
                  <Spinner size="lg" />
                  <span className="ml-3 text-foreground">
                    Đang tải chi tiết đơn xét nghiệm...
                  </span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:alert-circle"
                      className="h-4 w-4 text-red-600 dark:text-red-400"
                    />
                    <span className="text-red-600 dark:text-red-400 text-sm">
                      Lỗi khi tải đơn xét nghiệm:{" "}
                      {error.message || "Đã xảy ra lỗi"}
                    </span>
                  </div>
                </div>
              )}

              {/* Test Order Data Display */}
              {testOrder && !isLoading && (
                <div className="space-y-4">
                  {/* Họ và tên */}
                  <Input
                    label="Họ và tên"
                    value={testOrder.patientName || ""}
                    readOnly
                    classNames={{
                      base: "w-full",
                      input: "bg-gray-50 dark:bg-gray-800 text-foreground",
                      inputWrapper:
                        "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
                      label: "text-foreground",
                    }}
                    startContent={
                      <Icon
                        icon="mdi:account"
                        className="h-4 w-4 text-gray-500"
                      />
                    }
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mã Bệnh Nhân */}
                    <Input
                      label="Mã Bệnh Nhân"
                      value={
                        patientCodeMap.get(String(testOrder.patientId ?? "")) ||
                        "-"
                      }
                      readOnly
                      classNames={{
                        base: "w-full",
                        input: "bg-gray-50 dark:bg-gray-800 text-foreground",
                        inputWrapper:
                          "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
                        label: "text-foreground",
                      }}
                      startContent={
                        <Icon
                          icon="mdi:account"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    />

                    <Input
                      label="Ngày sinh"
                      value={(() => {
                        const dob = testOrder.yob ? (testOrder.yob ?? "") : "";
                        const ageFromApi = testOrder.age ?? undefined;
                        const ageFromDob = !ageFromApi
                          ? calcAgeFromDate(
                              parseDateOnly(testOrder.yob ?? undefined)
                            )
                          : undefined;
                        const age = ageFromApi ?? ageFromDob;
                        if (dob && age !== undefined)
                          return `${dob} (${age} tuổi)`;
                        if (dob) return dob;
                        if (age !== undefined) return `${age} tuổi`;
                        return "";
                      })()}
                      readOnly
                      classNames={{
                        base: "w-full",
                        input: "bg-gray-50 dark:bg-gray-800 text-foreground",
                        inputWrapper:
                          "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
                        label: "text-foreground",
                      }}
                      startContent={
                        <Icon
                          icon="mdi:calendar"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    />

                    {/* Giới tính */}
                    <Input
                      label="Giới tính"
                      value={(() => {
                        const genderOption = genderOptions.find(
                          (option) => option.key === testOrder.gender
                        );
                        return genderOption
                          ? genderOption.label
                          : testOrder.gender || "";
                      })()}
                      readOnly
                      classNames={{
                        base: "w-full",
                        input: "bg-gray-50 dark:bg-gray-800 text-foreground",
                        inputWrapper:
                          "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
                        label: "text-foreground",
                      }}
                      startContent={
                        <Icon
                          icon="mdi:gender-male-female"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    />

                    {/* Email */}
                    <Input
                      label="Email"
                      value={testOrder.email || ""}
                      readOnly
                      classNames={{
                        base: "w-full",
                        input: "bg-gray-50 dark:bg-gray-800 text-foreground",
                        inputWrapper:
                          "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
                        label: "text-foreground",
                      }}
                      startContent={
                        <Icon
                          icon="mdi:email"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    />
                    {/* Phone */}
                    <Input
                      label="Số điện thoại"
                      value={testOrder.phone || ""}
                      readOnly
                      classNames={{
                        base: "w-full",
                        input: "bg-gray-50 dark:bg-gray-800 text-foreground",
                        inputWrapper:
                          "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
                        label: "text-foreground",
                      }}
                      startContent={
                        <Icon
                          icon="mdi:phone"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    />
                    <Input
                      label="Địa chỉ"
                      value={testOrder.address || ""}
                      readOnly
                      classNames={{
                        base: "w-full",
                        input: "bg-gray-50 dark:bg-gray-800 text-foreground",
                        inputWrapper:
                          "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
                        label: "text-foreground",
                      }}
                      startContent={
                        <Icon
                          icon="mdi:account"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    />
                    <Input
                      label="Người tạo"
                      value={testOrder.createdBy || ""}
                      readOnly
                      classNames={{
                        base: "w-full",
                        input: "bg-gray-50 dark:bg-gray-800 text-foreground",
                        inputWrapper:
                          "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
                        label: "text-foreground",
                      }}
                      startContent={
                        <Icon
                          icon="mdi:account"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    />
                    <Input
                      label="Người thực hiện"
                      value={testOrder.runBy || ""}
                      readOnly
                      classNames={{
                        base: "w-full",
                        input: "bg-gray-50 dark:bg-gray-800 text-foreground",
                        inputWrapper:
                          "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
                        label: "text-foreground",
                      }}
                      startContent={
                        <Icon
                          icon="mdi:play-circle"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    />
                    <Input
                      label="Mức độ ưu tiên"
                      value={getPriorityText(
                        (testOrder.priority as PriorityOption) ?? undefined
                      )}
                      readOnly
                      classNames={{
                        base: "w-full",
                        input: "bg-gray-50 dark:bg-gray-800 text-foreground",
                        inputWrapper:
                          "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
                        label: "text-foreground",
                      }}
                      startContent={
                        <Icon
                          icon="mdi:flag"
                          className={`h-4 w-4 ${priorityTokenToClass(
                            getPriorityColor(
                              (testOrder.priority as PriorityOption) ??
                                undefined
                            )
                          )}`}
                        />
                      }
                    />
                    <Input
                      label="Trạng thái"
                      value={(() => {
                        const label = getStatusText(testOrder.status);
                        return label;
                      })()}
                      readOnly
                      classNames={{
                        base: "w-full",
                        input: "bg-gray-50 dark:bg-gray-800",
                        inputWrapper:
                          "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
                        label: "text-foreground",
                      }}
                      startContent={
                        <Icon
                          icon="mdi:information"
                          className={`h-4 w-4 ${statusColorClass(
                            testOrder.status
                          )}`}
                        />
                      }
                    />
                  </div>
                </div>
              )}
            </ModalBody>

            <ModalFooter className="bg-background">
              <Button
                variant="bordered"
                onPress={handleClose}
                className="text-red-600 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                startContent={<Icon icon="mdi:close" className="h-4 w-4" />}
              >
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
