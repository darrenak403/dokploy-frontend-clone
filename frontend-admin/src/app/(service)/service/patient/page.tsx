import React from "react";

import MainTitle from "@/components/shared/patient/MainTitle";
import PatientList from "@/components/shared/patient/PatientList";
import PatientStat from "@/components/shared/patient/PatientStat";

const PatientDashboardPage = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0 mb-3 sm:mb-4 md:mb-6">
        <MainTitle />
      </div>
      <div className="flex-shrink-0 mb-3 sm:mb-4 md:mb-6">
        <PatientStat />
      </div>
      <div className="flex-1 min-h-[1000px] lg:min-h-0 overflow-hidden">
        <PatientList />
      </div>
    </div>
  );
};

export default PatientDashboardPage;
