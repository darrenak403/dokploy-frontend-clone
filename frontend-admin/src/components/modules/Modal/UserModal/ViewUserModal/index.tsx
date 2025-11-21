"use client";
import React from "react";

import {
  Avatar,
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

import { useGetUserByIdDiscloresureSingleton } from "@/hook/singleton/discloresures/account/useGetUserByIdDiscloresure";
import { useFetchUserByIdSwrSingleton } from "@/hook/singleton/swrs/user/useFetchUserByIdSwr";

import { calcAgeFromDate, parseDateOnly } from "@/modules/day";
import { getGenderLabel, getRoleLabel } from "@/modules/user/getAllUserHelper";

export default function ViewUserModal() {
  const { isOpen, onOpenChange, onClose, userId } =
    useGetUserByIdDiscloresureSingleton();

  const { data, error, isLoading } = useFetchUserByIdSwrSingleton(
    isOpen
      ? (() => {
          if (userId == null) return null;
          const n = Number(userId);
          return Number.isNaN(n) ? String(userId) : n;
        })()
      : null
  );

  const user = data;

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
        <ModalHeader className="flex items-center gap-2 bg-background text-foreground">
          <Icon icon="mingcute:user-info-fill" className="h-5 w-5" />
          <span className="text-foreground">Thông tin người dùng</span>
        </ModalHeader>

        <ModalBody className="py-6 bg-background">
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
              <span className="ml-3 text-foreground">
                Đang tải thông tin người dùng...
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
                  Lỗi tải người dùng: {error.message || "Có lỗi xảy ra"}
                </span>
              </div>
            </div>
          )}

          {/* User Data Display */}
          {!userId && !isLoading && (
            <div className="p-6 text-center text-default-500">
              Không có ID người dùng. Vui lòng mở modal từ danh sách người dùng.
            </div>
          )}

          {userId && !user && !isLoading && !error && (
            <div className="p-6 text-center text-default-500">
              Không tìm thấy người dùng với ID: {String(userId)}
            </div>
          )}

          {user && !isLoading && (
            <div className="space-y-6">
              {/* Avatar - centered at top */}
              <div className="flex justify-center mb-6">
                <Avatar
                  src={user.data?.avatarUrl || undefined}
                  alt={user.data?.fullName || "User"}
                  className="w-32 h-32 text-large transition-transform object-cover object-center overflow-hidden round hover:scale-105"
                  isBordered
                  color="danger"
                  showFallback
                  name={user.data?.fullName || "U"}
                />
              </div>

              {/* User Information Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CCCD */}
                <Input
                  label="CCCD"
                  value={user.data?.identityNumber || ""}
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
                {/* Full Name */}
                <Input
                  label="Họ và tên"
                  value={user.data?.fullName || ""}
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

                {/* Date of Birth */}
                <Input
                  label="Ngày sinh"
                  value={(() => {
                    const dob = user.data.dateOfBirth
                      ? (user.data.dateOfBirth ?? "")
                      : "";
                    const ageFromDob = calcAgeFromDate(
                      parseDateOnly(user.data.dateOfBirth ?? undefined)
                    );
                    if (dob && ageFromDob !== undefined)
                      return `${dob} (${ageFromDob} tuổi)`;
                    if (dob) return dob;
                    if (ageFromDob !== undefined) return `${ageFromDob} tuổi`;
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

                {/* Gender */}
                <Input
                  label="Giới tính"
                  value={getGenderLabel(user.data?.gender) || ""}
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
                  label="Số điện thoại"
                  value={user.data?.phone || ""}
                  readOnly
                  classNames={{
                    base: "w-full",
                    input: "bg-gray-50 dark:bg-gray-800 text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
                    label: "text-foreground",
                  }}
                  startContent={
                    <Icon icon="mdi:phone" className="h-4 w-4 text-gray-500" />
                  }
                />

                {/* Role */}
                <Input
                  label="Vai trò"
                  value={getRoleLabel(user.data?.role) || ""}
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
                      icon="mdi:shield-account"
                      className="h-4 w-4 text-gray-500"
                    />
                  }
                />
              </div>
              {/* Email */}
              <Input
                label="Email"
                value={user.data?.email || ""}
                readOnly
                classNames={{
                  base: "w-full",
                  input: "bg-gray-50 dark:bg-gray-800 text-foreground",
                  inputWrapper:
                    "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
                  label: "text-foreground",
                }}
                startContent={
                  <Icon icon="mdi:email" className="h-4 w-4 text-gray-500" />
                }
              />

              {/* Address - full width */}
              <Textarea
                label="Địa chỉ"
                value={user.data?.address || ""}
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
      </ModalContent>
    </Modal>
  );
}
