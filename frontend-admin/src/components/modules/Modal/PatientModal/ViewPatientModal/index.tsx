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
  Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import { useViewPatientDiscloresureSingleton } from "@/hook/singleton/discloresures";
import { useFetchPatientByIdSwrSingleton } from "@/hook/singleton/swrs/patient/useFetchPatientByIdSwr";

import { calcAgeFromDate, parseDateOnly } from "@/modules/day";
import {
  genderOptions,
  instrumentOptions,
  testTypeOptions,
} from "@/modules/patient/createUpdateHelpers";

export default function ViewPatientModal() {
  const { isOpen, onOpenChange, onClose, patientId } =
    useViewPatientDiscloresureSingleton();
  const selectedPatientId = patientId as number | null;
  const { error, isLoading, patient } = useFetchPatientByIdSwrSingleton(
    isOpen ? selectedPatientId : null
  );

  const handleClose = () => {
    onClose();
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
              <Icon icon="mingcute:user-info-fill" className="h-5 w-5" />
              <span className="text-foreground">Thông tin bệnh nhân</span>
            </ModalHeader>

            <ModalBody className="py-6 bg-background">
              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-center items-center py-8">
                  <Spinner size="lg" />
                  <span className="ml-3 text-foreground">
                    Đang tải thông tin bệnh nhân...
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
                      Lỗi khi tải thông tin bệnh nhân:{" "}
                      {error.message || "Có gì đó không đúng"}
                    </span>
                  </div>
                </div>
              )}

              {/* Patient Data Display */}
              {patient && !isLoading && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* CCCD */}
                    <Input
                      label="CCCD"
                      value={patient.identityNumber || ""}
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
                          icon="mdi:card-account-details-star"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    />

                    {/* Mã Bệnh Nhân */}
                    <Input
                      label="Mã Bệnh Nhân"
                      value={patient.patientCode || ""}
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
                    {/* Họ và Tên */}
                    <Input
                      label="Họ và Tên"
                      value={patient.fullName || ""}
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

                    {/* Ngày Sinh */}
                    <Input
                      label="Ngày Sinh"
                      value={(() => {
                        const dob = patient.yob ? (patient.yob ?? "") : "";
                        const ageFromDob = calcAgeFromDate(
                          parseDateOnly(patient.yob ?? undefined)
                        );
                        if (dob && ageFromDob !== undefined)
                          return `${dob} (${ageFromDob} tuổi)`;
                        if (dob) return dob;
                        if (ageFromDob !== undefined)
                          return `${ageFromDob} tuổi`;
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

                    {/* Giới Tính */}
                    <Input
                      label="Giới Tính"
                      value={(() => {
                        const genderOption = genderOptions.find(
                          (option) => option.key === patient.gender
                        );
                        return genderOption
                          ? genderOption.label
                          : patient.gender || "";
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

                    {/* Phone */}
                    <Input
                      label="Số Điện Thoại"
                      value={patient.phone || ""}
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

                    {/* Email */}
                    <Input
                      label="Email"
                      value={patient.email || ""}
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

                    {/* Người Tạo */}
                    <Input
                      label="Người Tạo"
                      value={patient.createdBy ? patient.createdBy : "-"}
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
                          icon="mdi:calendar-clock"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    />

                    {/* Last Test Type */}
                    <Input
                      label="Người Chỉnh Sửa"
                      value={(() => {
                        const testTypeOption = testTypeOptions.find(
                          (option) => option.key === patient.modifiedBy
                        );
                        return testTypeOption
                          ? testTypeOption.label
                          : patient.modifiedBy || "-";
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
                          icon="mdi:test-tube"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    />

                    {/* Created At */}
                    <Input
                      label="Ngày Tạo"
                      value={(() => {
                        const instrumentOption = instrumentOptions.find(
                          (option) => option.key === patient.createdAt
                        );
                        return instrumentOption
                          ? instrumentOption.label
                          : String(patient.createdAt).split(" ")[0] || "-";
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
                          icon="mdi:medical-bag"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    />
                  </div>

                  {/* User */}
                  {/* <Input
                    label="User"
                    value={(() => {
                      const user = users.find((u) => u.id === patient.userId);
                      return user
                        ? user.fullName || user.email
                        : `User ID: ${patient.userId || "N/A"}`;
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
                      <Icon icon="mdi:user" className=" text-gray-500" />
                    }
                  /> */}

                  {/* Address (Full Width) */}
                  <Textarea
                    label="Địa Chỉ"
                    value={patient.address || ""}
                    readOnly
                    minRows={2}
                    maxRows={4}
                    classNames={{
                      base: "w-full",
                      input: "bg-gray-50 dark:bg-gray-800 text-foreground",
                      inputWrapper:
                        "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
                      label: "text-foreground",
                    }}
                    startContent={
                      <Icon
                        icon="mdi:map-marker"
                        className="text-gray-500 mt-[3px]"
                      />
                    }
                  />
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
