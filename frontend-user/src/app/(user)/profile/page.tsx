"use client";
import React, { useEffect, useState } from "react";

import { Alert } from "@heroui/react";
import { useSelector } from "react-redux";

import { RootState } from "@/redux/store";

import { AccountInfo } from "@/components/shared/profile/AccountInfo";
import { IdentifyNumber } from "@/components/shared/profile/IdentifyNumber";
import ProfileStat from "@/components/shared/profile/ProfileStat";

export default function ProfilePage() {
  const authState = useSelector((state: RootState) => state.auth);
  const user = authState.data?.user;
  const [showCornerAlert, setShowCornerAlert] = useState(false);

  useEffect(() => {
    if (!user) return setShowCornerAlert(false);
    const missing = !user.email || !user.phone || !user.address || !user.gender;
    setShowCornerAlert(!!missing);
  }, [user]);

  return (
    <div className="max-w-screen mx-auto h-full min-h-0 flex flex-col">
      {showCornerAlert && (
        <div className="fixed top-4 right-4 z-50 w-64 sm:w-80">
          <Alert color="danger" className="text-xs sm:text-sm">
            Vui lòng hoàn tất thông tin hồ sơ trước khi sử dụng dịch vụ.
          </Alert>
        </div>
      )}
      <div className="w-full mx-auto bg-[var(--bg-pale)] opacity-80 p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8 rounded-lg cursor-pointer transform transition-all duration-500 ease-out hover:opacity-100 hover:-translate-y-1 hover:scale-101 shadow-zinc-100 dark:shadow-zinc-800 hover:shadow-lg active:scale-100 active:translate-y-0">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold dark:text-white text-center">
          Thông tin tài khoản
        </h2>
      </div>
      <div className="mb-4 sm:mb-6 md:mb-8">
        <ProfileStat />
      </div>
      <div className="mb-4 sm:mb-6 md:mb-8">
        <AccountInfo />
      </div>
      <div className="mb-4 sm:mb-6 md:mb-8">
        <IdentifyNumber />
      </div>
    </div>
  );
}
