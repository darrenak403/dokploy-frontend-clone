"use client";
import React from "react";
import { useCallback, useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Alert, Button, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch } from "react-redux";
import useSWR from "swr";

import { fetcher } from "@/libs/fetcher";

import { setAuth } from "@/redux/slices/authSlice";

import AuthLogo from "../../../../public/images/AuthLogo.svg";

const SpinnerGoogleCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const code = searchParams?.get("code") ?? null;

  // Alert states
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState<
    "default" | "primary" | "secondary" | "success" | "warning" | "danger"
  >("default");

  // Function to show alert
  const displayAlert = useCallback(
    (
      message: string,
      color:
        | "default"
        | "primary"
        | "secondary"
        | "success"
        | "warning"
        | "danger" = "default",
      duration: number = 4000
    ) => {
      setAlertMessage(message);
      setAlertColor(color);
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, duration);
    },
    []
  );

  // build full backend url; encode code because searchParams.get returns decoded value
  const base = "https://lab.dupssapp.id.vn/api";
  const apiUrl = code
    ? `${base}/iam/auth/google/social/callback?code=${encodeURIComponent(
        code
      )}&loginType=google`
    : null;

  const { data, error } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (!apiUrl) {
      displayAlert("Không tìm thấy mã xác thực từ Google", "danger");
      setTimeout(() => router.replace("/signin?error=no_code"), 2000);
      return;
    }
    if (error) {
      console.error("Google callback error:", error);
      displayAlert("Đăng nhập Google thất bại. Vui lòng thử lại!", "danger");
      setTimeout(
        () => router.replace("/signin?error=google_login_failed"),
        2000
      );
    }
    if (data) {
      try {
        const payload = data as {
          status: number;
          message: string | null;
          data: {
            accessToken: string;
            refreshToken: string;
            user: {
              id: number;
              email: string;
              fullName: string;
              role: string;
              address: string | null;
              gender: string | null;
              dateOfBirth: string | null;
              phone: string | null;
              avatarUrl: string | null;
            };
          } | null;
        };
        if (payload?.status === 200 && payload.data) {
          const result = payload.data;
          displayAlert("Đăng nhập thành công! Đang chuyển hướng...", "success");
          dispatch(
            setAuth({
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
              id: result.user.id,
              role: result.user.role,
              email: result.user.email,
              fullName: result.user.fullName,
              address: result.user.address ?? undefined,
              gender: result.user.gender ?? undefined,
              dateOfBirth: result.user.dateOfBirth ?? undefined,
              phone: result.user.phone ?? undefined,
              avatarUrl: result.user.avatarUrl ?? undefined,
            })
          );
          setTimeout(() => router.replace("/"), 1500);
        } else {
          console.error("Callback payload invalid:", payload);
          displayAlert("Phản hồi từ server không hợp lệ", "danger");
          setTimeout(() => {
            router.replace("/signin?error=google_login_failed");
          }, 2000);
        }
      } catch (e) {
        console.error("Error processing callback data:", e);
        displayAlert("Có lỗi xảy ra khi xử lý dữ liệu", "danger");
        setTimeout(() => {
          router.replace("/signin?error=google_login_failed");
        }, 2000);
      }
    }
  }, [apiUrl, data, error, dispatch, router, displayAlert]);

  return (
    <div className="wrapper w-full max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:min-w-[30vw] min-h-[72vh] flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.15)] dark:shadow-[0_0_10px_rgba(255,255,255,0.1)] rounded-[20px] dark:bg-slate-800 bg-background px-4 sm:px-6 md:px-8 py-8">
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
        <div className="image mb-2 flex items-center gap-2 w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px]">
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
        <div className="flex items-center w-full max-w-[350px] sm:max-w-[450px] mt-6">
          <div className="flex-1 h-px bg-zinc-200" />
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        {/* Spinner */}
        <div className="my-25">
          <Spinner className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" />
        </div>

        {/* Login Button */}
        <div className="flex items-center justify-center w-full">
          <Button
            type="submit"
            className="w-full max-w-[300px] mt-2 bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold"
          >
            Đăng nhập
          </Button>
        </div>

        {/* Social Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full">
          {/* Login google button */}
          <Button
            variant="bordered"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-8 py-1 rounded-[8px] border border-zinc-200 hover:bg-zinc-300 dark:hover:bg-slate-700"
          >
            <div className="flex items-center gap-2 w-full sm:w-[180px]">
              <Icon icon="logos:google-icon" width="25" height="25" />
              <p className="text-xs sm:text-sm">Đăng nhập bằng Google</p>
            </div>
          </Button>

          {/* Login facebook button */}
          <div className="relative w-full sm:w-auto">
            <Button
              variant="bordered"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-5 py-1 rounded-[8px] border border-zinc-200 hover:bg-zinc-300 dark:hover:bg-slate-700"
            >
              <div className="flex items-center gap-2 w-full sm:w-[180px]">
                <Icon icon="logos:facebook" width="25" height="25" />
                <p className="text-xs sm:text-sm">Đăng nhập bằng Facebook</p>
              </div>
            </Button>
            <div className="absolute top-[-15px] right-[-10px] sm:right-[-20px] hidden sm:block">
              <p className="text-[10px] border-[1px] rounded-2xl px-1 py-1 bg-zinc-100 dark:bg-slate-800 whitespace-nowrap">
                bạn tôi đã cố gắng hết sức
              </p>
            </div>
          </div>
        </div>

        {/* Signup link */}
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

export default SpinnerGoogleCallback;
