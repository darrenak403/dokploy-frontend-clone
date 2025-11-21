import { useContext } from "react";

import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

import { Reagent } from "@/types/regent";

import { postFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface CreateRegentPayload {
  reagentType: string;
  reagentName: string;
  lotNumber: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  vendorId: string;
  vendorName: string;
  vendorContact: string;
  remarks: string;
}

// API Response interface
export interface CreateRegentResponse {
  status?: number;
  error?: string | null;
  message?: string | null;
  data: Reagent;
}

export const useFetchCreateRegentSwrCore = (
  url: string = "/instrument/reagents/install",
  options?: SWRMutationConfiguration<
    CreateRegentResponse,
    Error,
    string,
    CreateRegentPayload
  >
) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation<
    CreateRegentResponse,
    Error,
    string,
    CreateRegentPayload
  >(url, postFetcher<CreateRegentResponse, CreateRegentPayload>, {
    ...options,
  });

  return {
    data,
    error,
    isMutating,
    createInstrument: trigger,
    trigger,
    reset,
  };
};

export const useFetchCreateRegentSwrSingleton = () => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error(
      "useFetchCreateRegentSwrSingleton must be used within SwrProvider"
    );
  }

  const { useFetchCreateRegentSwr } = context;
  return useFetchCreateRegentSwr;
};
