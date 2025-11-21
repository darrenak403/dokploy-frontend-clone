"use client";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useSelector } from "react-redux";

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
  const [checking, setChecking] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkAuth = async () => {
      if (!authState._persist?.rehydrated) {
        return;
      }

      if (!authState.data?.accessToken) {
        router.push("/signin");
        setChecking(false);
        return;
      }

      if (authState.data?.accessToken && authState.data?.user?.role) {
        if (allowedRoles && allowedRoles.length > 0) {
          const userRole = authState.data.user.role;
          if (!allowedRoles.includes(userRole)) {
            router.push("/");
            setChecking(false);
            return;
          }
        }
        setChecking(false);
        return;
      }

      if (authState.data?.accessToken && !authState.data?.user?.role) {
        setChecking(false);
        return;
      }

      router.push("/signin");
      setChecking(false);
    };

    const timer = setTimeout(checkAuth, 200);
    return () => clearTimeout(timer);
  }, [isClient, authState, allowedRoles, router]);

  if (!isClient || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-2" />
          <p>Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
