"use client";
import React from "react";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";

import { RootState } from "@/redux/store";

import { useCreateUserDiscloresureSingleton } from "@/hook/singleton/discloresures/account/useCreateUserDisclosure";

const MainTitle = () => {
  const { onOpen } = useCreateUserDiscloresureSingleton();
  const authState = useSelector((state: RootState) => state.auth);
  const role = authState.data?.user?.role;
  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-700 bg-transparent">
      <div className="max-w-screen-xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Quản lí tài khoản
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            Quản lý hồ sơ và thông tin tài khoản của người dùng
          </p>
        </div>

        {role !== "ROLE_STAFF" ? (
          <Button
            type="button"
            aria-label="Add User"
            onPress={onOpen}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm
                     bg-zinc-800 text-white hover:opacity-95
                     dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-coral-500"
          >
            <Icon icon="solar:user-plus-bold-duotone" className="w-4 h-4" />
            <span className="text-sm font-medium">Thêm người dùng</span>
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default MainTitle;
