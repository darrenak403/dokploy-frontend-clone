import React from "react";

import { Icon } from "@iconify/react";

const TestOrderHistoryCurrentlySkeleton: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="p-4 rounded-lg border border-gray-200 bg-white flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="mdi:clipboard-text-outline"
            className="w-8 h-8 mx-auto mb-2 text-zinc-500"
          />
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
            Chưa có thông tin
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Lịch sử xét nghiệm sẽ chưa có
          </p>
        </div>
      </div>
      <div className="p-4 rounded-lg border border-gray-200 bg-white flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="mdi:information-outline"
            className="w-8 h-8 mx-auto mb-2 text-zinc-500"
          />
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
            Chưa có thông tin
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Thông tin hệ thống sẽ chưa có
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestOrderHistoryCurrentlySkeleton;
