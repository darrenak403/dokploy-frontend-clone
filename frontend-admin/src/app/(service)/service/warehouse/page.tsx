import React from "react";

import CreateWareHouse from "@/components/shared/warehouse/CreateWareHouse";
import MainTitle from "@/components/shared/warehouse/MainTitle";
import WareHouseList from "@/components/shared/warehouse/WareHouseList";
import WareHouseStats from "@/components/shared/warehouse/WareHouseStats";

const WarehousePage = () => {
  return (
    <div className="h-full w-full flex flex-col gap-3 sm:gap-4 md:gap-6">
      <div className="flex-shrink-0">
        <MainTitle />
      </div>

      <div className="flex-shrink-0">
        <WareHouseStats />
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 overflow-hidden">
        <div className="h-full lg:col-span-1 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800 overflow-y-auto">
          <CreateWareHouse />
        </div>

        <div className="h-full lg:col-span-2 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800 overflow-y-auto">
          <WareHouseList />
        </div>
      </div>
    </div>
  );
};

export default WarehousePage;
