"use client";
import React, { useEffect } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

import { clearAuth } from "@/redux/slices";
import { RootState, store } from "@/redux/store";

import DefaultLogo from "../../../../public/images/gct.png";

interface SidebarServiceProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SidebarService = ({ isOpen = false, onClose }: SidebarServiceProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const authState = useSelector((state: RootState) => state.auth);
  const user = authState.data?.user;
  const email = user?.email;
  const fullName = user?.fullName;

  const allMenuItems = [
    {
      key: "/service",
      icon: "solar:home-bold-duotone",
      label: "Trang chủ",
      href: "/service",
    },
    {
      key: "/service/account",
      icon: "solar:users-group-two-rounded-bold-duotone",
      label: "Quản lí tài khoản",
      href: "/service/account",
      roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
    },
    {
      key: "/service/permission",
      icon: "solar:key-bold-duotone",
      label: "Quản lí quyền truy cập",
      href: "/service/permission",
      roles: ["ROLE_ADMIN"],
    },
    {
      key: "/service/warehouse",
      icon: "solar:box-bold-duotone",
      label: "Quản lí thiết bị",
      href: "/service/warehouse",
      roles: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_STAFF"],
    },
    {
      key: "/service/instrument",
      icon: "solar:test-tube-bold-duotone",
      label: "Quản lí thuốc thử",
      href: "/service/instrument",
      roles: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_STAFF"],
    },
    {
      key: "/service/patient",
      icon: "solar:heart-pulse-bold-duotone",
      label: "Quản lí bệnh nhân",
      href: "/service/patient",
      roles: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_DOCTOR"],
    },
    {
      key: "/service/test-order",
      icon: "solar:document-text-bold-duotone",
      label: "Quản lí đơn xét nghiệm",
      href: "/service/test-order",
    },
    {
      key: "/service/monitoring",
      icon: "solar:settings-bold-duotone",
      label: "Quản lí hệ thống",
      href: "/service/monitoring",
      roles: ["ROLE_ADMIN"],
    },
  ];

  const menuItems = allMenuItems.filter((item) => {
    if (item.roles) {
      return item.roles.includes(user?.role || "");
    }
    return true;
  });

  useEffect(() => {
    menuItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [router, menuItems]);

  const handleLogout = () => {
    Cookies.remove("auth-token", { path: "/" });
    store.dispatch(clearAuth());
    router.push("/signin");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleDropdownAction = (key: string) => {
    switch (key) {
      case "profile":
        handleProfile();
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <Card
        className={`w-80 min-h-[88vh] shadow-sm border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-[#1a263b] flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 lg:opacity-100 ${
          isOpen
            ? "fixed left-2 top-20 z-50 translate-x-0 opacity-100"
            : "fixed -translate-x-[calc(100%+1rem)] opacity-0 lg:relative lg:flex"
        }`}
      >
        {/* Close button for mobile */}
        {/* <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 z-10"
          aria-label="Close menu"
        >
          <Icon
            icon="solar:close-circle-bold"
            className="w-6 h-6 text-gray-700 dark:text-gray-300"
          />
        </button> */}

        <CardBody className="p-0 flex flex-col h-full">
          {/* Main content wrapper with flex-1 to push footer to bottom */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 flex-1">
              {/* Regular Menu Items */}
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={onClose}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ease-in-out rounded-md transform hover:scale-[1.02] active:scale-[0.98] ${
                        isActive
                          ? "bg-red-50 text-red-600 border-l-4 border-red-500 dark:bg-red-900/20 dark:text-red-400 shadow-sm"
                          : "text-gray-700 hover:bg-gray-100 hover:shadow-sm dark:text-gray-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      <Icon
                        icon={item.icon}
                        className="w-5 h-5 transition-transform duration-200"
                      />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* User Footer Section - Always at bottom */}
            <div className="mt-auto">
              <Divider />

              <div className="p-4">
                <Dropdown placement="top-end">
                  <DropdownTrigger>
                    <Button
                      variant="light"
                      className="w-full justify-start p-3 h-auto rounded-lg"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Avatar
                          src={DefaultLogo.src}
                          name={fullName || "User"}
                          size="sm"
                        />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {fullName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {email || "user@example.com"}
                          </p>
                        </div>
                        <Icon
                          icon="solar:alt-arrow-up-linear"
                          className="w-4 h-4 text-gray-400"
                        />
                      </div>
                    </Button>
                  </DropdownTrigger>

                  <DropdownMenu
                    onAction={(key) => handleDropdownAction(key as string)}
                  >
                    <DropdownItem
                      key="profile"
                      startContent={
                        <Icon icon="solar:user-bold" className="w-4 h-4" />
                      }
                    >
                      Hồ sơ của tôi
                    </DropdownItem>
                    <DropdownItem
                      key="logout"
                      color="danger"
                      startContent={
                        <Icon
                          icon="solar:logout-2-outline"
                          className="w-4 h-4"
                        />
                      }
                    >
                      Đăng xuất
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default SidebarService;
