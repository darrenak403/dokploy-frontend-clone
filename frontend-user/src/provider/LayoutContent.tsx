"use client";

import { usePathname } from "next/navigation";

import { Footer, Header } from "@/components/shared";

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
    pathname === "/forgot-password/reset" ||
    pathname.startsWith("/auth/");

  const isServicePage = pathname.startsWith("/service");

  return (
    <div className="">
      {!isAuthPage && <Header />}
      <main className="flex-1">{children}</main>
      {!isAuthPage && !isServicePage && <Footer />}
    </div>
  );
}
