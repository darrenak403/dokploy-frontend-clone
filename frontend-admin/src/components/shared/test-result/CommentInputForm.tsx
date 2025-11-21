import React, { useState } from "react";

import { Alert, Button, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { mutate } from "swr";
import * as Yup from "yup";

import { useFetchCreateCommentSwrSingleton } from "@/hook/singleton/swrs/comments/useFetchCreateCommentSwr";
import { CommentPayload } from "@/hook/singleton/swrs/comments/useFetchCreateCommentSwr";

interface CommentInputFormProps {
  testOrderId: number;
  testResultId: number;
  disabled?: boolean;
}

const validationCreateCommentSchema = Yup.object().shape({
  content: Yup.string().min(10, "Ghi chú phải có ít nhất 10 ký tự"),
});

const CommentInputForm: React.FC<CommentInputFormProps> = ({
  testOrderId,
  testResultId,
  disabled = false,
}) => {
  const { createComment, isMutating } = useFetchCreateCommentSwrSingleton()!;
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [showAlert, setShowAlert] = useState(false);

  const formik = useFormik<{ content: string }>({
    initialValues: {
      content: "",
    },
    validationSchema: validationCreateCommentSchema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      if (!testResultId) {
        setShowAlert(true);
        setAlertColor("danger");
        setAlertMessage("ID đơn hàng không hợp lệ.");

        // Auto hide after 3 seconds
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }

      try {
        const payload: CommentPayload = {
          testResultId: testResultId,
          content: values.content.trim(),
        };

        const response = await createComment(payload);

        if (response?.data) {
          await mutate(`/orders/${testOrderId}`);
        }
        setShowAlert(true);
        setAlertColor("success");
        setAlertMessage("Ghi chú đã được thêm thành công!");

        // Auto hide after 3 seconds
        setTimeout(() => setShowAlert(false), 3000);

        resetForm();
      } catch (error) {
        console.error("Error creating comment:", error);

        setShowAlert(true);
        setAlertColor("danger");
        setAlertMessage("Không thể thêm ghi chú. Vui lòng thử lại.");

        // Auto hide after 3 seconds
        setTimeout(() => setShowAlert(false), 3000);

        if (error instanceof Error) {
          setFieldError("content", error.message);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full">
      <AnimatePresence>
        {showAlert && alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="fixed top-18 right-4 z-[999] w-auto max-w-[90vw] sm:max-w-sm"
          >
            <Alert
              color={alertColor}
              title={alertMessage}
              variant="flat"
              className="shadow-lg bg-background border border-gray-200 dark:border-gray-700"
              onClose={() => setShowAlert(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={formik.handleSubmit} className="flex gap-3 items-end">
        <Textarea
          name="content"
          placeholder="Nhập ghi chú của bạn..."
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          minRows={1}
          maxRows={8}
          isInvalid={formik.touched.content && !!formik.errors.content}
          errorMessage={formik.touched.content ? formik.errors.content : ""}
          disabled={isMutating || formik.isSubmitting || disabled}
          classNames={{
            base: "w-full",
            input: "bg-background text-foreground placeholder:text-gray-500",
            inputWrapper:
              "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
            label: "text-foreground",
            description: "text-gray-500 dark:text-gray-400",
          }}
        />

        <Button
          type="submit"
          variant="bordered"
          isLoading={isMutating || formik.isSubmitting}
          disabled={isMutating || formik.isSubmitting || disabled}
          className="bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent min-w-[40px] px-0 border-none"
        >
          {isMutating || formik.isSubmitting ? (
            ""
          ) : (
            <Icon
              icon="material-symbols-light:send-rounded"
              className="h-24 w-24"
            />
          )}
        </Button>
      </form>
    </div>
  );
};

export default CommentInputForm;
