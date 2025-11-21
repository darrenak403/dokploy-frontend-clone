import { useContext } from "react";

import useSWR, { SWRConfiguration } from "swr";

import { Patient } from "@/types/patient";

import { fetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface PatientListResponse {
  status?: number;
  message?: string | null;
  data: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    data: Patient[];
  };
}

export const useFetchAllPatientSwrCore = (
  url: string = "/patient",
  options?: SWRConfiguration
) => {
  const { data, error, isLoading, mutate, isValidating } =
    useSWR<PatientListResponse>(url, fetcher<PatientListResponse>, {
      // refreshInterval: 5000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      ...options,
    });
  return { data, error, isLoading, mutate, isValidating };
};

export const useFetchAllPatientSwrSingleton = () => {
  const { useFetchAllPatientSwr } = useContext(SwrContext)!;
  return useFetchAllPatientSwr;
};
