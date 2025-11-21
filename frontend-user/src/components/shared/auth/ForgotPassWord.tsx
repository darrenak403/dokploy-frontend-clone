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
    <div className="wrapper min-w-[30vw] min-h-[72vh] flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.15)] rounded-[20px]">
      <div className="container flex flex-col items-center justify-center bg-white p-8">
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="fixed top-16 right-0 z-999 w-auto max-w-sm"
            >
              <Alert color={alertColor} title={alertMessage} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logo */}
        <div className="image mb-6 flex items-center gap-2 mr-10">
          <Image
            src="/images/AuthLogo.svg"
            alt="Forgot Password"
            width={400}
            height={100}
            quality={100}
          />
        </div>

        <div className="flex items-center w-[350px] mb-6">
          <div className="flex-1 h-px bg-zinc-200" />
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        {/* Form */}
        <form
          className="min-w-[400px] flex flex-col gap-6"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div>
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
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-xs text-red-500 mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold"
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
