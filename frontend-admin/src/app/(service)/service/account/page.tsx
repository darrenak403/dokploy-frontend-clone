import React from "react";

import AccountList from "@/components/shared/account/AccountList";
import AccountStat from "@/components/shared/account/AccountStat";
import MainTitle from "@/components/shared/account/MainTitle";

const AccountPage = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0 mb-3 sm:mb-4 md:mb-6">
        <MainTitle />
      </div>
      <div className="flex-shrink-0 mb-3 sm:mb-4 md:mb-6">
        <AccountStat />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <AccountList />
      </div>
    </div>
  );
};

export default AccountPage;
