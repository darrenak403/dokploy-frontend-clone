"use client";
import { useContext, useState } from "react";

import { useDisclosure } from "@heroui/react";

import { DiscloresuresContext } from "../DiscloresuresProvider";

export const useViewPatientDiscloresureCore = () => {
  const disclosure = useDisclosure();
  const [patientId, setPatientId] = useState<number | null>(null);

  const openWithPatientId = (patientId: number) => {
    setPatientId(patientId);
    disclosure.onOpen();
  };

  const handleClose = () => {
    disclosure.onClose();
    setTimeout(() => setPatientId(null), 300);
  };

  return {
    ...disclosure,
    onClose: handleClose,
    patientId,
    openWithPatientId,
  };
};

export const useViewPatientDiscloresureSingleton = () => {
  const { useViewPatientDisclosure } = useContext(DiscloresuresContext)!;
  return useViewPatientDisclosure;
};
