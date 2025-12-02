"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { InputOtp } from "@heroui/input-otp";
import { Alert, Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import * as Yup from "yup";

import { postFetcher } from "@/libs/fetcher";

import { encryptValue } from "@/modules/encrypt";

// Types
interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
  email: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  email: string;
}

const validationSchema = Yup.object({
  otp: Yup.string().required("OTP is required"),
  newPassword: Yup.string()
    .required("Mật khẩu mới là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  confirmPassword: Yup.string()
    .required("Xác nhận mật khẩu là bắt buộc")
    .oneOf([Yup.ref("newPassword")], "Mật khẩu không khớp"),
});

const Reset = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Countdown states
  const [countdown, setCountdown] = useState(59); // Start from 59 seconds
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const encryptedPassword = encryptValue(values.newPassword ?? "");

        const response = await postFetcher<
          ResetPasswordResponse,
          ResetPasswordRequest
        >("/auth/password/reset", {
          arg: {
            email: email,
            otp: values.otp,
            newPassword: encryptedPassword,
          },
        });

        if (response.success) {
          setAlertColor("success");
          setAlertMessage("Đặt lại mật khẩu thành công!");
          setShowAlert(true);

          setTimeout(() => {
            setShowAlert(false);
            router.push(
              "/signin?message=Mật khẩu đã được đặt lại. Vui lòng đăng nhập với mật khẩu mới"
            );
          }, 2000);
        } else {
          throw new Error(response.message || "Đặt mật khẩu thất bại");
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

  // Countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);

        if (countdown === 20) {
          setCanResend(true);
        }
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleResendOTP = async () => {
    try {
      setResendLoading(true);
      const response = await postFetcher<
        ForgotPasswordResponse,
        ForgotPasswordRequest
      >("/auth/password/forgot", {
        arg: {
          email: email,
        },
      });

      if (response.success) {
        setAlertColor("success");
        setAlertMessage("Mã OTP mới đã được gửi đến email của bạn!");
        setShowAlert(true);

        setCountdown(59);
        setCanResend(false);

        formik.setFieldValue("otp", "");

        setTimeout(() => setShowAlert(false), 3000);
      } else {
        throw new Error(response.message || "Thất bại khi gửi lại OTP");
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
      setResendLoading(false);
    }
  };

  useEffect(() => {
    if (!email) {
      router.push("/forgot-password");
    }
  }, [email, router]);

  if (!email) {
    return <div>Chuyển hướng...</div>;
  }

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

        <div className="image mb-6 flex items-center gap-2 w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px]">
          <Image
            src="/images/AuthLogo.svg"
            alt="Reset Password"
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

        <form
          className="w-full max-w-[350px] sm:max-w-[400px] flex flex-col gap-6"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          {/* OTP Input with Countdown */}
          <div className="flex flex-col items-center gap-4">
            <InputOtp
              length={4}
              value={formik.values.otp}
              onValueChange={(value) => formik.setFieldValue("otp", value)}
              onComplete={(value) => formik.setFieldValue("otp", value)}
              disabled={loading}
              variant="bordered"
              className="flex justify-center gap-3"
              classNames={{
                input: "text-center text-2xl font-bold text-gray-800",
                base: "gap-3",
              }}
            />

            {formik.touched.otp && formik.errors.otp && (
              <div className="text-xs text-red-500 text-center">
                {formik.errors.otp}
              </div>
            )}

            {/* Countdown and Resend Button */}
            <div className="flex flex-col items-center gap-2">
              {countdown > 0 && (
                <div className="text-sm text-gray-500">
                  Mã OTP hết hạn sau:{" "}
                  <span className="font-semibold text-red-500">
                    {formatTime(countdown)}
                  </span>
                </div>
              )}

              {canResend && (
                <Button
                  variant="light"
                  size="sm"
                  className="text-red-400 hover:text-red-500"
                  onPress={handleResendOTP}
                  isLoading={resendLoading}
                  disabled={resendLoading}
                >
                  {resendLoading ? "Đang gửi..." : "Gửi lại mã OTP"}
                </Button>
              )}
            </div>
          </div>

          <div className="w-full">
            <Input
              label="Mật khẩu mới"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              value={formik.values.newPassword}
              onValueChange={(value) =>
                formik.setFieldValue("newPassword", value)
              }
              isInvalid={
                !!(formik.touched.newPassword && formik.errors.newPassword)
              }
              onBlur={() => formik.setFieldTouched("newPassword", true)}
              disabled={loading}
              className="w-full"
              classNames={{
                input: "bg-white dark:bg-slate-600 text-foreground",
                inputWrapper:
                  "border border-gray-200 dark:border-gray-700 dark:bg-slate-600",
                label: "text-foreground",
              }}
              endContent={
                <Icon
                  color="#71717b"
                  icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              }
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <div className="text-xs text-red-500 mt-1">
                {formik.errors.newPassword}
              </div>
            )}
          </div>

          <div className="w-full">
            <Input
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formik.values.confirmPassword}
              onValueChange={(value) =>
                formik.setFieldValue("confirmPassword", value)
              }
              isInvalid={
                !!(
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                )
              }
              onBlur={() => formik.setFieldTouched("confirmPassword", true)}
              disabled={loading}
              className="w-full"
              classNames={{
                input: "bg-white dark:bg-slate-600 text-foreground",
                inputWrapper:
                  "border border-gray-200 dark:border-gray-700 dark:bg-slate-600",
                label: "text-foreground",
              }}
              endContent={
                <Icon
                  color="#71717b"
                  icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"}
                  className="cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="text-xs text-red-500 mt-1">
                  {formik.errors.confirmPassword}
                </div>
              )}
          </div>

          <div className="flex items-center justify-center w-full">
            <Button
              type="submit"
              className="w-full max-w-[300px] bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold"
              disabled={loading}
              isLoading={loading}
              isDisabled={
                !formik.isValid ||
                !formik.values.otp ||
                !formik.values.newPassword ||
                !formik.values.confirmPassword
              }
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>
          </div>
        </form>

        {/* Back to login link */}
        <div className="w-full text-center mt-6 text-sm">
          <span className="text-zinc-500">Quay lại </span>
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

export default Reset;
