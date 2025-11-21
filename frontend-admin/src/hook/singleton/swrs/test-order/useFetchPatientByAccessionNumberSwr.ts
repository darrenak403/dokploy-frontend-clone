import { useContext } from "react";

import useSWR, { SWRConfiguration } from "swr";

import { PatientAccessionNumber } from "@/types/patient";

import { fetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export const useFetchPatientByAccessionNumberSwrCore = (
  accessionNumber: string | null,
  options?: SWRConfiguration
) => {
  const url = accessionNumber
    ? `/orders/accessionNumber/patient/${accessionNumber}`
    : null;

  const { data, error, isLoading, mutate, isValidating } =
    useSWR<PatientAccessionNumber>(url, fetcher<PatientAccessionNumber>, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      ...options,
    });

  return {
    data,
    error,
    isLoading,
    mutate,
    isValidating,
    patientData: data?.data,
  };
};

export const useFetchPatientByAccessionNumberSwrSingleton = (
  accessionNumber: string | null
) => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error(
      "useFetchTestOrderByIdSwrSingleton must be used within SwrProvider"
    );
  }

  return useFetchPatientByAccessionNumberSwrCore(accessionNumber);
};
