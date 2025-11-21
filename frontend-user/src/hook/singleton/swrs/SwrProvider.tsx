import React from "react";
import { createContext } from "react";
import { PropsWithChildren } from "react";

import { useFetchLoginSwrCore } from "./auth/useFetchLoginSwr";
import { useFetchRegisterSwrCore } from "./auth/useFetchRegisterSwr";
import { useFetchCreateIdentityCardSwrCore } from "./indentityCard/useFetchCreateIdentityCardSwr";
import { useFetchGetIdentitySwrCore } from "./indentityCard/useFetchGetIdentityCardSwr";
import { useFetchScanIdentityCardSwrCore } from "./indentityCard/useFetchScanIdentityCardSwr";
import { useFetchMyPatientRecordSwrCore } from "./my-patient-record/useFetchMyPatientRecordSwr";
import { useFetchUpdateAvatarUrlSwrCore } from "./profile/useFetchUpdateAvatarUrlSwr";
import { useFetchUpdateProfileSwrCore } from "./profile/useFetchUpdateProfile";
import { useFetchAllTestOrderByPatientIdSwrCore } from "./test-order/useFetchAllTestOrderByPatientIdSwr";
import { useFetchUploadImgCore } from "./uploadImage/useFetchUploadImage";

export interface SwrContextType {
  //auth
  useFetchRegisterSwr: ReturnType<typeof useFetchRegisterSwrCore>;
  useFetchLoginSwr: ReturnType<typeof useFetchLoginSwrCore>;

  //my-patient-record
  useFetchMyPatientRecordSwr: ReturnType<typeof useFetchMyPatientRecordSwrCore>;

  //test-order
  useFetchAllTestOrderByPatientIdSwr: (
    patientId: string | number | null
  ) => ReturnType<typeof useFetchAllTestOrderByPatientIdSwrCore>;

  //profile
  useFetchUpdateProfileSwr: ReturnType<typeof useFetchUpdateProfileSwrCore>;
  useFetchUpdateAvatarUrlSwr: ReturnType<typeof useFetchUpdateAvatarUrlSwrCore>;

  //upload image
  useFetchUploadImgSwr: ReturnType<typeof useFetchUploadImgCore>;

  //scan identity card
  useFetchScanIdentityCardSwr: ReturnType<
    typeof useFetchScanIdentityCardSwrCore
  >;
  useFetchCreateIdentityCardSwr: ReturnType<
    typeof useFetchCreateIdentityCardSwrCore
  >;

  //get identity card
  useFetchGetIdentitySwr: ReturnType<typeof useFetchGetIdentitySwrCore>;
}

export const SwrContext = createContext<SwrContextType | null>(null); //khoi tao 1 cai thung

export const SwrProvider = ({ children }: PropsWithChildren) => {
  //auth
  const useFetchRegisterSwr = useFetchRegisterSwrCore();
  const useFetchLoginSwr = useFetchLoginSwrCore();

  //my-patient-record
  const useFetchMyPatientRecordSwr = useFetchMyPatientRecordSwrCore();

  //test-order
  const useFetchAllTestOrderByPatientIdSwr = (
    patientId: string | number | null
  ) => {
    return useFetchAllTestOrderByPatientIdSwrCore(patientId);
  };

  //profile
  const useFetchUpdateProfileSwr = useFetchUpdateProfileSwrCore(null);
  const useFetchUpdateAvatarUrlSwr = useFetchUpdateAvatarUrlSwrCore(null);

  //upload image
  const useFetchUploadImgSwr = useFetchUploadImgCore();

  //scan identity card
  const useFetchScanIdentityCardSwr = useFetchScanIdentityCardSwrCore();
  const useFetchCreateIdentityCardSwr = useFetchCreateIdentityCardSwrCore();
  //get identity card
  const useFetchGetIdentitySwr = useFetchGetIdentitySwrCore();
  return (
    <>
      <SwrContext.Provider
        value={{
          //auth
          useFetchRegisterSwr,
          useFetchLoginSwr,
          //my-patient-record
          useFetchMyPatientRecordSwr,
          //test-order
          useFetchAllTestOrderByPatientIdSwr,
          //profile
          useFetchUpdateProfileSwr,
          useFetchUpdateAvatarUrlSwr,
          //upload image
          useFetchUploadImgSwr,
          //scan identity card
          useFetchScanIdentityCardSwr,
          useFetchCreateIdentityCardSwr,
          //get identity card
          useFetchGetIdentitySwr,
        }}
      >
        {children}
      </SwrContext.Provider>
    </>
  );
};
