import React from "react";

import MainTitle from "@/components/shared/monitoring/MainTitle";
<<<<<<< HEAD
import MonitoringStat from "@/components/shared/monitoring/MonitoringStat";
import MonitoringList from "@/components/shared/monitoring/MonitoringList";

const MonitoringPage = () => {
  return (
    <div className="max-w-screen mx-auto h-full min-h-0 flex flex-col p-6">
=======
import MonitoringList from "@/components/shared/monitoring/MonitoringList";
import MonitoringStat from "@/components/shared/monitoring/MonitoringStat";

const MonitoringPage = () => {
  return (
    <div className="max-w-screen mx-auto h-full min-h-0 flex flex-col">
>>>>>>> 706ea9b95546c6814000ecbbd6afdf4667f0da2f
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
