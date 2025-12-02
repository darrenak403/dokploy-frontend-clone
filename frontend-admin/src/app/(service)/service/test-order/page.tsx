import React from "react";

import MainTitle from "@/components/shared/test-order/MainTitle";
import TestOrderList from "@/components/shared/test-order/TestOrderList";
import TestOrderStat from "@/components/shared/test-order/TestOrderStat";

const TestOrderPage = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0 mb-3 sm:mb-4 md:mb-6">
        <MainTitle />
      </div>
      <div className="flex-shrink-0 mb-3 sm:mb-4 md:mb-6">
        <TestOrderStat />
      </div>
      <div className="flex-1 min-h-[1000px] lg:min-h-0 overflow-hidden">
        <TestOrderList />
      </div>
    </div>
  );
};

export default TestOrderPage;
