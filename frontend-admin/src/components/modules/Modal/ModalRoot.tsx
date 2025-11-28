"use client";
import CreateCommentModal from "./CreateCommentModal";
import CreatePermissionModal from "./CreatePermisionModal";
import CreatePatientModal from "./PatientModal/CreatePatientModal";
import UpdatePatientModal from "./PatientModal/UpdatePatientModal";
import ViewPatientModal from "./PatientModal/ViewPatientModal";
import UpdateAvatarModal from "./ProfileModal/UpdateAvatarModal";
import CreateTestOrderModal from "./TestOrderModal/CreateTestOrderModal";
import UpdateTestOrderModal from "./TestOrderModal/UpdateTestOrderModal";
import ViewTestOrderModal from "./TestOrderModal/ViewTestOrderModal";
import CreateUserModal from "./UserModal/CreateUserModal";
import UpdateUserModal from "./UserModal/UpdateUserModal";
import ViewUserModal from "./UserModal/ViewUserModal";

export default function ModalsRoot() {
  // chỉ render modal; modals dùng disclosure singleton bên trong
  return (
    <>
      <CreateTestOrderModal />
      <UpdateTestOrderModal />
      <CreatePatientModal />
      <UpdatePatientModal />
      <ViewPatientModal />
      <ViewTestOrderModal />
      <CreateCommentModal />
      <CreateUserModal />
      <UpdateUserModal />
      <ViewUserModal />
      <UpdateAvatarModal />
      <CreatePermissionModal />
    </>
  );
}
