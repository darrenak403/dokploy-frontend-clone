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
    <div className="relative h-[80vh] w-full overflow-hidden bg-gradient-to-br from-background via-background to-background">
      {/* 3D Background Scene */}
      <div className="absolute inset-0 z-0">
        <MedicalScene3D />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />

      {/* Content */}
      <div className="relative z-20 flex h-[80vh] items-center justify-center px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <div className="max-w-2xl text-center">
          {/* Error Code */}
          <div className="mb-4 sm:mb-6 md:mb-8 flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
            <Icon
              icon="mdi:flask"
              className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-red-500 animate-pulse"
            />
            <h1
              ref={titleRef}
              className="text-[100px] sm:text-[100px] md:text-[120px] lg:text-[140px] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-red-500"
              style={{
                filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))",
              }}
            >
              404
            </h1>
            <Icon
              icon="mdi:test-tube"
              className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-blue-500 animate-pulse"
            />
          </div>

          {/* Error Message */}
          <div className="mb-6 sm:mb-8 md:mb-12 space-y-2 sm:space-y-3 md:space-y-4">
            <p
              ref={subtitleRef}
              className="text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[var(--coral-500)] px-2 sm:px-0"
            >
              Oops! Trang bạn đang tìm kiếm không tồn tại.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 sm:flex-row sm:justify-center w-full px-2 sm:px-0">
            <Button
              as={Link}
              href="/service"
              color="danger"
              size="sm"
              className="group relative overflow-hidden w-full sm:w-auto text-xs sm:text-sm md:text-base"
              startContent={
                <Icon
                  icon="mdi:home"
                  className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110"
                />
              }
            >
              Về Trang Chủ
            </Button>

            <Button
              as={Link}
              href="/service/test-order"
              variant="bordered"
              size="sm"
              className="group w-full sm:w-auto text-xs sm:text-sm md:text-base"
              startContent={
                <Icon
                  icon="mdi:test-tube"
                  className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:rotate-12"
                />
              }
            >
              Xem Đơn Xét Nghiệm
            </Button>
          </div>

          {/* Medical Info Card */}
          <div className="mt-6 sm:mt-10 md:mt-16 rounded-xl sm:rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-3 sm:p-4 md:p-6 shadow-lg mx-2 sm:mx-0">
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
              <div className="flex-shrink-0">
                <div className="rounded-full bg-gradient-to-r from-red-500 to-blue-500 p-2 sm:p-2.5 md:p-3">
                  <Icon
                    icon="mdi:flask"
                    className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white"
                  />
                </div>
              </div>
              <div className="text-left">
                <h3 className="mb-1 sm:mb-1.5 md:mb-2 text-sm sm:text-base md:text-lg font-semibold text-foreground">
                  Hệ Thống Xét Nghiệm Máu
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
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
      <div className="absolute top-4 sm:top-6 md:top-10 left-4 sm:left-6 md:left-10 h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-r from-red-500 to-blue-500 opacity-20 blur-2xl sm:blur-3xl animate-pulse" />
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-10 right-4 sm:right-6 md:right-10 h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 rounded-full bg-gradient-to-r from-blue-500 to-red-500 opacity-20 blur-2xl sm:blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/4 h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 rounded-full bg-primary/30 opacity-30 blur-xl sm:blur-2xl" />
    </div>
  );
}
