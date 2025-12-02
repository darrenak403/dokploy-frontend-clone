"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

import {
  Alert,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";

import { REAGENT_TYPE_VALUES } from "@/types/regent";

import { useFetchCreateRegentSwrSingleton } from "@/hook/singleton/swrs/instrument/useFetchCreateRegentSwr";
import { useFetchGetAllReagentSwrSingleton } from "@/hook/singleton/swrs/instrument/useFetchGetAllReagentSwr";

import { createReagentValidationSchema } from "@/modules/regent/createUpdateRegentHelper";

const CreateRegent = () => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const createRegentSwr = useFetchCreateRegentSwrSingleton();
  const getAllReagentSwr = useFetchGetAllReagentSwrSingleton();

  const formatCapitalize = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formik = useFormik({
    initialValues: {
      reagentType: "",
      reagentName: "",
      lotNumber: "",
      quantity: 0,
      unit: "",
      expiryDate: "",
      vendorId: "",
      vendorName: "",
      vendorContact: "",
      remarks: "",
    },
    validationSchema: createReagentValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setIsLoading(true);
        // Format expiryDate từ "yyyy-MM-dd" thành "dd/MM/yyyy" trước khi gửi
        const formattedValues = {
          ...values,
          expiryDate: values.expiryDate
            ? values.expiryDate.split("-").reverse().join("/") // "2027-04-03" -> "03/04/2027"
            : "",
        };
        const result = await createRegentSwr?.trigger(formattedValues as any);
        if (result?.data) {
          setAlertMessage("Thuốc thử đã được thêm thành công!");
          setAlertColor("success");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          resetForm();
          getAllReagentSwr?.mutate?.();
        } else {
          setAlertMessage("Có lỗi xảy ra khi thêm thuốc thử");
          setAlertColor("danger");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        }
      } catch (error: any) {
        console.error("Create reagent error:", error);
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
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex-shrink-0 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        {/* Alert */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="fixed top-20 right-4 z-[999] w-auto max-w-[90vw] sm:max-w-sm"
            >
              <Alert
                color={alertColor}
                title={alertMessage}
                variant="flat"
                className="shadow-lg bg-background border border-gray-200 dark:border-gray-700"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
            <Icon
              icon="mdi:flask-plus"
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400"
            />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Thêm mới thuốc thử
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Nhập thông tin chi tiết
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="flex-1 overflow-auto p-3 sm:p-4 space-y-3 sm:space-y-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Select
            name="reagentType"
            label="Loại thuốc thử"
            placeholder="Chọn loại thuốc thử"
            selectedKeys={
              formik.values.reagentType ? [formik.values.reagentType] : []
            }
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              formik.setFieldValue("reagentType", value);
              if (value) {
                formik.setFieldValue(
                  "reagentName",
                  `CBC ${formatCapitalize(value)} Solution`
                );
              }
            }}
            onBlur={() => formik.setFieldTouched("reagentType", true)}
            isInvalid={
              !!(formik.touched.reagentType && formik.errors.reagentType)
            }
            errorMessage={
              formik.touched.reagentType && formik.errors.reagentType
            }
            isDisabled={isLoading}
            startContent={
              <Icon icon="mdi:label" className="h-4 w-4 text-default-400" />
            }
            classNames={{
              base: "w-full",
              trigger:
                "border border-gray-200 dark:border-gray-700 bg-background " +
                "hover:border-blue-500 dark:hover:border-blue-400 " +
                "data-[focus=true]:border-blue-500 dark:data-[focus=true]:border-blue-400",
              label: "text-foreground",
              errorMessage: "text-red-500 dark:text-red-400",
            }}
          >
            {REAGENT_TYPE_VALUES.map((type) => (
              <SelectItem key={type}>{type}</SelectItem>
            ))}
          </Select>

          <Input
            name="reagentName"
            label="Tên thuốc thử"
            placeholder="VD: CBC Diluent Solution"
            value={formik.values.reagentName}
            onChange={formik.handleChange}
            isInvalid={
              !!(formik.touched.reagentName && formik.errors.reagentName)
            }
            onBlur={() => formik.setFieldTouched("reagentName", true)}
            errorMessage={
              formik.touched.reagentName && formik.errors.reagentName
            }
            isDisabled={isLoading}
            startContent={
              <Icon icon="mdi:flask" className="h-4 w-4 text-default-400" />
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
            name="lotNumber"
            label="Mã lô"
            placeholder="VD: LOT-2025-ABC1234567"
            value={formik.values.lotNumber}
            onChange={formik.handleChange}
            isInvalid={!!(formik.touched.lotNumber && formik.errors.lotNumber)}
            onBlur={() => formik.setFieldTouched("lotNumber", true)}
            errorMessage={formik.touched.lotNumber && formik.errors.lotNumber}
            isDisabled={isLoading}
            startContent={
              <Icon icon="mdi:barcode" className="h-4 w-4 text-default-400" />
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
            name="quantity"
            type="number"
            label="Số lượng"
            placeholder="VD: 10"
            value={String(formik.values.quantity ?? "")}
            onChange={(e) =>
              formik.setFieldValue("quantity", Number(e.target.value))
            }
            isInvalid={!!(formik.touched.quantity && formik.errors.quantity)}
            onBlur={() => formik.setFieldTouched("quantity", true)}
            errorMessage={formik.touched.quantity && formik.errors.quantity}
            isDisabled={isLoading}
            startContent={
              <Icon icon="mdi:numeric" className="h-4 w-4 text-default-400" />
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
            name="unit"
            label="Đơn vị"
            placeholder="VD: bottle"
            value={formik.values.unit}
            onChange={formik.handleChange}
            isInvalid={!!(formik.touched.unit && formik.errors.unit)}
            onBlur={() => formik.setFieldTouched("unit", true)}
            errorMessage={formik.touched.unit && formik.errors.unit}
            isDisabled={isLoading}
            startContent={
              <Icon icon="mdi:beaker" className="h-4 w-4 text-default-400" />
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
            name="expiryDate"
            type="date"
            label="Hạn sử dụng"
            placeholder="YYYY-MM-DD"
            value={formik.values.expiryDate}
            onChange={formik.handleChange}
            isInvalid={
              !!(formik.touched.expiryDate && formik.errors.expiryDate)
            }
            onBlur={() => formik.setFieldTouched("expiryDate", true)}
            errorMessage={formik.touched.expiryDate && formik.errors.expiryDate}
            isDisabled={isLoading}
            startContent={
              <Icon icon="mdi:calendar" className="h-4 w-4 text-default-400" />
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
            name="vendorId"
            label="Mã nhà cung cấp"
            placeholder="VD: VEND-001"
            value={formik.values.vendorId}
            onChange={formik.handleChange}
            isInvalid={!!(formik.touched.vendorId && formik.errors.vendorId)}
            onBlur={() => formik.setFieldTouched("vendorId", true)}
            errorMessage={formik.touched.vendorId && formik.errors.vendorId}
            isDisabled={isLoading}
            startContent={
              <Icon
                icon="mdi:identifier"
                className="h-4 w-4 text-default-400"
              />
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
            name="vendorName"
            label="Tên nhà cung cấp"
            placeholder="VD: Meditech Supplies Co."
            value={formik.values.vendorName}
            onChange={formik.handleChange}
            isInvalid={
              !!(formik.touched.vendorName && formik.errors.vendorName)
            }
            onBlur={() => formik.setFieldTouched("vendorName", true)}
            errorMessage={formik.touched.vendorName && formik.errors.vendorName}
            isDisabled={isLoading}
            startContent={
              <Icon icon="mdi:factory" className="h-4 w-4 text-default-400" />
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
        </div>
        <Input
          name="vendorContact"
          label="Liên hệ nhà cung cấp"
          placeholder="VD: 0123 456 789"
          value={formik.values.vendorContact}
          onChange={formik.handleChange}
          isInvalid={
            !!(formik.touched.vendorContact && formik.errors.vendorContact)
          }
          onBlur={() => formik.setFieldTouched("vendorContact", true)}
          errorMessage={
            formik.touched.vendorContact && formik.errors.vendorContact
          }
          isDisabled={isLoading}
          startContent={
            <Icon icon="mdi:phone" className="h-4 w-4 text-default-400" />
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
        <Textarea
          name="remarks"
          label="Ghi chú"
          placeholder="Ghi chú thêm cho thuốc thử"
          value={formik.values.remarks}
          onChange={formik.handleChange}
          isInvalid={!!(formik.touched.remarks && formik.errors.remarks)}
          onBlur={() => formik.setFieldTouched("remarks", true)}
          errorMessage={formik.touched.remarks && formik.errors.remarks}
          isDisabled={isLoading}
          className="md:col-span-2"
          classNames={{
            base: "w-full",
            input: "text-foreground",
            inputWrapper:
              "border border-gray-200 dark:border-gray-700 bg-background ",
            label: "text-foreground",
          }}
        />

        {/* Submit Button */}
        <div className="pt-3 sm:pt-4 lg:col-span-2">
          <Button
            type="submit"
            color="default"
            size="lg"
            isLoading={isLoading}
            isDisabled={
              !formik.isValid ||
              !formik.values.reagentType ||
              !formik.values.reagentName ||
              !formik.values.lotNumber ||
              !formik.values.unit ||
              !formik.values.expiryDate ||
              !formik.values.vendorId ||
              !formik.values.vendorName ||
              !formik.values.quantity ||
              !formik.values.vendorContact ||
              !formik.values.remarks ||
              formik.values.quantity <= 0
            }
            className="w-full bg-black dark:bg-gray-700 text-white 
                     hover:bg-gray-800 dark:hover:bg-gray-600 
                     font-medium text-sm sm:text-base"
            startContent={
              !isLoading && (
                <Icon icon="mdi:plus" className="h-4 w-4 sm:h-5 sm:w-5" />
              )
            }
          >
            {isLoading ? "Đang thêm..." : "Thêm Thuốc Thử"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateRegent;
