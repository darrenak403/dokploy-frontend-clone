"use client";
import React from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

import { clearAuth } from "@/redux/slices";
import { RootState, store } from "@/redux/store";

import { ThemeToggle } from "@/components/modules/SwithTheme/theme-toggle";

import LabMS_Logo from "../../../../public/images/InjectionLogo.svg";
import DefaultLogo from "../../../../public/images/gct.png";

export const Header = () => {
  const router = useRouter();
  const authState = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!(
    authState.data?.accessToken || authState.data?.refreshToken
  );
  const user = authState.data?.user;
  const email = user?.email;
  const fullName = user?.fullName;
  const avatarUrl = user?.avatarUrl;

  const isProfileIncomplete =
    !user || !user.email || !user.phone || !user.address || !user.gender;

  const handleLogout = () => {
    Cookies.remove("auth-token", { path: "/" });
    store.dispatch(clearAuth());
    router.push("/signin");
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isProfileIncomplete) {
      e.preventDefault();
      router.push("/profile");
    }
  };

  return (
    <Navbar className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">
      <NavbarBrand className="flex items-center gap-2">
        {isLoggedIn && isProfileIncomplete ? (
          <div
            className="flex items-center gap-2 text-black-500 opacity-50 cursor-not-allowed"
            onClick={() => router.push("/profile")}
          >
            <Image
              src={LabMS_Logo}
              alt="Auth Image"
              width={50}
              quality={100}
              className="w-8 sm:w-10 md:w-12"
            />
            <p className="font-bold text-inherit text-sm sm:text-base md:text-lg">
              LabMS
            </p>
          </div>
        ) : (
          <Link href="/" className="flex items-center gap-2 text-black-500">
            <Image
              src={LabMS_Logo}
              alt="Auth Image"
              width={50}
              quality={100}
              className="w-8 sm:w-10 md:w-12"
            />
            <p className="font-bold text-inherit text-sm sm:text-base md:text-lg">
              LabMS
            </p>
          </Link>
        )}
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-3 md:gap-5" justify="center">
        <NavbarItem className="relative">
          <Link
            href="/service"
            prefetch={true}
            onMouseEnter={() => router.prefetch("/service")}
            onClick={(e) => handleLinkClick(e)}
            className={`font-[600] text-sm md:text-base lg:text-lg text-foreground hover:text-[var(--coral-600)] hover:font-bold transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] hover:after:scale-x-100 after:scale-x-0 after:w-full after:bg-red-200 after:transition-all after:duration-300 ${
              isProfileIncomplete
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : ""
            }`}
            aria-disabled={isProfileIncomplete}
          >
            Dịch vụ
          </Link>
        </NavbarItem>
        <NavbarItem className="relative">
          <Link
            href="/customers"
            prefetch={true}
            onMouseEnter={() => router.prefetch("/customers")}
            onClick={(e) => handleLinkClick(e)}
            className={`font-[600] text-sm md:text-base lg:text-lg text-foreground hover:text-[var(--coral-600)] hover:font-bold transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] hover:after:scale-x-100 after:scale-x-0 after:w-full after:bg-red-200 after:transition-all after:duration-300 ${
              isProfileIncomplete
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : ""
            }`}
            aria-disabled={isProfileIncomplete}
          >
            Khách hàng
          </Link>
        </NavbarItem>
        <NavbarItem className="relative">
          <Link
            href="/integrations"
            prefetch={true}
            onMouseEnter={() => router.prefetch("/integrations")}
            onClick={(e) => handleLinkClick(e)}
            className={`font-[600] text-sm md:text-base lg:text-lg text-foreground hover:text-[var(--coral-600)] hover:font-bold transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] hover:after:scale-x-100 after:scale-x-0 after:w-full after:bg-red-200 after:transition-all after:duration-300 ${
              isProfileIncomplete
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : ""
            }`}
            aria-disabled={isProfileIncomplete}
          >
            Tích hợp
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        as="div"
        className="items-center gap-2 sm:gap-3"
        justify="end"
      >
        {isLoggedIn ? (
          <>
            <NavbarItem className="flex-shrink-0">
              <ThemeToggle />
            </NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform object-cover object-center overflow-hidden round hover:scale-105"
                  color="danger"
                  name="Jason Hughes"
                  size="sm"
                  src={avatarUrl || DefaultLogo.src}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Đăng nhập với</p>
                  <p className="font-semibold">
                    {email == null ? fullName : email}
                  </p>
                </DropdownItem>
                <DropdownItem key="my_profile">
                  <Link
                    href="/profile"
                    prefetch={true}
                    onMouseEnter={() => router.prefetch("/profile")}
                  >
                    Hồ sơ của tôi
                  </Link>
                </DropdownItem>
                <DropdownItem key="help_and_feedback">
                  <Link
                    href="/support"
                    prefetch={true}
                    onMouseEnter={() => router.prefetch("/support")}
                  >
                    Trợ giúp & phản hồi
                  </Link>
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onPress={handleLogout}
                >
                  <p className="font-bold">Log Out</p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : (
          <>
            <NavbarItem className="flex-shrink-0 w-auto">
              <ThemeToggle />
            </NavbarItem>
            <NavbarItem className="hidden sm:block">
              <Link
                href="/signin"
                prefetch={true}
                onMouseEnter={() => router.prefetch("/signin")}
              >
                <Button
                  className="text-xs sm:text-sm opacity-100"
                  size="sm"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--coral-500), var(--coral-600))",
                    color: "#ffffff",
                    borderRadius: 8,
                  }}
                >
                  Đăng nhập
                </Button>
              </Link>
            </NavbarItem>
            <NavbarItem className="hidden sm:block">
              <Link
                href="/signup"
                prefetch={true}
                onMouseEnter={() => router.prefetch("/signup")}
              >
                <Button
                  className="text-xs sm:text-sm opacity-100"
                  size="sm"
                  variant="bordered"
                  style={{
                    borderColor: "var(--coral-500)",
                    color: "var(--coral-500)",
                    background: "transparent",
                    borderRadius: 8,
                  }}
                  onPress={() => router.push("/signup")}
                >
                  Đăng ký
                </Button>
              </Link>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};
