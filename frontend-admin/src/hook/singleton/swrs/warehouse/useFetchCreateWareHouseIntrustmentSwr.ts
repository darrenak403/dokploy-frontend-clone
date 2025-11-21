import { useContext } from "react";

import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

import { Instrument } from "@/types/wareHouse";

import { postFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface CreateInstrumentPayload {
  name: string;
  serialNumber: string;
}

// API Response interface
export interface CreateInstrumentResponse {
  status?: number;
  error?: string | null;
  message?: string | null;
  data: Instrument;
}

export const useFetchCreateInstrumentSwrCore = (
  url: string = "/warehouse/instruments",
  options?: SWRMutationConfiguration<
    CreateInstrumentResponse,
    Error,
    string,
    CreateInstrumentPayload
  >
) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation<
    CreateInstrumentResponse,
    Error,
    string,
    CreateInstrumentPayload
  >(url, postFetcher<CreateInstrumentResponse, CreateInstrumentPayload>, {
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

export const useFetchCreateInstrumentSwrSingleton = () => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error(
      "useFetchCreateInstrumentSwrSingleton must be used within SwrProvider"
    );
  }

  const { useFetchCreateInstrumentSwr } = context;
  return useFetchCreateInstrumentSwr;
};
