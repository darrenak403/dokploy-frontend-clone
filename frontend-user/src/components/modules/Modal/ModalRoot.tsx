"use client";

import UpdateAvatarModal from "./ProfileModal/UpdateAvatarModal";

export default function ModalsRoot() {
  // chỉ render modal; modals dùng disclosure singleton bên trong
  return (
    <>
      <UpdateAvatarModal />
    </>
  );
}
