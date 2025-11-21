import React from "react";

const TestOrderHistoryCurrentlySkeleton: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Blood test skeleton */}
      <div className="p-4 rounded-lg border border-gray-200 bg-white">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between py-1">
            <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center justify-between py-1 border-t border-gray-100">
            <div className="w-28 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center justify-between py-1 border-t border-gray-100">
            <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-28 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* System info skeleton */}
      <div className="p-4 rounded-lg border border-gray-200 bg-white">
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-36 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between py-1">
            <div className="w-28 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center justify-between py-1 border-t border-gray-100">
            <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center justify-between py-1 border-t border-gray-100">
            <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-28 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestOrderHistoryCurrentlySkeleton;
