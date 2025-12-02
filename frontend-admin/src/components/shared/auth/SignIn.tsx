"use client";
import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useFetchLoginSwrSingleton } from "@/hook";
import { Alert, Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import * as Yup from "yup";

import { SignInFormValues } from "@/types/auth";

import { axiosNoAuth } from "@/libs/fetcher";

import { encryptValue } from "@/modules/encrypt";

import AuthLogo from "../../../../public/images/AuthLogo.svg";

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Must be at least 6 characters"),
});

export const SignIn = () => {
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //googleLogin parameters
  const loginType = "google";
  const [googleLoading, setGoogleLoading] = useState(false);

  //swr
  const { login, loading } = useFetchLoginSwrSingleton();

  const formik = useFormik<SignInFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const encryptedPassword = encryptValue(values.password ?? "");
        const result = await login({
          email: values.email,
          password: encryptedPassword,
        });

        if (result.status === 201 || result.status === 200) {
          // Lưu token vào Cookie
          if (result.data.accessToken) {
            // Lưu token với thời gian hết hạn 7 ngày
            Cookies.set("auth-token", result.data.accessToken, {
              expires: 7, // 7 ngày
              secure: process.env.NODE_ENV === "production", // Chỉ https trong production
              sameSite: "strict", // Bảo mật CSRF
              path: "/", // Available toàn bộ app
            });
          }

          setAlertColor("success");
          setAlertMessage("Đăng nhập thành công!");
          setShowAlert(true);

          setTimeout(() => {
            setShowAlert(false);
            router.push("/service");
          }, 1500);
        }
      } catch (error) {
        console.log(error);
        setAlertColor("danger");
        setAlertMessage("Đăng nhập thất bại. ");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 1500);
      } finally {
        formik.setSubmitting(false);
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
        // Chuyển tới trang callback để xử lý tiếp tục
        window.location.href = response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to get Google OAuth URL"
        );
      }
    } catch (error) {
      setAlertColor("danger");
      setAlertMessage(
        error instanceof Error ? error.message : "Google login failed"
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 1000);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="wrapper min-w-[90vw] sm:min-w-[400px] md:min-w-[500px] lg:min-w-[600px] min-h-[72vh] flex items-center justify-center dark:bg-slate-800 bg-background p-4 sm:p-6 md:p-8">
      <div className="container flex flex-col items-center justify-center text-foreground w-full max-w-[500px]">
        {/* Alert */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="fixed top-4 right-4 z-[999] w-auto max-w-[90vw] sm:max-w-sm"
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

        {/* Logo */}
        <div className="image mb-2 flex items-center gap-2 w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px]">
          <Image
            src={AuthLogo}
            alt="Sign In"
            width={400}
            height={100}
            quality={100}
            className="w-full h-auto"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center w-full max-w-[350px] sm:max-w-[400px] md:max-w-[450px] mt-6">
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
          <span className="mx-2 text-xs text-zinc-400 dark:text-zinc-500">
            or
          </span>
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
        </div>

        {/* Form */}
        <form
          className="w-full max-w-[350px] sm:max-w-[450px] flex flex-col gap-4 mt-8"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div>
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
              <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>
          <div>
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onValueChange={(value) => formik.setFieldValue("password", value)}
              isInvalid={!!(formik.touched.password && formik.errors.password)}
              onBlur={() => formik.setFieldTouched("password", true)}
              disabled={loading}
              className="w-full relative"
              classNames={{
                input: "bg-white dark:bg-slate-600 text-foreground ",
                inputWrapper:
                  "border border-gray-200 dark:border-gray-700 dark:bg-slate-600",
                label: "text-foreground",
              }}
              endContent={
                <Icon
                  className="text-gray-500 dark:text-gray-400 cursor-pointer absolute right-4 top-6"
                  icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                  onClick={() => setShowPassword(!showPassword)}
                />
              }
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>
          <div className="flex items-center justify-center">
            <Button
              type="submit"
              className="w-full sm:w-[300px] mt-2 font-semibold"
              style={{
                background:
                  "linear-gradient(90deg, var(--coral-400), var(--coral-500))",
                color: "#ffffff",
              }}
              disabled={loading}
              isLoading={formik.isSubmitting}
              isDisabled={
                !formik.isValid ||
                !formik.values.email ||
                !formik.values.password
              }
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Login google button */}
            <div className="mt-8 relative w-full sm:w-auto">
              <Button
                variant="bordered"
                className="flex items-center justify-center gap-2 w-full px-4 sm:px-8 py-1 rounded-[8px] border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:bg-slate-700 text-foreground"
                onPress={handleGoogleLogin}
                disabled={googleLoading}
              >
                <div className="flex items-center gap-2 min-w-[160px] sm:w-[180px] justify-center">
                  <Icon icon="logos:google-icon" width="25" height="25" />
                  <p className="text-foreground text-xs sm:text-sm">
                    Đăng nhập bằng Google
                  </p>
                </div>
              </Button>
              <div className="absolute top-[-15px] right-[-10px]">
                <p className="text-[10px] border-[1px] rounded-2xl px-1 py-1 bg-zinc-100 dark:bg-zinc-800 text-foreground border-zinc-200 dark:border-zinc-700 whitespace-nowrap">
                  Client-Facing
                </p>
              </div>
            </div>
            {/* Login facebook button */}
            <div className="mt-8 relative w-full sm:w-auto hidden sm:block">
              <div>
                <Button
                  variant="bordered"
                  className="flex items-center justify-center gap-2 w-full px-4 sm:px-5 py-1 rounded-[8px] border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:bg-slate-700 text-foreground"
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Icon icon="logos:facebook" width="25" height="25" />
                    <p className="text-foreground text-xs sm:text-sm">
                      Đăng nhập bằng Facebook
                    </p>
                  </div>
                </Button>
              </div>
              <div className="absolute top-[-15px] right-[-10px]">
                <p className="text-[10px] border-[1px] rounded-2xl px-1 py-1 bg-zinc-100 dark:bg-zinc-800 text-foreground border-zinc-200 dark:border-zinc-700 whitespace-nowrap">
                  Client-Facing
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
