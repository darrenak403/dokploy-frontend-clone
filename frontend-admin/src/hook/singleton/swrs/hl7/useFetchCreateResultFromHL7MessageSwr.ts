import { useContext } from "react";

import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

import {
  HL7MessagePayload,
  HL7MessageResponse,
} from "@/types/hl7/createHL7Result";

import { postHL7Fetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export const useFetchCreateResultFromHL7MessageSwrCore = (
  url: string = "/results/hl7",
  options?: SWRMutationConfiguration<
    HL7MessageResponse,
    Error,
    string,
    HL7MessagePayload
  >
) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation<
    HL7MessageResponse,
    Error,
    string,
    HL7MessagePayload
  >(url, postHL7Fetcher, {
    ...options,
  });

  return {
    data,
    error,
    isMutating,
    createResult: trigger,
    trigger,
    reset,
  };
};

export const useFetchCreateResultFromHL7MessageSwrSingleton = () => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error("Singleton must be used within SwrProvider");
  }

  const { useFetchCreateResultFromHL7MessageSwr } = context;
  return useFetchCreateResultFromHL7MessageSwr;
};
