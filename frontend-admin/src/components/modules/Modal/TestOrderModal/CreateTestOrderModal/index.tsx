/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

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
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { FormikHelpers, useFormik } from "formik";
import { useSWRConfig } from "swr";

import { useCreateTestOrderDiscloresureSingleton } from "@/hook/singleton/discloresures";
import {
  useFetchAllPatientSwrSingleton,
  useFetchCreateTestOrderSwrSingleton,
} from "@/hook/singleton/swrs";
import { useFetchGetAllUserSwrSingleton } from "@/hook/singleton/swrs/user/useFetchGetAllUserSwr";
import { useFetchGetAllInstrumentSwrSingleton } from "@/hook/singleton/swrs/warehouse/useFetchGetAllInstrumentSwr";

import { calcAgeFromDate } from "@/modules/day";
import {
  getPriorityColor,
  parseDateOnly,
  priorityTokenToClass,
} from "@/modules/test-order";
import { validationCreateTestOrderSchema } from "@/modules/test-order/createUpdateHelper";

export default function CreateTestOrderModal() {
  const route = useRouter();
  const disclosure = useCreateTestOrderDiscloresureSingleton();
  const isOpen = disclosure?.isOpen ?? false;
  const onOpenChange = disclosure?.onOpenChange ?? (() => {});
  const onClose = disclosure?.onClose ?? (() => {});
  const [userSearch, setUserSearch] = React.useState("");

  const instrumentsResp = useFetchGetAllInstrumentSwrSingleton();
  const instrumentsOptions = (instrumentsResp?.data?.data.data ?? []).filter(
    (instrument) => instrument.status === "READY"
  );
  const createTestOrderSwr = useFetchCreateTestOrderSwrSingleton();
  const createTestOrder =
    createTestOrderSwr?.createTestOrder ?? createTestOrderSwr?.trigger;
  const isMutating = createTestOrderSwr?.isMutating;
  const error = createTestOrderSwr?.error;

  const { mutate } = useSWRConfig();

  const { data: patientsResp, isLoading: isLoadingPatients } =
    useFetchAllPatientSwrSingleton();
  const patients = patientsResp?.data?.data ?? [];
  const selectedPatientId = disclosure?.patientId ?? null;

  const { data: usersResp } = useFetchGetAllUserSwrSingleton();
  const users = usersResp?.data ?? [];
  const systemUsers = Array.isArray(users)
    ? users.filter((u: any) => {
        if (!u) return false;
        const role = u.role ?? undefined;
        return role && String(role).toUpperCase() !== "ROLE_PATIENT";
      })
    : [];

  const formik = useFormik({
    initialValues: {
      patientId: "",
      priority: "low",
      instrumentId: "",
      runBy: "",
    },
    validationSchema: validationCreateTestOrderSchema,
    onSubmit: async (values, formikHelpers: FormikHelpers<any>) => {
      const { setSubmitting, resetForm, setFieldError } = formikHelpers;
      try {
        const payload = {
          patientId: Number(values.patientId),
          priority: values.priority.toUpperCase(),
          instrumentId: Number(values.instrumentId),
          runBy: values.runBy ? Number(values.runBy) : undefined,
        } as any;

        const result = await createTestOrder?.(payload);

        await mutate(
          (key) => typeof key === "string" && key.startsWith("/orders")
        );
        resetForm();
        onClose();
        if (result?.status === 201 || result?.status === 200) {
          route.push(`/service/test-order`);
        }
      } catch (err) {
        console.error(err);
        if (err instanceof Error) setFieldError("patientId", err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handlePatientSelect = (selectedId?: number) => {
    // đúng field name: patientId
    formik.setFieldValue("patientId", selectedId ?? "");
    formik.setFieldTouched("patientId", true);

    if (!selectedId) return;

    const patient = patients.find((u) => Number(u.id) === Number(selectedId));
    if (!patient) return;

    // Populate form fields from patient record
    formik.setFieldValue("email", patient.email ?? "");
    formik.setFieldValue("phone", patient.phone ?? "");
    formik.setFieldValue("gender", patient.gender ?? "");
    formik.setFieldValue("address", patient.address ?? "");
    formik.setFieldValue("yob", patient.yob ?? "");
  };

  const selectedPatient = patients.find(
    (p: any) => String(p.id) === String(formik.values.patientId)
  );

  // reset when modal opens, then autofill if selectedPatientId present
  useEffect(() => {
    if (!isOpen) return;
    formik.resetForm();
    setUserSearch("");

    if (selectedPatientId == null) return;
    const idNum = Number(selectedPatientId);
    if (Number.isNaN(idNum)) return;

    // autofill after reset
    handlePatientSelect(idNum);
    const p = patients.find((x: any) => String(x.id) === String(idNum));
    if (p) {
      setUserSearch(
        `${p.patientCode ? p.patientCode + " - " : ""}${
          p.fullName ?? p.email ?? ""
        }`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedPatientId, patients]);

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
                icon="mdi:clipboard-plus"
                className="h-5 w-5 text-coral-500"
              />
              <span>Tạo đơn xét nghiệm</span>
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
                      Lỗi khi tạo đơn xét nghiệm:{" "}
                      {error.message || "Đã xảy ra lỗi"}
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-3 md:col-span-3">
                    <Autocomplete
                      name="patientId"
                      label="Bệnh nhân"
                      placeholder={
                        isLoadingPatients
                          ? "Đang tải người dùng..."
                          : "tìm kiếm theo tên hoặc mã bệnh nhân..."
                      }
                      inputValue={userSearch}
                      onInputChange={(val: string) => setUserSearch(val)}
                      value={
                        formik.values.patientId
                          ? String(formik.values.patientId)
                          : ""
                      }
                      onSelectionChange={(key) =>
                        handlePatientSelect(key ? Number(key) : undefined)
                      }
                      onClose={() => {
                        // mark touched
                        formik.setFieldTouched("patientId", true);

                        // if user typed something that matches a patient code or name, select it
                        if (userSearch && patients.length > 0) {
                          const q = userSearch.toString().toLowerCase().trim();
                          const found = patients.find((p: any) => {
                            const code = (p.patientCode ?? "")
                              .toString()
                              .toLowerCase();
                            const name = (p.fullName ?? "")
                              .toString()
                              .toLowerCase();
                            return (
                              code === q ||
                              name === q ||
                              code.includes(q) ||
                              name.includes(q)
                            );
                          });
                          if (found && found.id != null) {
                            handlePatientSelect(Number(found.id));
                            // keep display for selected patient below
                          }
                        }

                        // keep display text if we have a selectedPatient,
                        // otherwise clear the typed search
                        if (formik.values.patientId) {
                          const p = patients.find(
                            (x: any) =>
                              String(x.id) === String(formik.values.patientId)
                          );
                          if (p) {
                            setUserSearch(
                              `${p.patientCode ? p.patientCode + " - " : ""}${
                                p.fullName ?? p.email ?? ""
                              }`
                            );
                            return;
                          }
                        }

                        setUserSearch("");
                      }}
                      isInvalid={
                        formik.touched.patientId &&
                        !!(formik.errors as any).patientId
                      }
                      errorMessage={
                        formik.touched.patientId
                          ? (formik.errors as any).patientId
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
                      {patients
                        .filter((u: any) => {
                          if (!userSearch) return true;
                          const q = userSearch.toString().toLowerCase();
                          const name = (u.fullName ?? "")
                            .toString()
                            .toLowerCase();
                          const code = (u.patientCode ?? "")
                            .toString()
                            .toLowerCase();
                          return name.includes(q) || code.includes(q);
                        })
                        .map((u: any) => (
                          <AutocompleteItem
                            key={String(u.id)}
                            id={String(u.id)}
                          >
                            {`${u.patientCode ?? ""}${
                              u.patientCode ? " - " : ""
                            }${u.fullName ?? "-"}`}
                          </AutocompleteItem>
                        ))}
                    </Autocomplete>
                  </div>
                  <div className="col-span-3 grid grid-cols-2 gap-2">
                    <div className="col-span-1">
                      <Select
                        name="priority"
                        label="Mức độ ưu tiên"
                        placeholder="Chọn mức độ ưu tiên"
                        selectedKeys={
                          formik.values.priority ? [formik.values.priority] : []
                        }
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as
                            | string
                            | undefined;
                          formik.setFieldValue("priority", selected || "low");
                          formik.setFieldTouched("priority", true);
                        }}
                        onClose={() => formik.setFieldTouched("priority", true)}
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
                            icon="mdi:flag"
                            className={`h-4 w-4 ${priorityTokenToClass(
                              getPriorityColor(
                                formik.values.priority ?? undefined
                              )
                            )}`}
                          />
                        }
                      >
                        <SelectItem key="low">LOW</SelectItem>
                        <SelectItem key="medium">MEDIUM</SelectItem>
                        <SelectItem key="high">HIGH</SelectItem>
                      </Select>
                    </div>

                    <div className="col-span-1">
                      <Select
                        name="instrumentId"
                        label="Thiết bị"
                        placeholder="Chọn thiết bị"
                        selectedKeys={
                          formik.values.instrumentId
                            ? [formik.values.instrumentId]
                            : []
                        }
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as
                            | string
                            | undefined;
                          formik.setFieldValue("instrumentId", selected || "");
                        }}
                        isInvalid={
                          formik.touched.instrumentId &&
                          !!formik.errors.instrumentId
                        }
                        errorMessage={
                          (formik.touched.instrumentId ||
                            formik.submitCount > 0) &&
                          (formik.errors as any).instrumentId
                            ? (formik.errors as any).instrumentId
                            : ""
                        }
                        isRequired
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
                            icon="mdi:medical-bag"
                            className="h-4 w-4 text-gray-500"
                          />
                        }
                      >
                        {instrumentsOptions.length === 0 ? (
                          <SelectItem key="none" isDisabled>
                            Không có thiết bị sẵn sàng
                          </SelectItem>
                        ) : (
                          instrumentsOptions.map((i) => (
                            <SelectItem key={i.id}>{i.name}</SelectItem>
                          ))
                        )}
                      </Select>
                    </div>
                  </div>

                  <div className="col-span-3 md:col-span-3">
                    <Select
                      name="runBy"
                      label="Người thực hiện"
                      placeholder="Chọn người thực hiện"
                      selectedKeys={
                        formik.values.runBy ? [String(formik.values.runBy)] : []
                      }
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as
                          | string
                          | undefined;
                        formik.setFieldValue(
                          "runBy",
                          selected ? String(selected) : ""
                        );
                        formik.setFieldTouched("runBy", true);
                      }}
                      onClose={() => formik.setFieldTouched("runBy", true)}
                      isInvalid={
                        formik.touched.runBy && !!(formik.errors as any).runBy
                      }
                      errorMessage={
                        formik.touched.runBy ? (formik.errors as any).runBy : ""
                      }
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
                      {systemUsers.length === 0 ? (
                        <SelectItem key="none">
                          Không có người dùng hệ thống
                        </SelectItem>
                      ) : (
                        systemUsers.map((u: any) => (
                          <SelectItem key={u.id}>
                            {u.fullName ?? u.name ?? u.email}
                          </SelectItem>
                        ))
                      )}
                    </Select>
                  </div>
                </div>

                {selectedPatient && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        label="Email"
                        value={selectedPatient.email ?? ""}
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
                            icon="mdi:email"
                            className="h-4 w-4 text-gray-500"
                          />
                        }
                      />
                      <Input
                        label="Số điện thoại"
                        value={selectedPatient.phone ?? ""}
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
                            icon="mdi:phone"
                            className="h-4 w-4 text-gray-500"
                          />
                        }
                      />
                      <Input
                        label="Giới tính"
                        value={selectedPatient.gender ?? ""}
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
                            icon="mdi:gender-male-female"
                            className="h-4 w-4 text-gray-500"
                          />
                        }
                      />
                      <Input
                        label="Ngày sinh"
                        value={(() => {
                          const dob = selectedPatient.yob
                            ? (selectedPatient.yob ?? "")
                            : "";
                          const ageFromDob = calcAgeFromDate(
                            parseDateOnly(selectedPatient.yob ?? undefined)
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
                    <Textarea
                      label="Địa chỉ"
                      value={selectedPatient.address ?? ""}
                      readOnly
                      maxRows={3}
                      minRows={2}
                      classNames={{
                        base: "w-full mt-3",
                        input:
                          "bg-background text-foreground placeholder:text-gray-500",
                        inputWrapper:
                          "border border-gray-200 dark:border-gray-700 bg-background",
                        label: "text-foreground",
                      }}
                      startContent={
                        <Icon
                          icon="mdi:map-marker"
                          className="h-4 w-4 text-gray-500"
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
                onPress={() => {
                  formik.resetForm();
                  onClose();
                }}
                disabled={isMutating || formik.isSubmitting}
                className="text-red-600 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                Hủy
              </Button>
              <Button
                variant="solid"
                onPress={() => formik.handleSubmit()}
                isLoading={isMutating || formik.isSubmitting}
                disabled={isMutating || formik.isSubmitting}
                startContent={
                  !isMutating &&
                  !formik.isSubmitting && (
                    <Icon icon="mdi:content-save" className="h-4 w-4" />
                  )
                }
                className="bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                Tạo đơn xét nghiệm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
