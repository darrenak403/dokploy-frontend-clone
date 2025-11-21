/* eslint-disable @typescript-eslint/no-explicit-any */

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
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useFormik } from "formik";
import { useSWRConfig } from "swr";

import { UpdateTestOrderPayload } from "@/types/test-order";

import { useUpdateTestOrderDiscloresureSingleton } from "@/hook/singleton/discloresures";
import { useFetchAllPatientSwrSingleton } from "@/hook/singleton/swrs/patient/useFetchAllPatientSwr";
import { useFetchGetAllUserSwrSingleton } from "@/hook/singleton/swrs/user/useFetchGetAllUserSwr";

import {
  getPriorityColor,
  getStatusColor,
  priorityTokenToClass,
} from "@/modules/test-order";

import { useFetchUpdateTestOrderSwrSingleton } from "../../../../../hook/singleton/swrs/test-order/useFetchUpdateTestOrder";
import {
  calcAgeFromDate,
  formatDateDisplay,
  parseDateOnly,
} from "../../../../../modules/day";
import { validationUpdateTestOrderSchema } from "../../../../../modules/test-order/createUpdateHelper";

export default function UpdateTestOrderModal() {
  const disclosure = useUpdateTestOrderDiscloresureSingleton();
  const selectedTestOrder = disclosure?.testOrder || null;
  const { mutate } = useSWRConfig();
  const update = useFetchUpdateTestOrderSwrSingleton();
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

  const { data: usersResp } = useFetchGetAllUserSwrSingleton();
  const users = usersResp?.data ?? [];
  const adminUsers = Array.isArray(users)
    ? users.filter((u: any) => {
        if (!u) return false;
        const payload = u.data ?? u;
        const role = payload.role ?? undefined;
        if (role && String(role).toLowerCase().includes("admin")) return true;
        if (
          Array.isArray(payload.roles) &&
          payload.roles.some((r: any) =>
            String(r).toLowerCase().includes("admin")
          )
        )
          return true;
        return false;
      })
    : [];

  type FormValues = UpdateTestOrderPayload & { id?: number | null };

  const initialValues: FormValues = {
    runBy: selectedTestOrder?.runBy
      ? Number(selectedTestOrder.runBy)
      : undefined,
    id: selectedTestOrder?.id ?? undefined,
  };

  const formik = useFormik<FormValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema: validationUpdateTestOrderSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);

        const source = selectedTestOrder;
        if (!source || !source.id) {
          setSubmitting(false);
          return;
        }

        const id = Number(source.id);
        if (!Number.isFinite(id) || Number.isNaN(id)) {
          setSubmitting(false);
          return;
        }

        const payload: UpdateTestOrderPayload = {
          runBy: values.runBy ? Number(values.runBy) : undefined,
        };

        const res = await update?.updateTestOrder({ id, payload });

        if (res?.statusCode !== 200 && res?.statusCode !== 201) {
          throw new Error(res?.message || "Update failed");
        }

        await mutate(
          (key) => typeof key === "string" && key.startsWith("/orders")
        );
        resetForm();
        disclosure?.onClose();
      } catch (err) {
        console.error("Failed to update test order:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    disclosure?.onClose();
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
                icon="mdi:clipboard-edit"
                className="h-5 w-5 text-coral-500"
              />
              <span>Cập nhật đơn xét nghiệm (Người thực hiện)</span>
            </ModalHeader>

            <ModalBody className="py-6 bg-background">
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <Input
                  label="Patient"
                  value={selectedTestOrder?.patientName ?? ""}
                  readOnly
                  startContent={
                    <Icon
                      icon="mdi:account"
                      className="h-4 w-4 text-gray-500"
                    />
                  }
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Mã Bệnh Nhân */}
                  <Input
                    label="Mã Bệnh Nhân"
                    value={
                      patientCodeMap.get(
                        String(selectedTestOrder?.patientId ?? "")
                      ) || "-"
                    }
                    readOnly
                    startContent={
                      <Icon
                        icon="mdi:account"
                        className="h-4 w-4 text-gray-500"
                      />
                    }
                  />

                  <Input
                    label="Date of Birth"
                    value={(() => {
                      const dobDate = parseDateOnly(
                        selectedTestOrder?.yob ?? undefined
                      );
                      const dob = dobDate ? formatDateDisplay(dobDate) : "";
                      const ageFromApi = selectedTestOrder?.age ?? undefined;
                      const ageFromDob = !ageFromApi
                        ? calcAgeFromDate(dobDate)
                        : undefined;
                      const age = ageFromApi ?? ageFromDob;
                      if (dob && age !== undefined)
                        return `${dob} (${age} tuổi)`;
                      if (dob) return dob;
                      if (age !== undefined) return `${age} tuổi`;
                      return "";
                    })()}
                    readOnly
                    startContent={
                      <Icon
                        icon="mdi:calendar"
                        className="h-4 w-4 text-gray-500"
                      />
                    }
                  />

                  <Input
                    label="Giới tính"
                    value={selectedTestOrder?.gender ?? ""}
                    readOnly
                    startContent={
                      <Icon
                        icon="mdi:gender-male-female"
                        className="h-4 w-4 text-gray-500"
                      />
                    }
                  />

                  <Input
                    label="Số điện thoại"
                    value={selectedTestOrder?.phone ?? ""}
                    readOnly
                    startContent={
                      <Icon
                        icon="mdi:phone"
                        className="h-4 w-4 text-gray-500"
                      />
                    }
                  />

                  <Input
                    label="Thiết bị"
                    value={String(selectedTestOrder?.instrumentName ?? "")}
                    readOnly
                    startContent={
                      <Icon
                        icon="mdi:tools"
                        className="h-4 w-4 text-gray-500"
                      />
                    }
                  />

                  <Input
                    label="Mức độ ưu tiên"
                    value={String(selectedTestOrder?.priority ?? "")}
                    readOnly
                    startContent={
                      <Icon
                        icon="mdi:flag"
                        className={`h-4 w-4 ${priorityTokenToClass(
                          getPriorityColor(
                            String(selectedTestOrder?.priority) ?? undefined
                          )
                        )}`}
                      />
                    }
                  />

                  <Input
                    label="Trạng thái"
                    value={selectedTestOrder?.status ?? ""}
                    readOnly
                    startContent={
                      <Icon
                        icon="mdi:information"
                        className={`h-4 w-4 ${statusColorClass(
                          selectedTestOrder?.status
                        )}`}
                      />
                    }
                  />
                </div>

                <div className="mt-3">
                  <Input
                    label="Người tạo"
                    value={selectedTestOrder?.createdBy ?? ""}
                    readOnly
                    classNames={{
                      base: "w-full",
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

                <div className="mt-3">
                  <Select
                    name="runBy"
                    label="Người thực hiện"
                    placeholder="Chọn người thực hiện"
                    // selectedKeys={
                    //   formik.values.runBy ? [String(formik.values.runBy)] : []
                    // }
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0];
                      formik.setFieldValue(
                        "runBy",
                        selected ? Number(selected) : undefined
                      );
                      formik.setFieldTouched("runBy", true);
                    }}
                    onClose={() => formik.setFieldTouched("runBy", true)}
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
                        icon="mdi:account-tie"
                        className="h-4 w-4 text-gray-500"
                      />
                    }
                  >
                    {adminUsers.length === 0 ? (
                      <SelectItem key="none">Không có thực hiện</SelectItem>
                    ) : (
                      adminUsers.map((u: any) => (
                        <SelectItem key={String(u.id)}>
                          {u.fullName ?? u.name ?? u.email}
                        </SelectItem>
                      ))
                    )}
                  </Select>
                  {(formik.touched.runBy || formik.submitCount > 0) &&
                    formik.errors.runBy && (
                      <div className="text-red-600 text-sm mt-1">
                        {String(formik.errors.runBy)}
                      </div>
                    )}
                </div>
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
        )}
      </ModalContent>
    </Modal>
  );
}
