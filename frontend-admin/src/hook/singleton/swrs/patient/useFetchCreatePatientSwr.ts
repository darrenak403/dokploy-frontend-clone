import { useContext } from "react";

import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

import { Patient } from "@/types/patient";

import { postFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface CreatePatientPayload {
  userId?: number;
  fullName?: string;
  yob?: string;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
}

// API Response interface
export interface CreatePatientResponse {
  status?: number;
  error?: string | null;
  message?: string | null;
  data: Patient;
}

export const useFetchCreatePatientSwrCore = (
  url: string = "/patient",
  options?: SWRMutationConfiguration<
    CreatePatientResponse,
    Error,
    string,
    CreatePatientPayload
  >
) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation<
    CreatePatientResponse,
    Error,
    string,
    CreatePatientPayload
  >(url, postFetcher<CreatePatientResponse, CreatePatientPayload>, {
    ...options,
  });

  return {
    data,
    error,
    isMutating,
    createPatient: trigger,
    trigger,
    reset,
  };
};

export const useFetchCreatePatientSwrSingleton = () => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error(
      "useFetchCreatePatientSwrSingleton must be used within SwrProvider"
    );
  }

  const { useFetchCreatePatientSwr } = context;
  return useFetchCreatePatientSwr;
};
