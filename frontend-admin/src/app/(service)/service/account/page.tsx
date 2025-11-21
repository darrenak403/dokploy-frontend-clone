import React from "react";

import AccountList from "@/components/shared/account/AccountList";
import AccountStat from "@/components/shared/account/AccountStat";
import MainTitle from "@/components/shared/account/MainTitle";

const AccountPage = () => {
  return (
    <div className="max-w-screen mx-auto h-full min-h-0 flex flex-col">
      <div className="mb-8">
        <MainTitle />
      </div>
      <div className="mb-8">
        <AccountStat />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <AccountList />
      </div>
    </div>
  );
};

export default AccountPage;
