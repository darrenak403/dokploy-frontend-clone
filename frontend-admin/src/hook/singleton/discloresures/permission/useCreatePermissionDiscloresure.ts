"use client";
import { useContext } from "react";

import { useDisclosure } from "@heroui/react";

import { DiscloresuresContext } from "../DiscloresuresProvider";

export const useCreatePermissionDisclosureCore = () => {
  return useDisclosure();
};

export const useCreatePermissionDisclosureSingleton = () => {
  const { useCreatePermissionDisclosure } = useContext(DiscloresuresContext)!;
  return useCreatePermissionDisclosure;
};
