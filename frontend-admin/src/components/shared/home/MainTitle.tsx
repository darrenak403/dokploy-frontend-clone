/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";

import { Button } from "@heroui/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function MainTitle() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLSpanElement | null>(null);
  const primaryRef = useRef<HTMLElement | null>(null);
  const secondaryRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // entrance animations
      gsap.from(titleRef.current, {
        y: 36,
        duration: 0.9,
        ease: "power3.out",
      });
      gsap.from(subtitleRef.current, {
        y: 18,
        duration: 0.9,
        delay: 0.12,
        ease: "power3.out",
      });
      gsap.from([primaryRef.current, secondaryRef.current], {
        y: 20,
        stagger: 0.12,
        delay: 0.28,
        duration: 0.7,
        ease: "power2.out",
      });
      gsap.from(videoRef.current, {
        y: 48,
        duration: 1,
        delay: 0.45,
        ease: "power3.out",
        scrollTrigger: {
          trigger: videoRef.current,
          start: "top 85%",
        },
      });

      // smooth hover effects for buttons
      const hoverIn = (el: HTMLElement) =>
        gsap.to(el, {
          scale: 1.04,
          duration: 0.45,
          ease: "power2.out",
        });
      const hoverOut = (el: HTMLElement) =>
        gsap.to(el, {
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
        });

      const prim = primaryRef.current;
      const sec = secondaryRef.current;
      if (prim) {
        prim.addEventListener("mouseenter", () => hoverIn(prim));
        prim.addEventListener("mouseleave", () => hoverOut(prim));
      }
      if (sec) {
        sec.addEventListener("mouseenter", () => hoverIn(sec));
        sec.addEventListener("mouseleave", () => hoverOut(sec));
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <h1
            ref={titleRef}
            className="text-6xl md:text-7xl font-bold gravitas-one-regular mb-6 leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            Quản lý phòng xét nghiệm
            <span
              ref={subtitleRef}
              className="block"
              style={{ color: "var(--coral-500)" }}
            >
              hiệu quả và chuyên nghiệp
            </span>
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-gray-400">
            Hệ thống quản lý phòng xét nghiệm toàn diện giúp bạn theo dõi bệnh
            nhân, quản lý thiết bị và xử lý kết quả xét nghiệm nhanh chóng,
            chính xác.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            ref={primaryRef as any}
            size="lg"
            className=" px-8 py-3 bg-gradient-to-b from-[var(--coral-500)] to-[var(--coral-600)] text-white "
          >
            Bắt đầu ngay
          </Button>
          <Button
            ref={secondaryRef as any}
            size="lg"
            className="border border-[var(--coral-600)] text-[var(--coral-500)] bg-transparent px-8 py-3 "
          >
            Xem demo
          </Button>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="rounded-2xl shadow-2xl p-6 bg-white dark:bg-slate-900 shadow-gray-200 dark:shadow-gray-800">
            <div
              ref={videoRef}
              className="w-full h-80 md:h-96 lg:h-[520px] rounded-lg flex items-center justify-center overflow-hidden"
            >
              <div className="w-full h-full">
                <video
                  className="w-full h-full object-cover rounded-md"
                  src="/videos/HomePage.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
