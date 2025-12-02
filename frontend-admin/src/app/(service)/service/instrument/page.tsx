import React from "react";

import CreateRegent from "@/components/shared/regents/CreateRegent";
import MainTitle from "@/components/shared/regents/MainTitle";
import RegentList from "@/components/shared/regents/RegentList";
import RegentStats from "@/components/shared/regents/RegentStats";

const InstrumentPage = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0">
        <MainTitle />
      </div>

      <div className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4">
        <RegentStats />
      </div>

      <div className="flex-1 min-h-0 px-4 sm:px-6 pb-4">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="lg:col-span-2 h-full min-h-[600px] lg:min-h-0">
            <RegentList />
          </div>
          <div className="lg:col-span-1 h-full min-h-[400px] lg:min-h-0">
            <CreateRegent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentPage;
