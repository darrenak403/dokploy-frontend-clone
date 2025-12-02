import React from "react";

import CreateWareHouse from "@/components/shared/warehouse/CreateWareHouse";
import MainTitle from "@/components/shared/warehouse/MainTitle";
import WareHouseList from "@/components/shared/warehouse/WareHouseList";
import WareHouseStats from "@/components/shared/warehouse/WareHouseStats";

const WarehousePage = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0">
        <MainTitle />
      </div>

      <div className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4">
        <WareHouseStats />
      </div>

      <div className="flex-1 min-h-0 px-4 sm:px-6 pb-4">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="lg:col-span-2 h-full min-h-[600px] lg:min-h-0">
            <WareHouseList />
          </div>
          <div className="lg:col-span-1 h-full min-h-[400px] lg:min-h-0">
            <CreateWareHouse />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehousePage;
