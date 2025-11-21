"use client";
import { useContext, useState } from "react";

import { useDisclosure } from "@heroui/react";

import { DiscloresuresContext } from "../DiscloresuresProvider";

export const useGetUserByIdDiscloresureCore = () => {
  const disclosure = useDisclosure();
  const [userId, setUserId] = useState<string | null>(null);

  const openWithUserId = (id: string) => {
    setUserId(id);
    disclosure.onOpen();
  };

  const handleClose = () => {
    disclosure.onClose();
    setTimeout(() => setUserId(null), 300);
  };

  return {
    ...disclosure,
    onClose: handleClose,
    userId,
    openWithUserId,
  };
};

export const useGetUserByIdDiscloresureSingleton = () => {
  const { useGetUserByIdDisclosure } = useContext(DiscloresuresContext)!;
  return useGetUserByIdDisclosure;
};
