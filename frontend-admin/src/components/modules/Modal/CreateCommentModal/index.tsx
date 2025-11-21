"use client";
import React from "react";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { mutate } from "swr";
import * as Yup from "yup";

import { useCreateCommentDiscloresureSingleton } from "@/hook/singleton/discloresures/comment/useCreateCommentDiscloresure";
import { useFetchCreateCommentSwrSingleton } from "@/hook/singleton/swrs/comments/useFetchCreateCommentSwr";
import { CommentPayload } from "@/hook/singleton/swrs/comments/useFetchCreateCommentSwr";

// Validation schema
const validationCreateCommentSchema = Yup.object().shape({
  content: Yup.string()
    .min(10, "Ghi chú phải có ít nhất 10 ký tự")
    .required("Vui lòng nhập nội dung ghi chú"),
});

export default function CreateCommentModal() {
  const { isOpen, onOpenChange, onClose, testOrderId } =
    useCreateCommentDiscloresureSingleton();

  const { createComment, isMutating, error } =
    useFetchCreateCommentSwrSingleton()!;

  const formik = useFormik<{ content: string }>({
    initialValues: {
      content: "",
    },
    validationSchema: validationCreateCommentSchema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      if (!testOrderId) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không tìm thấy mã đơn xét nghiệm",
        });
        return;
      }

      try {
        // Show loading
        Swal.fire({
          title: "Đang lưu...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const payload: CommentPayload = {
          testResultId: Number(testOrderId),
          content: values.content.trim(),
        };

        const response = await createComment(payload);

        if (response?.data) {
          await mutate(`/orders/${testOrderId}`);
        }

        // Success
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Ghi chú đã được thêm",
          timer: 2000,
          showConfirmButton: false,
        });

        resetForm();
        onClose();
      } catch (error) {
        console.error("Error creating comment:", error);

        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể thêm ghi chú. Vui lòng thử lại.",
        });

        if (error instanceof Error) {
          setFieldError("content", error.message);
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
              <Icon icon="mdi:note-edit" className="h-5 w-5 text-coral-500" />
              <span className="text-foreground">Thêm ghi chú</span>
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
                      Lỗi thêm ghi chú: {error.message || "Có gì đó không đúng"}
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <Textarea
                  name="content"
                  label="Nội dung ghi chú"
                  placeholder="Nhập ghi chú của bạn..."
                  value={formik.values.content}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.content && !!formik.errors.content}
                  errorMessage={
                    formik.touched.content ? formik.errors.content : ""
                  }
                  minRows={5}
                  maxRows={10}
                  description="Ghi chú sẽ được hiển thị trong kết quả xét nghiệm"
                  disabled={isMutating || formik.isSubmitting}
                  classNames={{
                    base: "w-full",
                    input:
                      "bg-background text-foreground placeholder:text-gray-500 resize-y",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                    description: "text-gray-500 dark:text-gray-400",
                  }}
                  startContent={
                    <Icon
                      icon="mdi:note-text"
                      className="text-gray-500 mt-[3px]"
                    />
                  }
                />

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:information" className="w-4 h-4" />
                    <span>Ghi chú tối thiểu 10 ký tự</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Số ký tự: {formik.values.content.length}</span>
                    <span
                      className={
                        formik.values.content.trim().length >= 10
                          ? "text-green-600"
                          : "text-orange-500"
                      }
                    >
                      {formik.values.content.trim().length >= 10
                        ? "✓ Hợp lệ"
                        : "⚠ Chưa đủ"}
                    </span>
                  </div>
                </div>
              </form>
            </ModalBody>

            <ModalFooter className="bg-background">
              <Button
                variant="bordered"
                onPress={handleClose}
                disabled={isMutating || formik.isSubmitting}
                className="text-red-600 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                startContent={<Icon icon="mdi:close" className="h-4 w-4" />}
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
                  ? "Đang lưu ghi chú..."
                  : "Lưu ghi chú"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
