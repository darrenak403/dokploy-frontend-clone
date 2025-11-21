"use client";

import React, { useEffect, useRef } from "react";

import Link from "next/link";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    id: "lab-samples",
    title: "Quản lý xét nghiệm máu",
    desc: "Theo dõi và xử lý các mẫu xét nghiệm một cách chính xác và nhanh chóng.",
    icon: "mdi:beaker",
    color: "from-red-400 to-pink-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
  },
  {
    id: "patients",
    title: "Quản lý bệnh nhân",
    desc: "Lưu trữ thông tin bệnh nhân an toàn với hệ thống bảo mật cao.",
    icon: "mdi:account-group",
    color: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    id: "devices",
    title: "Giám sát thiết bị",
    desc: "Theo dõi trạng thái hoạt động của thiết bị xét nghiệm theo thời gian thực.",
    icon: "pepicons-pop:camera",
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  {
    id: "reports",
    title: "Báo cáo thống kê",
    desc: "Tạo báo cáo chi tiết về hoạt động phòng xét nghiệm và kết quả.",
    icon: "mdi:chart-box",
    color: "from-purple-400 to-violet-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
  {
    id: "security",
    title: "Bảo mật dữ liệu",
    desc: "Đảm bảo an toàn thông tin y tế với tiêu chuẩn bảo mật cao nhất.",
    icon: "mdi:shield-check",
    color: "from-orange-400 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
  },
  {
    id: "fast-processing",
    title: "Xử lý nhanh chóng",
    desc: "Tối ưu hoá quy trình để giảm thời gian chờ và trả kết quả.",
    icon: "mdi:clock-fast",
    color: "from-cyan-400 to-blue-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
  },
];

export function HighlightFeature() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Cards stagger animation
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 80,
            scale: 0.8,
            rotationY: -15,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: 1,
            ease: "back.out(1.2)",
            stagger: 0.15,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Setup hover animations for each card
      if (cards) {
        Array.from(cards).forEach((card) => {
          const iconContainer = card.querySelector(".icon-container");
          const icon = card.querySelector(".feature-icon");

          // Hover in
          card.addEventListener("mouseenter", () => {
            gsap.to(card, {
              y: -15,
              scale: 1.03,
              rotationY: 5,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              duration: 0.6,
              ease: "power2.out",
            });

            gsap.to(iconContainer, {
              scale: 1.2,
              rotation: 10,
              duration: 0.5,
              ease: "back.out(1.7)",
            });

            gsap.to(icon, {
              scale: 1.1,
              duration: 0.3,
              ease: "power2.out",
            });
          });

          // Hover out
          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              rotationY: 0,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              duration: 0.5,
              ease: "power2.out",
            });

            gsap.to(iconContainer, {
              scale: 1,
              rotation: 0,
              duration: 0.4,
              ease: "power2.out",
            });

            gsap.to(icon, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="pt-10 pb-20 px-4 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-7xl mx-auto">
        <header ref={headerRef} className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold gravitas-one-regular mb-6"
            style={{ color: "var(--foreground)" }}
          >
            Tính năng nổi bật
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-xl leading-relaxed text-gray-600 dark:text-gray-300">
            Hệ thống quản lý phòng xét nghiệm với đầy đủ tính năng cần thiết cho
            hoạt động chuyên nghiệp
          </p>
        </header>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {FEATURES.map((f) => (
            <article
              key={f.id}
              className={`${f.bgColor} rounded-2xl p-8 border border-gray-100 dark:border-gray-700 cursor-pointer`}
              style={{
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="mb-6">
                <div
                  className={`icon-container w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <Icon
                    icon={f.icon}
                    className="feature-icon w-8 h-8 text-white"
                  />
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {f.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                <Link
                  href={`/features/${f.id}`}
                  className="text-gray-700 dark:text-gray-300 hover:text-[var(--coral-500)] font-medium"
                >
                  Xem chi tiết →
                </Link>

                <Button
                  size="sm"
                  className={`px-4 py-2 rounded-lg bg-gradient-to-r ${f.color} text-white font-medium shadow-md`}
                >
                  Dùng thử
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HighlightFeature;
