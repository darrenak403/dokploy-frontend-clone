"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //googleLogin parameters
  const loginType = "google";
  const [googleLoading, setGoogleLoading] = useState(false);

  //loginFaceBook
  const facebookLoginType = "facebook";
  const [facebookLoading, setFacebookLoading] = useState(false);

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
            router.push("/");
          }, 1500);
        }
      } catch (error) {
        console.log(error);
        setAlertColor("danger");
        setAlertMessage("Đăng nhập thất bại. ");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 4000);
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

  useEffect(() => {
    const error = searchParams?.get("error");
    const message = searchParams?.get("message");

    if (error === "email_exists") {
      setAlertColor("danger");
      setAlertMessage(
        message ||
          "Email đã được sử dụng, vui lòng đăng nhập bằng tài khoản hiện có"
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } else if (error === "facebook_login_failed") {
      setAlertColor("danger");
      setAlertMessage("Đăng nhập Facebook thất bại");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    }
  }, [searchParams]);

  return (
    <div className="wrapper w-full max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:min-w-[30vw] min-h-[72vh] flex items-center justify-center dark:bg-slate-800 bg-background px-4 sm:px-6 md:px-8 py-8">
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

        <div className="image mb-2 flex items-center gap-2 w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px]">
          <Image
            src={AuthLogo}
            alt="Sign In"
            width={400}
            height={400}
            quality={100}
            className="w-full h-auto"
          />
        </div>

        <div className="flex items-center w-full max-w-[350px] sm:max-w-[450px] mt-6">
          <div className="flex-1 h-px bg-zinc-200" />
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        <form
          className="w-full max-w-[350px] sm:max-w-[500px] flex flex-col items-center justify-center gap-4 mt-6"
          onSubmit={formik.handleSubmit}
          noValidate
        >
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
              <div className="text-xs text-red-500">{formik.errors.email}</div>
            )}
          </div>

          <div className="w-full px-2 sm:px-4 relative">
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
                  color="#71717b"
                  icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              }
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-xs text-red-500">
                {formik.errors.password}
              </div>
            )}

            <div className="flex justify-end mt-2">
              <Link
                href="/forgot-password"
                className="text-red-400 font-medium text-xs hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>
          <div className="flex w-full items-center justify-center">
            <Button
              type="submit"
              className="w-full max-w-[300px] mt-2 bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold"
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:mt-6 sm:mt-4">
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
            <div className="relative w-full sm:w-auto hidden sm:block">
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
              <div className="absolute top-[-15px] right-[-10px] sm:right-[-20px]">
                <p className="text-[10px] border-[1px] rounded-2xl px-1 py-1 bg-zinc-100 dark:bg-slate-800 whitespace-nowrap">
                  tôi đã cố gắng hết sức
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Signin link */}
        <div className="w-full text-center mt-6 text-sm">
          <span className="text-zinc-500">Đã có tài khoản? </span>
          <Link
            href="/signup"
            className="text-red-400 font-medium hover:underline"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};
