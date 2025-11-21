"use client";
import { useContext } from "react";

import { useDisclosure } from "@heroui/react";

import { DiscloresuresContext } from "../DiscloresuresProvider";

export const useCreateUserDiscloresureCore = () => {
  const disclosure = useDisclosure();

  const handleClose = () => {
    disclosure.onClose();
  };

  return {
    ...disclosure,
    onClose: handleClose,
  };
};

export const useCreateUserDiscloresureSingleton = () => {
  const { useCreateUserDisclosure } = useContext(DiscloresuresContext)!;
  return useCreateUserDisclosure;
};
