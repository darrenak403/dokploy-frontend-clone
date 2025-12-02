"use client";
import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Alert, Button, Input } from "@heroui/react";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import * as Yup from "yup";

import { postFetcher } from "@/libs/fetcher";

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  email: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email là bắt buộc")
    .email("Định dạng email không hợp lệ"),
});

const ForgotPassword = () => {
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const response = await postFetcher<
          ForgotPasswordResponse,
          ForgotPasswordRequest
        >("/auth/password/forgot", {
          arg: {
            email: values.email,
          },
        });

        if (response.success) {
          setAlertColor("success");
          setAlertMessage("OTP đã được gửi đến email của bạn!");
          setShowAlert(true);

          setTimeout(() => {
            setShowAlert(false);
            // Chuyển đến trang reset với email
            router.push(
              `/forgot-password/reset?email=${encodeURIComponent(values.email)}`
            );
          }, 2000);
        } else {
          throw new Error(response.message || "Failed to send OTP");
        }
      } catch (error) {
        setAlertColor("danger");
        setAlertMessage(
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra. Vui lòng thử lại"
        );
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 4000);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="wrapper w-full max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:min-w-[30vw] min-h-[72vh] flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.15)] dark:shadow-[0_0_10px_rgba(255,255,255,0.1)] rounded-[20px] dark:bg-slate-800 bg-white px-4 sm:px-6 md:px-8 py-8">
      <div className="container flex flex-col items-center justify-center w-full">
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="fixed top-4 right-4 z-[999] w-auto max-w-[calc(100vw-2rem)] sm:max-w-sm"
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

        {/* Logo */}
        <div className="image mb-6 flex items-center gap-2 w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px]">
          <Image
            src="/images/AuthLogo.svg"
            alt="Forgot Password"
            width={400}
            height={100}
            quality={100}
            className="w-full h-auto"
          />
        </div>

        <div className="flex items-center w-full max-w-[300px] sm:max-w-[350px] mb-6">
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
        </div>

        {/* Form */}
        <form
          className="w-full max-w-[350px] sm:max-w-[400px] flex flex-col gap-6"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div className="w-full">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Nhập email của bạn"
              value={formik.values.email}
              onValueChange={(value) => formik.setFieldValue("email", value)}
              isInvalid={!!(formik.touched.email && formik.errors.email)}
              onBlur={() => formik.setFieldTouched("email", true)}
              disabled={loading}
              className="w-full"
              classNames={{
                input: "bg-white dark:bg-slate-600 text-foreground",
                inputWrapper:
                  "border border-gray-200 dark:border-gray-700 dark:bg-slate-600",
                label: "text-foreground",
              }}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-xs text-red-500 mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center w-full">
            <Button
              type="submit"
              className="w-full max-w-[300px] bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold"
              disabled={loading}
              isLoading={loading}
              isDisabled={!formik.isValid || !formik.values.email}
            >
              {loading ? "Đang gửi..." : "Gửi mã OTP"}
            </Button>
          </div>
        </form>

        {/* Back to login link */}
        <div className="w-full text-center mt-6 text-sm">
          <span className="text-zinc-500">Nhớ mật khẩu? </span>
          <Link
            href="/signin"
            className="text-red-400 font-medium hover:underline"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
