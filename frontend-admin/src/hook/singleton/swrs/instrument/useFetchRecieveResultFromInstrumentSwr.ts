import { useContext } from "react";

import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

import { postFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface RecievedHL7MessagePayload {
  accessionNumber: string;
  reagentId: string;
}

export interface RecievedResultData {
  status?: string;
  hl7Message?: string;
  testOrderId?: number;
  instrumentStatus?: string;
}

export interface RecievedHL7MessageResponse {
  status?: number;
  error?: string | null;
  message?: string | null;
  path?: string | null;
  timestamp?: string | null;
  data?: RecievedResultData;
}

export const useFetchRecieveResultFromInstrumentSwrCore = (
  url: string = "/instrument/blood-analysis/hl7",
  options?: SWRMutationConfiguration<
    RecievedHL7MessageResponse,
    Error,
    string,
    RecievedHL7MessagePayload
  >
) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation<
    RecievedHL7MessageResponse,
    Error,
    string,
    RecievedHL7MessagePayload
  >(url, postFetcher<RecievedHL7MessageResponse, RecievedHL7MessagePayload>, {
    ...options,
  });

  return {
    data,
    error,
    isMutating,
    trigger,
    reset,
  };
};

export const useFetchRecieveResultFromInstrumentSwrSingleton = () => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error("Singleton must be used within SwrProvider");
  }

  const { useFetchRecieveResultFromInstrumentSwr } = context;
  return useFetchRecieveResultFromInstrumentSwr;
};
