"use client";
import { useContext } from "react";

import { useDisclosure } from "@heroui/react";

import { DiscloresuresContext } from "../DiscloresuresProvider";

export const useCreatePatientDiscloresureCore = () => {
  return useDisclosure();
};

export const useCreatePatientDiscloresureSingleton = () => {
  const { useCreatePatientDisclosure } = useContext(DiscloresuresContext)!;
  return useCreatePatientDisclosure;
};
