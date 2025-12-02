import React from "react";

import AccountList from "@/components/shared/account/AccountList";
import AccountStat from "@/components/shared/account/AccountStat";
import MainTitle from "@/components/shared/account/MainTitle";

const AccountPage = () => {
  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <MainTitle />
      </div>
      <div className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4">
        <AccountStat />
      </div>
      <div className="flex-1 min-h-0 px-4 sm:px-6 pb-4 overflow-hidden">
        <AccountList />
      </div>
    </div>
  );
};

export default AccountPage;
