"use client";
import { useContext, useState } from "react";

import { useDisclosure } from "@heroui/react";

import { Patient } from "@/types/patient";

import { DiscloresuresContext } from "../DiscloresuresProvider";

// ✅ Import Patient type

export const useUpdatePatientDiscloresureCore = () => {
  const disclosure = useDisclosure();
  const [patient, setPatient] = useState<Patient | null>(null);

  const openWithPatient = (patientData: Patient) => {
    setPatient(patientData);
    disclosure.onOpen();
  };

  const handleClose = () => {
    disclosure.onClose();
    setTimeout(() => setPatient(null), 300);
  };

  return {
    ...disclosure,
    onClose: handleClose,
    patient,
    openWithPatient,
  };
};

export const useUpdatePatientDiscloresureSingleton = () => {
  const { useUpdatePatientDisclosure } = useContext(DiscloresuresContext)!;
  return useUpdatePatientDisclosure;
};
