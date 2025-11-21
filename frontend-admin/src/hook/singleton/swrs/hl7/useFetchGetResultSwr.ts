import { useContext } from "react";

import useSWR, { SWRConfiguration } from "swr";

import { GetHL7ResultResponse } from "@/types/hl7/getHL7Result";

import { fetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export const useFetchGetResultSwrCore = (
  accessionNumber: string | null,
  options?: SWRConfiguration
) => {
  const url = accessionNumber ? `/results/${accessionNumber}` : null;

  const { data, error, isLoading, mutate, isValidating } =
    useSWR<GetHL7ResultResponse>(url, fetcher<GetHL7ResultResponse>, {
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
    result: data,
  };
};

export const useFetchGetResultSwrSingleton = (
  accessionNumber: string | null
) => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error(
      "useFetchTestOrderByIdSwrSingleton must be used within SwrProvider"
    );
  }

  return useFetchGetResultSwrCore(accessionNumber);
};
