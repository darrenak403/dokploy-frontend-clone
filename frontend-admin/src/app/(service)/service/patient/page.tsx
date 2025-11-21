import React from "react";

import MainTitle from "@/components/shared/patient/MainTitle";
import PatientList from "@/components/shared/patient/PatientList";
import PatientStat from "@/components/shared/patient/PatientStat";

const PatientDashboardPage = () => {
  return (
    <div className="max-w-screen mx-auto h-full min-h-0 flex flex-col">
      <div className="mb-8">
        <MainTitle />
      </div>
      <div className="mb-8">
        <PatientStat />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <PatientList />
      </div>
    </div>
  );
};

export default PatientDashboardPage;
