import React from "react";
import { PropsWithChildren, createContext } from "react";

import { useFetchLoginSwrCore } from "./auth/useFetchLoginSwr";
import { useFetchRegisterSwrCore } from "./auth/useFetchRegisterSwr";
import { useFetchCreateCommentSwrCore } from "./comments/useFetchCreateCommentSwr";
import { useFetchDeleteCommentSwrCore } from "./comments/useFetchDeleteCommentSwr";
import { useFetchUpdateCommentSwrCore } from "./comments/useFetchUpdateCommentSwr";
import { useFetchCreateResultFromHL7MessageSwrCore } from "./hl7/useFetchCreateResultFromHL7MessageSwr";
import { useFetchCreateRegentSwrCore } from "./instrument/useFetchCreateRegentSwr";
import { useFetchDeleteReagentSwrCore } from "./instrument/useFetchDeleteReagentsSwr";
import { useFetchGetAllReagentSwrCore } from "./instrument/useFetchGetAllReagentSwr";
import { useFetchRecieveResultFromInstrumentSwrCore } from "./instrument/useFetchRecieveResultFromInstrumentSwr";
import { useFetchUpdateStatusReagentsSwrCore } from "./instrument/useFetchUpdateStatusReagentsSwr";
import { useFetchGetAllMonitoringSwrCore } from "./monitoring/useFetchGetAllMonitoringSwr";
import { useFetchAllPatientSwrCore } from "./patient/useFetchAllPatientSwr";
import { useFetchCreatePatientSwrCore } from "./patient/useFetchCreatePatientSwr";
import { useFetchDeletePatientSwrCore } from "./patient/useFetchDeletePatientSwr";
import { useFetchUpdatePatientSwrCore } from "./patient/useFetchUpdatePatientSwr";
import { useFetchUpdateAvatarUrlSwrCore } from "./profile/useFetchUpdateAvatarUrlSwr";
import { useFetchUpdateProfileSwrCore } from "./profile/useFetchUpdateProfile";
import { useFetchGetAllRoleSwrCore } from "./roles/useFetchGetAllRoleSwr";
import { useFetchGetAllRoleCore } from "./permission/useFetchGetAllRoleSwr";
import { useFetchGetAllPermissionSwrCore } from "./permission/useFetchGetAllPermissionSwr";
import { useFetchUpdatePermissionSwrCore } from "./permission/useFetchUpdatePermissionSwr";
import { useFetchAllTestOrderSwrCore } from "./test-order/useFetchAllTestOrderSwr";
import { useFetchCreateTestOrderSwrCore } from "./test-order/useFetchCreateTestOrder";
import { useFetchDeleteTestOrderSwrCore } from "./test-order/useFetchDeleteTestOrderSwr";
import { useFetchPatientByAccessionNumberSwrCore } from "./test-order/useFetchPatientByAccessionNumberSwr";
import { useFetchUpdateTestOrderSwrCore } from "./test-order/useFetchUpdateTestOrder";
import { useFetchGetTestResultSwrCore } from "./test-result/useFetchGetTestResultSwr";
import { useFetchUploadImgCore } from "./uploadImage/useFetchUploadImage";
import { useFetchCreateUserSwrCore } from "./user/useFetchCreateUserSwr";
import { useFetchGetAllUserSwrCore } from "./user/useFetchGetAllUserSwr";
import { useFetchUpdateUserSwrCore } from "./user/useFetchUpdateUserSwr";
import { useFetchCreateInstrumentSwrCore } from "./warehouse/useFetchCreateWareHouseIntrustmentSwr";
import { useFetchGetAllInstrumentSwrCore } from "./warehouse/useFetchGetAllInstrumentSwr";
import { useFetchUpdateInstrumentSwrCore } from "./warehouse/useFetchUpdateWareHouseIntrustmentSwr";

export interface SwrContextType {
  useFetchRegisterSwr: ReturnType<typeof useFetchRegisterSwrCore>;
  useFetchLoginSwr: ReturnType<typeof useFetchLoginSwrCore>;
  //patient
  useFetchAllPatientSwr: ReturnType<typeof useFetchAllPatientSwrCore>;
  useFetchDeletePatientSwr: ReturnType<typeof useFetchDeletePatientSwrCore>;
  useFetchCreatePatientSwr: ReturnType<typeof useFetchCreatePatientSwrCore>;
  useFetchUpdatePatientSwr: ReturnType<typeof useFetchUpdatePatientSwrCore>;
  //user
  useFetchGetAllUserSwr: ReturnType<typeof useFetchGetAllUserSwrCore>;
  //test-order
  useFetchAllTestOrderSwr: ReturnType<typeof useFetchAllTestOrderSwrCore>;
  useFetchDeleteTestOrderSwr: ReturnType<typeof useFetchDeleteTestOrderSwrCore>;
  useFetchCreateTestOrderSwr?: ReturnType<
    typeof useFetchCreateTestOrderSwrCore
  >;
  useFetchUpdateTestOrderSwr?: ReturnType<
    typeof useFetchUpdateTestOrderSwrCore
  >;
  useFetchPatientByAccessionNumberSwr?: ReturnType<
    typeof useFetchPatientByAccessionNumberSwrCore
  >;
  //test-result
  useFetchGetTestResultSwr?: ReturnType<typeof useFetchGetTestResultSwrCore>;
  //comments
  useFetchCreateCommentSwr?: ReturnType<typeof useFetchCreateCommentSwrCore>;
  useFetchUpdateCommentSwr?: ReturnType<typeof useFetchUpdateCommentSwrCore>;
  useFetchDeleteCommentSwr?: ReturnType<typeof useFetchDeleteCommentSwrCore>;
  //HL7
  useFetchCreateResultFromHL7MessageSwr?: ReturnType<
    typeof useFetchCreateResultFromHL7MessageSwrCore
  >;
  //profile
  useFetchUpdateProfileSwr?: ReturnType<typeof useFetchUpdateProfileSwrCore>;
  useFetchUpdateAvatarUrlSwr?: ReturnType<
    typeof useFetchUpdateAvatarUrlSwrCore
  >;
  //upload image
  useFetchUploadImgSwr?: ReturnType<typeof useFetchUploadImgCore>;
  //accounts
  useFetchCreateUserSwr?: ReturnType<typeof useFetchCreateUserSwrCore>;
  useFetchUpdateUserSwr?: ReturnType<typeof useFetchUpdateUserSwrCore>;
  //roles
  useFetchGetAllRoleSwr?: ReturnType<typeof useFetchGetAllRoleSwrCore>;
  //permission
  useFetchGetAllPermissionSwr?: ReturnType<
    typeof useFetchGetAllPermissionSwrCore
  >;
  useFetchUpdatePermissionSwr?: ReturnType<
    typeof useFetchUpdatePermissionSwrCore
  >;
  //warehouse
  useFetchGetAllInstrumentSwr?: ReturnType<
    typeof useFetchGetAllInstrumentSwrCore
  >;
  //instrument
  useFetchGetAllReagentSwr?: ReturnType<typeof useFetchGetAllReagentSwrCore>;
  useFetchRecieveResultFromInstrumentSwr?: ReturnType<
    typeof useFetchRecieveResultFromInstrumentSwrCore
  >;
  useFetchCreateInstrumentSwr?: ReturnType<
    typeof useFetchCreateInstrumentSwrCore
  >;
  useFetchUpdateInstrumentSwr?: ReturnType<
    typeof useFetchUpdateInstrumentSwrCore
  >;
  useFetchCreateRegentSwr?: ReturnType<typeof useFetchCreateRegentSwrCore>;
  useFetchUpdateStatusReagentsSwr?: ReturnType<
    typeof useFetchUpdateStatusReagentsSwrCore
  >;
  useFetchDeleteReagentSwr?: ReturnType<typeof useFetchDeleteReagentSwrCore>;
  //monitoring
  useFetchGetAllMonitoringSwr?: ReturnType<
    typeof useFetchGetAllMonitoringSwrCore
  >;
}

export const SwrContext = createContext<SwrContextType | null>(null);

export const SwrProvider = ({ children }: PropsWithChildren) => {
  //auth
  const useFetchRegisterSwr = useFetchRegisterSwrCore();
  const useFetchLoginSwr = useFetchLoginSwrCore();
  //patient
  const useFetchAllPatientSwr = useFetchAllPatientSwrCore();
  const useFetchDeletePatientSwr = useFetchDeletePatientSwrCore();
  const useFetchCreatePatientSwr = useFetchCreatePatientSwrCore();
  const useFetchUpdatePatientSwr = useFetchUpdatePatientSwrCore(null);
  //user
  const useFetchGetAllUserSwr = useFetchGetAllUserSwrCore();
  //test-order
  const useFetchAllTestOrderSwr = useFetchAllTestOrderSwrCore();
  const useFetchDeleteTestOrderSwr = useFetchDeleteTestOrderSwrCore();
  const useFetchCreateTestOrderSwr = useFetchCreateTestOrderSwrCore();
  const useFetchUpdateTestOrderSwr = useFetchUpdateTestOrderSwrCore(null);
  const useFetchPatientByAccessionNumberSwr =
    useFetchPatientByAccessionNumberSwrCore(null);
  //test-result
  const useFetchGetTestResultSwr = useFetchGetTestResultSwrCore(null);
  //comments
  const useFetchCreateCommentSwr = useFetchCreateCommentSwrCore();
  const useFetchUpdateCommentSwr = useFetchUpdateCommentSwrCore();
  const useFetchDeleteCommentSwr = useFetchDeleteCommentSwrCore();
  //HL7
  const useFetchCreateResultFromHL7MessageSwr =
    useFetchCreateResultFromHL7MessageSwrCore();
  //profile
  const useFetchUpdateProfileSwr = useFetchUpdateProfileSwrCore(null);
  const useFetchUpdateAvatarUrlSwr = useFetchUpdateAvatarUrlSwrCore(null);
  //upload image
  const useFetchUploadImgSwr = useFetchUploadImgCore();
  //accounts
  const useFetchCreateUserSwr = useFetchCreateUserSwrCore();
  const useFetchUpdateUserSwr = useFetchUpdateUserSwrCore(null);
  //roles
  const useFetchGetAllRoleSwr = useFetchGetAllRoleSwrCore();
  //permission
  const useFetchGetAllPermissionSwr = useFetchGetAllPermissionSwrCore();
  const useFetchUpdatePermissionSwr = useFetchUpdatePermissionSwrCore(null);
  //warehouse
  const useFetchGetAllInstrumentSwr = useFetchGetAllInstrumentSwrCore();
  //instrument
  const useFetchGetAllReagentSwr = useFetchGetAllReagentSwrCore();
  const useFetchRecieveResultFromInstrumentSwr =
    useFetchRecieveResultFromInstrumentSwrCore();
  const useFetchCreateInstrumentSwr = useFetchCreateInstrumentSwrCore();
  const useFetchUpdateInstrumentSwr = useFetchUpdateInstrumentSwrCore(null);
  const useFetchCreateRegentSwr = useFetchCreateRegentSwrCore();
  const useFetchUpdateStatusReagentsSwr =
    useFetchUpdateStatusReagentsSwrCore(null);
  const useFetchDeleteReagentSwr = useFetchDeleteReagentSwrCore(null);
  //monitoring
  const useFetchGetAllMonitoringSwr = useFetchGetAllMonitoringSwrCore();
  return (
    <>
      <SwrContext.Provider
        value={{
          //auth
          useFetchRegisterSwr,
          useFetchLoginSwr,
          //patient
          useFetchAllPatientSwr,
          useFetchDeletePatientSwr,
          useFetchCreatePatientSwr,
          useFetchUpdatePatientSwr,
          //user
          useFetchGetAllUserSwr,
          //test-order
          useFetchAllTestOrderSwr,
          useFetchDeleteTestOrderSwr,
          useFetchCreateTestOrderSwr,
          useFetchUpdateTestOrderSwr,
          useFetchPatientByAccessionNumberSwr,
          //test-Result
          useFetchGetTestResultSwr,
          //comments
          useFetchCreateCommentSwr,
          useFetchUpdateCommentSwr,
          useFetchDeleteCommentSwr,
          //HL7
          useFetchCreateResultFromHL7MessageSwr,
          //profile
          useFetchUpdateProfileSwr,
          useFetchUpdateAvatarUrlSwr,
          //upload image
          useFetchUploadImgSwr,
          //accounts
          useFetchCreateUserSwr,
          useFetchUpdateUserSwr,
          //roles
          useFetchGetAllRoleSwr,
          //permission
          useFetchGetAllPermissionSwr,
          useFetchUpdatePermissionSwr,
          //warehouse
          useFetchGetAllInstrumentSwr,
          //instrument
          useFetchGetAllReagentSwr,
          useFetchRecieveResultFromInstrumentSwr,
          useFetchCreateInstrumentSwr,
          useFetchUpdateInstrumentSwr,
          useFetchCreateRegentSwr,
          useFetchUpdateStatusReagentsSwr,
          useFetchDeleteReagentSwr,
          //monitoring
          useFetchGetAllMonitoringSwr,
        }}
      >
        {children}
      </SwrContext.Provider>
    </>
  );
};
