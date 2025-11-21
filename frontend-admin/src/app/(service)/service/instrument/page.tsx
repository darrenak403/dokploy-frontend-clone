import React from "react";

import CreateRegent from "@/components/shared/regents/CreateRegent";
import MainTitle from "@/components/shared/regents/MainTitle";
import RegentList from "@/components/shared/regents/RegentList";
import RegentStats from "@/components/shared/regents/RegentStats";

const InstrumentPage = () => {
  return (
    <div className="h-full flex flex-col gap-6">
      <MainTitle />

      <RegentStats />

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800 overflow-auto">
          <CreateRegent />
        </div>

        <div className="lg:col-span-2 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800 overflow-auto">
          <RegentList />
        </div>
      </div>
    </div>
  );
};

export default InstrumentPage;
