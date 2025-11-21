import React from "react";

import MainTitle from "@/components/shared/test-order/MainTitle";
import TestOrderList from "@/components/shared/test-order/TestOrderList";
import TestOrderStat from "@/components/shared/test-order/TestOrderStat";

const TestOrderPage = () => {
  return (
    <div className="max-w-screen mx-auto h-full min-h-0 flex flex-col">
      <div className="mb-8">
        <MainTitle />
      </div>
      <div className="mb-8">
        <TestOrderStat />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <TestOrderList />
      </div>
    </div>
  );
};

export default TestOrderPage;
