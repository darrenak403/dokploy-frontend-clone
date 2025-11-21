/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useFormik } from "formik";
import { useSWRConfig } from "swr";

import { useCreatePatientDiscloresureSingleton } from "@/hook/singleton/discloresures";
import {
  CreatePatientPayload,
  useFetchCreatePatientSwrSingleton,
} from "@/hook/singleton/swrs";
import { useFetchGetAllUserSwrSingleton } from "@/hook/singleton/swrs/user/useFetchGetAllUserSwr";

import { calcAgeFromDate } from "@/modules/day";
import { validationCreatePatientSchema } from "@/modules/patient/createUpdateHelpers";
import { parseDateOnly } from "@/modules/test-order/getAllTestOrderHelper";

export default function CreatePatientModal() {
  const { isOpen, onOpenChange, onClose } =
    useCreatePatientDiscloresureSingleton();

  const { createPatient, isMutating, error } =
    useFetchCreatePatientSwrSingleton();

  const { mutate } = useSWRConfig();

  const { data: userResponse, isLoading: isLoadingUsers } =
    useFetchGetAllUserSwrSingleton();

  const users = userResponse?.data || [];
  const [userSearch, setUserSearch] = React.useState("");

  // Add helper to fill form when selecting a user
  const handleUserSelect = (selectedId?: number) => {
    formik.setFieldValue("userId", selectedId ?? undefined);

    if (!selectedId) return;

    const user = users.find((u) => Number(u.id) === Number(selectedId));
    if (!user) return;

    // Populate form fields from user record (fallback to empty string)
    formik.setFieldValue("fullName", user.fullName ?? "");
    formik.setFieldValue("email", user.email ?? "");
    formik.setFieldValue("phone", user.phone ?? "");
    formik.setFieldValue("gender", user.gender ?? "");
    formik.setFieldValue("address", user.address ?? "");
    formik.setFieldValue("yob", user.dateOfBirth ?? "");
  };

  const formik = useFormik<CreatePatientPayload>({
    initialValues: {
      userId: undefined,
    },
    validationSchema: validationCreatePatientSchema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      try {
        const payload: CreatePatientPayload = {
          userId: values.userId,
        };

        await createPatient(payload);

        await mutate(
          (key) => typeof key === "string" && key.startsWith("/patient")
        );

        resetForm();
        onClose();
      } catch (error) {
        console.error("Error creating patient:", error);

        if (error instanceof Error) {
          setFieldError("fullName", error.message);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const selectedUser = users.find(
    (p: any) => String(p.id) === String(formik.values.userId)
  );

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
              <Icon
                icon="mingcute:user-add-fill"
                className="h-5 w-5 text-coral-500"
              />
              <span className="text-foreground">Tạo mới bệnh nhân</span>
            </ModalHeader>

            <ModalBody className="py-6 bg-background">
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:alert-circle"
                      className="h-4 w-4 text-red-600 dark:text-red-400"
                    />
                    <span className="text-red-600 dark:text-red-400 text-sm">
                      Lỗi tạo bệnh nhân:{" "}
                      {error.message || "Có gì đó không đúng"}
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* User select */}
                  <div className="col-span-2 md:col-span-2">
                    <Autocomplete
                      name="userId"
                      label="Người dùng"
                      placeholder={
                        isLoadingUsers
                          ? "Đang tải người dùng..."
                          : "Chọn hoặc gõ để tìm..."
                      }
                      inputValue={userSearch}
                      onInputChange={(val: string) => setUserSearch(val)}
                      value={selectedUser ? String(selectedUser.id) : ""}
                      onSelectionChange={(key) =>
                        handleUserSelect(key ? Number(key) : undefined)
                      }
                      onClose={() => {
                        formik.setFieldTouched("userId", true);
                        setUserSearch("");
                      }}
                      isInvalid={
                        formik.touched.userId && !!(formik.errors as any).userId
                      }
                      errorMessage={
                        formik.touched.userId
                          ? (formik.errors as any).userId
                          : ""
                      }
                      classNames={{
                        base: "w-full",
                        popoverContent:
                          "bg-background border border-gray-200 dark:border-gray-700",
                      }}
                      startContent={
                        <Icon
                          icon="mdi:account"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    >
                      {users
                        .filter((u) => u.role === "ROLE_PATIENT")
                        .filter((u: any) => {
                          if (!userSearch) return true;
                          const q = userSearch.toString().toLowerCase();
                          const name = (u.fullName ?? "")
                            .toString()
                            .toLowerCase();
                          const email = (u.email ?? "")
                            .toString()
                            .toLowerCase();
                          return name.includes(q) || email.includes(q);
                        })
                        .map((u) => (
                          <AutocompleteItem
                            key={String(u.id)}
                            id={String(u.id)}
                          >
                            {`${u.fullName ?? ""}${u.email ? " - " : ""}${
                              u.email ?? "-"
                            }`}
                          </AutocompleteItem>
                        ))}
                    </Autocomplete>
                  </div>
                </div>

                {selectedUser && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="col-span-1">
                        {/* Full Name */}
                        <Input
                          name="fullName"
                          label="Họ và tên"
                          placeholder="Nhập họ và tên bệnh nhân"
                          value={formik.values.fullName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={
                            formik.touched.fullName && !!formik.errors.fullName
                          }
                          errorMessage={
                            formik.touched.fullName
                              ? formik.errors.fullName
                              : ""
                          }
                          readOnly
                          classNames={{
                            base: "w-full",
                            input:
                              "bg-background text-foreground placeholder:text-gray-500",
                            inputWrapper:
                              "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                            label: "text-foreground",
                          }}
                          startContent={
                            <Icon
                              icon="mdi:account"
                              className="h-4 w-4 text-gray-500"
                            />
                          }
                        />
                      </div>

                      <div className="col-span-1">
                        {/* Date of Birth - với logic chuyển đổi dd/mm/yyyy */}
                        <Input
                          label="Ngày sinh"
                          value={(() => {
                            const dob = formik.values.yob
                              ? (formik.values.yob ?? "")
                              : "";
                            const ageFromDob = calcAgeFromDate(
                              parseDateOnly(formik.values.yob ?? undefined)
                            );

                            const age = ageFromDob;
                            if (dob && age !== undefined)
                              return `${dob} (${age} tuổi)`;
                            if (dob) return dob;
                            if (age !== undefined) return `${age} tuổi`;
                            return "";
                          })()}
                          readOnly
                          classNames={{
                            base: "w-full",
                            input:
                              "bg-background text-foreground placeholder:text-gray-500",
                            inputWrapper:
                              "border border-gray-200 dark:border-gray-700 bg-background",
                            label: "text-foreground",
                          }}
                          startContent={
                            <Icon
                              icon="mdi:calendar"
                              className="h-4 w-4 text-gray-500"
                            />
                          }
                        />
                      </div>

                      <div className="col-span-1">
                        {/* Gender */}
                        <Input
                          name="gender"
                          label="Giới tính"
                          placeholder="Nhập giới tính"
                          value={formik.values.gender}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={
                            formik.touched.gender && !!formik.errors.gender
                          }
                          errorMessage={
                            formik.touched.gender ? formik.errors.gender : ""
                          }
                          readOnly
                          classNames={{
                            base: "w-full",
                            input:
                              "bg-background text-foreground placeholder:text-gray-500",
                            inputWrapper:
                              "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                            label: "text-foreground",
                          }}
                          startContent={
                            <Icon
                              icon="mdi:gender-male-female"
                              className="h-4 w-4 text-gray-500"
                            />
                          }
                        />
                      </div>

                      <div className="col-span-1">
                        {/* Phone */}
                        <Input
                          name="phone"
                          label="Số điện thoại"
                          placeholder="Nhập số điện thoại"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={
                            formik.touched.phone && !!formik.errors.phone
                          }
                          errorMessage={
                            formik.touched.phone ? formik.errors.phone : ""
                          }
                          readOnly
                          classNames={{
                            base: "w-full",
                            input:
                              "bg-background text-foreground placeholder:text-gray-500",
                            inputWrapper:
                              "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                            label: "text-foreground",
                          }}
                          startContent={
                            <Icon
                              icon="mdi:phone"
                              className="h-4 w-4 text-gray-500"
                            />
                          }
                        />
                      </div>
                    </div>
                    {/* Email */}
                    <Input
                      name="email"
                      label="Email"
                      placeholder="Nhập địa chỉ email"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.email && !!formik.errors.email}
                      errorMessage={
                        formik.touched.email ? formik.errors.email : ""
                      }
                      readOnly
                      classNames={{
                        base: "w-full mt-3",
                        input:
                          "bg-background text-foreground placeholder:text-gray-500",
                        inputWrapper:
                          "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                        label: "text-foreground",
                      }}
                      startContent={
                        <Icon
                          icon="mdi:email"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    />
                    {/* Address (Full Width) */}
                    <Textarea
                      name="address"
                      label="Địa chỉ"
                      placeholder="Nhập địa chỉ bệnh nhân"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.touched.address && !!formik.errors.address
                      }
                      errorMessage={
                        formik.touched.address ? formik.errors.address : ""
                      }
                      minRows={2}
                      maxRows={4}
                      readOnly
                      classNames={{
                        base: "w-full mt-3",
                        input:
                          "bg-background text-foreground placeholder:text-gray-500",
                        inputWrapper:
                          "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
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
              </form>
            </ModalBody>

            <ModalFooter className="bg-background">
              <Button
                variant="bordered"
                onPress={handleClose}
                disabled={isMutating || formik.isSubmitting}
                className="text-red-600 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                Hủy
              </Button>
              <Button
                variant="bordered"
                onPress={() => formik.handleSubmit()}
                isLoading={isMutating || formik.isSubmitting}
                disabled={isMutating || formik.isSubmitting}
                className="bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                startContent={
                  !isMutating &&
                  !formik.isSubmitting && (
                    <Icon icon="mdi:content-save" className="h-4 w-4" />
                  )
                }
              >
                {isMutating || formik.isSubmitting
                  ? "Đang tạo bệnh nhân..."
                  : "Tạo bệnh nhân"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
