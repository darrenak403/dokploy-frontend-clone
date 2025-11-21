"use client";
import { useContext, useState } from "react";

import { useDisclosure } from "@heroui/react";

import { User } from "@/types/profile";

import { DiscloresuresContext } from "../DiscloresuresProvider";

export const useUpdateUserDiscloresureCore = () => {
  const disclosure = useDisclosure();
  const [user, setUser] = useState<User | null>(null);

  const openWithUser = (userData: User) => {
    setUser(userData);
    disclosure.onOpen();
  };

  const handleClose = () => {
    disclosure.onClose();
    setTimeout(() => setUser(null), 300);
  };

  return {
    ...disclosure,
    onClose: handleClose,
    user,
    openWithUser,
  };
};

export const useUpdateUserDiscloresureSingleton = () => {
  const { useUpdateUserDiscloresure } = useContext(DiscloresuresContext)!;
  return useUpdateUserDiscloresure;
};
