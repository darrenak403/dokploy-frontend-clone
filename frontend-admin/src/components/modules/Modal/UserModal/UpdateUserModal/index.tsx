"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useFormik } from "formik";
import { useSWRConfig } from "swr";

import { UpdateProfilePayload } from "@/types/profile";

import { useUpdateUserDiscloresureSingleton } from "@/hook/singleton/discloresures/account/useUpdateUserDiscloresure";
import { useFetchGetAllRoleSwrSingleton } from "@/hook/singleton/swrs/roles/useFetchGetAllRoleSwr";
import { useFetchUpdateUserSwrSingleton } from "@/hook/singleton/swrs/user/useFetchUpdateUserSwr";

import {
  convertToDateInputFormat,
  convertToDdMmYyyyFormat,
} from "@/modules/day";
import { validationUpdateUserSchema } from "@/modules/profile/updateProfileHelper";
import { genderRoleLabel } from "@/modules/user/createUserHelper";

export default function UpdateUserModal() {
  const disclosure = useUpdateUserDiscloresureSingleton();
  const { mutate } = useSWRConfig();
  const user = disclosure?.user ?? null;
  const updater = useFetchUpdateUserSwrSingleton();

  const {
    data: rolesResp,
    isLoading: rolesLoading,
    error: rolesError,
  } = useFetchGetAllRoleSwrSingleton() ?? {};
  const roles = Array.isArray(rolesResp?.data) ? rolesResp.data : [];

  const resolveInitialRoleId = (): number | undefined => {
    if (!user) return;

    const roleId = Number(user?.roleId);
    if (!isNaN(roleId)) return roleId;

    const rawRole = (user as any)?.role;
    if (!rawRole) return;

    const normalize = (s: string) => s.toLowerCase().replace(/[_\s-]/g, "");
    const target = normalize(String(rawRole));

    const found = roles.find((r) => {
      const rc = normalize(String(r.roleCode ?? ""));
      const rn = normalize(String(r.roleName ?? ""));
      return [rc, rn].some((v) => v === target || v.includes(target));
    });

    return found ? Number(found.id) : undefined;
  };

  const initialRoleId = resolveInitialRoleId();

  const formik = useFormik<UpdateProfilePayload>({
    initialValues: {
      email: user?.email ?? "",
      fullName: user?.fullName ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
      gender: (user?.gender ?? "") as string,
      dateOfBirth: user?.dateOfBirth ?? "",
      roleId: initialRoleId ?? undefined,
    },
    enableReinitialize: true,
    validationSchema: validationUpdateUserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        if (!user || !user.id) throw new Error("Missing user id");
        const id = Number(user.id);
        const payload: UpdateProfilePayload = {
          email: values.email,
          fullName: values.fullName,
          phone: values.phone,
          address: values.address,
          gender: values.gender as unknown as
            | "male"
            | "female"
            | "other"
            | string,
          dateOfBirth: values.dateOfBirth,
          roleId: values.roleId ?? undefined,
        };

        const res = await updater?.updateUserProfile({ id, payload });

        if (res && (res.statusCode === 200 || res.statusCode === 201)) {
          try {
            await mutate(`/iam/users`);
            await mutate(`/iam/users/${id}`);
          } catch {}
          disclosure?.onClose();
        } else {
          disclosure?.onClose();
        }
      } catch (err) {
        console.error("Update user failed", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    disclosure?.onClose();
  };

  return (
    <Modal
      isOpen={disclosure?.isOpen}
      onOpenChange={disclosure?.onOpenChange}
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
        <>
          <ModalHeader className="flex items-center gap-2 bg-background text-foreground">
            <Icon icon="mdi:account-edit" className="h-5 w-5 text-coral-500" />
            <span>Chỉnh sửa người dùng</span>
          </ModalHeader>

          <ModalBody className="py-6 bg-background">
            {!user && !disclosure?.isOpen && (
              <div className="p-4 text-center text-default-500">
                Không có người dùng để chỉnh sửa
              </div>
            )}

            {disclosure?.isOpen && !user && (
              <div className="p-6 text-center text-default-500">
                Đang tải thông tin...
              </div>
            )}

            {user && (
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="flex justify-center mb-4">
                  <Avatar
                    src={user.avatarUrl ?? undefined}
                    name={user.fullName ?? "U"}
                    className="w-28 h-28"
                    isBordered
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="fullName"
                    label="Họ và tên"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.fullName && !!formik.errors.fullName
                    }
                    errorMessage={
                      formik.touched.fullName ? formik.errors.fullName : ""
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

                  <Input
                    name="dateOfBirth"
                    label="Ngày sinh"
                    placeholder="dd/mm/yyyy"
                    type="date"
                    value={convertToDateInputFormat(
                      formik.values.dateOfBirth || ""
                    )}
                    onChange={(e) => {
                      const ddmmyyyy = convertToDdMmYyyyFormat(e.target.value);
                      formik.setFieldValue("dateOfBirth", ddmmyyyy);
                    }}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.dateOfBirth && !!formik.errors.dateOfBirth
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
                        icon="mdi:gender-male-female"
                        className="h-4 w-4 text-gray-500"
                      />
                    }
                  >
                    <SelectItem key="male">Nam</SelectItem>
                    <SelectItem key="female">Nữ</SelectItem>
                    <SelectItem key="other">Khác</SelectItem>
                  </Select>

                  {/* Role */}
                  <Select
                    name="roleId"
                    label="Vai trò"
                    selectedKeys={
                      formik.values.roleId ? [String(formik.values.roleId)] : []
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

                  <Input
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.email && !!formik.errors.email}
                    errorMessage={
                      formik.touched.email ? formik.errors.email : ""
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
                        icon="mdi:email"
                        className="h-4 w-4 text-gray-500"
                      />
                    }
                  />

                  <Input
                    name="phone"
                    label="Số điện thoại"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.phone && !!formik.errors.phone}
                    errorMessage={
                      formik.touched.phone ? formik.errors.phone : ""
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
                <Textarea
                  name="address"
                  label="Địa chỉ"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.address && !!formik.errors.address}
                  errorMessage={
                    formik.touched.address ? formik.errors.address : ""
                  }
                  minRows={2}
                  maxRows={4}
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
              </form>
            )}
          </ModalBody>

          <ModalFooter className="bg-background">
            <Button
              variant="bordered"
              onPress={handleClose}
              disabled={formik.isSubmitting}
              className="text-red-600 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              Hủy
            </Button>
            <Button
              variant="solid"
              onPress={() => formik.handleSubmit()}
              isLoading={formik.isSubmitting}
              disabled={formik.isSubmitting}
              startContent={
                <Icon icon="mdi:content-save" className="h-4 w-4" />
              }
              className="bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              Cập nhật
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
