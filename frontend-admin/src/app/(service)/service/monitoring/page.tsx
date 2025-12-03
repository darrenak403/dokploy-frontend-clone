import React from "react";

import MainTitle from "@/components/shared/monitoring/MainTitle";
import MonitoringList from "@/components/shared/monitoring/MonitoringList";
import MonitoringStat from "@/components/shared/monitoring/MonitoringStat";

const MonitoringPage = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0 mb-3 sm:mb-4 md:mb-6">
        <MainTitle />
      </div>
      <div className="flex-shrink-0 mb-3 sm:mb-4 md:mb-6">
        <MonitoringStat />
      </div>
      <div className="flex-1 min-h-[1000px] lg:min-h-0 overflow-hidden">
        <MonitoringList />
      </div>
    </div>
  );
};

export default MonitoringPage;
