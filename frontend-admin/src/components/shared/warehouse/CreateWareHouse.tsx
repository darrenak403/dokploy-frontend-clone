"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

import { Alert, Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";

import { useFetchCreateInstrumentSwrSingleton } from "@/hook/singleton/swrs/warehouse/useFetchCreateWareHouseIntrustmentSwr";
import { useFetchGetAllInstrumentSwrSingleton } from "@/hook/singleton/swrs/warehouse/useFetchGetAllInstrumentSwr";

import { createInstrumentValidationSchema } from "@/modules/wareHouse/createUpdateWareHouseIntrustmentHelper";

const CreateWareHouse = () => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const createInstrumentSwr = useFetchCreateInstrumentSwrSingleton();
  const getAllInstrumentSwr = useFetchGetAllInstrumentSwrSingleton();

  const formik = useFormik({
    initialValues: {
      name: "",
      serialNumber: "",
    },
    validationSchema: createInstrumentValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setIsLoading(true);
        const result = await createInstrumentSwr?.trigger(values);
        if (result?.data) {
          setAlertMessage("Thiết bị đã được thêm thành công!");
          setAlertColor("success");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          resetForm();
          getAllInstrumentSwr?.mutate?.();
        } else {
          setAlertMessage(result?.message || "Có lỗi xảy ra khi thêm thiết bị");
          setAlertColor("danger");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        }
      } catch (error: any) {
        console.error("Create instrument error:", error);
        setAlertMessage(
          error?.response?.data?.message ||
            "Không thể kết nối đến máy chủ. Vui lòng thử lại."
        );
        setAlertColor("danger");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } finally {
        setSubmitting(false);
        setIsLoading(false);
      }
    },
  });

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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Thêm mới thiết bị</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Nhập thông tin thiết bị mới vào hệ thống
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="flex-1 overflow-auto p-6 space-y-4"
      >
        <Input
          name="name"
          label="Tên Thiết Bị"
          placeholder="VD: Oscilloscope"
          value={formik.values.name}
          onChange={formik.handleChange}
          isInvalid={!!(formik.touched.name && formik.errors.name)}
          onBlur={() => formik.setFieldTouched("name", true)}
          errorMessage={formik.touched.name && formik.errors.name}
          isDisabled={isLoading}
          startContent={
            <Icon icon="mdi:test-tube" className="h-4 w-4 text-default-400" />
          }
          classNames={{
            base: "w-full",
            input: "text-foreground",
            inputWrapper:
              "border border-gray-200 dark:border-gray-700 bg-background " +
              "hover:border-blue-500 dark:hover:border-blue-400 " +
              "data-[focus=true]:border-blue-500 dark:data-[focus=true]:border-blue-400",
            label: "text-foreground",
            errorMessage: "text-red-500 dark:text-red-400",
          }}
        />

        <Input
          name="serialNumber"
          label="Số Seri"
          placeholder="VD: OSC-001-2024"
          value={formik.values.serialNumber}
          onChange={(e) => {
            formik.setFieldValue("serialNumber", e.target.value.toUpperCase());
          }}
          onBlur={() => formik.setFieldTouched("serialNumber", true)}
          isInvalid={
            !!(formik.touched.serialNumber && formik.errors.serialNumber)
          }
          errorMessage={
            formik.touched.serialNumber && formik.errors.serialNumber
          }
          isRequired
          isDisabled={isLoading}
          startContent={
            <Icon icon="mdi:barcode" className="h-4 w-4 text-default-400" />
          }
          classNames={{
            base: "w-full",
            input: "text-foreground uppercase",
            inputWrapper:
              "border border-gray-200 dark:border-gray-700 bg-background " +
              "hover:border-blue-500 dark:hover:border-blue-400 " +
              "data-[focus=true]:border-blue-500 dark:data-[focus=true]:border-blue-400",
            label: "text-foreground",
            errorMessage: "text-red-500 dark:text-red-400",
          }}
        />

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            color="default"
            isLoading={isLoading}
            isDisabled={
              !formik.isValid ||
              !formik.values.name ||
              !formik.values.serialNumber
            }
            className="w-full bg-gray-900 dark:bg-gray-700 text-white 
                     hover:bg-gray-800 dark:hover:bg-gray-600 
                     font-medium"
            startContent={
              !isLoading && <Icon icon="mdi:plus" className="h-5 w-5" />
            }
          >
            {isLoading ? "Đang thêm..." : "Thêm Thiết Bị"}
          </Button>
        </div>

        {formik.dirty && !isLoading && (
          <Button
            type="button"
            variant="light"
            onPress={() => formik.resetForm()}
            className="w-full"
            startContent={<Icon icon="mdi:refresh" className="h-5 w-5" />}
          >
            Đặt lại
          </Button>
        )}
      </form>
    </div>
  );
};

export default CreateWareHouse;
