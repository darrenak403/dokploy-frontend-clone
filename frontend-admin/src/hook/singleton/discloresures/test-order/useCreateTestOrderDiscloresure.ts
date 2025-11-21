"use client";
import { useContext, useState } from "react";

import { useDisclosure } from "@heroui/react";

import { DiscloresuresContext } from "../DiscloresuresProvider";

export const useCreateTestOrderDiscloresureCore = () => {
  const disclosure = useDisclosure();
  const [patientId, setPatientId] = useState<number | null>(null);

  // ✅ Function để mở modal với patient data
  const openWithPatientId = (patientId: number) => {
    setPatientId(patientId);
    disclosure.onOpen();
  };

  // ✅ Override onClose để clear patient data
  const handleClose = () => {
    disclosure.onClose();
    // Clear patient after animation completes
    setTimeout(() => setPatientId(null), 300);
  };

  return {
    ...disclosure,
    onClose: handleClose,
    patientId,
    openWithPatientId,
  };
};

export const useCreateTestOrderDiscloresureSingleton = () => {
  const { useCreateTestOrderDisclosure } = useContext(DiscloresuresContext)!;
  return useCreateTestOrderDisclosure;
};
