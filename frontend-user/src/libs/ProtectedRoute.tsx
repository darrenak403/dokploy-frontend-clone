"use client";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/redux/store";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const authState = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkAuth = async () => {
      if (!authState.data?.accessToken && !authState.data?.refreshToken) {
        router.push("/signin");
        return;
      }

      if (authState.data.accessToken && authState.data?.user?.role) {
        if (allowedRoles) {
          const userRole = authState.data.user.role;
          if (!allowedRoles.includes(userRole)) {
            router.push("/");
            return;
          }
        }
        setChecking(false);
        return;
      }

      if (authState.data.accessToken) {
        setChecking(false);
        return;
      }

      if (!authState.data.accessToken && authState.data.refreshToken) {
        setChecking(false);
        return;
      }
      router.push("/signin");
    };

    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [isClient, authState, allowedRoles, dispatch, router]);

  if (!isClient || checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--background)" }}
        aria-live="polite"
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-8 w-8 border-2 border-transparent mx-auto mb-2"
            style={{ borderTopColor: "var(--coral-500)" }}
            role="status"
            aria-hidden="true"
          />
          <p style={{ color: "var(--foreground)" }}>
            Đang kiểm tra quyền truy cập...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
