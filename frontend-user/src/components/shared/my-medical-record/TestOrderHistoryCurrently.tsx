import React from "react";

import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

import {
  TestOrderProps,
  formatDate,
  isAccessionNumber,
} from "@/types/test-order/getAllTestOrderByPatientId";
import {
  getPriorityText,
  getStatusPriorityColor,
} from "@/types/test-order/getAllTestOrderList";

import TestOrderHistoryCurrentlySkeleton from "./TestOrderHistoryCurrentlySkeleton";

const TestOrderHistoryCurrently: React.FC<TestOrderProps> = ({
  lastTestOrder,
}) => {
  // skeleton
  if (!lastTestOrder) {
    return <TestOrderHistoryCurrentlySkeleton />;
  }
  console.log("Currently", lastTestOrder);
  const accessionNumber = lastTestOrder.accessionNumber;
  const lastTestDate = lastTestOrder.createdAt;
  const instrument = lastTestOrder.instrumentName;
  const priority = lastTestOrder.priority;
  const createdBy = lastTestOrder.createdBy || "N/A";
  const createdAt = formatDate(lastTestOrder.createdAt);
  const phone = lastTestOrder.phone || "N/A";

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Recent blood test */}
      <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-none hover:shadow-lg transform hover:scale-[1.01] origin-center transition-all duration-500 ease-in-out">
        <div className="mb-2 flex items-center gap-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon
                icon="healthicons:heartbeat"
                className="w-4 h-4 text-red-500"
              />
              Xét nghiệm máu gần nhất
            </h3>
          </div>
          <div className="">
            <Chip
              color={getStatusPriorityColor(priority || "-")}
              size="sm"
              variant="flat"
              className="font-medium"
            >
              {getPriorityText(priority || "-")}
            </Chip>
          </div>
        </div>

        {isAccessionNumber(accessionNumber) ? (
          <div className="space-y-2">
            {/* Loại xét nghiệm */}
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Loại xét nghiệm
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {accessionNumber}
              </span>
            </div>

            {/* Thiết bị sử dụng */}
            {instrument && (
              <div className="flex items-center justify-between py-1 border-t border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Thiết bị sử dụng
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {instrument}
                </span>
              </div>
            )}

            {/* Ngày thực hiện */}
            <div className="flex items-center justify-between py-1 border-t border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Ngày thực hiện
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(lastTestDate)}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-500 dark:text-gray-400 italic">
            Không tìm thấy lịch sử xét nghiệm máu gần đây.
          </div>
        )}
      </div>

      {/* System info */}
      <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-none hover:shadow-lg transform hover:scale-[1.01] origin-center transition-all duration-500 ease-in-out">
        <div className="mb-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Icon
              icon="mdi:information-outline"
              className="w-4 h-4 text-blue-500"
            />
            Thông tin liên hệ
          </h3>
        </div>

        <div className="space-y-2">
          {/* Được tạo bởi */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Bác sĩ xét nghiệm
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {createdBy}
            </span>
          </div>

          {/* Ngày tạo */}
          <div className="flex items-center justify-between py-1 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Ngày khám
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {createdAt}
            </span>
          </div>

          {/* Số điện thoại */}
          <div className="flex items-center justify-between py-1 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Số điện thoại liên hệ
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {phone}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestOrderHistoryCurrently;
