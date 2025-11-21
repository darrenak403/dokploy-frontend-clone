"use client";
import { useEffect, useRef, useState } from "react";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

// Lazy load 3D components to avoid SSR issues
const MedicalScene3D = dynamic(
  () => import("@/components/shared/NotFound/3DScene"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-blue-50/50 dark:from-gray-900 dark:to-gray-800" />
    ),
  }
);

export default function NotFound() {
  const pathname = usePathname();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [gsap, setGsap] = useState<typeof import("gsap").default | null>(null);

  useEffect(() => {
    console.log(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );

    // Lazy load GSAP
    import("gsap").then((module) => {
      setGsap(module.default);
    });
  }, [pathname]);

  useEffect(() => {
    if (!gsap) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        duration: 1,
        y: -50,
        opacity: 0,
        ease: "elastic.out(1, 0.5)",
        delay: 0.2,
      });

      // Subtitle animation
      gsap.from(subtitleRef.current, {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: "power3.out",
        delay: 0.5,
      });

      // Content animation
      gsap.from(contentRef.current?.children || [], {
        duration: 0.6,
        y: 40,
        opacity: 0,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.8,
      });

      // Floating animation
      gsap.to(titleRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, [gsap]);

  return (
    <div className="fixed top-0 min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-background">
      {/* 3D Background Scene */}
      <div className="absolute inset-0 z-0">
        <MedicalScene3D />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />

      {/* Content */}
      <div className="relative z-20 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="max-w-2xl text-center">
          {/* Error Code */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <Icon
              icon="mdi:flask"
              className="h-16 w-16 text-red-500 animate-pulse"
            />
            <h1
              ref={titleRef}
              className="text-[120px] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-red-500"
              style={{
                filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))",
              }}
            >
              404
            </h1>
            <Icon
              icon="mdi:test-tube"
              className="h-16 w-16 text-blue-500 animate-pulse"
            />
          </div>

          {/* Error Message */}
          <div className="mb-12 space-y-4">
            <p
              ref={subtitleRef}
              className="text-2xl font-semibold md:text-3xl text-[var(--coral-500)]"
            >
              Oops! Trang bạn đang tìm kiếm không tồn tại.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              as={Link}
              href="/service"
              color="danger"
              size="lg"
              className="group relative overflow-hidden"
              startContent={
                <Icon
                  icon="mdi:home"
                  className="h-5 w-5 transition-transform group-hover:scale-110"
                />
              }
            >
              Về Trang Chủ
            </Button>

            <Button
              as={Link}
              href="/service/test-order"
              variant="bordered"
              size="lg"
              className="group"
              startContent={
                <Icon
                  icon="mdi:test-tube"
                  className="h-5 w-5 transition-transform group-hover:rotate-12"
                />
              }
            >
              Xem Đơn Xét Nghiệm
            </Button>
          </div>

          {/* Medical Info Card */}
          <div className="mt-16 rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="rounded-full bg-gradient-to-r from-red-500 to-blue-500 p-3">
                  <Icon icon="mdi:flask" className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Hệ Thống Xét Nghiệm Máu
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Nếu bạn cần hỗ trợ hoặc có câu hỏi về kết quả xét nghiệm của
                  mình, vui lòng liên hệ với bộ phận chăm sóc khách hàng hoặc
                  quay lại trang chủ để tra cứu thông tin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 h-20 w-20 rounded-full bg-gradient-to-r from-red-500 to-blue-500 opacity-20 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-gradient-to-r from-blue-500 to-red-500 opacity-20 blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/4 h-16 w-16 rounded-full bg-primary/30 opacity-30 blur-2xl" />
    </div>
  );
}
