"use client";
import React from "react";

import { useRouter } from "next/navigation";

import { Button } from "@heroui/react";

const ServiceDashboardPage: React.FC = () => {
  const router = useRouter();

  return (
    <>
      {/* Landing page */}
      <div className="w-full">
        <div className="mx-auto space-y-8">
          {/* Hero */}
          <div
            style={{ background: "var(--gradient-medical)" }}
            className="text-white rounded-lg overflow-hidden"
          >
            <div className="px-6 py-12 text-center">
              <h1 className="text-3xl sm:text-4xl font-extrabold gravitas-one-regular">
                Nền tảng quản lý phòng xét nghiệm
              </h1>
              <p className="mt-4 text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
                Tối ưu quy trình, quản lý bệnh nhân và kết quả xét nghiệm —
                nhanh chóng, an toàn và đáng tin cậy.
              </p>

              <div className="mt-6 flex justify-center gap-3">
                <Button
                  onPress={() => router.push("/profile")}
                  className="bg-white text-[var(--primary)] hover:brightness-95 font-medium px-5 py-2 rounded-lg"
                  aria-label="Dùng thử miễn phí"
                >
                  Xem hồ sơ
                </Button>

                <Button
                  onPress={() => router.push("/service/my-medical-records")}
                  className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-lg"
                  aria-label="Xem hồ sơ"
                >
                  Xem kết quả
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <section id="features">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] text-center">
              Tính năng nổi bật
            </h2>
            <p className="text-center mt-2 text-[var(--muted)] max-w-2xl mx-auto">
              Các công cụ cần thiết để vận hành phòng xét nghiệm hiệu quả.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div
                className="rounded-lg shadow p-4"
                style={{ background: "var(--card)" }}
              >
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  Quản lý bệnh nhân
                </h3>
                <p className="mt-2 text-[var(--muted)] text-sm">
                  Thêm, sửa, theo dõi hồ sơ và lịch sử xét nghiệm của bệnh nhân.
                </p>
              </div>

              <div
                className="rounded-lg shadow p-4"
                style={{ background: "var(--card)" }}
              >
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  Kết quả nhanh chóng
                </h3>
                <p className="mt-2 text-[var(--muted)] text-sm">
                  Xem và chia sẻ kết quả ngay sau khi xét nghiệm hoàn thành.
                </p>
              </div>

              <div
                className="rounded-lg shadow p-4"
                style={{ background: "var(--card)" }}
              >
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  Bảo mật & Quyền truy cập
                </h3>
                <p className="mt-2 text-[var(--muted)] text-sm">
                  Quản lý quyền truy cập người dùng và bảo vệ dữ liệu nhạy cảm.
                </p>
              </div>
            </div>
          </section>

          {/* CTA strip */}
          <div className="bg-[var(--bg-pale)] dark:bg-[var(--surface)] rounded-lg p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  Sẵn sàng để bắt đầu?
                </h3>
                <p className="text-[var(--muted)] text-sm">
                  Tạo tài khoản và quản lý phòng xét nghiệm của bạn ngay hôm
                  nay.
                </p>
              </div>
              <div className="flex gap-3">
                <Button className="bg-[var(--primary)] hover:bg-[var(--primary-600)] text-white px-4 py-2 rounded-lg">
                  Bắt đầu
                </Button>
                <Button className="bg-transparent border border-[var(--divider)] px-4 py-2 rounded-lg">
                  Liên hệ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDashboardPage;
