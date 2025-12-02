"use client";
import React from "react";

import { Button, Input, Link } from "@heroui/react";
import { Icon } from "@iconify/react";

export const Footer = () => {
  return (
    <footer className="bg-zinc-100 dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white border-t py-6 sm:py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 mb-6 sm:mb-8 md:mb-12">
          {/* Left Column - Brand & Subscribe */}
          <div className="md:col-span-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 gravitas-one-regular">
              LABMS
            </h1>
            <div className="max-w-md">
              <h2 className="text-base sm:text-lg md:text-xl mb-3 sm:mb-4 md:mb-6">
                Đăng kí nhận bản tin của chúng tôi
              </h2>
              <div className="flex gap-2">
                <Input
                  placeholder="Your email address"
                  variant="flat"
                  size="sm"
                  className="flex-1"
                  classNames={{
                    input:
                      "bg-white text-black dark:bg-white dark:text-black text-sm",
                    inputWrapper:
                      "bg-white text-black dark:bg-white dark:text-black",
                  }}
                />
                <Button
                  isIconOnly
                  className="bg-[var(--coral-600)] text-white hover:bg-[var(--coral-600)]"
                  size="sm"
                >
                  <Icon
                    icon="mdi:arrow-right"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Links */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div>
              <ul className="space-y-2 sm:space-y-3 list-none text-sm sm:text-base">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-gray-300 text-black dark:text-white"
                    underline="none"
                  >
                    Trợ giúp
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-gray-300 text-black dark:text-white"
                    underline="none"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className=" hover:text-gray-300 text-black dark:text-white"
                    underline="none"
                  >
                    Điều khoản dịch vụ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className=" hover:text-gray-300 text-black dark:text-white"
                    underline="none"
                  >
                    Chính sách bảo mật
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2 sm:space-y-3 list-none text-sm sm:text-base">
                <li>
                  <Link
                    href="/features"
                    className=" hover:text-gray-300 text-black dark:text-white"
                    underline="none"
                  >
                    Tính năng
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className=" hover:text-gray-300 text-black dark:text-white"
                    underline="none"
                  >
                    Giá cả
                  </Link>
                </li>
                <li>
                  <Link
                    href="/discover"
                    className=" hover:text-gray-300 text-black dark:text-white"
                    underline="none"
                  >
                    Khám phá
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jobs"
                    className=" hover:text-gray-300 text-black dark:text-white"
                    underline="none"
                  >
                    Việc làm
                  </Link>
                </li>
                <li>
                  <Link
                    href="/board-meetings"
                    className=" hover:text-gray-300 text-black dark:text-white"
                    underline="none"
                  >
                    Cuộc họp hội đồng
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright & Social */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4 sm:pt-6 md:pt-8 border-t border-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="text-gray-400 flex items-center gap-1 text-xs sm:text-sm">
              <Icon
                icon="solar:copyright-linear"
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 inline-block mr-1"
              />
              2024 LabMS. All rights reserved.
            </span>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            <Link
              href="#"
              className="text-gray-400 hover:text-white"
              underline="none"
            >
              <Icon
                icon="mdi:twitter"
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
              />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white"
              underline="none"
            >
              <Icon
                icon="mdi:linkedin"
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
              />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white"
              underline="none"
            >
              <Icon
                icon="mdi:github"
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
              />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white"
              underline="none"
            >
              <Icon
                icon="mdi:facebook"
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
              />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white"
              underline="none"
            >
              <Icon
                icon="mdi:instagram"
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
