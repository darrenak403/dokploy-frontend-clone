import React from "react";

import MainTitle from "@/components/shared/monitoring/MainTitle";
import MonitoringList from "@/components/shared/monitoring/MonitoringList";
import MonitoringStat from "@/components/shared/monitoring/MonitoringStat";

const MonitoringPage = () => {
  return (
    <div className="max-w-screen mx-auto h-full min-h-0 flex flex-col">
      <div className="mb-8">
        <MainTitle />
      </div>
      <div className="mb-8">
        <MonitoringStat />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <MonitoringList />
      </div>
    </div>
  );
};

export default MonitoringPage;
