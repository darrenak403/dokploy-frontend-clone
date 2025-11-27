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

import { useFetchRegisterSwrSingleton } from "@/hook/singleton/swrs/auth/useFetchRegisterSwr";

import { encryptValue } from "@/modules/encrypt";

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
        const encryptedPassword = encryptValue(values.password ?? "");
        const result = await register({
          email: values.email,
          password: encryptedPassword,
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
          }, 1500);
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

  return (
    <div className="wrapper min-w-[30vw] min-h-[75vh] flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.15)] rounded-[20px]">
      <div className="container flex flex-col items-center justify-center bg-white">
        {/* Alert */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="fixed top-4 right-4 z-[999] w-auto max-w-sm"
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
        <div className="image flex items-center gap-2">
          <Image src={AuthLogo} alt="Sign Up" width={400} quality={100} />
        </div>

        {/* Divider */}
        <div className="flex items-center w-[450px] mt-8">
          <div className="flex-1 h-px bg-zinc-200" />
          <span className="mx-2 text-xs text-zinc-400">or</span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        {/* Form */}
        <form
          className="min-w-[400px] flex flex-col gap-4 mt-6"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div>
            <Input
              label="Full Name"
              name="fullName"
              type="text"
              value={formik.values.fullName}
              onValueChange={(value) => formik.setFieldValue("fullName", value)}
              isInvalid={!!(formik.touched.fullName && formik.errors.fullName)}
              onBlur={() => formik.setFieldTouched("fullName", true)}
              disabled={loading}
              className="w-full"
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <div className="text-xs text-red-500 mt-1">
                {formik.errors.fullName}
              </div>
            )}
          </div>
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
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-xs text-red-500 mt-1">
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
              endContent={
                <Icon
                  icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                  className="cursor-pointer absolute right-4 top-6"
                  onClick={() => setShowPassword(!showPassword)}
                />
              }
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-xs text-red-500 mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>
          <div>
            <Input
              label="Confirm password"
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
              className="w-full relative"
              endContent={
                <Icon
                  icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"}
                  className="cursor-pointer absolute right-4 top-6"
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
          <div className="flex items-center justify-center">
            <Button
              type="submit"
              isLoading={formik.isSubmitting}
              isDisabled={
                !formik.isValid ||
                !formik.values.email ||
                !formik.values.password ||
                !formik.values.confirmPassword
              }
              onPress={() => {
                formik.handleSubmit();
              }}
              className="w-[300px] mt-2 bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-4">
            {/* Login google button */}
            <div className="mt-8">
              <Button
                variant="bordered"
                className="flex items-center justify-center gap-2 w-full px-5 py-1 rounded-[8px] border border-zinc-200 hover:bg-zinc-100 "
              >
                <div className="flex items-center gap-2">
                  <Icon icon="flat-color-icons:google" width="25" height="25" />
                  <p>Login with Google</p>
                </div>
              </Button>
            </div>
            {/* Login google button */}
            <div className="mt-8">
              <Button
                variant="bordered"
                className="flex items-center justify-center gap-2 w-full px-5 py-1 rounded-[8px] border border-zinc-200 hover:bg-zinc-100 "
              >
                <div className="flex items-center gap-2">
                  <Icon icon="logos:facebook" width="25" height="25" />
                  <p>Login with Facebook</p>
                </div>
              </Button>
            </div>
          </div>
        </form>

        {/* Signin link */}
        <div className="w-full text-center mt-6 text-sm">
          <span className="text-zinc-500">Already have an account? </span>
          <Link
            href="/signin"
            className="text-red-500 font-medium hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
