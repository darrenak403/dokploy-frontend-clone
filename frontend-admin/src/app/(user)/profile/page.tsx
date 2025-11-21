"use client";
import React from "react";

import { AccountInfo } from "@/components/shared/profile/AccountInfo";
import ProfileStat from "@/components/shared/profile/ProfileStat";

export default function ProfilePage() {
  return (
    <div className="max-w-screen mx-auto h-full min-h-0 flex flex-col">
      <div className="w-full mx-auto bg-[var(--bg-pale)] opacity-80 p-4 mb-8 rounded-lg cursor-pointer transform transition-all duration-500 ease-out hover:opacity-100 hover:-translate-y-1 hover:scale-101 shadow-zinc-100 dark:shadow-zinc-800 hover:shadow-lg active:scale-100 active:translate-y-0">
        <h2 className="text-2xl font-bold dark:text-white text-center">
          Thông tin tài khoản
        </h2>
      </div>
      <div className="mb-8">
        <ProfileStat />
      </div>
      <div className="mb-8">
        <AccountInfo />
      </div>
    </div>
  );
}
