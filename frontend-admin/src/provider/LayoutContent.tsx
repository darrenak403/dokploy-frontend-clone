"use client";

import { usePathname } from "next/navigation";

import { Header } from "@/components";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/auth/");

  return (
    <div className="">
      {!isAuthPage && <Header />}
      <main className="flex-1 ">{children}</main>
    </div>
  );
}
