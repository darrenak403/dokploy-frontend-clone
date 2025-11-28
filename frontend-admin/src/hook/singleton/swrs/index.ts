//provider
export * from "./SwrProvider";

//auth
export * from "./auth/useFetchLoginSwr";
export * from "./auth/useFetchRegisterSwr";

//patient
export * from "./patient/useFetchAllPatientSwr";
export * from "./patient/useFetchCreatePatientSwr";
// export * from "./patient/useFetchUpdatePatientSwr";
export * from "./patient/useFetchDeletePatientSwr";

//test-order
export * from "./test-order/useFetchAllTestOrderSwr";
export * from "./test-order/useFetchDeleteTestOrderSwr";
export * from "./test-order/useFetchCreateTestOrder";
export * from "./test-order/useFetchUpdateTestOrder";

//profile
export * from "./profile/useFetchUpdateProfile";
export * from "./profile/useFetchUpdateAvatarUrlSwr";

//upload image
export * from "./uploadImage/useFetchUploadImage";

//accounts
export * from "./user/useFetchCreateUserSwr";
export * from "./user/useFetchGetAllUserSwr";
export * from "./user/useFetchUserByIdSwr";
export * from "./user/useFetchUpdateUserSwr";

//roles
export * from "./roles/useFetchGetAllRoleSwr";

//permission
export * from "./permission/useFetchGetAllPermissionSwr";
export * from "./permission/useFetchUpdatePermissionSwr";

//warehouse
export * from "./warehouse/useFetchCreateWareHouseIntrustmentSwr";
export * from "./warehouse/useFetchUpdateWareHouseIntrustmentSwr";

//instrument
export * from "./instrument/useFetchCreateRegentSwr";
export * from "./instrument/useFetchUpdateStatusReagentsSwr";
export * from "./instrument/useFetchDeleteReagentsSwr";

//monitoring
export * from "./monitoring/useFetchGetAllMonitoringSwr";
