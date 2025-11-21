/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";

import { convertToDateInputFormat, convertToDdMmYyyyFormat } from "@/modules";
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
import { useSWRConfig } from "swr";

import { Patient } from "@/types/patient";

import { useUpdatePatientDiscloresureSingleton } from "@/hook/singleton/discloresures";
import { useFetchAllPatientSwrSingleton } from "@/hook/singleton/swrs/patient/useFetchAllPatientSwr";
import {
  UpdatePatientPayload,
  useFetchUpdatePatientSwrSingleton,
} from "@/hook/singleton/swrs/patient/useFetchUpdatePatientSwr";
import { useFetchGetAllUserSwrSingleton } from "@/hook/singleton/swrs/user/useFetchGetAllUserSwr";

import { validationUpdatePatientSchema } from "@/modules/patient/index";

export default function UpdatePatientModal() {
  const disclosure = useUpdatePatientDiscloresureSingleton();
  const selectedPatient = disclosure.patient as Patient | null;
  const { mutate } = useSWRConfig();
  const update = useFetchUpdatePatientSwrSingleton();
  const source: Patient | null | undefined = selectedPatient;
  type FormValues = UpdatePatientPayload & { id?: number | null };
  const { data, isLoading, error } = useFetchGetAllUserSwrSingleton();
  const users = Array.isArray(data?.data) ? data?.data : [];
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
  // console.log(users);
  // console.log(source?.id);
  const initialValues: FormValues = {
    userId: source?.userId ?? undefined,
    fullName: source?.fullName ?? "",
    yob: source?.yob ?? "",
    gender: source?.gender ?? "",
    address: source?.address ?? "",
    phone: source?.phone ?? "",
    email: source?.email ?? "",
  };
  const formik = useFormik<FormValues>({
    initialValues: initialValues,
    validationSchema: validationUpdatePatientSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);

        if (!source || !source.id) {
          setSubmitting(false);
          return;
        }

        const id = Number(source.id);
        if (!Number.isFinite(id) || Number.isNaN(id)) {
          setSubmitting(false);
          return;
        }

        // Chỉ gửi fields cần thiết (adjust theo API)
        const payload: UpdatePatientPayload = {
          userId: values.userId,
          fullName: values.fullName || "",
          yob: values.yob || "",
          gender: values.gender || "",
          address: values.address || "",
          phone: values.phone || "",
          email: values.email || "",
        };

        const res = await update.updatePatient({ id, payload });

        if (res?.statusCode !== 201 && res?.statusCode !== 200) {
          throw new Error(res?.message || "Update failed");
        }

        await mutate(
          (key) => typeof key === "string" && key.startsWith("/patient")
        );
        resetForm();
        disclosure.onClose();
      } catch (error: any) {
        console.error("Failed to update patient:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (disclosure?.isOpen && source) {
      formik.setValues({
        userId: source.userId ?? undefined,
        fullName: source.fullName || "",
        yob: source.yob || "",
        gender: (source.gender || "").toLowerCase(),
        address: source.address || "",
        phone: source.phone || "",
        email: source.email || "",
      } as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disclosure?.isOpen, source]);

  const handleClose = () => {
    formik.resetForm();
    disclosure.onClose();
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
        {() => (
          <>
            <ModalHeader className="flex items-center gap-2 bg-background text-foreground">
              <Icon
                icon="mdi:account-edit"
                className="h-5 w-5 text-[var(--primary)]"
              />
              <span className="text-foreground">Cập nhật bệnh nhân</span>
            </ModalHeader>

            <ModalBody className="py-6 bg-background">
              <form onSubmit={formik.handleSubmit} className="space-y-4">
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
                    formik.touched.fullName ? formik.errors.fullName : ""
                  }
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mã Bệnh Nhân */}
                  <Input
                    label="Mã Bệnh Nhân"
                    value={
                      patientCodeMap.get(String(selectedPatient?.id ?? "")) ||
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
                    name="yob"
                    label="Ngày sinh"
                    placeholder="dd/mm/yyyy"
                    type="date"
                    value={convertToDateInputFormat(formik.values.yob || "")}
                    onChange={(e) => {
                      const ddmmyyyy = convertToDdMmYyyyFormat(e.target.value);
                      formik.setFieldValue("yob", ddmmyyyy);
                    }}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.yob && !!formik.errors.yob}
                    errorMessage={formik.touched.yob ? formik.errors.yob : ""}
                    classNames={{
                      base: "w-full",
                      input: "bg-background text-foreground",
                      inputWrapper:
                        "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
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
                    className="w-full"
                  >
                    <SelectItem key="male">Nam</SelectItem>
                    <SelectItem key="female">Nữ</SelectItem>
                    <SelectItem key="other">Khác</SelectItem>
                  </Select>

                  <Input
                    name="phone"
                    label="Số điện thoại"
                    placeholder="Nhập số điện thoại"
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
                        icon="mdi:email"
                        className="h-4 w-4 text-gray-500"
                      />
                    }
                  />
                  <Input
                    label="Người dùng"
                    value={(() => {
                      if (isLoading) return "Đang tải người dùng...";
                      if (error) return "Lỗi khi tải người dùng";

                      const id = formik.values.userId ?? source?.id;
                      if (!id || id === null)
                        return "Chưa có người dùng nào được chỉ định";

                      const u = users.find((x) => Number(x.id) === Number(id));
                      if (u) {
                        return u.fullName ?? u.email ?? `Người dùng ${id}`;
                      } else {
                        return `Người dùng (ID: ${id})`;
                      }
                    })()}
                    readOnly
                    disabled
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
                </div>

                <Textarea
                  name="address"
                  label="Địa chỉ"
                  placeholder="Nhập địa chỉ của bệnh nhân"
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
              </form>
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
                onPress={() => {
                  formik.handleSubmit();
                }}
                isLoading={formik.isSubmitting}
                disabled={!formik.isValid || formik.isSubmitting}
                className="bg-[var(--primary)] hover:bg-[var(--primary-600)] text-[var(--on-primary)]"
                startContent={
                  !formik.isSubmitting && (
                    <Icon icon="mdi:content-save" className="h-4 w-4" />
                  )
                }
              >
                {formik.isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
