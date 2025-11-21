"use client";
import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Alert, Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import * as Yup from "yup";

import { SignUpFormValues } from "@/types/auth";
import { hashPasswordSHA256 } from "@/types/hashPassword";

import { axiosNoAuth } from "@/libs/fetcher";

import { useFetchRegisterSwrSingleton } from "@/hook/singleton/swrs/auth/useFetchRegisterSwr";

import AuthLogo from "../../../../public/images/AuthLogo.svg";

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Must be at least 8 characters")
    .matches(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
    .matches(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
    .matches(/[0-9]/, "Mật khẩu phải có ít nhất 1 số"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export const SignUp = () => {
  const router = useRouter();
  const { register, loading } = useFetchRegisterSwrSingleton();
  const [showAlert, setShowAlert] = useState(false);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //googleLogin parameters
  const loginType = "google";
  const [googleLoading, setGoogleLoading] = useState(false);

  //loginFaceBook
  const facebookLoginType = "facebook";
  const [facebookLoading, setFacebookLoading] = useState(false);

  const formik = useFormik<SignUpFormValues>({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const hashedPassword = await hashPasswordSHA256(values.password);
        const result = await register({
          email: values.email,
          password: hashedPassword,
          fullName: values.fullName,
        });
        if (result.status === 201 || result.status === 200) {
          setAlertColor("success");
          setAlertMessage(
            "Đăng kí thành công! Chuyển hướng tới trang đăng nhập..."
          );
          setShowAlert(true);
          setTimeout(() => {
            router.push("/signin");
          }, 2500);
        } else {
          setAlertColor("danger");
          setAlertMessage(result?.message);
          setShowAlert(true);
        }
      } catch (error: unknown) {
        setAlertMessage(error instanceof Error ? error.message : String(error));
        setAlertColor("danger");
        setShowAlert(true);
      }
    },
  });

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      const response = await axiosNoAuth.get<{
        status: number;
        message: string | null;
        data: string;
      }>(`/auth/google/social?loginType=${encodeURIComponent(loginType)}`);

      if (
        (response.status === 200 || response.status === 201) &&
        response.data
      ) {
        window.location.href = response.data?.data;
      } else {
        throw new Error(
          response.data.message || "thất bại khi lấy URL OAuth của Google"
        );
      }
    } catch (error) {
      setAlertColor("danger");
      setAlertMessage(
        error instanceof Error ? error.message : "thất bại khi đăng nhập Google"
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 1000);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLoginFacebook = async () => {
    try {
      setFacebookLoading(true);

      const response = await axiosNoAuth.get<{
        status: number;
        message: string | null;
        data: string;
      }>(
        `/auth/google/social?loginType=${encodeURIComponent(facebookLoginType)}`
      );

      if (
        (response.status === 200 || response.status === 201) &&
        response.data
      ) {
        window.location.href = response.data?.data;
      } else {
        throw new Error(
          response.data.data || "thất bại khi lấy URL OAuth của FaceBook"
        );
      }
    } catch (error) {
      setAlertColor("danger");
      setAlertMessage(
        error instanceof Error
          ? error.message
          : "thất bại khi đăng nhập FaceBook"
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 1000);
    } finally {
      setFacebookLoading(false);
    }
  };

  return (
    <div className="wrapper w-full max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:min-w-[30vw] min-h-[75vh] flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.15)] dark:shadow-[0_0_10px_rgba(255,255,255,0.1)] rounded-[20px] dark:bg-slate-800 bg-background px-4 sm:px-6 md:px-8 py-8">
      <div className="container flex flex-col items-center justify-center w-full">
        {/* Alert */}
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
        <div className="image flex items-center gap-2 w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px]">
          <Image
            src={AuthLogo}
            alt="Sign Up"
            width={400}
            height={400}
            quality={100}
            className="w-full h-auto"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center w-full max-w-[350px] sm:max-w-[450px] mt-4">
          <div className="flex-1 h-px bg-zinc-200" />
          <span className="mx-2 text-xs text-zinc-400">or</span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        {/* Form */}
        <form
          className="w-full max-w-[350px] sm:max-w-[500px] flex flex-col items-center justify-center gap-4 mt-6"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          {/* Full Name */}
          <div className="w-full px-2 sm:px-4">
            <Input
              label="Họ và tên"
              name="fullName"
              type="text"
              value={formik.values.fullName}
              onValueChange={(value) => formik.setFieldValue("fullName", value)}
              isInvalid={!!(formik.touched.fullName && formik.errors.fullName)}
              onBlur={() => formik.setFieldTouched("fullName", true)}
              disabled={loading}
              className="w-full"
              classNames={{
                input: "bg-white dark:bg-slate-600 text-foreground",
                inputWrapper:
                  "border border-gray-200 dark:border-gray-700 dark:bg-slate-600",
                label: "text-foreground",
              }}
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <div className="text-xs text-red-500 mt-1 ml-1">
                {formik.errors.fullName}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="w-full px-2 sm:px-4">
            <Input
              label="Email"
              name="email"
              type="email"
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
              <div className="text-xs text-red-500 mt-1 ml-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="w-full px-2 sm:px-4">
            <Input
              label="Mật khẩu"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onValueChange={(value) => formik.setFieldValue("password", value)}
              isInvalid={!!(formik.touched.password && formik.errors.password)}
              onBlur={() => formik.setFieldTouched("password", true)}
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
                  icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                  className="cursor-pointer text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                />
              }
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-xs text-red-500 mt-1 ml-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="w-full px-2 sm:px-4">
            <Input
              label="Xác nhận mật khẩu"
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
                  icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"}
                  className="cursor-pointer text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="text-xs text-red-500 mt-1 ml-1">
                  {formik.errors.confirmPassword}
                </div>
              )}
          </div>

          <div className="flex items-center justify-center w-full">
            <Button
              type="submit"
              isLoading={formik.isSubmitting}
              isDisabled={
                !formik.isValid ||
                !formik.values.email ||
                !formik.values.password ||
                !formik.values.confirmPassword
              }
              className="w-full max-w-[300px] mt-2 bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            {/* Login google button */}
            <Button
              variant="bordered"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-8 py-1 rounded-[8px] border border-zinc-200 hover:bg-zinc-300 dark:hover:bg-slate-700"
              onPress={handleGoogleLogin}
              disabled={googleLoading}
            >
              <div className="flex items-center gap-2 w-full sm:w-[200px]">
                <Icon icon="logos:google-icon" width="25" height="25" />
                <p className="text-xs sm:text-sm">Đăng nhập bằng Google</p>
              </div>
            </Button>

            {/* Login facebook button */}
            <div className="relative w-full sm:w-auto">
              <Button
                variant="bordered"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-5 py-1 rounded-[8px] border border-zinc-200 hover:bg-zinc-300 dark:hover:bg-slate-700"
                onPress={handleLoginFacebook}
                disabled={facebookLoading}
              >
                <div className="flex items-center gap-2 w-full sm:w-[200px]">
                  <Icon icon="logos:facebook" width="25" height="25" />
                  <p className="text-xs sm:text-sm">Đăng nhập bằng Facebook</p>
                </div>
              </Button>
              <div className="absolute top-[-15px] right-[-10px] sm:right-[-20px] hidden sm:block">
                <p className="text-[10px] border-[1px] rounded-2xl px-1 py-1 bg-zinc-100 dark:bg-slate-800 whitespace-nowrap">
                  tôi đã cố gắng hết sức
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Signin link */}
        <div className="w-full text-center mt-6 text-sm">
          <span className="text-zinc-500">Bạn đã có tài khoản? </span>
          <Link
            href="/signin"
            className="text-red-500 font-medium hover:underline"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};
