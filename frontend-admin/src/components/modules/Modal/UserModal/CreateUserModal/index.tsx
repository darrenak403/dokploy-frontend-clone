/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useFormik } from "formik";

import { useCreateUserDiscloresureSingleton } from "@/hook/singleton/discloresures/account/useCreateUserDisclosure";
import { useFetchGetAllRoleSwrSingleton } from "@/hook/singleton/swrs/roles/useFetchGetAllRoleSwr";
import {
  CreateUserPayload,
  useFetchCreateUserSwrSingleton,
} from "@/hook/singleton/swrs/user/useFetchCreateUserSwr";
import { useFetchGetAllUserSwrSingleton } from "@/hook/singleton/swrs/user/useFetchGetAllUserSwr";

import {
  convertToDateInputFormat,
  convertToDdMmYyyyFormat,
} from "@/modules/day";
import { encryptValue } from "@/modules/encrypt";
import { validationCreateUserSchema } from "@/modules/user/createUserHelper";
import { genderRoleLabel } from "@/modules/user/createUserHelper";

export default function CreateUserModal() {
  const [showPassword, setShowPassword] = useState(false);

  const { isOpen, onOpenChange, onClose } =
    useCreateUserDiscloresureSingleton();

  const createUserResult = useFetchCreateUserSwrSingleton();
  const createUser = createUserResult?.createUser;
  const isMutating = createUserResult?.isMutating ?? false;
  const error = createUserResult?.error;

  const { mutate: refreshUsers } = useFetchGetAllUserSwrSingleton() ?? {};

  const {
    data: rolesResp,
    isLoading: rolesLoading,
    error: rolesError,
  } = useFetchGetAllRoleSwrSingleton() ?? {};
  const roles = Array.isArray(rolesResp?.data) ? rolesResp.data : [];

  const formik = useFormik<CreateUserPayload>({
    initialValues: {
      email: "",
      password: "",
      fullName: "",
      phone: "",
      address: "",
      gender: "male",
      dateOfBirth: "",
      roleId: undefined,
    },
    validationSchema: validationCreateUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      try {
        setSubmitting(true);
        const encryptedPassword = encryptValue(values.password ?? "");
        const payload: CreateUserPayload = {
          email: values.email,
          password: encryptedPassword,
          fullName: values.fullName,
          phone: values.phone,
          address: values.address,
          gender: values.gender,
          dateOfBirth: values.dateOfBirth,
          roleId: values.roleId ?? undefined,
        };

        const res = await createUser?.(payload);
        const ok = !!(
          res &&
          (res.data || res.status === 200 || res.status === 201)
        );
        if (!ok) {
          const msg = (res && (res as any).message) || "Create failed";
          throw new Error(msg);
        }
        try {
          await refreshUsers?.();
        } catch {
          // ignore refresh errors
        }

        resetForm();
        onClose();
      } catch (err: unknown) {
        console.error("Error creating user:", err);
        if (err instanceof Error) {
          setFieldError("email", err.message || "Không thể tạo người dùng");
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
              <span className="text-foreground">Tạo mới người dùng</span>
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
                      Lỗi tạo người dùng:{" "}
                      {error.message || "Có gì đó không đúng"}
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      name="email"
                      label="Email"
                      placeholder="Nhập email"
                      type="email"
                      value={formik.values.email}
                      onValueChange={(value) =>
                        formik.setFieldValue("email", value)
                      }
                      isInvalid={
                        !!(formik.touched.email && formik.errors.email)
                      }
                      onBlur={() => formik.setFieldTouched("email", true)}
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
                          icon="mdi:email"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                        {formik.errors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <Input
                      name="password"
                      label="Mật khẩu"
                      placeholder="Mật khẩu"
                      type={showPassword ? "text" : "password"}
                      value={formik.values.password}
                      onValueChange={(value) =>
                        formik.setFieldValue("password", value)
                      }
                      isInvalid={
                        !!(formik.touched.password && formik.errors.password)
                      }
                      onBlur={() => formik.setFieldTouched("password", true)}
                      errorMessage={
                        formik.touched.password
                          ? (formik.errors as any).password
                          : ""
                      }
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
                          icon="mdi:shield-key"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                      endContent={
                        <Icon
                          className="text-gray-500 dark:text-gray-400 cursor-pointer absolute right-4 top-6"
                          icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      }
                    />
                  </div>

                  <div>
                    <Input
                      name="fullName"
                      label="Họ và tên"
                      placeholder="Họ và tên"
                      onValueChange={(value) =>
                        formik.setFieldValue("fullName", value)
                      }
                      isInvalid={
                        !!(formik.touched.fullName && formik.errors.fullName)
                      }
                      onBlur={() => formik.setFieldTouched("fullName", true)}
                      errorMessage={
                        formik.touched.fullName
                          ? (formik.errors as any).fullName
                          : ""
                      }
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
                          icon="mdi:account"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    />
                  </div>

                  <div>
                    <Input
                      name="phone"
                      label="Số điện thoại"
                      placeholder="Số điện thoại"
                      onValueChange={(value) =>
                        formik.setFieldValue("phone", value)
                      }
                      isInvalid={
                        !!(formik.touched.phone && formik.errors.phone)
                      }
                      onBlur={() => formik.setFieldTouched("phone", true)}
                      errorMessage={
                        formik.touched.phone ? (formik.errors as any).phone : ""
                      }
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
                          icon="mdi:phone"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    />
                  </div>

                  <div>
                    <Select
                      name="gender"
                      label="Giới tính"
                      selectedKeys={[formik.values.gender || "male"]}
                      onSelectionChange={(keys) => {
                        const v = Array.from(keys)[0] as string;
                        formik.setFieldValue("gender", v);
                      }}
                      onClose={() => formik.setFieldTouched("gender", true)}
                      classNames={{
                        base: "w-full",
                        trigger:
                          "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus:border-coral-500 bg-background",
                        label: "text-foreground",
                        value: "text-foreground",
                        popoverContent:
                          "bg-background border border-gray-200 dark:border-gray-700",
                      }}
                      startContent={
                        <Icon
                          icon="mdi:shield-account"
                          className="h-4 w-4 text-gray-500"
                        />
                      }
                    >
                      <SelectItem key="male">Nam</SelectItem>
                      <SelectItem key="female">Nữ</SelectItem>
                      <SelectItem key="other">Khác</SelectItem>
                    </Select>
                  </div>

                  <div>
                    <Input
                      name="dateOfBirth"
                      label="Ngày sinh"
                      placeholder="dd/mm/yyyy"
                      type="date"
                      value={convertToDateInputFormat(
                        formik.values.dateOfBirth || ""
                      )}
                      onChange={(e) => {
                        const ddmmyyyy = convertToDdMmYyyyFormat(
                          e.target.value
                        );
                        formik.setFieldValue("dateOfBirth", ddmmyyyy);
                      }}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.touched.dateOfBirth &&
                        !!formik.errors.dateOfBirth
                      }
                      errorMessage={
                        formik.touched.dateOfBirth
                          ? formik.errors.dateOfBirth
                          : ""
                      }
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
                </div>
                <div>
                  <Select
                    name="roleId"
                    label="Vai trò"
                    selectedKeys={
                      formik.values.roleId
                        ? [genderRoleLabel(String(formik.values.roleId))]
                        : []
                    }
                    onSelectionChange={(keys) => {
                      const v = Array.from(keys)[0] as string | undefined;
                      formik.setFieldValue("roleId", v ? Number(v) : undefined);
                    }}
                    onClose={() => formik.setFieldTouched("roleId", true)}
                    classNames={{
                      base: "w-full",
                      trigger:
                        "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus:border-coral-500 bg-background",
                      label: "text-foreground",
                      value: "text-foreground",
                      popoverContent:
                        "bg-background border border-gray-200 dark:border-gray-700",
                    }}
                  >
                    <SelectItem key="">Chọn vai trò</SelectItem>
                    {rolesLoading && (
                      <SelectItem key="loading">Đang tải...</SelectItem>
                    )}
                    {rolesError && (
                      <SelectItem key="err">Lỗi tải vai trò</SelectItem>
                    )}

                    {roles.map((r) => {
                      return (
                        <SelectItem key={String(r.id)}>
                          {genderRoleLabel(r.roleCode)}
                        </SelectItem>
                      );
                    })}
                  </Select>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Textarea
                    name="address"
                    label="Địa chỉ"
                    placeholder="Địa chỉ"
                    onValueChange={(value) =>
                      formik.setFieldValue("address", value)
                    }
                    isInvalid={
                      !!(formik.touched.address && formik.errors.address)
                    }
                    onBlur={() => formik.setFieldTouched("address", true)}
                    errorMessage={
                      formik.touched.password
                        ? (formik.errors as any).password
                        : ""
                    }
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
                        icon="mdi:map-marker"
                        className="text-gray-500 mt-[3px]"
                      />
                    }
                  />
                </div>
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
                  ? "Đang tạo..."
                  : "Tạo người dùng"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
