import { useContext } from "react";

import useSWR, { SWRConfiguration } from "swr";

import { Patient } from "@/types/patient";

import { fetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface PatientByIdResponse {
  status?: number;
  message?: string | null;
  data: Patient;
}

export const useFetchPatientByIdSwrCore = (
  patientId: string | number | null,
  options?: SWRConfiguration
) => {
  const url = patientId ? `/patient/${patientId}` : null;

  const { data, error, isLoading, mutate, isValidating } =
    useSWR<PatientByIdResponse>(url, fetcher<PatientByIdResponse>, {
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
    patient: data?.data,
  };
};

export const useFetchPatientByIdSwrSingleton = (
  patientId: string | number | null
) => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error(
      "useFetchPatientByIdSwrSingleton must be used within SwrProvider"
    );
  }

  return useFetchPatientByIdSwrCore(patientId);
};
