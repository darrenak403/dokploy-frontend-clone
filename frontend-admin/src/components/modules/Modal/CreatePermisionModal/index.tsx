"use client";
import React, { useState } from "react";

import {
  Alert,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import * as Yup from "yup";

import { useCreatePermissionDisclosureSingleton } from "@/hook/singleton/discloresures/permission/useCreatePermissionDiscloresure";
import { useFetchCreatePermissionSwrSingleton } from "@/hook/singleton/swrs/permission/useFetchCreatePermissionSwr";

const CreatePermissionModal = () => {
  const { isOpen, onClose, onOpenChange } =
    useCreatePermissionDisclosureSingleton();
  const swr = useFetchCreatePermissionSwrSingleton();

  const [showAlert, setShowAlert] = useState(false);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [alertMessage, setAlertMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên quyền là bắt buộc").trim(),
      description: Yup.string().optional(),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!swr) return;
      const { createPermission } = swr;
      try {
        await createPermission({
          name: values.name.trim(),
          description: values.description.trim() || undefined,
        });
        onClose();
        resetForm();
        setShowAlert(true);
        setAlertColor("success");
        setAlertMessage("Tạo quyền thành công");
        setTimeout(() => setShowAlert(false), 3000);
      } catch (err) {
        console.error("Lỗi tạo quyền:", err);
        alert("Có lỗi xảy ra khi tạo quyền");
      }
    },
  });

  if (!swr) return null;

  const { isMutating, error } = swr;

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Tạo Quyền Mới</ModalHeader>
          <ModalBody>
            <Input
              label="Tên Quyền"
              placeholder="Nhập tên quyền"
              value={formik.values.name}
              onChange={formik.handleChange}
              name="name"
              isRequired
              isInvalid={!!formik.errors.name}
              errorMessage={formik.errors.name}
            />
            <Textarea
              label="Mô Tả"
              placeholder="Nhập mô tả (tùy chọn)"
              value={formik.values.description}
              onChange={formik.handleChange}
              name="description"
              isInvalid={!!formik.errors.description}
              errorMessage={formik.errors.description}
            />
            {error && <p className="text-red-500">Lỗi: {error.message}</p>}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="solid" onPress={handleClose}>
              Hủy
            </Button>
            <Button
              color="success"
              variant="solid"
              onPress={() => formik.handleSubmit()}
              isLoading={isMutating || formik.isSubmitting}
              disabled={isMutating || formik.isSubmitting}
            >
              Tạo mới
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
    </>
  );
};

export default CreatePermissionModal;
